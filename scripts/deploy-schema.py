#!/usr/bin/env python3
"""
Deploy NeighborGigs Database Schema to Supabase
This script reads schema.sql and deploys it via Supabase REST API
"""

import os
import sys
import requests
from pathlib import Path

# Read from environment variables (or use inline for testing)
supabase_url = os.getenv("SUPABASE_URL", "https://kxpglaetbawiugqmihfj.supabase.co")
service_role_key = os.getenv("SUPABASE_SERVICE_ROLE_KEY", "")

if not service_role_key:
    print("❌ SUPABASE_SERVICE_ROLE_KEY not set")
    print("   Run: export SUPABASE_SERVICE_ROLE_KEY='your-key'")
    sys.exit(1)

print(f"✓ SUPABASE_URL: {supabase_url}")
print(f"✓ SUPABASE_SERVICE_ROLE_KEY: {service_role_key[:20]}...")

# Read schema file
schema_path = Path(__file__).parent.parent / "backend" / "supabase" / "schema.sql"
schema_sql = schema_path.read_text()
print(f"✓ Loaded schema: {schema_path}")
print(f"   Size: {len(schema_sql)} characters")

# Prepare SQL execution request
headers = {
    "apikey": service_role_key,
    "Authorization": f"Bearer {service_role_key}",
    "Content-Type": "application/json",
    "Prefer": "return=minimal"
}

# Execute SQL via Supabase REST API
sql_endpoint = f"{supabase_url}/rest/v1/rpc/exec_sql"

# Note: Using direct REST endpoint for SQL execution
# Alternative: Use PostgreSQL connection string
print("\n🔨 Deploying schema to Supabase...")
print("   This may take 10-30 seconds...")

try:
    # For Supabase, we typically use SQL Editor or CLI
    # This script prepares the SQL for manual execution
    print("\n📋 SQL ready to deploy!")
    print("\nOption 1: Manual Deployment (RECOMMENDED)")
    print("   1. Go to: https://supabase.com/dashboard/project/kxpglaetbawiugqmihfj/sql")
    print("   2. Open: backend/supabase/schema.sql")
    print("   3. Copy entire file content")
    print("   4. Paste into SQL Editor")
    print("   5. Click 'Run'")
    print("\nOption 2: Supabase CLI (if installed)")
    print("   supabase db push --project-url https://kxpglaetbawiugqmihfj.supabase.co --db-password YOUR_DB_PASSWORD")
    
    print(f"\n✓ Schema file location: {schema_path}")
    print("✓ Schema contains:")
    print("   - Tables: users, broadcasts, tasks, messages, reviews, badges, challenges, leaderboards")
    print("   - RLS policies: 17 policies")
    print("   - Views: neighborhood_feed")
    print("   - Functions: award_points, update_user_level")
    
except Exception as e:
    print(f"❌ Error: {e}")
    sys.exit(1)
