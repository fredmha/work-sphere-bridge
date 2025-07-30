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
  const isSupabaseConfigured = () => {
    return supabase !== null;
  };

  // Clear all auth-related data
  const clearAuthData = () => {
    setUser(null);
    setIsAuthenticated(false);
    
    // Clear all Supabase-related storage
    const supabaseKeys = [
      'supabase.auth.token',
      'supabase.auth.expires_at',
      'supabase.auth.refresh_token',
      'supabase.auth.expires_in',
      'supabase.auth.access_token',
      'supabase.auth.user',
      'supabase.auth.session',
      'sb-cwngvhypysvajbjtbdhx-auth-token', // Your specific project key
      'sb-cwngvhypysvajbjtbdhx-auth-refresh-token',
    ];
    
    // Clear specific Supabase keys
    supabaseKeys.forEach(key => {
      localStorage.removeItem(key);
      sessionStorage.removeItem(key);
    });
    
    // Clear any other auth-related storage
    Object.keys(localStorage).forEach(key => {
      if (key.includes('supabase') || key.includes('auth') || key.includes('sb-')) {
        localStorage.removeItem(key);
      }
    });
    Object.keys(sessionStorage).forEach(key => {
      if (key.includes('supabase') || key.includes('auth') || key.includes('sb-')) {
        sessionStorage.removeItem(key);
      }
    });
    
    // Clear cookies that might contain auth data
    document.cookie.split(";").forEach(function(c) { 
      document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); 
    });
    
    console.log('Auth data cleared');
  };

  // Fetch user profile data from database
  const fetchUserProfile = async (supabaseUser: SupabaseUser): Promise<User | null> => {
    if (!supabase) return null;
    
    try {
      // Get user data from users table
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', supabaseUser.id)
        .single();

      if (userError) {
        console.error('Error fetching user data:', userError);
        return null;
      }

      if (!userData) {
        console.error('No user data found');
        return null;
      }

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
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
  };

  // Initialize auth state
  useEffect(() => {
    console.log('AuthContext: Initializing...');
    console.log('AuthContext: Supabase configured:', isSupabaseConfigured());
    
    // Clear any cached auth data on app startup
    clearAuthData();
    
    // Always set loading to false after a short delay
    const timer = setTimeout(() => {
      console.log('AuthContext: Setting loading to false');
      setIsLoading(false);
    }, 100);

    // If Supabase is configured, try to get session
    if (isSupabaseConfigured()) {
      const initializeAuth = async () => {
        try {
          const { data: { session }, error } = await supabase!.auth.getSession();
          
          if (error) {
            console.error('Session error:', error);
            clearAuthData();
            return;
          }
          
          if (session?.user) {
            const userProfile = await fetchUserProfile(session.user);
            if (userProfile) {
              setUser(userProfile);
              setIsAuthenticated(true);
            } else {
              // If we can't fetch user profile, clear auth data
              clearAuthData();
            }
          } else {
            clearAuthData();
          }
        } catch (error) {
          console.error('Error getting Supabase session:', error);
          clearAuthData();
        }
      };

      initializeAuth();

      // Set up auth listener
      const { data: { subscription } } = supabase!.auth.onAuthStateChange(
        async (event, session) => {
          console.log('Auth state changed:', event, session?.user?.id);
          
          if (session?.user) {
            const userProfile = await fetchUserProfile(session.user);
            if (userProfile) {
              setUser(userProfile);
              setIsAuthenticated(true);
            } else {
              clearAuthData();
            }
          } else {
            clearAuthData();
          }
        }
      );

      return () => {
        clearTimeout(timer);
        subscription.unsubscribe();
      };
    }

    return () => clearTimeout(timer);
  }, []);

  const login = async (email: string, password: string) => {
    if (!isSupabaseConfigured()) {
      return { error: new Error('Supabase not configured. Please set up your environment variables.') };
    }
  
    try {
      clearAuthData();
      await new Promise(resolve => setTimeout(resolve, 100));
  
      const { data, error } = await supabase!.auth.signInWithPassword({
        email,
        password,
      });
  
      if (error) {
        console.error('Login error:', error);
        clearAuthData();
        return { error };
      }
  
      const loggedInUser = data.user;
  
      if (!loggedInUser) {
        console.error('No user returned from Supabase');
        clearAuthData();
        return { error: new Error('No user returned') };
      }
  
      // ✅ Fetch full user profile
      const userProfile = await fetchUserProfile(loggedInUser);
  
      if (!userProfile) {
        console.error('Failed to fetch user profile');
        clearAuthData();
        return { error: new Error('User profile fetch failed') };
      }
  
      setUser(userProfile);
      setIsAuthenticated(true);
  
      // ✅ Redirect logic
      if (userProfile.role === 'contractor') {
        if (!userProfile.completedSignUp) {
          window.location.href = '/contractor-onboarding';
        } else {
          window.location.href = '/contractor-dashboard';
        }
      } else if (userProfile.role === 'business') {
        window.location.href = '/dashboard'; // or another route for business users
      } else {
        window.location.href = '/'; // fallback
      }
  
      return { error: null };
    } catch (error) {
      console.error('Login error:', error);
      clearAuthData();
      return { error };
    }
  };

  const signup = async (email: string, password: string, userData: Partial<User>) => {
    if (!isSupabaseConfigured()) {
      return { error: new Error('Supabase not configured. Please set up your environment variables.') };
    }

    try {
      // Clear any existing auth data before attempting signup
      clearAuthData();
      
      const { data, error } = await supabase!.auth.signUp({
        email,
        password,
      });

      if (error) {
        console.error('Signup error:', error);
        clearAuthData();
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
      clearAuthData();
      return;
    }

    try {
      await supabase!.auth.signOut();
      clearAuthData();
      
      // Navigate to home page instead of reloading
      window.location.href = '/';
    } catch (error) {
      console.error('Logout error:', error);
      // Even if signOut fails, clear local data
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

  const forceClearCache = () => {
    clearAuthData();
    // Force reload the page to clear any remaining cache
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