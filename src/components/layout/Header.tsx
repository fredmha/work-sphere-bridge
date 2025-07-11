import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { AuthModal } from "@/components/auth/AuthModal";
import { useState } from "react";
import { LogOut, User } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Header = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [authModal, setAuthModal] = useState<{ isOpen: boolean; defaultTab: 'login' | 'signup' } | null>(null);

  const openAuthModal = (defaultTab: 'login' | 'signup') => {
    setAuthModal({ isOpen: true, defaultTab });
  };

  const closeAuthModal = () => {
    setAuthModal(null);
  };

  return (
    <>
      <header className="bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold">
            B🔗rn
          </Link>
          
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/find-projects" className="hover:text-accent transition-colors">
              Find Projects
            </Link>
            {user?.userType === 'business' && (
              <Link to="/talent" className="hover:text-accent transition-colors">
                Find Talent
              </Link>
            )}
            {isAuthenticated && (
              <>
                {user?.userType === 'business' ? (
                  <Link to="/dashboard" className="hover:text-accent transition-colors">
                    Dashboard
                  </Link>
                ) : (
                  <>
                    <Link to="/applications" className="hover:text-accent transition-colors">
                      Application Management
                    </Link>
                    <Link to="/contractor-dashboard" className="hover:text-accent transition-colors">
                      Dashboard
                    </Link>
                  </>
                )}
              </>
            )}
          </nav>
          
          <div className="flex items-center space-x-3">
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="text-primary-foreground hover:bg-primary-foreground/10">
                    <User className="h-4 w-4 mr-2" />
                    {user?.name}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-card">
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="w-full">
                      Profile & Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={logout} className="text-destructive">
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
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