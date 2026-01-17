-- NeighborGigs Database Schema for Supabase
-- PostgreSQL with Row-Level Security (RLS)

-- ============================================
-- EXTENSIONS
-- ============================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";  -- For location-based queries

-- ============================================
-- ENUMS
-- ============================================

-- Task states from task_state.md
CREATE TYPE task_state AS ENUM (
  'DRAFT',
  'PENDING_MATCH',
  'OFFERED',
  'ACCEPTED',
  'IN_PROGRESS',
  'COMPLETED',
  'CONFIRMED',
  'PAID',
  'CANCELLED',
  'EXPIRED',
  'DISPUTED',
  'REFUNDED'
);

-- User roles
CREATE TYPE user_role AS ENUM (
  'user',
  'ambassador',
  'admin'
);

-- ============================================
-- TABLES
-- ============================================

-- Users table (extends auth.users)
CREATE TABLE public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Profile info
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL UNIQUE,
  photo_url TEXT,
  
  -- Location
  zip_code TEXT NOT NULL,
  neighborhood TEXT,
  location GEOGRAPHY(POINT, 4326),  -- PostGIS point for radius queries
  
  -- Settings
  radius_miles INTEGER DEFAULT 2 CHECK (radius_miles BETWEEN 1 AND 5),
  notifications_enabled BOOLEAN DEFAULT TRUE,
  
  -- Trust & Reputation
  rating DECIMAL(2,1) DEFAULT 5.0 CHECK (rating BETWEEN 0 AND 5),
  total_tasks_completed INTEGER DEFAULT 0,
  reliability_score INTEGER DEFAULT 100,  -- % of completed tasks
  is_verified BOOLEAN DEFAULT FALSE,  -- ID verification
  
  -- Badges & Level
  level INTEGER DEFAULT 1,
  badges JSONB DEFAULT '[]'::jsonb,  -- Array of badge names
  
  -- Gamification
  points INTEGER DEFAULT 0,
  points_this_month INTEGER DEFAULT 0,
  
  -- Role
  role user_role DEFAULT 'user',
  
  -- Status
  is_active BOOLEAN DEFAULT TRUE,
  last_active_at TIMESTAMPTZ DEFAULT NOW()
);

-- Broadcasts (helpers announcing they're going out)
CREATE TABLE public.broadcasts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Helper info
  helper_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  
  -- Errand details
  errand_type TEXT NOT NULL,  -- 'grocery', 'pharmacy', 'general'
  leaving_at TIMESTAMPTZ NOT NULL,
  radius_miles INTEGER NOT NULL DEFAULT 2,
  note TEXT,
  
  -- Location
  location GEOGRAPHY(POINT, 4326) NOT NULL,
  
  -- Status
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'expired', 'completed')),
  expires_at TIMESTAMPTZ NOT NULL,
  
  -- Stats
  requests_received INTEGER DEFAULT 0,
  tasks_completed INTEGER DEFAULT 0
);

-- Tasks (requests attached to broadcasts)
CREATE TABLE public.tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Requester info
  requester_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  
  -- Helper info (when attached to broadcast)
  helper_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  broadcast_id UUID REFERENCES public.broadcasts(id) ON DELETE SET NULL,
  
  -- Task details
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,  -- 'grocery', 'pharmacy', 'help', 'delivery'
  
  -- Location
  location GEOGRAPHY(POINT, 4326) NOT NULL,
  address TEXT,
  
  -- Pricing
  base_price_cents INTEGER NOT NULL,  -- In cents
  tip_cents INTEGER DEFAULT 0,
  total_cents INTEGER GENERATED ALWAYS AS (base_price_cents + tip_cents) STORED,
  
  -- Timing
  deadline TIMESTAMPTZ NOT NULL,
  estimated_duration_minutes INTEGER,
  
  -- State machine
  state task_state NOT NULL DEFAULT 'DRAFT',
  
  -- Payment (Stripe)
  payment_intent_id TEXT,  -- Stripe PaymentIntent ID
  payout_id TEXT,  -- Stripe Transfer ID (for helpers)
  
  -- Completion
  proof_photo_url TEXT,
  completed_at TIMESTAMPTZ,
  confirmed_at TIMESTAMPTZ,
  paid_at TIMESTAMPTZ,
  
  -- Dispute
  dispute_reason TEXT,
  dispute_resolved_at TIMESTAMPTZ,
  
  -- Gamification
  points_awarded INTEGER DEFAULT 0
);

