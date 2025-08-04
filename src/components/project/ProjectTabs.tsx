import { Project } from '@/types/entities';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Users, CheckSquare, Clock, CreditCard, UserCheck } from 'lucide-react';

interface ProjectTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  project: Project;
}

export function ProjectTabs({ activeTab, onTabChange, project }: ProjectTabsProps) {
  const milestoneRoles = project.roles.filter(role => role.type === 'Milestone');
  const timesheetRoles = project.roles.filter(role => role.type === 'Timesheet');
  const totalTasks = milestoneRoles.reduce((acc, role) => acc + (role.tasks?.length || 0), 0);
  const pendingTasks = milestoneRoles.reduce((acc, role) => 
    acc + (role.tasks?.filter(task => task.status === 'Pending').length || 0), 0
  );

  return (
    <div className="glass-card border border-border/50 rounded-lg overflow-hidden">
      <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
        <TabsList className="grid w-full grid-cols-5 h-auto p-1 bg-background/50">
          <TabsTrigger value="roles" className="flex items-center gap-2 py-3 data-[state=active]:bg-primary/10">
            <Users className="w-4 h-4" />
            <span className="hidden sm:inline">Roles</span>
            <Badge variant="secondary" className="ml-1">
              {project.roles.length}
            </Badge>
          </TabsTrigger>
          
          <TabsTrigger value="tasks" className="flex items-center gap-2 py-3 data-[state=active]:bg-primary/10" disabled={milestoneRoles.length === 0}>
            <CheckSquare className="w-4 h-4" />
            <span className="hidden sm:inline">Tasks</span>
            {totalTasks > 0 && (
              <Badge variant="secondary" className="ml-1">
                {pendingTasks}/{totalTasks}
              </Badge>
            )}
          </TabsTrigger>
          
          <TabsTrigger value="timesheets" className="flex items-center gap-2 py-3 data-[state=active]:bg-primary/10" disabled={timesheetRoles.length === 0}>
            <Clock className="w-4 h-4" />
            <span className="hidden sm:inline">Timesheets</span>
          </TabsTrigger>
          
          <TabsTrigger value="team" className="flex items-center gap-2 py-3 data-[state=active]:bg-primary/10">
            <UserCheck className="w-4 h-4" />
            <span className="hidden sm:inline">Team</span>
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