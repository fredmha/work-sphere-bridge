import { useParams } from 'react-router-dom';
import { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { ProjectHeader } from '@/components/project/ProjectHeader';
import { ProjectTabs } from '@/components/project/ProjectTabs';
import { RolesTab } from '@/components/project/RolesTab';
import { TasksTab } from '@/components/project/TasksTab';
import { TimesheetsTab } from '@/components/project/TimesheetsTab';
import { TeamTab } from '@/components/project/TeamTab';
import { PaymentsTab } from '@/components/project/PaymentsTab';
import { ComplianceModal } from '@/components/compliance/ComplianceModal';

export function ProjectDetailPage() {
  const { projectId = 'project-1' } = useParams(); // Default to first project for demo
  const { state } = useApp();
  const [activeTab, setActiveTab] = useState('roles');
  const [complianceModalOpen, setComplianceModalOpen] = useState(false);
  const [selectedContractor, setSelectedContractor] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);

  const project = state.projects.find(p => p.id === projectId);
  
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

  const openComplianceModal = (contractorId: string, roleId: string) => {
    setSelectedContractor(contractorId);
    setSelectedRole(roleId);
    setComplianceModalOpen(true);
  };

  return (
    <div className="space-y-6">
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