import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabaseClient';
import { ProjectHeader } from '@/components/project/ProjectHeader';
import { ProjectTabs } from '@/components/project/ProjectTabs';
import { RolesTab } from '@/components/project/RolesTab';
import { TasksTab } from '@/components/project/TasksTab';
import { TimesheetsTab } from '@/components/project/TimesheetsTab';
import { TeamTab } from '@/components/project/TeamTab';
import { PaymentsTab } from '@/components/project/PaymentsTab';
import { ComplianceModal } from '@/components/compliance/ComplianceModal';
import { Card, CardContent } from '@/components/ui/card';
import { AlertTriangle, Loader2 } from 'lucide-react';
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

export function ProjectDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('roles');
  const [complianceModalOpen, setComplianceModalOpen] = useState(false);
  const [selectedContractor, setSelectedContractor] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  
  // Project data state
  const [project, setProject] = useState<DatabaseProject | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const projectIdNum = id ? parseInt(id) : null;

  // Fetch project data
  const refreshProject = async () => {
    if (!projectIdNum || !user?.id || !supabase) return;

    // Fetch the specific project
    const { data: projectData } = await supabase
      .from('projects')
      .select('*')
      .eq('id', projectIdNum)
      .eq('owner_id', user.id)
      .single();

    // Fetch contractor roles for this project
    const { data: rolesData } = await supabase
      .from('ContractorRole')
      .select('*')
      .eq('project_id', projectIdNum);

    if (projectData) {
      const transformedProject: DatabaseProject = {
        ...projectData,
        title: projectData.project_name || 'Untitled Project',
        description: projectData.project_description || 'No description available',
        roles: rolesData || []
      };
      setProject(transformedProject);
    }
  };

  useEffect(() => {
    const fetchProject = async () => {
      if (!id || !user?.id || !supabase) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        await refreshProject();
      } catch (err) {
        console.error('Error fetching project:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch project');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProject();
  }, [id, user?.id]);

  const openComplianceModal = (contractorId: string, roleId: string) => {
    setSelectedContractor(contractorId);
    setSelectedRole(roleId);
    setComplianceModalOpen(true);
  };

  const handleRolesUpdate = (updatedRoles: ContractorRoleRow[]) => {
    if (project) {
      setProject({
        ...project,
        roles: updatedRoles
      });
    }
  };

  const handleUpdateProject = async (updates: { title?: string; description?: string }) => {
    if (!projectIdNum) return;
    const payload: any = {};
    if (updates.title !== undefined) payload.project_name = updates.title;
    if (updates.description !== undefined) payload.project_description = updates.description;
    const { error: updateError } = await supabase
      .from('projects')
      .update(payload)
      .eq('id', projectIdNum);
    if (updateError) throw updateError;
    await refreshProject();
  };

  const handlePublish = async () => {
    if (!projectIdNum) return;

    // Validation: For each milestone role, ensure at least 1 task exists
    const { data: milestoneRoles, error: rolesErr } = await supabase
      .from('ContractorRole')
      .select('id, type')
      .eq('project_id', projectIdNum)
      .in('type', ['milestone', 'Milestone']);

    if (rolesErr) {
      alert('Failed to validate roles before publish.');
      return;
    }

    if (!milestoneRoles || milestoneRoles.length === 0) {
      // No milestone roles, can still publish
    } else {
      const roleIds = milestoneRoles.map(r => r.id);
      const { data: tasksForProject, error: tasksErr } = await supabase
        .from('ContractorTask')
        .select('id, role')
        .eq('Project', projectIdNum)
        .in('role', roleIds);
      if (tasksErr) {
        alert('Failed to validate tasks before publish.');
        return;
      }
      const roleIdToHasTask: Record<number, boolean> = {};
      roleIds.forEach(id => { roleIdToHasTask[id] = false; });
      (tasksForProject || []).forEach(t => { if (t.role) roleIdToHasTask[t.role] = true; });
      const violating = roleIds.filter(id => !roleIdToHasTask[id]);
      if (violating.length > 0) {
        alert('Each milestone role must have at least 1 task before publishing.');
        return;
      }
    }

    const { error: publishErr } = await supabase
      .from('projects')
      .update({ status: 'Published' })
      .eq('id', projectIdNum);
    if (publishErr) {
      alert('Failed to publish project.');
      return;
    }
    await refreshProject();
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading project details...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <AlertTriangle className="w-12 h-12 text-destructive mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-foreground mb-2">Error Loading Project</h2>
          <p className="text-muted-foreground">{error}</p>
        </div>
      </div>
    );
  }

  // Project not found
  if (!project) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground mb-2">Project Not Found</h2>
          <p className="text-muted-foreground">The requested project could not be found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <ProjectHeader project={project} onPublish={handlePublish} onUpdateProject={handleUpdateProject} />
      
      <ProjectTabs 
        activeTab={activeTab} 
        onTabChange={setActiveTab}
        project={project}
      />

      <div className="min-h-[60vh]">
        {activeTab === 'roles' && (
          <RolesTab 
            project={project} 
            onOpenCompliance={openComplianceModal}
            onRolesUpdate={handleRolesUpdate}
          />
        )}
        {activeTab === 'tasks' && <TasksTab project={project} />}
        {activeTab === 'timesheets' && <TimesheetsTab project={project} />}
        {activeTab === 'team' && (
          <TeamTab 
            project={project} 
            onOpenCompliance={openComplianceModal}
          />
        )}
        {activeTab === 'payments' && <PaymentsTab project={project} />}
      </div>

      <ComplianceModal
        open={complianceModalOpen}
        onOpenChange={setComplianceModalOpen}
        contractorId={selectedContractor}
        roleId={selectedRole}
      />
    </div>
  );
}

export default ProjectDetailPage;