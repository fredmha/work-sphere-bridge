import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthProvider';
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
interface Project extends ProjectRow {
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
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch project data
  useEffect(() => {
    const fetchProject = async () => {
      if (!id || !user?.id || !supabase) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        // Fetch the specific project
        const { data: projectData, error: projectError } = await supabase
          .from('projects')
          .select('*')
          .eq('id', parseInt(id))
          .eq('owner_id', user.id)
          .single();

        if (projectError) {
          if (projectError.code === 'PGRST116') {
            throw new Error('Project not found');
          }
          throw projectError;
        }

        // Fetch contractor roles for this project
        const { data: rolesData, error: rolesError } = await supabase
          .from('ContractorRole')
          .select('*')
          .eq('project_id', parseInt(id));

        if (rolesError) throw rolesError;

        // Transform project data
        const transformedProject: Project = {
          ...projectData,
          title: projectData.project_name || 'Untitled Project',
          description: projectData.project_description || 'No description available',
          roles: rolesData || []
        };

        setProject(transformedProject);
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
      <ProjectHeader project={project} />
      
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