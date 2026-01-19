# NeighborGigs 🏘️

> A hyper-local, community-driven platform that connects neighbors for everyday tasks and errands.

## Overview

NeighborGigs helps neighbors help each other. Whether you're already going to the grocery store and can pick up items for others, or you need someone to assemble furniture, NeighborGigs makes it easy to connect with trusted neighbors in your immediate area.

## Project Structure

```
NeighborGigs/
├── README.md
├── APP_SUMMARY.md          # Complete product vision
├── DESIGN.md               # UI/UX blueprint
├── TECH_STACK.md           # Technology choices
├── GAMIFICATION.md         - Engagement strategy
├── TASK_STATE.md           - State machine specification
├── mobile-app/             # React Native (Expo) iOS/Android app
│   ├── src/
│   │   ├── lib/           # Supabase config, types
│   │   ├── screens/       # Screen components
│   │   └── components/    # Reusable UI
│   ├── app/               # Expo Router routes
│   └── package.json
├── web-dashboard/          # Next.js admin dashboard
│   ├── src/
│   │   ├── app/           # Pages & routes
│   │   ├── components/    # UI components
│   │   └── lib/           # Utilities & types
│   └── package.json
└── backend/                # Supabase configuration
    ├── supabase/
    │   └── schema.sql     # Database schema
    └── config.ts          # App configuration
```

## Core Features

### 1. Helper Flow (Primary Path)
- **"I'm Already Going Out"** - Broadcast your trip (Grocery, Pharmacy, Errands)
- Set 15/30/60 min window and radius (1-3 miles)
- Receive and accept nearby requests
- Photo proof, instant payment on completion

### 2. Requester Flow
- Post what you need with a suggested price
- Match automatically with active broadcasts
- Track task status in real-time
- Pay only after confirmation

## Task Templates 📝

Speed up task creation with pre-built templates for common tasks:

- **24 templates** across 4 categories: Errands, Help, Quick Jobs, Delivery
- **Pre-populated forms** with title, description, price range, and duration
- **Step-by-step instructions** for common tasks
- **Tag-based search** to find the right template
- **Template tracking** to analyze which tasks are most popular

**Quick Start:** See `TASK_TEMPLATES_DEPLOYMENT.md` for integration guide

**Example Templates:**
- Grocery Pickup, Pharmacy Run, Pet Supplies
- Furniture Moving, TV Installation, Yard Work
- Car Wash, Lawn Mowing, Light Cleaning
- Item Delivery, Document Pickup

## Getting Started

### Prerequisites

- Node.js 18+
- Bun (for the web dashboard)
- Supabase project

### Environment Setup

```bash
# Frontend
cd neighborgigs-web
bun install

# Copy env template and configure
cp .env.example .env
# Edit .env with your Supabase credentials

# Start dev server
bun run dev
```

### Deploy Task Templates

```bash
# Deploy database migration
# (see TASK_TEMPLATES_DEPLOYMENT.md for detailed instructions)

# Option A: Run SQL via Supabase Dashboard
# Copy contents of backend/supabase/migrations/002_task_templates.sql

# Option B: Export from dataset
cd neighborgigs-task-templates
python3 scripts/export_to_supabase.py
```

## Trust & Safety
- Phone verification required
- 1-5 star rating system
- Photo proof for all completed tasks
- Optional ID verification unlocks badges
- Clear dispute resolution process

### 4. Gamification
- Earn points for completing tasks
- Neighborhood ranks (New Neighbor → Local Legend)
- Badges for task categories & special achievements
- Daily/Weekly challenges with rewards
- Neighborhood leaderboards

### 5. Payments
- Upfront payment via Stripe Connect
- Funds held in escrow until completion
- 10-15% platform commission
- Payouts to helpers weekly or on-demand
- Optional tips

## Tech Stack

| Component | Technology | Why |
|-----------|------------|-----|
| **Mobile App** | React Native (Expo) | Cross-platform, fast development |
| **Backend** | Supabase | PostgreSQL + Realtime + Auth |
| **Payments** | Stripe Connect | Marketplace escrow, compliance |
| **Maps** | Mapbox / React Native Maps | Location & radius filtering |
| **Web Dashboard** | Next.js (TypeScript) | Admin & analytics dashboard |
| **Notifications** | Firebase Cloud Messaging | Push notifications |

## Quick Start

### Prerequisites
- Node.js 20+ / Bun
- Supabase account
- Stripe account (for payments)
- Mapbox account (for maps)

### 1. Setup Supabase

