#!/bin/bash

# NeighborGigs Quick Setup Script
# Run this script to get started quickly with NeighborGigs

set -e

echo "=========================================="
echo "   NeighborGigs Setup Script"
echo "=========================================="
echo ""

# Check for required tools
echo "Checking required tools..."
command -v node >/dev/null 2>&1 || { echo "Node.js is required but not installed. Install from https://nodejs.org"; exit 1; }
command -v bun >/dev/null 2>&1 || { echo "Bun is required but not installed. Install from https://bun.sh"; curl -fsSL https://bun.sh/install | bash; }
command -v git >/dev/null 2>&1 || { echo "Git is required but not installed."; exit 1; }

echo "✓ Node.js: $(node --version)"
echo "✓ Bun: $(bun --version)"
echo "✓ Git: $(git --version)"
echo ""

# Clone repository
echo "Cloning repository..."
cd /home/workspace
if [ ! -d "NeighborGigs" ]; then
    git clone https://github.com/pdqrobinson/NeighborGigs.git
    cd NeighborGigs
else
    cd NeighborGigs
    git pull origin main
fi
echo "✓ Repository ready"
echo ""

# Setup mobile app
echo "Setting up mobile app..."
cd mobile-app
bun install
echo "✓ Mobile app dependencies installed"
echo ""

# Setup web dashboard
echo "Setting up web dashboard..."
cd ../web-dashboard
bun install
echo "✓ Web dashboard dependencies installed"
echo ""

# Create .env files
echo "Creating environment files..."
cd ..

# Mobile app .env
if [ ! -f "mobile-app/.env.local" ]; then
    echo "EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co" > mobile-app/.env.local
    echo "EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key" >> mobile-app/.env.local
    echo "EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_..." >> mobile-app/.env.local
    echo "EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN=your-mapbox-token" >> mobile-app/.env.local
    echo "✓ Created mobile-app/.env.local"
fi

# Web dashboard .env
if [ ! -f "web-dashboard/.env.local" ]; then
    echo "NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co" > web-dashboard/.env.local
    echo "NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key" >> web-dashboard/.env.local
    echo "✓ Created web-dashboard/.env.local"
fi

echo ""
echo "=========================================="
echo "   Setup Complete! 🎉"
echo "=========================================="
echo ""
echo "Next steps:"
echo "1. Setup Supabase: See SETUP.md"
echo "2. Configure .env files with your credentials"
echo "3. Run mobile app: cd mobile-app && bun expo start"
echo "4. Run web dashboard: cd web-dashboard && bun dev"
echo ""
echo "See SETUP.md for detailed instructions."
echo ""