-- Messages (in-app chat)
CREATE TABLE public.messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  task_id UUID NOT NULL REFERENCES public.tasks(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  attachment_url TEXT,
  
  -- Read status
  read_at TIMESTAMPTZ,
  
  -- Message type
  message_type TEXT DEFAULT 'text' CHECK (message_type IN ('text', 'photo', 'system'))
);

-- Reviews & Ratings
CREATE TABLE public.reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  task_id UUID NOT NULL REFERENCES public.tasks(id) ON DELETE CASCADE,
  
  -- Who reviewed whom
  reviewer_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  reviewee_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  
  -- Rating
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment TEXT,
  
  -- Would work together again
  would_work_again BOOLEAN,
  
  UNIQUE(task_id, reviewer_id, reviewee_id)
);

-- Gamification: Badges
CREATE TABLE public.badges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  name TEXT NOT NULL UNIQUE,
  display_name TEXT NOT NULL,
  description TEXT,
  icon_emoji TEXT,
  category TEXT,
  
  -- Requirements
  requirements JSONB NOT NULL,  -- { task_count: 10, category: 'grocery' }
  points INTEGER DEFAULT 0
);

-- User badges earned
CREATE TABLE public.user_badges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  badge_id UUID NOT NULL REFERENCES public.badges(id) ON DELETE CASCADE,
  
  progress JSONB DEFAULT '{}'::jsonb,  -- Current progress toward badge
  completed_at TIMESTAMPTZ,
  
  UNIQUE(user_id, badge_id)
);

-- Challenges (daily/weekly)
CREATE TABLE public.challenges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  title TEXT NOT NULL,
  description TEXT,
  
  -- Challenge type
  type TEXT NOT NULL CHECK (type IN ('daily', 'weekly', 'monthly', 'event')),
  
  -- Requirements
  requirements JSONB NOT NULL,
  
  -- Rewards
  points INTEGER DEFAULT 0,
  reward TEXT,  -- 'badge', 'gift_card', etc.
  
  -- Timing
  starts_at TIMESTAMPTZ NOT NULL,
  ends_at TIMESTAMPTZ NOT NULL,
  is_active BOOLEAN DEFAULT TRUE
);

-- User challenge progress
CREATE TABLE public.user_challenges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  challenge_id UUID NOT NULL REFERENCES public.challenges(id) ON DELETE CASCADE,
  
  progress INTEGER DEFAULT 0,
  completed_at TIMESTAMPTZ,
  
  UNIQUE(user_id, challenge_id)
);

-- Point transactions (for redemption tracking)
CREATE TABLE public.point_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  
  -- Amount (positive for earning, negative for spending)
  amount INTEGER NOT NULL,
  
  -- Source
  source TEXT NOT NULL,  -- 'task_complete', 'bonus', 'redemption'
  description TEXT,
  
  -- Reference
  reference_id UUID,  -- task_id, challenge_id, etc.
  reference_type TEXT
);

-- ============================================
-- INDEXES
-- ============================================

-- Users
CREATE INDEX idx_users_location ON public.users USING GIST(location);
CREATE INDEX idx_users_zip_code ON public.users(zip_code);
CREATE INDEX idx_users_rating ON public.users(rating DESC);
CREATE INDEX idx_users_level ON public.users(level DESC);

-- Broadcasts
CREATE INDEX idx_broadcasts_helper ON public.broadcasts(helper_id);
CREATE INDEX idx_broadcasts_location ON public.broadcasts USING GIST(location);
CREATE INDEX idx_broadcasts_status ON public.broadcasts(status);
CREATE INDEX idx_broadcasts_expires_at ON public.broadcasts(expires_at);

-- Tasks
CREATE INDEX idx_tasks_requester ON public.tasks(requester_id);
CREATE INDEX idx_tasks_helper ON public.tasks(helper_id);
CREATE INDEX idx_tasks_broadcast ON public.tasks(broadcast_id);
CREATE INDEX idx_tasks_state ON public.tasks(state);
CREATE INDEX idx_tasks_location ON public.tasks USING GIST(location);
CREATE INDEX idx_tasks_created_at ON public.tasks(created_at DESC);

