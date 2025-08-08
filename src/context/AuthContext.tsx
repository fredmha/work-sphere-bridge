import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { User as SupabaseUser, Session } from '@supabase/supabase-js';
import type { Database } from '@/types/supabase';

type Tables = Database['public']['Tables'];
// Row types
type UserRow = Tables['users']['Row'];
type ContractorRow = Tables['contractor']['Row'];
type BusinessRow = Tables['business']['Row'];
// Insert types (fixes TS overload errors on .insert)
type UserInsert = Tables['users']['Insert'];
type ContractorInsert = Tables['contractor']['Insert'];
type BusinessInsert = Tables['business']['Insert'];

interface User {
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
  // Contractor specific fields
  contractorProfile?: {
    skills: string[] | null;
    interests: string[] | null;
    resume: string | null;
    description: string | null;
  };
  // Business specific fields
  businessProfile?: {
    name: string | null;
  };
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ error: any }>;
  signup: (email: string, password: string, userData: Partial<User>) => Promise<{ error: any }>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<{ error: any }>;
  clearAuthData: () => void;
  forceClearCache: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check if Supabase is properly configured
  const isSupabaseConfigured = () => supabase !== null;

  // STATE-ONLY clear (do NOT wipe storage so sessions persist across reloads)
  const clearAuthData = () => {
    setUser(null);
    setIsAuthenticated(false);
  };

  // Fetch user profile data from database (3 queries; no implicit joins required)
  const fetchUserProfile = async (supabaseUser: SupabaseUser): Promise<User | null> => {
    if (!supabase) return null;
    try {
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', supabaseUser.id)
        .single();
      if (userError || !userData) return null;

      let contractorProfile: User['contractorProfile'] | undefined;
      let businessProfile: User['businessProfile'] | undefined;

      if (userData.role === 'contractor') {
        const { data: contractorData } = await supabase
          .from('contractor')
          .select('*')
          .eq('linkeduser', supabaseUser.id)
          .maybeSingle();
        if (contractorData) {
          contractorProfile = {
            skills: contractorData.skills,
            interests: contractorData.interests,
            resume: contractorData.resume,
            description: contractorData.description,
          };
        }
      }

      if (userData.role === 'business') {
        const { data: businessData } = await supabase
          .from('business')
          .select('*')
          .eq('linkeduser', supabaseUser.id)
          .maybeSingle();
        if (businessData) {
          businessProfile = { name: businessData.name };
        }
      }

      return {
        id: userData.id,
        email: userData.email,
        fullName: (userData as any)['full name'],
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
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
  };

  // Initialize auth state — no cache nuking, no timers; rely on persisted session
  useEffect(() => {
    if (!isSupabaseConfigured()) {
      clearAuthData();
      setIsLoading(false);
      return;
    }

    let unsub: { unsubscribe: () => void } | null = null;
    let settled = false;

    const applySession = async (session: Session | null) => {
      if (session?.user) {
        const profile = await fetchUserProfile(session.user);
        if (profile) {
          setUser(profile);
          setIsAuthenticated(true);
        } else {
          clearAuthData();
        }
      } else {
        clearAuthData();
      }
    };

    const init = async () => {
      setIsLoading(true);
      try {
        // Prime from persisted session
        const { data: { session } } = await supabase!.auth.getSession();
        await applySession(session);

        // Subscribe (handles INITIAL_SESSION on modern SDKs)
        const { data } = supabase!.auth.onAuthStateChange(async (event, sessionNow) => {
          await applySession(sessionNow ?? null);
          if (event === 'INITIAL_SESSION' && !settled) {
            settled = true;
            setIsLoading(false);
          }
        });
        unsub = data.subscription;
      } catch (e) {
        console.error('Error during auth init:', e);
        clearAuthData();
      } finally {
        if (!settled) {
          settled = true;
          setIsLoading(false);
        }
      }
    };

    init();
    return () => unsub?.unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    if (!isSupabaseConfigured()) {
      return { error: new Error('Supabase not configured. Please set up your environment variables.') };
    }

    try {
      const { data, error } = await supabase!.auth.signInWithPassword({ email, password });
      if (error) return { error };

      if (data.user) {
        const profile = await fetchUserProfile(data.user);
        if (profile) {
          setUser(profile);
          setIsAuthenticated(true);
        } else {
          clearAuthData();
        }
      }
      return { error: null };
    } catch (error) {
      console.error('Login error:', error);
      return { error };
    }
  };

  const signup = async (email: string, password: string, userData: Partial<User>) => {
    if (!isSupabaseConfigured()) {
      return { error: new Error('Supabase not configured. Please set up your environment variables.') };
    }

    try {
      const { data, error } = await supabase!.auth.signUp({ email, password });
      if (error) return { error };

      if (data.user) {
        // Create users row (use Insert type, not Row)
        const { error: userError } = await supabase!
          .from('users')
          .insert({
            id: data.user.id,
            email,
            'full name': userData.fullName ?? null,
            role: userData.role ?? null,
            business_name: userData.businessName ?? null,
            business_website: userData.businessWebsite ?? null,
            industry: userData.industry ?? null,
            description: userData.description ?? null,
            completed_sign_up: false,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          } satisfies UserInsert);
        if (userError) return { error: userError };

        // Create contractor profile if applicable
        if (userData.role === 'contractor') {
          const { error: contractorError } = await supabase!
            .from('contractor')
            .insert({
              linkeduser: data.user.id,
              name: userData.fullName ?? null,
              description: userData.description ?? null,
              skills: userData.contractorProfile?.skills ?? null,
              interests: userData.contractorProfile?.interests ?? null,
              resume: userData.contractorProfile?.resume ?? null,
              created_at: new Date().toISOString(),
            } satisfies ContractorInsert);
          if (contractorError) return { error: contractorError };
        }

        // Create business profile if applicable
        if (userData.role === 'business') {
          const { error: businessError } = await supabase!
            .from('business')
            .insert({
              linkeduser: data.user.id,
              name: userData.businessProfile?.name ?? userData.businessName ?? null,
              created_at: new Date().toISOString(),
            } satisfies BusinessInsert);
          if (businessError) return { error: businessError };
        }

        // Load profile into context without reloading
        const { data: { user: supabaseUser } } = await supabase.auth.getUser();
        if (supabaseUser) {
          const profile = await fetchUserProfile(supabaseUser);
          if (profile) {
            setUser(profile);
            setIsAuthenticated(true);
          }
        }
      }

      return { error: null };
    } catch (error) {
      console.error('Signup error:', error);
      return { error };
    }
  };

  const logout = async () => {
    if (!isSupabaseConfigured()) {
      clearAuthData();
      return;
    }

    try {
      await supabase!.auth.signOut();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      clearAuthData();
      window.location.href = '/';
    }
  };

  const updateProfile = async (data: Partial<User>) => {
    if (!user) return { error: new Error('No user logged in') };
    if (!isSupabaseConfigured()) {
      return { error: new Error('Supabase not configured. Please set up your environment variables.') };
    }

    try {
      const { error: userError } = await supabase!
        .from('users')
        .update({
          'full name': data.fullName,
          business_name: data.businessName,
          business_website: data.businessWebsite,
          industry: data.industry,
          description: data.description,
          completed_sign_up: data.completedSignUp,
        })
        .eq('id', user.id);
      if (userError) return { error: userError };

      if (user.role === 'contractor' && data.contractorProfile) {
        const { error: contractorError } = await supabase!
          .from('contractor')
          .update({
            skills: data.contractorProfile.skills,
            interests: data.contractorProfile.interests,
            resume: data.contractorProfile.resume,
            description: data.contractorProfile.description,
          })
          .eq('linkeduser', user.id);
        if (contractorError) return { error: contractorError };
      }

      if (user.role === 'business' && data.businessProfile) {
        const { error: businessError } = await supabase!
          .from('business')
          .update({ name: data.businessProfile.name })
          .eq('linkeduser', user.id);
        if (businessError) return { error: businessError };
      }

      const { data: { user: supabaseUser } } = await supabase!.auth.getUser();
      if (supabaseUser) {
        const updatedProfile = await fetchUserProfile(supabaseUser);
        setUser(updatedProfile);
        setIsAuthenticated(!!updatedProfile);
      }

      return { error: null };
    } catch (error) {
      console.error('Update profile error:', error);
      return { error };
    }
  };

  const forceClearCache = () => {
    // Keep this state-only so we don't wipe the persisted session tokens
    clearAuthData();
    window.location.reload();
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
      clearAuthData,
      forceClearCache,
    }}>
      {children}
    </AuthContext.Provider>
  );
};
