# NeighborGigs Setup Checklist

## Git Repository Setup ✅

- [x] Initialize git repository
- [x] Add comprehensive .gitignore
- [x] Create GitHub templates (PR, contributing, code of conduct)
- [x] Setup GitHub Actions workflow (requires workflow OAuth scope)
- [x] Create feature branch for development
- [x] Push to remote

---

## Project Structure ✅

- [x] Organize main components (mobile, web, dashboard, backend)
- [x] Create environment variable templates
- [x] Add database migration with complete schema
- [x] Setup documentation folder

---

## Next Steps

### Phase 1: Supabase Setup (Priority 1)

- [ ] Create Supabase project at supabase.com
  - Project name: `neighborgigs-prod` or `neighborgigs-dev`
  - Choose region closest to target users
  - Set secure database password
  
- [ ] Deploy initial schema
  - Option A: Copy `backend/supabase/migrations/001_initial_schema.sql`
  - Option B: Use Supabase CLI `supabase migration apply`
  
- [ ] Configure Authentication
  - Enable Phone provider in Supabase Dashboard
  - Add test phone numbers (development)
  - Configure SMS templates
  
- [ ] Get Credentials
  - Copy Project URL
  - Copy Anon Key
  - Add to `.env.local` files

### Phase 2: Stripe Setup (Priority 2)

- [ ] Create Stripe account
  - Business information
  - Bank account for payouts
  - Verify email/phone
  
- [ ] Setup Stripe Connect
  - Navigate to Products → Connect
  - Choose Standard accounts
  - Configure onboarding flow
  
- [ ] Get API Keys
  - Publishable key (for mobile/web)
  - Secret key (for backend - use environment variable)
  
- [ ] Configure Test Mode
  - Use test cards for development
  - Set up webhooks for payment events

### Phase 3: Mapbox Setup (Priority 3)

- [ ] Create Mapbox account
  - Sign up at mapbox.com
  - Verify email
  
- [ ] Create access token
  - Navigate to Account → Access tokens
  - Create new token with restrictions
  
- [ ] Add to environment variables
  - Add `MAPBOX_ACCESS_TOKEN` to `.env.local`
  
- [ ] Optional: Custom map style
  - Create style in Mapbox Studio
  - Save style ID for app configuration

### Phase 4: Local Development (Priority 4)

- [ ] Install dependencies
  ```bash
  # Mobile app
  cd mobile-app && bun install
  
  # Web dashboard
  cd web-dashboard && bun install
  
  # Web app
  cd neighborgigs-web && bun install
  ```
  
- [ ] Configure environment
  - Copy `.env.example` to `.env.local` in each app
  - Fill in Supabase, Stripe, Mapbox credentials
  
- [ ] Test database connection
  - Run a simple query from app
  - Verify RLS policies work
  
- [ ] Start development servers
  ```bash
  # Mobile app
  cd mobile-app && bun expo start
  
  # Web dashboard
  cd web-dashboard && bun dev
  
  # Web app
  cd neighborgigs-web && bun run dev
  ```

### Phase 5: Core Features (Priority 5)

#### Authentication
- [ ] Phone sign-up flow
- [ ] OTP verification
- [ ] Session management
- [ ] Profile creation

#### Broadcasts (Helper Flow)
- [ ] Create broadcast form
- [ ] Set time window (15/30/60 min)
- [ ] Set radius (1-3 miles)
- [ ] Broadcast card display
- [ ] Live broadcast tracking

#### Requests (Requester Flow)
- [ ] Create request form
- [ ] Set price and deadline
- [ ] Task card display
- [ ] Matching with broadcasts

#### Task State Machine
- [ ] Implement all 11 states
- [ ] State transition logic
- [ ] UI state indicators
- [ ] Guards (no cancel after ACCEPTED, etc.)

---

## Testing Checklist

### Before First PR
- [ ] Supabase project created and schema deployed
- [ ] Phone authentication works in dev
- [ ] Can create broadcast from mobile app
- [ ] Can create request from mobile app
- [ ] Database queries successful
- [ ] No console errors

