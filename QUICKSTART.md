# NeighborGigs Quick Start

Get up and running in 5 minutes with this checklist.

## ⚡ Fast Start (Recommended)

```bash
# Run the setup script
./scripts/setup.sh

# Follow the prompts
```

## 📱 Mobile App Development

### 1. Setup (First time only)
```bash
cd mobile-app
bun install

# Create .env.local file
cp .env.example .env.local
```

### 2. Configure Environment
Edit `.env.local` and add your Supabase credentials:
```env
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 3. Start Development
```bash
bun expo start
```

### 4. Run on Device
- **iOS/Android**: Scan QR code with Expo Go app
- **iOS Simulator**: `bun expo run:ios` (Mac only)
- **Android Emulator**: `bun expo run:android`

## 🖥️ Web Dashboard Development

### 1. Setup (First time only)
```bash
cd web-dashboard
bun install

# Create .env.local file
cp .env.example .env.local
```

### 2. Configure Environment
Edit `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 3. Start Development
```bash
bun dev
```

### 4. Access Dashboard
Open browser: http://localhost:3000

## 🔧 Backend (Supabase)

### Required Setup
1. Create Supabase project at [supabase.com](https://supabase.com)
2. Run the schema: Copy contents from `backend/supabase/schema.sql`
3. Enable Phone Authentication
4. Update environment variables with your project URL and anon key

### Local Development (Optional)
```bash
supabase init
supabase start
supabase db reset
```

## 🎯 Core Features to Test

### Helper Flow (I'm Already Going Out)
1. Sign up with phone number
2. Upload profile photo
3. Create broadcast (Grocery, 30 min, 2 miles)
4. Wait for requests
5. Accept a request
6. Complete task & upload photo
7. Receive payment

### Requester Flow (I Need Something)
1. Sign up with phone number
2. Upload profile photo
3. Create request ("Need milk", $10, 5pm)
4. See matching broadcasts
5. Get matched and chat with helper
6. Confirm completion
7. Rate helper 1-5 stars

### Gamification
- Points for completing tasks
- Levels: New Neighbor → Local Legend
- Badges for task categories
- Daily/Weekly challenges

## 📦 Production Build

### Mobile Apps
```bash
# iOS
bun expo login
bun expo build:ios

# Android
bun expo build:android
```

### Web Dashboard
```bash
bun vercel deploy
# Or push to GitHub and connect Vercel
```

## 🛠️ Troubleshooting

### "Supabase connection failed"
- Check `.env.local` has correct URL and anon key
- Verify Supabase project is active
- Test connection: `curl $EXPO_PUBLIC_SUPABASE_URL`

### "Camera/Location permission denied"
- iOS: Settings → [App] → Enable permissions
- Android: Settings → Apps → [App] → Permissions

### "Build fails"
- Clear cache: `bun expo r -c`
- Reset build: `bun expo prebuild --clean`

### "Web dashboard not loading"
- Check `.env.local` has correct credentials
- Restart dev server: `Ctrl+C` then `bun dev`

## 📚 Documentation

- **[SETUP.md](SETUP.md)** - Complete setup guide
- **[README.md](README.md)** - Project overview
- **[APP_SUMMARY.md](APP_SUMMARY.md)** - Product vision
- **[DESIGN.md](DESIGN.md)** - UI/UX blueprint
- **[GAMIFICATION.md](GAMIFICATION.md)** - Engagement strategy

## 🚀 Next Steps

1. **Week 1**: Setup Supabase, Stripe, complete core mobile screens
2. **Week 2**: Implement authentication, task matching, payments
3. **Week 3**: Add gamification, polish UI, test thoroughly
4. **Week 4**: Beta test with real users, fix bugs
5. **Week 5**: Deploy to app stores, launch

## 💡 Pro Tips

- Use **Expo Go** for rapid prototyping
- **Supabase CLI** for local database development
- **Stripe Test Mode** for development payments
- **Mapbox Studio** for custom map styles
- **Vercel** for quick web dashboard deployment

## 🆘 Need Help?

- **GitHub Issues**: Report bugs or request features
- **Documentation**: Check the docs folder
- **Discord Community**: Coming soon
- **Email**: support@neighborgigs.com

---

**Happy Building! 🏘️**