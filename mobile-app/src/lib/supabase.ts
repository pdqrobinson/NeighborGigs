import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Environment variables will be set in app.config.js or .env
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// Types based on our database schema
export type TaskState = 
  | 'DRAFT' 
  | 'PENDING_MATCH' 
  | 'OFFERED' 
  | 'ACCEPTED' 
  | 'IN_PROGRESS' 
  | 'COMPLETED' 
  | 'CONFIRMED' 
  | 'PAID' 
  | 'CANCELLED' 
  | 'EXPIRED' 
  | 'DISPUTED' 
  | 'REFUNDED';

export type UserRole = 'user' | 'ambassador' | 'admin';

export interface User {
  id: string;
  created_at: string;
  updated_at: string;
  full_name: string;
  phone: string;
  photo_url: string | null;
  zip_code: string;
  neighborhood: string | null;
  location: { latitude: number; longitude: number } | null;
  radius_miles: number;
  notifications_enabled: boolean;
  rating: number;
  total_tasks_completed: number;
  reliability_score: number;
  is_verified: boolean;
  level: number;
  badges: string[];
  points: number;
  points_this_month: number;
  role: UserRole;
  is_active: boolean;
  last_active_at: string;
}

export interface Broadcast {
  id: string;
  created_at: string;
  updated_at: string;
  helper_id: string;
  errand_type: string;
  leaving_at: string;
  radius_miles: number;
  note: string | null;
  location: { latitude: number; longitude: number };
  status: 'active' | 'expired' | 'completed';
  expires_at: string;
  requests_received: number;
  tasks_completed: number;
  helper_name?: string;
  helper_photo?: string;
  helper_rating?: number;
  helper_level?: number;
  active_requests?: number;
}

export interface Task {
  id: string;
  created_at: string;
  updated_at: string;
  requester_id: string;
  helper_id: string | null;
  broadcast_id: string | null;
  title: string;
  description: string;
  category: string;
  location: { latitude: number; longitude: number };
  address: string | null;
  base_price_cents: number;
  tip_cents: number;
  total_cents: number;
  deadline: string;
  estimated_duration_minutes: number | null;
  state: TaskState;
  payment_intent_id: string | null;
  payout_id: string | null;
  proof_photo_url: string | null;
  completed_at: string | null;
  confirmed_at: string | null;
  paid_at: string | null;
  dispute_reason: string | null;
  dispute_resolved_at: string | null;
  points_awarded: number;
}

export interface Message {
  id: string;
  created_at: string;
  task_id: string;
  sender_id: string;
  content: string;
  attachment_url: string | null;
  read_at: string | null;
  message_type: 'text' | 'photo' | 'system';
}

export interface Review {
  id: string;
  created_at: string;
  task_id: string;
  reviewer_id: string;
  reviewee_id: string;
  rating: number;
  comment: string | null;
  would_work_again: boolean | null;
}

export interface Badge {
  id: string;
  name: string;
  display_name: string;
  description: string | null;
  icon_emoji: string | null;
  category: string | null;
  requirements: any;
  points: number;
}

export interface UserBadge {
  id: string;
  user_id: string;
  badge_id: string;
  progress: any;
  completed_at: string | null;
}

export interface Challenge {
  id: string;
  title: string;
  description: string | null;
  type: 'daily' | 'weekly' | 'monthly' | 'event';
  requirements: any;
  points: number;
  reward: string | null;
  starts_at: string;
  ends_at: string;
  is_active: boolean;
}

export interface PointTransaction {
  id: string;
  created_at: string;
  user_id: string;
  amount: number;
  source: string;
  description: string | null;
  reference_id: string | null;
  reference_type: string | null;
}