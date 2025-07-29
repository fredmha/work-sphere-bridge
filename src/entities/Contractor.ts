import { supabase } from '@/lib/supabaseClient';
import type { Database } from '@/types/supabase';

type Tables = Database['public']['Tables'];
type ContractorRow = Tables['contractor']['Row'];
type ContractorInsert = Tables['contractor']['Insert'];

export class Contractor {
  static async create(data: ContractorInsert): Promise<{ error: any }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return { error: new Error('No authenticated user') };

      const { error } = await supabase
        .from('contractor')
        .insert({
          ...data,
          linkeduser: user.id,
          created_at: new Date().toISOString()
        });

      return { error };
    } catch (error) {
      console.error('Error creating contractor:', error);
      return { error };
    }
  }

  static async update(data: Partial<ContractorRow>): Promise<{ error: any }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return { error: new Error('No authenticated user') };

      const { error } = await supabase
        .from('contractor')
        .update(data)
        .eq('linkeduser', user.id);

      return { error };
    } catch (error) {
      console.error('Error updating contractor:', error);
      return { error };
    }
  }

  static async getByUserId(userId: string): Promise<ContractorRow | null> {
    try {
      const { data, error } = await supabase
        .from('contractor')
        .select('*')
        .eq('linkeduser', userId)
        .single();

      if (error) {
        console.error('Error fetching contractor:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error in Contractor.getByUserId():', error);
      return null;
    }
  }
} 