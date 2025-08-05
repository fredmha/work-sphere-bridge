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

interface RolesTabProps {
  project: Project;
  onOpenCompliance: (contractorId: string, roleId: string) => void;
}

export function RolesTab({ project, onOpenCompliance }: RolesTabProps) {
  const getStatusVariant = (hasContractor: boolean) => {
    return hasContractor ? 'default' : 'secondary';
  };

  const getTypeVariant = (type: string | null) => {
    switch (type) {
      case 'Milestone': return 'default';
      case 'Timesheet': return 'secondary';
      default: return 'outline';
    }
  };

  const renderRoleCard = (role: ContractorRoleRow) => {
    // A role is truly assigned only if it has a contractor_id
    const isAssigned = !!role.contractor_id;
    const applications = 0; // TODO: Implement applications table

    return (
      <Card key={role.id} className="glass-card border-border/50 hover:border-border transition-colors">
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <CardTitle className="text-lg font-semibold">{role.role}</CardTitle>
              <div className="flex items-center gap-2">
                <Badge variant="outline">
                  {role.type || 'General'}
                </Badge>
                <Badge variant={getStatusVariant(isAssigned)}>
                  {isAssigned ? 'Assigned' : 'Unassigned'}
                </Badge>
                {role.pay && (
                  <span className="text-sm text-muted-foreground">
                    ${role.pay}/hour
                  </span>
                )}
              </div>
            </div>
            {isAssigned && (
              <div className="flex items-center gap-2">
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="text-xs">
                    {role.contractor_id?.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </div>
            )}
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground line-clamp-2">
            {role.description || 'No description available'}
          </p>

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <User className="w-4 h-4 text-muted-foreground" />
                <span>{isAssigned ? 'Assigned' : 'Unassigned'}</span>
              </div>
              {applications > 0 && (
                <div className="flex items-center gap-1">
                  <FileText className="w-4 h-4 text-muted-foreground" />
                  <span>{applications} application{applications !== 1 ? 's' : ''}</span>
                </div>
              )}
            </div>
            
            <div className="flex items-center gap-2">
              {isAssigned && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onOpenCompliance(role.contractor_id!, role.id.toString())}
                  >
                    <CheckCircle className="w-4 h-4 mr-1" />
                    Compliance
                  </Button>
                  <Button variant="outline" size="sm">
                    <MessageSquare className="w-4 h-4 mr-1" />
                    Message
                  </Button>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Project Roles</h2>
          <p className="text-muted-foreground">
            Manage contractor roles and assignments for this project
          </p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Add Role
        </Button>
      </div>

      {project.roles.length === 0 ? (
        <Card className="glass-card">
          <CardContent className="p-8 text-center">
            <User className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Roles Created</h3>
            <p className="text-muted-foreground mb-4">
              Create contractor roles to start building your project team.
            </p>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Create First Role
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {project.roles.map(renderRoleCard)}
        </div>
      )}
    </div>
  );
}