-- Messages
CREATE INDEX idx_messages_task ON public.messages(task_id);
CREATE INDEX idx_messages_created_at ON public.messages(created_at DESC);

-- Reviews
CREATE INDEX idx_reviews_reviewee ON public.reviews(reviewee_id);
CREATE INDEX idx_reviews_rating ON public.reviews(rating);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.broadcasts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.point_transactions ENABLE ROW LEVEL SECURITY;

-- Users: Users can read all (for neighborhood discovery), update only own
CREATE POLICY "Users can read all" ON public.users FOR SELECT USING (TRUE);
CREATE POLICY "Users can update own" ON public.users FOR UPDATE USING (auth.uid() = id);

-- Broadcasts: Users can read active broadcasts within radius, create own
CREATE POLICY "Broadcasts can read active" ON public.broadcasts FOR SELECT USING (
  status = 'active' AND 
  expires_at > NOW()
);
CREATE POLICY "Broadcasts can create" ON public.broadcasts FOR INSERT WITH CHECK (
  auth.uid() = helper_id
);
CREATE POLICY "Broadcasts can update own" ON public.broadcasts FOR UPDATE USING (
  auth.uid() = helper_id
);

-- Tasks: Users can read tasks they're involved in
CREATE POLICY "Tasks can read own" ON public.tasks FOR SELECT USING (
  auth.uid() = requester_id OR 
  auth.uid() = helper_id
);
CREATE POLICY "Tasks can create" ON public.tasks FOR INSERT WITH CHECK (
  auth.uid() = requester_id
);
CREATE POLICY "Tasks can update" ON public.tasks FOR UPDATE USING (
  auth.uid() = requester_id OR 
  auth.uid() = helper_id
);

-- Messages: Users can read messages from their tasks
CREATE POLICY "Messages can read own" ON public.messages FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.tasks 
    WHERE tasks.id = messages.task_id 
    AND (tasks.requester_id = auth.uid() OR tasks.helper_id = auth.uid())
  )
);
CREATE POLICY "Messages can create" ON public.messages FOR INSERT WITH CHECK (
  auth.uid() = sender_id AND
  EXISTS (
    SELECT 1 FROM public.tasks 
    WHERE tasks.id = messages.task_id 
    AND (tasks.requester_id = auth.uid() OR tasks.helper_id = auth.uid())
  )
);

-- Reviews: Users can read all, create for tasks they're involved in
CREATE POLICY "Reviews can read all" ON public.reviews FOR SELECT USING (TRUE);
CREATE POLICY "Reviews can create" ON public.reviews FOR INSERT WITH CHECK (
  auth.uid() = reviewer_id
);

-- Badges, Challenges, User progress: Read all
CREATE POLICY "Badges can read all" ON public.badges FOR SELECT USING (TRUE);
CREATE POLICY "Challenges can read all" ON public.challenges FOR SELECT USING (TRUE);
CREATE POLICY "User badges can read own" ON public.user_badges FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "User challenges can read own" ON public.user_challenges FOR SELECT USING (auth.uid() = user_id);

-- Point transactions: Users can read only own
CREATE POLICY "Point transactions can read own" ON public.point_transactions FOR SELECT USING (auth.uid() = user_id);

-- ============================================
-- FUNCTIONS & TRIGGERS
-- ============================================

-- Update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_broadcasts_updated_at BEFORE UPDATE ON public.broadcasts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON public.tasks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Update user stats after task completion
CREATE OR REPLACE FUNCTION update_user_stats()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.state = 'COMPLETED' AND OLD.state != 'COMPLETED' THEN
    -- Increment completed tasks for helper
    UPDATE public.users 
    SET total_tasks_completed = total_tasks_completed + 1,
      last_active_at = NOW()
    WHERE id = NEW.helper_id;
    
    -- Increment reliability score
    UPDATE public.users 
    SET reliability_score = LEAST(100, reliability_score + 1)
    WHERE id = NEW.helper_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_user_stats_on_task_complete 
  AFTER UPDATE ON public.tasks
  FOR EACH ROW EXECUTE FUNCTION update_user_stats();

