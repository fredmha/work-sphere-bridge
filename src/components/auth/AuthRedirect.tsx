import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

export const AuthRedirect: React.FC = () => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Only run redirect logic when auth is not loading and user is authenticated
    if (!isLoading && isAuthenticated && user) {
      // Handle contractor routing based on completedSignUp flag
      if (user.role === 'contractor') {
        if (!user.completedSignUp) {
          // Redirect to onboarding if signup is not completed
          navigate('/contractor-onboarding');
        } else {
          // Redirect to dashboard if signup is completed
          navigate('/contractor-dashboard');
        }
      } else if (user.role === 'business') {
        // Handle business user routing
        navigate('/dashboard');
      }
    }
  }, [user, isAuthenticated, isLoading, navigate]);

  return null; // This component doesn't render anything
}; 