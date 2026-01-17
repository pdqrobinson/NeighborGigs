import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types based on our database schema
export interface User {
  id: string;
  full_name: string;
  phone_number: string;
  zip_code: string;
  photo_url: string | null;
  rating: number | null;
  level: number | null;
  created_at: string;
}

export interface Task {
  id: string;
  created_at: string;
  updated_at: string;
  requester_id: string;
  helper_id: string | null;
  broadcast_id: string | null;
  title: string;
  description: string | null;
  category: string;
  price_cents: number;
  deadline: string;
  status: string;
  proof_photo_url: string | null;
  proof_note: string | null;
  completed_at: string | null;
}

export interface Broadcast {
  id: string;
  created_at: string;
  updated_at: string;
  helper_id: string;
  category: string;
  notes: string | null;
  radius_miles: number;
  starts_at: string;
  ends_at: string;
  is_active: boolean;
}

export interface Transaction {
  id: string;
  created_at: string;
  task_id: string;
  requester_id: string;
  helper_id: string;
  amount_cents: number;
  stripe_payment_intent_id: string | null;
  status: string;
}