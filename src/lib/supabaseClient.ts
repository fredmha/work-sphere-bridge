import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/supabase'; // adjust path if needed

// Check if environment variables are available
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Temporarily disable Supabase to test if that's causing the blank screen
export const supabase = null;

// Original code (commented out for testing):
// export const supabase = supabaseUrl && supabaseAnonKey 
//   ? createClient<Database>(supabaseUrl, supabaseAnonKey)
//   : null; 