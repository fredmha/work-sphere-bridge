import { 
  Home, 
  FolderOpen, 
  Users, 
  CheckSquare, 
  DollarSign, 
  Settings,
  Bell,
  Calendar,
  FileText,
  UserCheck
} from 'lucide-react';
import { NavLink, useLocation } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import { Badge } from '@/components/ui/badge';

const mainNavItems = [
  { title: 'Dashboard', url: '/', icon: Home },
  { title: 'Projects', url: '/projects', icon: FolderOpen },
  { title: 'Contractors', url: '/contractors', icon: Users },
  { title: 'Application Management', url: '/application-management', icon: UserCheck },
  { title: 'Compliance', url: '/compliance', icon: CheckSquare },
  { title: 'Payments', url: '/payments', icon: DollarSign },
];

const toolsNavItems = [
  { title: 'Calendar', url: '/calendar', icon: Calendar },
  { title: 'Reports', url: '/reports', icon: FileText },
  { title: 'Notifications', url: '/notifications', icon: Bell },
  { title: 'Settings', url: '/settings', icon: Settings },
];

export function AppSidebar() {
  const { state: sidebarState } = useSidebar();
  const location = useLocation();
  const { state } = useApp();
  
  const currentPath = location.pathname;
  const isActive = (path: string) => {
    if (path === '/') return currentPath === '/';
    return currentPath.startsWith(path);
  };

  const getNavClasses = (path: string) => {
    const baseClasses = "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-accent/50";
    if (isActive(path)) {
      return `${baseClasses} bg-primary/10 text-primary border border-primary/20`;
    }
    return `${baseClasses} text-muted-foreground hover:text-foreground`;
  };

  // Calculate notification counts
  const pendingComplianceCount = state.complianceChecklists.filter(
    c => c.overallStatus === 'awaiting_review' || c.overallStatus === 'incomplete'
  ).length;

  const projectsByStatus = {
    Draft: state.projects.filter(p => p.state === 'Draft').length,
    Published: state.projects.filter(p => p.state === 'Published').length,
    Active: state.projects.filter(p => p.state === 'Active').length,
  };

  return (
    <Sidebar className={`${sidebarState === 'collapsed' ? 'w-16' : 'w-64'} transition-all duration-300`} collapsible="icon">
      <SidebarContent className="bg-gradient-to-b from-background to-background/80 backdrop-blur-xl border-r border-border/50">
        {/* Logo / Brand */}
        <div className="p-4 border-b border-border/50">
          {sidebarState !== 'collapsed' ? (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/60 rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">CF</span>
              </div>
              <span className="font-bold text-lg bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                ContractorFlow
              </span>
            </div>
          ) : (
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/60 rounded-lg flex items-center justify-center mx-auto">
              <span className="text-primary-foreground font-bold text-sm">CF</span>
            </div>
          )}
        </div>

        {/* Main Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel className={sidebarState === 'collapsed' ? 'hidden' : 'block'}>
            Main Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNavItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} end={item.url === '/'} className={getNavClasses(item.url)}>
                      <item.icon className="h-4 w-4 flex-shrink-0" />
                      {sidebarState !== 'collapsed' && (
                        <div className="flex items-center justify-between w-full">
                          <span>{item.title}</span>
                          {/* Show notification badges */}
                          {item.title === 'Compliance' && pendingComplianceCount > 0 && (
                            <Badge variant="destructive" className="text-xs px-1.5 py-0">
                              {pendingComplianceCount}
                            </Badge>
                          )}
                          {item.title === 'Projects' && projectsByStatus.Draft > 0 && (
                            <Badge variant="secondary" className="text-xs px-1.5 py-0">
                              {projectsByStatus.Draft}
                            </Badge>
                          )}
                        </div>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Tools & Settings */}
        <SidebarGroup>
          <SidebarGroupLabel className={sidebarState === 'collapsed' ? 'hidden' : 'block'}>
            Tools & Settings
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {toolsNavItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} className={getNavClasses(item.url)}>
                      <item.icon className="h-4 w-4 flex-shrink-0" />
                      {sidebarState !== 'collapsed' && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Status Overview (when expanded) */}
        {sidebarState !== 'collapsed' && (
          <div className="mt-auto p-4 border-t border-border/50">
            <div className="space-y-2">
              <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Quick Stats
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Active:</span>
                  <span className="font-medium text-primary">{projectsByStatus.Active}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Draft:</span>
                  <span className="font-medium">{projectsByStatus.Draft}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Published:</span>
                  <span className="font-medium text-warning">{projectsByStatus.Published}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Compliance:</span>
                  <span className={`font-medium ${pendingComplianceCount > 0 ? 'text-destructive' : 'text-success'}`}>
                    {pendingComplianceCount > 0 ? `${pendingComplianceCount} pending` : 'All clear'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </SidebarContent>
    </Sidebar>
  );
}