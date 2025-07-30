import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
  requireCompletedSignUp?: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  allowedRoles = [], 
  requireCompletedSignUp = false 
}) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Don't redirect while loading
    if (isLoading) return;

    // If not authenticated, redirect to home
    if (!isAuthenticated) {
      navigate('/');
      return;
    }

    // If user exists, check role-based routing
    if (user) {
      // Handle contractor-specific routing
      if (user.role === 'contractor') {
        if (!user.completedSignUp) {
          // If signup not completed, redirect to onboarding (unless already there)
          if (location.pathname !== '/contractor-onboarding') {
            navigate('/contractor-onboarding');
            return;
          }
        } else {
          // If signup completed, redirect to contractor dashboard (unless already there)
          if (location.pathname !== '/contractor-dashboard') {
            navigate('/contractor-dashboard');
            return;
          }
        }
      }

      // Handle business user routing
      if (user.role === 'business' && location.pathname === '/contractor-onboarding') {
        navigate('/dashboard');
        return;
      }

      // Check if user has required role
      if (allowedRoles.length > 0 && !allowedRoles.includes(user.role || '')) {
        navigate('/');
        return;
      }

      // Check if completed signup is required
      if (requireCompletedSignUp && !user.completedSignUp) {
        if (user.role === 'contractor') {
          navigate('/contractor-onboarding');
        } else {
          navigate('/');
        }
        return;
      }
    }
  }, [user, isAuthenticated, isLoading, navigate, location.pathname, allowedRoles, requireCompletedSignUp]);

  // Show loading state while auth is initializing
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render children if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}; 