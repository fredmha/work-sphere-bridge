import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { User as SupabaseUser, Session } from '@supabase/supabase-js';
import type { Database } from '@/types/supabase';

type Tables = Database['public']['Tables'];
type UserRow = Tables['users']['Row'];
type ContractorRow = Tables['contractor']['Row'];
type BusinessRow = Tables['business']['Row'];

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
  console.log("🔐 AuthProvider: Initializing...");
  
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check if Supabase is properly configured
  const isSupabaseConfigured = () => {
    const configured = supabase !== null;
    console.log("🔐 AuthProvider: Supabase configured:", configured);
    return configured;
  };

  // Fetch user profile data from database
  const fetchUserProfile = async (supabaseUser: SupabaseUser): Promise<User | null> => {
    console.log("🔐 AuthProvider: Fetching user profile for:", supabaseUser.id);
    
    if (!supabase) {
      console.log("🔐 AuthProvider: Supabase not available, returning null");
      return null;
    }
    
    try {
      // Get user data from users table
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', supabaseUser.id)
        .single();

      if (userError) {
        console.error('🔐 AuthProvider: Error fetching user data:', userError);
        return null;
      }

      if (!userData) {
        console.error('🔐 AuthProvider: No user data found');
        return null;
      }

      console.log("🔐 AuthProvider: User data fetched successfully:", userData);

      // Get contractor profile if user is a contractor
      let contractorProfile = undefined;
      if (userData.role === 'contractor') {
        const { data: contractorData, error: contractorError } = await supabase
          .from('contractor')
          .select('*')
          .eq('linkeduser', supabaseUser.id)
          .single();

        if (!contractorError && contractorData) {
          contractorProfile = {
            skills: contractorData.skills,
            interests: contractorData.interests,
            resume: contractorData.resume,
            description: contractorData.description,
          };
          console.log("🔐 AuthProvider: Contractor profile loaded");
        }
      }

      // Get business profile if user is a business
      let businessProfile = undefined;
      if (userData.role === 'business') {
        const { data: businessData, error: businessError } = await supabase
          .from('business')
          .select('*')
          .eq('linkeduser', supabaseUser.id)
          .single();

        if (!businessError && businessData) {
          businessProfile = {
            name: businessData.name,
          };
          console.log("🔐 AuthProvider: Business profile loaded");
        }
      }

      const userProfile = {
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

      console.log("🔐 AuthProvider: Final user profile:", userProfile);
      return userProfile;
    } catch (error) {
      console.error('🔐 AuthProvider: Error fetching user profile:', error);
      return null;
    }
  };

  // Initialize auth state
  useEffect(() => {
    console.log('🔐 AuthProvider: Starting initialization...');
    console.log('🔐 AuthProvider: Supabase configured:', isSupabaseConfigured());
    
    // Set loading to false immediately if Supabase is not configured
    if (!isSupabaseConfigured()) {
      console.log('🔐 AuthProvider: Supabase not configured, setting loading to false immediately');
      setIsLoading(false);
      return;
    }
    
    // Always set loading to false after a short delay as fallback
    const timer = setTimeout(() => {
      console.log('🔐 AuthProvider: Fallback timer - setting loading to false');
      setIsLoading(false);
    }, 2000); // Increased timeout to 2 seconds

    // If Supabase is configured, try to get session
    const initializeAuth = async () => {
      try {
        console.log('🔐 AuthProvider: Getting Supabase session...');
        const { data: { session } } = await supabase!.auth.getSession();
        
        if (session?.user) {
          console.log('🔐 AuthProvider: Session found, fetching user profile...');
          const userProfile = await fetchUserProfile(session.user);
          setUser(userProfile);
          setIsAuthenticated(!!userProfile);
          console.log('🔐 AuthProvider: User profile set, authenticated:', !!userProfile);
        } else {
          console.log('🔐 AuthProvider: No session found');
        }
      } catch (error) {
        console.error('🔐 AuthProvider: Error getting Supabase session:', error);
      } finally {
        console.log('🔐 AuthProvider: Setting loading to false after auth check');
        setIsLoading(false);
      }
    };

    initializeAuth();

    // Set up auth listener
    const { data: { subscription } } = supabase!.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔐 AuthProvider: Auth state changed:', event, session?.user?.id);
        
        if (session?.user) {
          const userProfile = await fetchUserProfile(session.user);
          setUser(userProfile);
          setIsAuthenticated(!!userProfile);
        } else {
          setUser(null);
          setIsAuthenticated(false);
        }
      }
    );

    return () => {
      console.log('🔐 AuthProvider: Cleaning up...');
      clearTimeout(timer);
      subscription.unsubscribe();
    };
  }, []);

  console.log("🔐 AuthProvider: Current state:", { user: !!user, isAuthenticated, isLoading });

  const login = async (email: string, password: string) => {
    if (!isSupabaseConfigured()) {
      return { error: new Error('Supabase not configured. Please set up your environment variables.') };
    }

    try {
      const { data, error } = await supabase!.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { error };
      }

      if (data.user) {
        const userProfile = await fetchUserProfile(data.user);
        setUser(userProfile);
        setIsAuthenticated(!!userProfile);
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
      const { data, error } = await supabase!.auth.signUp({
        email,
        password,
      });

      if (error) {
        return { error };
      }

      if (data.user) {
        // STEP 1: Create user record in users table FIRST
        const { error: userError } = await supabase!
          .from('users')
          .insert({
            id: data.user.id, // This must match auth.users.id
            email: email,
            'full name': userData.fullName, // Note: space in field name
            role: userData.role, // 'contractor' or 'business'
            business_name: userData.businessName,
            business_website: userData.businessWebsite,
            industry: userData.industry,
            description: userData.description,
            completed_sign_up: false,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });

        if (userError) {
          console.error('User table insert error:', userError);
          alert('Failed to create user profile: ' + userError.message);
          return;
        }

        // STEP 2: Create contractor profile
        const { error: contractorError } = await supabase!
          .from('contractor')
          .insert({
            linkeduser: data.user.id, // Foreign key to auth.users.id
            name: userData.fullName, // ✅ contractor table HAS name field
            description: userData.description,
            skills: userData.contractorProfile?.skills?.map(s => s.trim()).filter(Boolean),
            interests: userData.contractorProfile?.interests?.map(s => s.trim()).filter(Boolean),
            resume: userData.contractorProfile?.resume || null,
            created_at: new Date().toISOString()
          });

        if (contractorError) {
          console.error('Error creating contractor profile:', contractorError);
        }

        // STEP 3: Create business profile
        const { error: businessError } = await supabase!
          .from('business')
          .insert({
            linkeduser: data.user.id, // Foreign key to auth.users.id
            name: userData.businessName,
            created_at: new Date().toISOString()
          });

        if (businessError) {
          console.error('Error creating business profile:', businessError);
        }

        // After successful signup, refresh the auth context
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          // This will trigger the AuthContext to fetch the new user profile
          window.location.reload(); // Simple but effective
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
      setUser(null);
      setIsAuthenticated(false);
      return;
    }

    try {
      await supabase!.auth.signOut();
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const updateProfile = async (data: Partial<User>) => {
    if (!user) return { error: new Error('No user logged in') };
    if (!isSupabaseConfigured()) {
      return { error: new Error('Supabase not configured. Please set up your environment variables.') };
    }

    try {
      // Update users table
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

      if (userError) {
        return { error: userError };
      }

      // Update contractor profile if applicable
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

        if (contractorError) {
          console.error('Error updating contractor profile:', contractorError);
        }
      }

      // Update business profile if applicable
      if (user.role === 'business' && data.businessProfile) {
        const { error: businessError } = await supabase!
          .from('business')
          .update({
            name: data.businessProfile.name,
          })
          .eq('linkeduser', user.id);

        if (businessError) {
          console.error('Error updating business profile:', businessError);
        }
      }

      // Refresh user data
      const { data: { user: supabaseUser } } = await supabase!.auth.getUser();
      if (supabaseUser) {
        const updatedProfile = await fetchUserProfile(supabaseUser);
        setUser(updatedProfile);
      }

      return { error: null };
    } catch (error) {
      console.error('Update profile error:', error);
      return { error };
    }
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