-- Award points after task is paid
CREATE OR REPLACE FUNCTION award_points_on_payment()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.state = 'PAID' AND OLD.state != 'PAID' THEN
    -- Award points to helper
    INSERT INTO public.point_transactions (user_id, amount, source, description, reference_id, reference_type)
    VALUES (NEW.helper_id, 50, 'task_complete', 'Task completed', NEW.id, 'task');
    
    UPDATE public.users 
    SET points = points + 50,
      points_this_month = points_this_month + 50
    WHERE id = NEW.helper_id;
    
    -- Award points to requester (for completing the transaction)
    INSERT INTO public.point_transactions (user_id, amount, source, description, reference_id, reference_type)
    VALUES (NEW.requester_id, 25, 'task_complete', 'Request completed', NEW.id, 'task');
    
    UPDATE public.users 
    SET points = points + 25,
      points_this_month = points_this_month + 25
    WHERE id = NEW.requester_id;
    
    -- Check for badge completions
    -- (This would call additional functions to check badge requirements)
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER award_points_on_paid 
  AFTER UPDATE ON public.tasks
  FOR EACH ROW EXECUTE FUNCTION award_points_on_payment();

-- ============================================
-- SEED DATA
-- ============================================

-- Insert default badges
INSERT INTO public.badges (name, display_name, description, icon_emoji, category, requirements, points) VALUES
('grocery_guru', 'Grocery Guru', 'Complete 10 grocery tasks', '🛒', 'category', '{"task_count": 10, "category": "grocery"}', 50),
('handy_helper', 'Handy Helper', 'Complete 10 help tasks', '🔧', 'category', '{"task_count": 10, "category": "help"}', 50),
('pet_pal', 'Pet Pal', 'Complete 5 pet care tasks', '🐕', 'category', '{"task_count": 5, "category": "pet"}', 25),
('speed_demon', 'Speed Demon', 'Complete 10 tasks in under 30 minutes', '⚡', 'special', '{"fast_tasks": 10, "max_minutes": 30}', 100),
('five_star_superstar', '5-Star Superstar', 'Maintain 5.0 rating for 20 tasks', '🌟', 'special', '{"rating": 5.0, "task_count": 20}', 150),
('hot_streak', 'Hot Streak', '7-day consecutive task completion', '🔥', 'special', '{"streak_days": 7}', 100),
('early_bird', 'Early Bird', 'Complete 10 tasks before 9am', '🌅', 'special', '{"task_count": 10, "before_hour": 9}', 75),
('night_owl', 'Night Owl', 'Complete 10 tasks after 8pm', '🌙', 'special', '{"task_count": 10, "after_hour": 20}', 75);

-- ============================================
-- VIEWS
-- ============================================

-- View for neighborhood feed
CREATE OR REPLACE VIEW neighborhood_feed AS
SELECT 
  b.*,
  u.full_name as helper_name,
  u.photo_url as helper_photo,
  u.rating as helper_rating,
  u.level as helper_level,
  COUNT(DISTINCT t.id) as active_requests
FROM public.broadcasts b
JOIN public.users u ON u.id = b.helper_id
LEFT JOIN public.tasks t ON t.broadcast_id = b.id AND t.state IN ('OFFERED', 'ACCEPTED')
WHERE b.status = 'active' AND b.expires_at > NOW()
GROUP BY b.id, u.full_name, u.photo_url, u.rating, u.level;

-- View for user profile stats
CREATE OR REPLACE VIEW user_profile_stats AS
SELECT 
  u.*,
  COUNT(DISTINCT CASE WHEN t.state = 'PAID' THEN t.id END) as completed_tasks,
  COUNT(DISTINCT CASE WHEN t.helper_id = u.id AND t.state = 'PAID' THEN t.id END) as tasks_as_helper,
  COUNT(DISTINCT CASE WHEN t.requester_id = u.id AND t.state = 'PAID' THEN t.id END) as tasks_as_requester,
  AVG(r.rating) as average_rating_given,
  AVG(CASE WHEN r.reviewee_id = u.id THEN r.rating END) as average_rating_received
FROM public.users u
LEFT JOIN public.tasks t ON (t.helper_id = u.id OR t.requester_id = u.id)
LEFT JOIN public.reviews r ON (r.reviewer_id = u.id OR r.reviewee_id = u.id)
GROUP BY u.id;