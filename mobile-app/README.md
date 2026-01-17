# NeighborGigs Mobile App

## Overview

This is the mobile application for NeighborGigs - a hyper-local, community-driven platform that connects neighbors for everyday tasks and errands.

## Tech Stack

- **Framework**: React Native (Expo)
- **Language**: TypeScript
- **Navigation**: Expo Router v3
- **Backend**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth (Phone-based)
- **Payments**: Stripe Connect SDK
- **Maps**: Mapbox / React Native Maps
- **State Management**: React Context + Supabase Real-time

## Setup

### 1. Install Dependencies

```bash
bun install
```

### 2. Environment Variables

Create a `.env.local` file in the root of the mobile-app folder:

```env
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN=your_mapbox_token
```

### 3. Supabase Setup

1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Run the schema.sql file in the `backend/` folder
3. Enable Phone Authentication in Supabase Dashboard
4. Add the Row-Level Security policies (see schema.sql)

### 4. Development

```bash
# Start development server
bun expo start

# Run on iOS (requires macOS)
bun expo run:ios

# Run on Android
bun expo run:android

# Build for production
bun expo build:ios
bun expo build:android
```

### 5. Testing

```bash
# Run tests
bun test
```

## Project Structure

```
mobile-app/
├── app/                    # Expo Router routes
│   ├── (tabs)/            # Main app tabs
│   ├── (screens)/         # Modal screens
│   ├── index.tsx          # Welcome screen
│   ├── Welcome.tsx
│   ├── Signup.tsx
│   └── _layout.tsx        # Main layout
├── src/
│   ├── lib/               # Supabase config, types
│   ├── screens/           # Screen components
│   │   ├── WelcomeScreen.tsx
│   │   ├── SignupScreen.tsx
│   │   ├── HomeScreen.tsx
│   │   ├── CreateBroadcastScreen.tsx
│   │   ├── CreateRequestScreen.tsx
│   │   ├── BroadcastLiveScreen.tsx
│   │   ├── TaskDetailScreen.tsx
│   │   └── ProfileScreen.tsx
│   └── components/        # Reusable components
├── assets/                # Images, icons, fonts
├── package.json
└── app.json              # Expo config
```

## Key Features

### 1. Welcome & Onboarding
- Two-path entry: "I'm already going out" (Helper) or "I need something" (Requester)
- SMS verification for authentication
- Profile photo upload required
- Zip code for neighborhood anchoring

### 2. Home Screen (Neighborhood Feed)
- Real-time broadcast feed from nearby helpers
- Radius slider (1-3 miles)
- Contextual task recommendations
- Active broadcasts with countdown timers

### 3. Helper Flow (Broadcast Mode)
- Quick broadcast creation (15/30/60 min windows)
- Category selection (Grocery, Pharmacy, Errands, etc.)
- Live incoming request notifications
- One-tap accept/decline with escrow payment lock

### 4. Requester Flow
- Simple task creation with price suggestions
- Automatic matching to active broadcasts
- Push notifications for task updates
- In-app messaging with helpers

### 5. Task Management
- Clear state machine: PENDING → OFFERED → ACCEPTED → IN_PROGRESS → COMPLETED → PAID
- Photo proof of completion
- Rating system (1-5 stars with comments)
- Dispute resolution flow

### 6. Gamification
- Points system for completing tasks
- Neighborhood ranks (New Neighbor → Local Legend)
- Badges for task categories
- Daily/weekly challenges
- Leaderboards

### 7. Profile & Trust
- User photo, name, rating, neighborhood
- Reliability score
- Task completion stats
- Ambassador badge (trusted users)

## Architecture

### State Management

- **Session State**: Managed via Supabase Auth + React Context
- **Real-time Updates**: Supabase Real-time subscriptions for:
  - New broadcast alerts
  - Task status changes
  - New request matches
- **Location**: React Native Location for background GPS

### Database Schema

The app uses the following core tables (see `backend/supabase/schema.sql`):

- `users`: User profiles, photos, ratings, levels
- `broadcasts`: Helper trip announcements
- `tasks`: Individual task records (attached to broadcasts)
- `messages`: In-app chat between users
- `reviews`: Star ratings and comments
- `point_transactions`: Gamification points log
- `badges`: Achievement system
- `challenges`: Daily/weekly quests

### Payment Flow

1. User creates task → Stripe PaymentIntent (authorize)
2. Helper accepts → Capture into escrow
3. Requester confirms completion → Release payout
4. Commission (10-15%) retained by platform

## API Reference

### Authentication

```typescript
// Phone sign-up
await supabase.auth.signUp({
  phone: '+1234567890',
  password: 'temp_password'
});

// Phone sign-in
await supabase.auth.signInWithOtp({
  phone: '+1234567890'
});
```

### Tasks

```typescript
// Create broadcast
await supabase.from('broadcasts').insert({
  helper_id: userId,
  category: 'Grocery',
  starts_at: now(),
  ends_at: now() + 30 minutes
});

// Get nearby broadcasts
const { data: broadcasts } = await supabase
  .from('broadcasts')
  .select('*, users:helper_id(*)')
  .eq('is_active', true)
  .gt('starts_at', now())
  .lt('ends_at', now())
  .order('created_at', { ascending: false });
```

### Real-time Updates

```typescript
// Subscribe to new tasks
channel.on('broadcast', { event: 'new_task' }, (payload) => {
  // Show notification
});

// Subscribe to task status changes
channel.on('broadcast', { event: 'task_updated' }, (payload) => {
  // Update UI
});
```

## Deployment

### iOS

1. Create Apple Developer account
2. Configure EAS Build credentials
3. Build and submit to App Store

```bash
bun expo login
bun expo build:ios
```

### Android

1. Create Google Play Developer account
2. Generate signing keystore
3. Build and submit to Play Store

```bash
bun expo build:android
```

## Environment Notes

- **Supabase**: Use Supabase CLI or cloud for production
- **Stripe**: Configure Stripe Connect account for marketplace payments
- **Mapbox**: Use Mapbox Studio for custom map styles
- **FCM**: Firebase Cloud Messaging for push notifications (iOS/Android)

## Testing Checklist

- [ ] Authentication flow (sign-up, sign-in, sign-out)
- [ ] Location permissions and radius filtering
- [ ] Broadcast creation and live matching
- [ ] Task acceptance and payment flow
- [ ] Photo upload and proof of completion
- [ ] Rating system
- [ ] Real-time notifications
- [ ] Gamification points and badges
- [ ] Profile management
- [ ] Dispute resolution flow

## Troubleshooting

### "Failed to fetch Supabase data"
- Check environment variables in `.env.local`
- Verify Supabase project is active

### "Map not rendering"
- Ensure Mapbox access token is set
- Check location permissions

### "Build fails on iOS"
- Ensure correct bundle identifier in `app.json`
- Check EAS Build credentials

## Resources

- [Expo Documentation](https://docs.expo.dev/)
- [Supabase Documentation](https://supabase.com/docs)
- [Stripe Connect Documentation](https://stripe.com/docs/connect)
- [React Native Maps](https://github.com/react-native-maps/react-native-maps)
- [Expo Router](https://docs.expo.dev/routing/)

## License

This is a proprietary application for NeighborGigs. All rights reserved.