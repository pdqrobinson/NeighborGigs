# NeighborGigs Tech Stack

## Overview
This document outlines the recommended technology stack for building the NeighborGigs MVP, designed for a 30-45 day development timeline.

---

## Frontend (Mobile)

### **Expo (React Native)**
- Cross-platform mobile development for iOS and Android
- Hot reloading for rapid development
- Access to native device features (GPS, camera, notifications)
- Easy deployment to App Store and Play Store

**Why Expo?**
- Fastest path from development to production
- Eliminates need for separate iOS/Android native code
- Built-in updates and development tools
- Large ecosystem of libraries

---

## Backend & Database

### **Supabase**
- PostgreSQL database
- User authentication (phone-based, JWT tokens)
- Real-time database subscriptions
- File storage (user photos, task proof images)
- Row-level security policies

**Why Supabase?**
- PostgreSQL with real-time capabilities
- Built-in authentication flows
- Auto-generated APIs
- Easy local development with Supabase CLI
- Handles backend complexity out of the box

---

## Payments

### **Stripe Connect**
- Escrow-based payment system
- Hold payments until task completion
- Payout to helpers
- Commission handling (10-15%)
- Support for cards, PayPal, Venmo

**Why Stripe Connect?**
- Purpose-built for marketplace payments
- Automatic compliance and tax handling
- Easy integration with mobile apps
- Supports escrow and split payments
- Robust dispute resolution

---

## Maps & Location

### **Mapbox**
- Interactive maps for neighborhood boundaries
- Radius selection (1-3 mile slider)
- GPS location tracking
- Distance calculations
- Custom map styling

**Why Mapbox?**
- Flexible and highly customizable
- Good free tier for development
- Excellent SDKs for React Native
- Performance optimization for mobile
- Supports offline maps

---

## Additional Services

### **Notifications**
- **Firebase Cloud Messaging** (FCM) or **OneSignal**
- Push notifications for task matches
- Real-time task updates

### **Email/SMS**
- **Twilio** for SMS verification
- **SendGrid** or **Resend** for transactional emails

---

## Development Tools

### **Version Control**
- **Git** for version control
- **GitHub** for code hosting and collaboration

### **Project Management**
- **Linear** or **GitHub Projects** for issue tracking

### **Design**
- **Figma** for UI/UX design
- **Expo Snack** for quick prototyping

---

## Infrastructure & Deployment

### **Mobile App Deployment**
- **Expo EAS Build** for automated builds
- **App Store Connect** (iOS)
- **Google Play Console** (Android)
- **Expo Updates** for over-the-air updates

### **Backend Deployment**
- **Supabase Cloud** (managed PostgreSQL)
- No additional server infrastructure needed

---

## Development Timeline Estimate

With this stack:
- **Days 1-7**: Project setup, auth flow, basic UI
- **Days 8-14**: Task posting, broadcasting, feed
- **Days 15-21**: Messaging, task management
- **Days 22-28**: Payment integration (Stripe Connect)
- **Days 29-35**: Testing, bug fixes, polish
- **Days 36-45**: App store submission, final adjustments

---

## Why This Stack?

1. **Speed**: Everything is optimized for rapid development
2. **Scalability**: Can handle thousands of concurrent users
3. **Cost-effective**: Generous free tiers during development
4. **Modern**: Industry-standard technologies with strong communities
5. **Maintainable**: Clean architecture, easy to iterate

---

## Next Steps

1. Initialize Expo project
2. Set up Supabase project
3. Configure Stripe Connect account
4. Set up Mapbox access token
5. Design database schema
6. Build authentication flow
7. Create core UI components
8. Implement task matching logic
9. Integrate payment flows
10. Test and deploy

---

## Resources

- [Expo Documentation](https://docs.expo.dev/)
- [Supabase Documentation](https://supabase.com/docs)
- [Stripe Connect](https://stripe.com/docs/connect)
- [Mapbox API](https://docs.mapbox.com/)
- [React Native Docs](https://reactnative.dev/)

---

## Tech Stack Summary

| Category | Technology |
|----------|------------|
| Mobile Framework | Expo (React Native) |
| Backend | Supabase |
| Database | PostgreSQL (via Supabase) |
| Authentication | Supabase Auth |
| Payments | Stripe Connect |
| Maps | Mapbox |
| Notifications | Firebase Cloud Messaging |
| SMS | Twilio |
| Deployment | Expo EAS |
| Code Hosting | GitHub |