import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export function useCreateProject() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createProject = async ({
    projectName,
    projectDescription,
  }: {
    projectName: string;
    projectDescription: string;
  }) => {
    setLoading(true);
    setError(null);

    // Get the current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      setError('User not authenticated');
      setLoading(false);
      return null;
    }

    // Only send fields that exist in the DB: project_name, project_description, owner_id
    const insertPayload = {
      project_name: projectName,
      project_description: projectDescription,
      owner_id: user.id,
    };

    const { data, error: insertError } = await supabase
      .from('projects')
      .insert([insertPayload])
      .select()
      .single();

    if (insertError) {
      setError(insertError.message);
      setLoading(false);
      return null;
    }

    setLoading(false);
    return data;
  };

  return { createProject, loading, error };
} 