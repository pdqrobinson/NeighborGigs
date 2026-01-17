# NeighborGigs Setup Guide

This guide will walk you through setting up the entire NeighborGigs application.

## Prerequisites

### Required Tools
- **Node.js 20+** or **Bun 1.2+**
- **Git**
- **Expo CLI** (will be installed automatically)
- **Supabase CLI** (optional, for local development)

### Optional Tools
- **VS Code** (recommended)
- **Xcode** (for iOS development on Mac)
- **Android Studio** (for Android development)
- **Figma** (for design assets)

## Step 1: Setup Supabase

### Option A: Supabase Cloud (Recommended for Production)

1. Go to [supabase.com](https://supabase.com) and sign up
2. Click "New Project"
3. Configure:
   - **Organization**: Your organization
   - **Project Name**: `neighborgigs-dev` (or `neighborgigs-prod`)
   - **Region**: Closest to your users
   - **Database Password**: Create a secure password
4. Click "Create new project"
5. Wait for project to provision (2-3 minutes)

### Option B: Supabase Local (For Development)

```bash
# Install Supabase CLI
curl -sSL https://get.supabase.com | sh

# Initialize Supabase in your project
cd NeighborGigs
supabase init
supabase start
```

### Configure Authentication

1. In Supabase Dashboard, go to **Authentication** → **Providers**
2. Enable **Phone** (SMS OTP)
3. Under **Phone**, add your test phone numbers (if in development)
4. Optional: Enable **Email** as backup

### Run Database Schema

**For Cloud:**
1. In Supabase Dashboard, go to **SQL Editor**
2. Copy the contents of `backend/supabase/schema.sql`
3. Run the query

**For Local:**
```bash
# Reset database with schema
supabase db reset

# Or apply migration
supabase migration new init_schema
# (Copy schema into the migration file)
supabase migration up
```

### Configure Row-Level Security

The schema includes security policies. In production, verify they're working:

```sql
-- In SQL Editor, run:
SELECT * FROM pg_policies;
```

You should see policies for:
- `users` (insert/own, select public, update own)
- `broadcasts` (select public, insert/update own, delete own)
- `tasks` (select/insert/update own)
- etc.

### Get Supabase Credentials

1. Go to **Project Settings** → **API**
2. Copy:
   - **URL** (Project URL)
   - **anon public** key (Anon Key)

## Step 2: Setup Stripe

### Create Stripe Account

1. Go to [stripe.com](https://stripe.com) and sign up
2. Activate your account (requires business info)

### Configure Stripe Connect

1. In Stripe Dashboard, go to **Products** → **Connect**
2. Click **Get Started**
3. Choose **Standard** accounts (easiest for marketplace)
4. Enable:
   - **Onboarding**: Hosted onboarding
   - **Payouts**: Automatic payouts
   - **Disputes**: Dispute resolution
5. Save and copy:
   - **Publishable key** (for mobile app)
   - **Secret key** (for backend)

### Test Mode vs Live Mode

**For Development:**
- Use **Test Mode** (toggle in dashboard)
- Use test cards: https://stripe.com/docs/testing

**For Production:**
- Switch to **Live Mode**
- Complete account verification
- Add bank account for payouts

## Step 3: Setup Mapbox (Optional)

### Create Mapbox Account

1. Go to [mapbox.com](https://www.mapbox.com) and sign up
2. Create new access token
3. Copy the token

### Configuration

Mapbox is optional - the app falls back to `react-native-maps` (Google Maps) if Mapbox isn't configured.

## Step 4: Setup Mobile App

### Install Dependencies

```bash
cd NeighborGigs/mobile-app
bun install
```

### Configure Environment Variables

Create `.env.local` in the `mobile-app` folder:

```env
# Required - Supabase
EXPO_PUBLIC_SUPABASE_URL=https://xyz.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Required - Stripe (for payments)
EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...

# Optional - Mapbox
EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN=your-mapbox-token

# Optional - Development
EXPO_DEBUG=true
```

### Start Development Server

```bash
# Start Expo development server
bun expo start

# Or with specific port
bun expo start --port 8081
```

### Run on Device

**iOS Simulator (Mac only):**
```bash
bun expo run:ios
```

**Android Emulator:**
```bash
bun expo run:android
```

**Expo Go (iOS/Android - Recommended for testing):**
1. Install **Expo Go** app on your phone
2. Scan QR code from terminal
3. The app will load

### Build for Production

**iOS:**
```bash
bun expo login
bun expo build:ios
# Then submit to App Store Connect
```

**Android:**
```bash
bun expo login
bun expo build:android
# Then submit to Google Play Console
```

## Step 5: Setup Web Dashboard

### Install Dependencies

```bash
cd NeighborGigs/web-dashboard
bun install
```

### Configure Environment Variables

Create `.env.local` in the `web-dashboard` folder:

```env
# Required - Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xyz.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Optional - Development
NEXT_PUBLIC_ENABLE_ANALYTICS=false
```

### Start Development Server

```bash
# Start Next.js development server
bun dev

# The dashboard will be available at http://localhost:3000
```

### Deploy to Production

**Vercel (Recommended):**
```bash
bun vercel deploy
```

Or push to GitHub and connect Vercel to your repository.

## Step 6: Configuration & Customization

### Update Supabase RLS Policies

The schema includes basic RLS policies. Review and customize:

1. Go to **Authentication** → **URL Configuration**
2. Add:
   - **Site URL**: `https://yourapp.com` (or `neighborgigs://` for app)
   - **Redirect URLs**: Add localhost for dev, production URL for prod

### Configure Mobile App Settings

Update `mobile-app/app.json`:
```json
{
  "expo": {
    "name": "NeighborGigs",
    "slug": "neighborgigs",
    "ios": {
      "bundleIdentifier": "com.yourcompany.neighborgigs"
    },
    "android": {
      "package": "com.yourcompany.neighborgigs"
    }
  }
}
```

### Configure Web Dashboard Settings

Update `web-dashboard/src/app/layout.tsx` metadata:
```typescript
export const metadata: Metadata = {
  title: 'NeighborGigs Admin Dashboard',
  description: 'Manage neighborhood gigs, tasks, and users',
};
```

## Step 7: Testing

### Manual Testing Checklist

**Authentication:**
- [ ] Sign up with phone number
- [ ] Receive SMS code
- [ ] Upload profile photo
- [ ] Enter zip code
- [ ] Complete onboarding

**Helper Flow:**
- [ ] Create broadcast (Grocery)
- [ ] Set 30-minute window
- [ ] Set 2-mile radius
- [ ] Broadcast becomes visible to requesters
- [ ] Receive request notification
- [ ] Accept/decline request
- [ ] Mark task as complete
- [ ] Upload photo proof
- [ ] Receive payment

**Requester Flow:**
- [ ] Create request (Need milk)
- [ ] Set deadline (5pm)
- [ ] Set price ($10)
- [ ] See matching broadcasts
- [ ] See task accepted notification
- [ ] Chat with helper
- [ ] Confirm completion
- [ ] Add tip
- [ ] Rate helper (1-5 stars)

**Profile:**
- [ ] View profile stats
- [ ] See points earned
- [ ] View badge collection
- [ ] Check leaderboard position

**Web Dashboard:**
- [ ] Login with email (admin user)
- [ ] View dashboard stats
- [ ] See user list
- [ ] See task list
- [ ] View task details
- [ ] View charts

### Automated Testing

```bash
cd mobile-app
bun test

cd web-dashboard
bun test
```

## Step 8: Production Launch Checklist

### Pre-Launch
- [ ] Switch all environments to production
- [ ] Update app store metadata (screenshots, description)
- [ ] Configure push notifications (Firebase/OneSignal)
- [ ] Set up error monitoring (Sentry, LogRocket)
- [ ] Configure analytics (PostHog, Mixpanel)
- [ ] Add privacy policy & terms of service
- [ ] Test payment flow with real credit card (test mode)
- [ ] Verify SMS/OTP works
- [ ] Test on multiple devices

### Launch Week
- [ ] Deploy to App Store / Play Store
- [ ] Deploy web dashboard
- [ ] Monitor logs and error rates
- [ ] Prepare customer support channels
- [ ] Have beta testers ready

### Post-Launch
- [ ] Monitor user acquisition
- [ ] Track task completion rates
- [ ] Gather user feedback
- [ ] Fix critical bugs quickly
- [ ] Plan next feature release

## Troubleshooting

### Supabase Connection Issues
```bash
# Verify environment variables are set
cat .env.local

# Test connection from mobile app
curl -I $EXPO_PUBLIC_SUPABASE_URL
```

### iOS Build Issues
```bash
# Clear cache
bun expo r -c

# Reset build
bun expo prebuild --clean
```

### Android Build Issues
```bash
# Ensure Java is installed
java -version

# Clean Gradle
cd android && ./gradlew clean
```

### Permission Issues (Location/Camera)
- On iOS: Settings → [App] → Enable permissions
- On Android: Settings → Apps → [App] → Permissions

## Resources

- **Expo Docs**: https://docs.expo.dev/
- **Supabase Docs**: https://supabase.com/docs
- **Stripe Docs**: https://stripe.com/docs
- **Mapbox Docs**: https://docs.mapbox.com/

## Need Help?

- **GitHub Issues**: Report bugs or request features
- **Discord Community**: Join NeighborGigs developers
- **Email**: support@neighborgigs.com

---

**Happy Building! 🏘️**