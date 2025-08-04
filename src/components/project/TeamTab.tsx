import { Project } from '@/types/entities';
import { useApp } from '@/contexts/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { 
  MessageSquare,
  Mail,
  Phone,
  FileText,
  Calendar,
  ExternalLink,
  User,
  Users
} from 'lucide-react';

interface TeamTabProps {
  project: Project;
  onOpenCompliance: (contractorId: string, roleId: string) => void;
}

export function TeamTab({ project, onOpenCompliance }: TeamTabProps) {
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

  const assignedRoles = project.roles.filter(role => role.assignedContractor);

  if (assignedRoles.length === 0) {
    return (
      <div className="text-center py-12">
        <Users className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
        <h3 className="text-lg font-semibold mb-2">No Team Members</h3>
        <p className="text-muted-foreground">
          Once contractors are assigned to roles, they will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {assignedRoles.map(role => {
          const contractor = getContractorById(role.assignedContractor!);
          if (!contractor) return null;

          const compliance = getComplianceStatus(contractor.id, role.id);

          return (
            <Card key={role.id} className="glass-card border-border/50 hover:border-border transition-colors">
              <CardHeader className="pb-4">
                <div className="flex items-start gap-4">
                  <Avatar className="w-16 h-16">
                    <AvatarImage src={contractor.profilePicture} />
                    <AvatarFallback className="text-lg">
                      {contractor.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 space-y-2">
                    <div>
                      <CardTitle className="text-lg">{contractor.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">{role.name}</p>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {role.type}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {role.type === 'Milestone' ? `$${role.payRate}/milestone` : `$${role.payRate}/hour`}
                      </span>
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Contact Information */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <span>{contractor.email}</span>
                  </div>
                  {contractor.phone && (
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="w-4 h-4 text-muted-foreground" />
                      <span>{contractor.phone}</span>
                    </div>
                  )}
                  {contractor.location && (
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span>{contractor.location}</span>
                    </div>
                  )}
                </div>

                {/* Compliance Status */}
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
                    View Compliance Details
                  </Button>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 pt-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Message
                  </Button>
                  
                  {contractor.portfolioUrl && (
                    <Button variant="ghost" size="sm">
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  )}
                </div>

                {/* Performance Summary */}
                {role.type === 'Milestone' && role.tasks && (
                  <div className="pt-3 border-t border-border/50">
                    <div className="grid grid-cols-3 gap-3 text-center">
                      <div>
                        <div className="text-lg font-bold text-success">
                          {role.tasks.filter(t => t.status === 'Completed').length}
                        </div>
                        <div className="text-xs text-muted-foreground">Completed</div>
                      </div>
                      <div>
                        <div className="text-lg font-bold text-warning">
                          {role.tasks.filter(t => t.status === 'Submitted').length}
                        </div>
                        <div className="text-xs text-muted-foreground">Submitted</div>
                      </div>
                      <div>
                        <div className="text-lg font-bold text-muted-foreground">
                          {role.tasks.filter(t => t.status === 'Pending').length}
                        </div>
                        <div className="text-xs text-muted-foreground">Pending</div>
                      </div>
                    </div>
                  </div>
                )}

                {role.type === 'Timesheet' && (
                  <div className="pt-3 border-t border-border/50">
                    <div className="grid grid-cols-2 gap-3 text-center">
                      <div>
                        <div className="text-lg font-bold text-primary">40</div>
                        <div className="text-xs text-muted-foreground">Hours This Week</div>
                      </div>
                      <div>
                        <div className="text-lg font-bold text-success">$2,400</div>
                        <div className="text-xs text-muted-foreground">Total Earned</div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}