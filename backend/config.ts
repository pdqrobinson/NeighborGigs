/**
 * NeighborGigs Backend Configuration
 * 
 * Environment variables needed:
 * - SUPABASE_URL: Your Supabase project URL
 * - SUPABASE_ANON_KEY: Your Supabase anon/public key
 * - STRIPE_SECRET_KEY: Your Stripe secret key
 * - STRIPE_WEBHOOK_SECRET: Your Stripe webhook secret
 * - MAPBOX_ACCESS_TOKEN: Your Mapbox access token
 */

export const config = {
  supabase: {
    url: process.env.SUPABASE_URL || '',
    anonKey: process.env.SUPABASE_ANON_KEY || '',
  },

  stripe: {
    secretKey: process.env.STRIPE_SECRET_KEY || '',
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET || '',
    publishableKey: process.env.STRIPE_PUBLISHABLE_KEY || '',
    // Commission percentage (10-15%)
    commissionRate: 0.10,
  },

  mapbox: {
    accessToken: process.env.MAPBOX_ACCESS_TOKEN || '',
  },

  // Neighborhood settings
  neighborhood: {
    defaultRadiusMiles: 2,
    minRadiusMiles: 1,
    maxRadiusMiles: 5,
  },

  // Pricing
  pricing: {
    minPrice: 500, // $5.00 in cents
    maxPrice: 5000, // $50.00 in cents
    defaultOptions: [500, 1000, 1500], // $5, $10, $15
  },

  // Task timing
  tasks: {
    broadcastExpiryHours: 2,
    defaultDeadlineMinutes: 60,
  },

  // Gamification
  gamification: {
    points: {
      taskComplete: 50,
      requestComplete: 25,
      speedBonus: 20,
      ratingBonus: 15,
      referralBonus: 50,
    },
    levels: [
      { level: 1, title: 'New Neighbor', points: 0 },
      { level: 2, title: 'Friendly Face', points: 100 },
      { level: 3, title: 'Helpful Hand', points: 300 },
      { level: 4, title: 'Block Captain', points: 750 },
      { level: 5, title: 'Street Legend', points: 1500 },
      { level: 6, title: 'Community Hero', points: 3000 },
      { level: 7, title: 'Neighborhood Champion', points: 5000 },
      { level: 8, title: 'Local Legend', points: 10000 },
    ],
  },
};

export default config;