import { useState } from 'react';
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
  Plus,
  Edit3
} from 'lucide-react';
import { RoleModal } from './RoleModal';
import { supabase } from '@/lib/supabaseClient';
import type { Database } from '@/types/supabase';

type Tables = Database['public']['Tables'];
type ProjectRow = Tables['projects']['Row'];
type ContractorRoleRow = Tables['ContractorRole']['Row'];

// Extended project type that includes computed fields
interface DatabaseProject extends ProjectRow {
  title: string;
  description: string;
  roles: ContractorRoleRow[];
}

interface RolesTabProps {
  project: DatabaseProject;
  onOpenCompliance: (contractorId: string, roleId: string) => void;
  onRolesUpdate?: (roles: ContractorRoleRow[]) => void;
}

export function RolesTab({ project, onOpenCompliance, onRolesUpdate }: RolesTabProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<ContractorRoleRow | null>(null);

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

  const handleAddRole = () => {
    setEditingRole(null);
    setIsModalOpen(true);
  };

  const handleEditRole = (role: ContractorRoleRow) => {
    setEditingRole(role);
    setIsModalOpen(true);
  };

  const handleSaveRole = async (roleData: Partial<ContractorRoleRow>) => {
    try {
      if (editingRole) {
        // Update existing role
        const { error } = await supabase
          .from('ContractorRole')
          .update(roleData)
          .eq('id', editingRole.id);

        if (error) throw error;
      } else {
        // Create new role
        const { error } = await supabase
          .from('ContractorRole')
          .insert(roleData);

        if (error) throw error;
      }

      // Refresh roles by calling the update callback
      if (onRolesUpdate) {
        const { data: updatedRoles } = await supabase
          .from('ContractorRole')
          .select('*')
          .eq('project_id', project.id);
        
        onRolesUpdate(updatedRoles || []);
      }

      setIsModalOpen(false);
      setEditingRole(null);
    } catch (error) {
      console.error('Error saving role:', error);
      alert('Failed to save role. Please try again.');
    }
  };

  const renderRoleCard = (role: ContractorRoleRow) => {
    // A role is truly assigned only if it has a contractor_id
    const isAssigned = !!role.contractor_id;
    const applications = 0; // TODO: Implement applications table

    return (
      <Card key={role.id} className="glass-card border-border/50 hover:border-border transition-colors relative">
        {/* Edit button in top right corner */}
        <div className="absolute top-3 right-3 z-10">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleEditRole(role)}
            className="h-8 w-8 p-0 hover:bg-background/80"
          >
            <Edit3 className="w-4 h-4" />
          </Button>
        </div>

        <CardHeader className="pb-4">
          <div className="flex items-start justify-between">
            <div className="space-y-2 pr-12">
              <CardTitle className="text-lg font-semibold">{role.role}</CardTitle>
              <div className="flex items-center gap-2">
                <Badge variant="outline">
                  {role.type || 'General'}
                </Badge>
                {role.pay && (
                  <Badge variant={getStatusVariant(isAssigned)}>
                    <span className="text-lm">
                      ${role.pay}/hour
                    </span>
                  </Badge>
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
        <Button onClick={handleAddRole}>
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
            <Button onClick={handleAddRole}>
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

      <RoleModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingRole(null);
        }}
        onSave={handleSaveRole}
        role={editingRole}
        projectId={project.id}
      />
    </div>
  );
}