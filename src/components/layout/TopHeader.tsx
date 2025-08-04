import { SidebarTrigger } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { 
  Bell, 
  Search, 
  Plus,
  MessageSquare
} from 'lucide-react';
import { Input } from '@/components/ui/input';

export function TopHeader() {
  return (
    <header className="h-16 border-b border-border/50 bg-background/80 backdrop-blur-xl flex items-center justify-between px-6 sticky top-0 z-50">
      {/* Left Section */}
      <div className="flex items-center gap-4">
        <SidebarTrigger className="p-2 hover:bg-accent/50 rounded-lg transition-colors" />
        
        {/* Search */}
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search projects, contractors..." 
            className="pl-10 w-80 bg-background/50 border-border/50 focus:border-primary/50"
          />
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-3">
        {/* Quick Action Button */}
        <Button size="sm" className="gap-2 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70">
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">New Project</span>
        </Button>

        {/* Notifications */}
        <Button variant="ghost" size="sm" className="relative">
          <Bell className="h-4 w-4" />
          <Badge className="absolute -top-1 -right-1 h-5 w-5 text-xs flex items-center justify-center p-0 bg-destructive">
            3
          </Badge>
        </Button>

        {/* Messages */}
        <Button variant="ghost" size="sm" className="relative">
          <MessageSquare className="h-4 w-4" />
          <Badge className="absolute -top-1 -right-1 h-5 w-5 text-xs flex items-center justify-center p-0 bg-primary">
            2
          </Badge>
        </Button>

        {/* User Avatar */}
        <div className="flex items-center gap-3 pl-3 border-l border-border/50">
          <div className="hidden sm:block text-right">
            <p className="text-sm font-medium">Admin User</p>
            <p className="text-xs text-muted-foreground">admin@contractorflow.com</p>
          </div>
          <Avatar className="h-8 w-8">
            <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400" />
            <AvatarFallback>AU</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
}