import { Outlet } from 'react-router-dom';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from './AppSidebar';
import { TopHeader } from './TopHeader';

export function MainLayout() {
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-background via-background/98 to-primary/3">
        <AppSidebar />
        
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Global Header with Sidebar Toggle */}
          <TopHeader />
          
          {/* Main Content Area */}
          <main className="flex-1 overflow-y-auto bg-transparent">
            <div className="animate-fade-in">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}