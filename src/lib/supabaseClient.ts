import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/supabase'; // adjust path if needed

export const supabase = createClient<Database>(
  import.meta.env.VITE_SUPABASE_URL!,      // or process.env.NEXT_PUBLIC_SUPABASE_URL!
  import.meta.env.VITE_SUPABASE_ANON_KEY!  // or process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
); 