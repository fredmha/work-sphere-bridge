import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Users, CheckSquare, Clock, CreditCard, UserCheck } from 'lucide-react';
import type { Database } from '@/types/supabase';

type Tables = Database['public']['Tables'];
type ProjectRow = Tables['projects']['Row'];
type ContractorRoleRow = Tables['ContractorRole']['Row'];

// Extended project type that includes computed fields
interface Project extends ProjectRow {
  title: string;
  description: string;
  roles: ContractorRoleRow[];
}

interface ProjectTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  project: Project;
}

export function ProjectTabs({ activeTab, onTabChange, project }: ProjectTabsProps) {
  // For now, we'll use simple role counting since the database schema doesn't have tasks yet
  const totalRoles = project.roles.length;
  const assignedRoles = project.roles.filter(role => role.contractor_id).length;

  return (
    <div className="glass-card border border-border/50 rounded-lg overflow-hidden">
      <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
        <TabsList className="grid w-full grid-cols-5 h-auto p-1 bg-background/50">
          <TabsTrigger value="roles" className="flex items-center gap-2 py-3 data-[state=active]:bg-primary/10">
            <Users className="w-4 h-4" />
            <span className="hidden sm:inline">Roles</span>
            <Badge variant="secondary" className="ml-1">
              {totalRoles}
            </Badge>
          </TabsTrigger>
          
          <TabsTrigger value="tasks" className="flex items-center gap-2 py-3 data-[state=active]:bg-primary/10">
            <CheckSquare className="w-4 h-4" />
            <span className="hidden sm:inline">Tasks</span>
            <Badge variant="secondary" className="ml-1">
              0
            </Badge>
          </TabsTrigger>
          
          <TabsTrigger value="timesheets" className="flex items-center gap-2 py-3 data-[state=active]:bg-primary/10">
            <Clock className="w-4 h-4" />
            <span className="hidden sm:inline">Timesheets</span>
          </TabsTrigger>
          
          <TabsTrigger value="team" className="flex items-center gap-2 py-3 data-[state=active]:bg-primary/10">
            <UserCheck className="w-4 h-4" />
            <span className="hidden sm:inline">Team</span>
            <Badge variant="secondary" className="ml-1">
              {assignedRoles}
            </Badge>
          </TabsTrigger>
          
          <TabsTrigger value="payments" className="flex items-center gap-2 py-3 data-[state=active]:bg-primary/10">
            <CreditCard className="w-4 h-4" />
            <span className="hidden sm:inline">Payments</span>
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
}