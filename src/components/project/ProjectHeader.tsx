import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin, User } from 'lucide-react';
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

interface ProjectHeaderProps {
  project: Project;
  onPublish?: () => void;
  onUpdateProject?: () => void;
}

export function ProjectHeader({ project, onPublish, onUpdateProject }: ProjectHeaderProps) {
  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'Draft': return 'secondary';
      case 'Published': return 'default';
      case 'Active': return 'default';
      case 'Completed': return 'outline';
      default: return 'secondary';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Draft': return 'text-muted-foreground';
      case 'Published': return 'text-warning';
      case 'Active': return 'text-success';
      case 'Completed': return 'text-primary';
      default: return 'text-muted-foreground';
    }
  };

  return (
    <div className="glass-card p-6 rounded-lg border border-border/50">
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-foreground">{project.title}</h1>
            <Badge variant={getStatusVariant(project.status || 'Draft')} className={getStatusColor(project.status || 'Draft')}>
              {project.status || 'Draft'}
            </Badge>
          </div>
          
          <p className="text-muted-foreground text-base leading-relaxed max-w-2xl">
            {project.description}
          </p>
          
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>Created {new Date(project.created_at).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <span>{project.roles.length} role{project.roles.length !== 1 ? 's' : ''}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          {project.status === 'Draft' && (
            <Button variant="default" className="flex-1 sm:flex-none" onClick={onPublish}>
              Publish Project
            </Button>
          )}
          {project.status === 'Published' && (
            <Button variant="outline" className="flex-1 sm:flex-none">
              View Applications
            </Button>
          )}
          {project.status === 'Active' && (
            <Button variant="outline" className="flex-1 sm:flex-none">
              Export Report
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}