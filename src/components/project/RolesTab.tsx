import { Project, ContractorRole } from '@/types/entities';
import { useApp } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { 
  User, 
  DollarSign, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  MessageSquare,
  FileText,
  Plus
} from 'lucide-react';

interface RolesTabProps {
  project: Project;
  onOpenCompliance: (contractorId: string, roleId: string) => void;
}

export function RolesTab({ project, onOpenCompliance }: RolesTabProps) {
  const { state } = useApp();

  const getContractorById = (id: string) => {
    return state.contractors.find(c => c.id === id);
  };

  const getComplianceStatus = (contractorId: string, roleId: string) => {
    const checklist = state.complianceChecklists.find(
      c => c.contractorId === contractorId && c.roleId === roleId
    );
    
    if (!checklist) return { completed: 0, total: 6, percentage: 0 };

    const items = [
      checklist.abnTfnStatus,
      checklist.bankDetailsStatus,
      checklist.superDetailsStatus,
      checklist.workRightsStatus,
      checklist.contractStatus,
      checklist.fairWorkStatus
    ];

    const completed = items.filter(status => status === 'Complete').length;
    const total = items.length;
    const percentage = Math.round((completed / total) * 100);

    return { completed, total, percentage };
  };

  const getComplianceVariant = (percentage: number) => {
    if (percentage === 100) return 'default';
    if (percentage >= 50) return 'secondary';
    return 'destructive';
  };

  const renderRoleCard = (role: ContractorRole) => {
    const contractor = role.assignedContractor ? getContractorById(role.assignedContractor) : null;
    const compliance = contractor ? getComplianceStatus(contractor.id, role.id) : null;
    const applications = state.applications.filter(app => app.roleId === role.id);

    return (
      <Card key={role.id} className="glass-card border-border/50 hover:border-border transition-colors">
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <CardTitle className="text-lg font-semibold">{role.name}</CardTitle>
            <div className="flex items-center gap-2">
                <Badge variant="outline">
                  {role.type}
                </Badge>
                <Badge variant={role.status === 'open' ? 'secondary' : 'default'}>
                  {role.status}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  {role.type === 'Milestone' ? `$${role.payRate}/milestone` : `$${role.payRate}/hour`}
                </span>
              </div>
            </div>
            {contractor && (
              <div className="flex items-center gap-2">
                <Avatar className="w-8 h-8">
                  <AvatarImage src={contractor.profilePicture} />
                  <AvatarFallback className="text-xs">
                    {contractor.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
              </div>
            )}
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground line-clamp-2">
            {role.description}
          </p>

          {role.status === 'assigned' && contractor ? (
            <div className="space-y-4">
              {/* Assigned Contractor */}
              <div className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={contractor.profilePicture} />
                    <AvatarFallback>
                      {contractor.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-sm">{contractor.name}</p>
                    <p className="text-xs text-muted-foreground">{contractor.email}</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  <MessageSquare className="w-4 h-4" />
                </Button>
              </div>

              {/* Compliance Status */}
              {compliance && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Compliance Status</span>
                    <Badge variant={getComplianceVariant(compliance.percentage)}>
                      {compliance.completed}/{compliance.total} Complete
                    </Badge>
                  </div>
                  
                  <Progress value={compliance.percentage} className="h-2" />
                  
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full"
                    onClick={() => onOpenCompliance(contractor.id, role.id)}
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    View Compliance Checklist
                  </Button>
                </div>
              )}

              {/* Role Stats */}
              <div className="grid grid-cols-2 gap-3">
                {role.type === 'Milestone' && role.tasks && (
                  <>
                    <div className="text-center p-2 bg-background/30 rounded">
                      <div className="text-lg font-bold text-primary">
                        {role.tasks.filter(t => t.status === 'Completed').length}
                      </div>
                      <div className="text-xs text-muted-foreground">Completed</div>
                    </div>
                    <div className="text-center p-2 bg-background/30 rounded">
                      <div className="text-lg font-bold text-warning">
                        {role.tasks.filter(t => t.status === 'Pending').length}
                      </div>
                      <div className="text-xs text-muted-foreground">Pending</div>
                    </div>
                  </>
                )}
                {role.type === 'Timesheet' && (
                  <>
                    <div className="text-center p-2 bg-background/30 rounded">
                      <div className="text-lg font-bold text-success">40</div>
                      <div className="text-xs text-muted-foreground">Hours This Week</div>
                    </div>
                    <div className="text-center p-2 bg-background/30 rounded">
                      <div className="text-lg font-bold text-primary">$2,400</div>
                      <div className="text-xs text-muted-foreground">Pending Pay</div>
                    </div>
                  </>
                )}
              </div>
            </div>
          ) : role.status === 'open' ? (
            <div className="text-center py-6 space-y-3">
              <User className="w-12 h-12 mx-auto text-muted-foreground/50" />
              <div>
                <p className="font-medium text-sm">Accepting Applications</p>
                <p className="text-xs text-muted-foreground">
                  This role is open for contractor applications
                </p>
              </div>
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <User className="w-4 h-4" />
                Applications
                {applications.length > 0 && (
                  <Badge variant="secondary" className="ml-1">
                    {applications.length}
                  </Badge>
                )}
              </Button>
            </div>
          ) : (
            <div className="text-center py-6 space-y-3">
              <User className="w-12 h-12 mx-auto text-muted-foreground/50" />
              <div>
                <p className="font-medium text-sm">No Contractor Assigned</p>
                <p className="text-xs text-muted-foreground">
                  {project.state === 'Published' ? 'Accepting applications' : 'Awaiting publication'}
                </p>
              </div>
              {project.state === 'Published' && (
                <Button variant="outline" size="sm">
                  View Applications
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      {/* Add Role Button */}
      {project.state === 'Draft' && (
        <div className="flex justify-end">
          <Button className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add Role
          </Button>
        </div>
      )}

      {/* Roles Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {project.roles.map(renderRoleCard)}
      </div>

      {project.roles.length === 0 && (
        <div className="text-center py-12">
          <User className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Roles Defined</h3>
          <p className="text-muted-foreground mb-4">
            Add roles to define the work structure for this project.
          </p>
          {project.state === 'Draft' && (
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add First Role
            </Button>
          )}
        </div>
      )}
    </div>
  );
}