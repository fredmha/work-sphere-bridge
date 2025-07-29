import { supabase } from '@/lib/supabaseClient';
import type { Database } from '@/types/supabase';

type Tables = Database['public']['Tables'];
type UserRow = Tables['users']['Row'];

export class User {
  static async me(): Promise<UserRow | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Error fetching user:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error in User.me():', error);
      return null;
    }
  }

  static async update(data: Partial<UserRow>): Promise<{ error: any }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return { error: new Error('No authenticated user') };

      const { error } = await supabase
        .from('users')
        .update(data)
        .eq('id', user.id);

      return { error };
    } catch (error) {
      console.error('Error updating user:', error);
      return { error };
    }
  }
} 