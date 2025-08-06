import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import type { User as SupabaseUser } from '@supabase/supabase-js';
import type { Database } from '@/types/supabase';

// Table row types from generated Supabase types
type Tables = Database['public']['Tables'];
type UserRow = Tables['users']['Row'];
type ContractorRow = Tables['contractor']['Row'];
type BusinessRow = Tables['business']['Row'];

// Shape of user returned by the Auth context
export interface User {
  id: string;
  email: string | null;
  fullName: string | null;
  role: string | null;
  businessName: string | null;
  businessWebsite: string | null;
  industry: string | null;
  logo: string | null;
  description: string | null;
  completedSignUp: boolean | null;
  contractorProfile?: {
    skills: string[] | null;
    interests: string[] | null;
    resume: string | null;
    description: string | null;
  };
  businessProfile?: {
    name: string | null;
  };
}

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ error: Error | null }>;
  signup: (
    email: string,
    password: string,
    data: Partial<User>
  ) => Promise<{ error: Error | null }>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<{ error: Error | null }>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Helper to load the full user profile from database tables
  const fetchUserProfile = async (supaUser: SupabaseUser): Promise<User | null> => {
    if (!supabase) return null;
    const { data: userData, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', supaUser.id)
      .single<UserRow>();

    if (error || !userData) return null;

    let contractorProfile: User['contractorProfile'];
    if (userData.role === 'contractor') {
      const { data } = await supabase
        .from('contractor')
        .select('*')
        .eq('linkeduser', supaUser.id)
        .single<ContractorRow>();
      if (data) {
        contractorProfile = {
          skills: data.skills,
          interests: data.interests,
          resume: data.resume,
          description: data.description,
        };
      }
    }

    let businessProfile: User['businessProfile'];
    if (userData.role === 'business') {
      const { data } = await supabase
        .from('business')
        .select('*')
        .eq('linkeduser', supaUser.id)
        .single<BusinessRow>();
      if (data) {
        businessProfile = { name: data.name };
      }
    }

    return {
      id: userData.id,
      email: userData.email,
      fullName: userData['full name'],
      role: userData.role,
      businessName: userData.business_name,
      businessWebsite: userData.business_website,
      industry: userData.industry,
      logo: userData.logo,
      description: userData.description,
      completedSignUp: userData.completed_sign_up,
      contractorProfile,
      businessProfile,
    };
  };

  // Initialize auth state on first render
  useEffect(() => {
    let mounted = true;

    const init = async () => {
      if (!supabase) {
        setIsLoading(false);
        return;
      }
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) {
        console.error('Error fetching session:', error);
      }
      if (session?.user && mounted) {
        const profile = await fetchUserProfile(session.user);
        setUser(profile);
        setIsAuthenticated(!!profile);
      }
      if (mounted) setIsLoading(false);
    };

    init();

    const {
      data: { subscription },
    } = supabase?.auth.onAuthStateChange(async (_event, session) => {
      if (!mounted) return;
      if (session?.user) {
        const profile = await fetchUserProfile(session.user);
        setUser(profile);
        setIsAuthenticated(!!profile);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    }) ?? { data: { subscription: { unsubscribe: () => {} } } };

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // Authentication actions
  const login: AuthContextValue['login'] = async (email, password) => {
    if (!supabase) return { error: new Error('Supabase not configured') };
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { error };
    if (data.user) {
      const profile = await fetchUserProfile(data.user);
      setUser(profile);
      setIsAuthenticated(!!profile);
    }
    return { error: null };
  };

  const signup: AuthContextValue['signup'] = async (email, password, data) => {
    if (!supabase) return { error: new Error('Supabase not configured') };
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    });
    if (signUpError || !signUpData.user) return { error: signUpError ?? new Error('No user') };
    const userId = signUpData.user.id;

    // Create profile rows
    const { error: userError } = await supabase.from('users').insert({
      id: userId,
      email,
      'full name': data.fullName,
      role: data.role,
      business_name: data.businessName,
      business_website: data.businessWebsite,
      industry: data.industry,
      description: data.description,
      completed_sign_up: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    } satisfies Tables['users']['Insert']);
    if (userError) return { error: userError };

    if (data.role === 'contractor') {
      const { error: contractorError } = await supabase.from('contractor').insert({
        linkeduser: userId,
        name: data.fullName,
        skills: data.contractorProfile?.skills ?? [],
        interests: data.contractorProfile?.interests ?? [],
        resume: data.contractorProfile?.resume ?? null,
        description: data.contractorProfile?.description ?? null,
        created_at: new Date().toISOString(),
      } satisfies Tables['contractor']['Insert']);
      if (contractorError) return { error: contractorError };
    }

    if (data.role === 'business') {
      const { error: businessError } = await supabase.from('business').insert({
        linkeduser: userId,
        name: data.businessProfile?.name ?? data.businessName,
        created_at: new Date().toISOString(),
      } satisfies Tables['business']['Insert']);
      if (businessError) return { error: businessError };
    }

    const profile = await fetchUserProfile(signUpData.user);
    setUser(profile);
    setIsAuthenticated(!!profile);
    return { error: null };
  };

  const logout: AuthContextValue['logout'] = async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
    setUser(null);
    setIsAuthenticated(false);
  };

  const updateProfile: AuthContextValue['updateProfile'] = async (data) => {
    if (!user || !supabase) return { error: new Error('Not authenticated') };

    const { error: userError } = await supabase.from('users').update({
      'full name': data.fullName,
      business_name: data.businessName,
      business_website: data.businessWebsite,
      industry: data.industry,
      description: data.description,
      completed_sign_up: data.completedSignUp,
    }).eq('id', user.id);
    if (userError) return { error: userError };

    if (user.role === 'contractor' && data.contractorProfile) {
      const { error } = await supabase.from('contractor').update({
        skills: data.contractorProfile.skills,
        interests: data.contractorProfile.interests,
        resume: data.contractorProfile.resume,
        description: data.contractorProfile.description,
      }).eq('linkeduser', user.id);
      if (error) return { error };
    }

    if (user.role === 'business' && data.businessProfile) {
      const { error } = await supabase.from('business').update({
        name: data.businessProfile.name,
      }).eq('linkeduser', user.id);
      if (error) return { error };
    }

    const profile = await fetchUserProfile({ id: user.id } as SupabaseUser);
    setUser(profile);
    return { error: null };
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      isLoading,
      login,
      signup,
      logout,
      updateProfile,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

