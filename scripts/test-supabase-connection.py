#!/usr/bin/env python3
"""
Supabase Connection Test Script
Run this to verify your Supabase setup is working correctly.
"""

import os
import sys

# Read from environment variables (set in Zo Settings → Developers)
supabase_url = os.getenv("SUPABASE_URL")
supabase_key = os.getenv("SUPABASE_ANON_KEY")

if not supabase_url:
    print("❌ SUPABASE_URL environment variable not found")
    print("   Add it in: Settings → Developers")
    sys.exit(1)

if not supabase_key:
    print("❌ SUPABASE_ANON_KEY environment variable not found")
    print("   Add it in: Settings → Developers")
    sys.exit(1)

print(f"✓ Loaded SUPABASE_URL: {supabase_url}")
print(f"✓ Loaded SUPABASE_ANON_KEY: {supabase_key[:20]}...")

# Try importing supabase-py
try:
    from supabase import create_client, Client
except ImportError:
    print("\n❌ supabase-py not installed")
    print("   Run: pip install supabase")
    sys.exit(1)

# Test connection
def test_connection():
    try:
        print("\n🔌 Testing Supabase connection...")
        client: Client = create_client(supabase_url, supabase_key)
        
        # Simple health check - try to query the database
        result = client.table('users').select('count', count='exact').execute()
        
        print("✅ SUCCESS: Connected to Supabase!")
        print(f"   Users table exists: {result.count}")
        return True
        
    except Exception as e:
        print(f"❌ FAILED: {type(e).__name__}")
        print(f"   Error: {str(e)}")
        print("\nPossible issues:")
        print("   1. Invalid credentials")
        print("   2. Database schema not yet deployed")
        print("   3. Network connectivity issue")
        return False

if __name__ == "__main__":
    success = test_connection()
    sys.exit(0 if success else 1)
