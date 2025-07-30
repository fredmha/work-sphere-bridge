import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { AuthModal } from "@/components/auth/AuthModal";
import { useState } from "react";
import { LogOut, User, Building2, Briefcase, Loader2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Header = () => {
  console.log("🔝 Header component: Starting render...");
  
  const [authError, setAuthError] = useState<string | null>(null);
  
  // Try to get auth context with error handling
  let authContext = null;
  try {
    authContext = useAuth();
    console.log("🔝 Header component: Auth context obtained successfully");
  } catch (error) {
    console.error("🔝 Header component: Error getting auth context:", error);
    setAuthError(error instanceof Error ? error.message : "Unknown auth error");
  }

  const { user, isAuthenticated, isLoading, logout } = authContext || { 
    user: null, 
    isAuthenticated: false, 
    isLoading: false, 
    logout: async () => {} 
  };

  console.log("🔝 Header component: Auth state:", { 
    user: !!user, 
    isAuthenticated, 
    isLoading,
    authError 
  });

  const [authModal, setAuthModal] = useState<{ isOpen: boolean; defaultTab: 'login' | 'signup' } | null>(null);

  const openAuthModal = (defaultTab: 'login' | 'signup') => {
    setAuthModal({ isOpen: true, defaultTab });
  };

  const closeAuthModal = () => {
    setAuthModal(null);
  };

  const handleLogout = async () => {
    await logout();
  };

  // Show loading spinner while auth is initializing
  if (isLoading) {
    console.log("🔝 Header component: Rendering loading state");
    return (
      <header className="bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold">
            B🔗rn
          </Link>
          <div className="flex items-center space-x-3">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="text-sm">Loading...</span>
          </div>
        </div>
      </header>
    );
  }

  // Show error state if auth failed
  if (authError) {
    console.log("🔝 Header component: Rendering error state");
    return (
      <header className="bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold">
            B🔗rn
          </Link>
          <div className="flex items-center space-x-3">
            <span className="text-sm text-yellow-200">Auth Error</span>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-primary-foreground hover:bg-primary-foreground/10"
              onClick={() => window.location.reload()}
            >
              Retry
            </Button>
          </div>
        </div>
      </header>
    );
  }

  console.log("🔝 Header component: Rendering main header");

  return (
    <>
      <header className="bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold">
            B🔗rn
          </Link>
          
          <nav className="hidden md:flex items-center space-x-6">
            {/* Always show Find Projects */}
            <Link to="/find-projects" className="hover:text-accent transition-colors">
              Find Projects
            </Link>
            
            {/* Show different navigation based on user type */}
            {isAuthenticated && user && (
              <>
                {user.role === 'business' ? (
                  // Business user navigation
                  <>
                    <Link to="/talent" className="hover:text-accent transition-colors">
                      Find Talent
                    </Link>
                    <Link to="/applicationmanagement">
                      <Button variant="ghost" size="sm" className="text-primary-foreground hover:bg-primary-foreground/10">
                        <Building2 className="h-4 w-4 mr-2" />
                        Application Management
                      </Button>
                    </Link>
                    <Link to="/dashboard" className="hover:text-accent transition-colors">
                      Dashboard
                    </Link>
                  </>
                ) : user.role === 'contractor' ? (
                  // Contractor user navigation
                  <>
                    <Link to="/applications">
                      <Button variant="ghost" size="sm" className="text-primary-foreground hover:bg-primary-foreground/10">
                        <Briefcase className="h-4 w-4 mr-2" />
                        My Applications
                      </Button>
                    </Link>
                    <Link to="/contractor-dashboard" className="hover:text-accent transition-colors">
                      Dashboard
                    </Link>
                  </>
                ) : null}
              </>
            )}
          </nav>
          
          <div className="flex items-center space-x-3">
            {isAuthenticated && user ? (
              // Authenticated user dropdown
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="text-primary-foreground hover:bg-primary-foreground/10">
                    <Avatar className="h-6 w-6 mr-2">
                      <AvatarImage src={user.logo || undefined} alt={user.fullName || 'User'} />
                      <AvatarFallback className="text-xs">
                        {user.fullName ? user.fullName.charAt(0).toUpperCase() : 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <span className="hidden sm:inline">
                      {user.fullName || user.email || 'User'}
                    </span>
                    {user.role === 'business' && (
                      <Building2 className="h-4 w-4 ml-1" />
                    )}
                    {user.role === 'contractor' && (
                      <Briefcase className="h-4 w-4 ml-1" />
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-2 py-1.5">
                    <p className="text-sm font-medium">{user.fullName || 'User'}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                    <p className="text-xs text-muted-foreground capitalize">
                      {user.role === 'business' ? 'Business Account' : 'Contractor Account'}
                    </p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="w-full cursor-pointer">
                      <User className="h-4 w-4 mr-2" />
                      Profile & Settings
                    </Link>
                  </DropdownMenuItem>
                  {user.role === 'business' && (
                    <DropdownMenuItem asChild>
                      <Link to="/dashboard" className="w-full cursor-pointer">
                        <Building2 className="h-4 w-4 mr-2" />
                        Business Dashboard
                      </Link>
                    </DropdownMenuItem>
                  )}
                  {user.role === 'contractor' && (
                    <DropdownMenuItem asChild>
                      <Link to="/contractor-dashboard" className="w-full cursor-pointer">
                        <Briefcase className="h-4 w-4 mr-2" />
                        Contractor Dashboard
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={handleLogout} 
                    className="text-destructive cursor-pointer"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              // Unauthenticated user buttons
              <>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-primary-foreground hover:bg-primary-foreground/10"
                  onClick={() => openAuthModal('login')}
                >
                  Login
                </Button>
                <Button 
                  variant="secondary" 
                  size="sm"
                  onClick={() => openAuthModal('signup')}
                >
                  Sign Up
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      {authModal && (
        <AuthModal
          isOpen={authModal.isOpen}
          onClose={closeAuthModal}
          defaultTab={authModal.defaultTab}
        />
      )}
    </>
  );
};

export default Header;