### Manual Testing
- [ ] Sign up with phone number
- [ ] Receive and enter OTP code
- [ ] Create profile photo
- [ ] Enter zip code
- [ ] Create broadcast (Grocery, 30 min, 2 miles)
- [ ] Broadcast appears in feed
- [ ] Create request ("Need milk", $10)
- [ ] Request appears matching broadcast
- [ ] Accept task
- [ ] Task status updates correctly
- [ ] Complete task and upload photo
- [ ] View task in history

---

## Pull Request Preparation

### Before Opening PR
- [ ] All tests pass
- [ ] Code follows CONTRIBUTING.md guidelines
- [ ] Commit messages are descriptive
- [ ] No console warnings
- [ ] Documentation updated
- [ ] Environment variables documented

### PR Template
- [ ] Type of change selected
- [ ] Description provided
- [ ] Testing checklist completed
- [ ] Screenshots for UI changes
- [ ] Additional notes added

---

## CodeRabbit Setup

- [ ] Install CodeRabbit on GitHub repository
  - Navigate to repository → Settings → Integrations
  - Find and install CodeRabbit
  
- [ ] Configure CodeRabbit
  - Select code review preferences
  - Enable automatic review
  
- [ ] Test CodeRabbit
  - Create a test PR
  - Verify review comments appear
  - Check feedback quality

---

## Development Workflow

### Daily Routine

1. **Morning**
   - `git checkout master`
   - `git pull origin master`
   - `git checkout -b feature/your-task`

2. **Development**
   - Code changes
   - Test locally
   - Commit often: `feat:`, `fix:`, `refactor:`

3. **End of Day**
   - `git push origin feature/your-task`
   - Create PR on GitHub
   - Read CodeRabbit feedback
   - Address feedback in same branch

4. **Next Day**
   - Continue working on branch
   - Push updates
   - CodeRabbit auto-reviews
   - Merge when ready

---

## Quick Commands

```bash
# Start fresh feature branch
git checkout master && git pull && git checkout -b feature/new-feature

# Commit with proper format
git add . && git commit -m "feat: add phone authentication"

# Push and create PR
git push origin feature/new-feature

# After merge, cleanup
git checkout master && git pull && git branch -d feature/new-feature

# View recent commits
git log --oneline --graph -10

# Check git status
git status --short
```

---

## Environment Variables Reference

### Supabase
- `EXPO_PUBLIC_SUPABASE_URL` - Project URL (e.g., `https://xyz.supabase.co`)
- `EXPO_PUBLIC_SUPABASE_ANON_KEY` - Public key for client access

### Stripe
- `EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY` - Starts with `pk_test_` or `pk_live_`
- `STRIPE_SECRET_KEY` - Starts with `sk_test_` or `sk_live_` (server-side only!)

### Mapbox
- `EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN` - Long alphanumeric string

### Firebase (Optional)
- `EXPO_PUBLIC_FIREBASE_PROJECT_ID` - Firebase project identifier

---

## Troubleshooting

### Git Issues
- "File exists error": `rm .git/index.lock`
- "Merge conflict": `git status`, resolve files, `git add`, `git commit`
- "Branch not tracking": `git push -u origin feature-name`

### Supabase Issues
- "Connection failed": Check URL and anon key in `.env.local`
- "RLS policy failed": Check user is authenticated
- "Query timeout": Check Supabase project is active

### Expo Issues
- "Metro bundler": Press `i` to open in iOS simulator
- "Clear cache": `bun expo r -c`
- "Build fails": Check environment variables are set

---

## Resources

- **Supabase**: https://supabase.com/docs
- **Stripe**: https://stripe.com/docs
- **Expo**: https://docs.expo.dev
- **Mapbox**: https://docs.mapbox.com
- **Git Commit Strategy**: `file 'GIT_COMMIT_STRATEGY.md'`
- **Contributing**: `file 'CONTRIBUTING.md'`

---

*Last Updated: 2026-01-18*
