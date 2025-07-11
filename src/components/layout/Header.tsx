import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Header = () => {
  return (
    <header className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold">
          B🔗rn
        </Link>
        
        <nav className="hidden md:flex items-center space-x-6">
          <Link to="/find-projects" className="hover:text-accent transition-colors">
            Find Projects
          </Link>
          <Link to="/talent" className="hover:text-accent transition-colors">
            Find Talent
          </Link>
          <Link to="/dashboard" className="hover:text-accent transition-colors">
            Dashboard
          </Link>
        </nav>
        
        <div className="flex items-center space-x-3">
          <Button variant="ghost" size="sm" className="text-primary-foreground hover:bg-primary-foreground/10">
            Login
          </Button>
          <Button variant="secondary" size="sm">
            Sign Up
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;