1. Create project at [supabase.com](https://supabase.com)
2. Run the schema:
   ```bash
   supabase db reset --local
   # Or manually execute backend/supabase/schema.sql
   ```
3. Enable Phone Authentication
4. Enable Row-Level Security (see schema for policies)

### 2. Setup Mobile App

```bash
cd mobile-app
bun install

# Create .env.local file
echo "EXPO_PUBLIC_SUPABASE_URL=your_url" > .env.local
echo "EXPO_PUBLIC_SUPABASE_ANON_KEY=your_anon_key" >> .env.local

# Start development
bun expo start
```

### 3. Setup Web Dashboard

```bash
cd web-dashboard
bun install

# Create .env.local file
echo "NEXT_PUBLIC_SUPABASE_URL=your_url" > .env.local
echo "NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key" >> .env.local

# Start development
bun dev
```

### 4. Run End-to-End

1. **Backend**: Supabase project running
2. **Mobile**: `bun expo start` (scan QR with Expo Go)
3. **Web**: `bun dev` (admin dashboard at localhost:3000)

## Development Roadmap

### Phase 1: MVP (Weeks 1-6)
- [x] Database schema & setup
- [ ] Authentication (Phone OTP)
- [ ] Basic broadcast creation & matching
- [ ] Task flow (Request → Accept → Complete → Pay)
- [ ] Photo upload & proof
- [ ] Basic rating system
- [ ] Core gamification (Points & Levels)

### Phase 2: Polish (Weeks 7-10)
- [ ] Advanced gamification (Badges, Challenges, Leaderboards)
- [ ] Push notifications (FCM)
- [ ] In-app messaging
- [ ] Admin dashboard (Web)
- [ ] Dispute resolution flow
- [ ] Ambassador system

### Phase 3: Scale (Weeks 11-15)
- [ ] Local business partnerships
- [ ] Premium membership
- [ ] Advanced analytics
- [ ] Seasonal events
- [ ] Referral program

## Key Documents

- **[APP_SUMMARY.md](APP_SUMMARY.md)** - Product vision, features, monetization
- **[DESIGN.md](DESIGN.md)** - Complete UI/UX blueprint for all screens
- **[TECH_STACK.md](TECH_STACK.md)** - Detailed technology choices and timeline
- **[GAMIFICATION.md](GAMIFICATION.md)** - Engagement mechanics & rewards
- **[TASK_STATE.md](TASK_STATE.md)** - State machine specification

## Environment Variables

### Mobile App (.env.local)
```env
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN=your-mapbox-token
```

### Web Dashboard (.env.local)
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### Backend
Supabase will use environment variables set in the dashboard.

## Testing

### Unit Tests
```bash
cd mobile-app
bun test
```

### Manual Testing Checklist
- [ ] Sign up with phone number
- [ ] Upload profile photo
- [ ] Create broadcast (Helper)
- [ ] Accept incoming request
- [ ] Complete task with photo proof
- [ ] Receive payment
- [ ] Rate user (1-5 stars)
- [ ] View profile with stats

## Deployment

### Mobile Apps

**iOS (App Store)**
```bash
cd mobile-app
bun expo login
bun expo build:ios
# Submit to App Store Connect
```

**Android (Google Play)**
```bash
cd mobile-app
bun expo build:android
# Submit to Play Console
```

### Web Dashboard (Vercel)
```bash
cd web-dashboard
bun vercel deploy
```

### Database (Supabase)
- Automatic on Supabase Cloud
- Use Supabase CLI for local development

## Monetization

1. **Commission**: 10-15% on each task
2. **Premium**: $4.99/month for enhanced features
3. **Sponsored**: Local business listings
4. **Data**: Anonymized neighborhood insights (opt-in)

## Safety & Legal

### Safety Features
- Phone number verification
- Optional ID verification
- Photo proof of completion
- Rating & review system
- Clear flagging system

### Legal Considerations
- **Not professional services**: User agreement states this is peer-to-peer assistance only
- **No licensing required**: Tasks are casual neighbor help
- **Dispute resolution**: Simple refund process
- **Data privacy**: Supabase handles GDPR compliance

## Community

### Launch Strategy
1. Beta in 2-3 neighborhoods
2. Word-of-mouth growth via Nextdoor/Facebook
3. Early adopter incentives (free first tasks)
4. Ambassador program for trusted helpers

### Success Metrics
- **Adoption**: # of users, # of neighborhoods
- **Engagement**: Tasks/week, completion rate
- **Retention**: Monthly active users
- **Revenue**: Transaction volume, commission

## Contributing

This is a proprietary application. For internal development:
1. Review the design documents
2. Follow the tech stack guidelines
3. Test thoroughly before merging
4. Update the changelog

## Support

- **Questions**: Create GitHub issue
- **Bug reports**: Include reproduction steps
- **Feature requests**: Reference design documents

## License

Proprietary. All rights reserved.

---

**Built with ❤️ for communities everywhere**