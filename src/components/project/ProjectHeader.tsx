import { Project } from '@/types/entities';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin, User } from 'lucide-react';

interface ProjectHeaderProps {
  project: Project;
}

export function ProjectHeader({ project }: ProjectHeaderProps) {
  const getStateVariant = (state: string) => {
    switch (state) {
      case 'Draft': return 'secondary';
      case 'Published': return 'default';
      case 'Active': return 'default';
      case 'Completed': return 'outline';
      default: return 'secondary';
    }
  };

  const getStateColor = (state: string) => {
    switch (state) {
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
            <Badge variant={getStateVariant(project.state)} className={getStateColor(project.state)}>
              {project.state}
            </Badge>
          </div>
          
          <p className="text-muted-foreground text-base leading-relaxed max-w-2xl">
            {project.description}
          </p>
          
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>Created {new Date(project.createdAt).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <span>{project.roles.length} role{project.roles.length !== 1 ? 's' : ''}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          {project.state === 'Draft' && (
            <Button variant="default" className="flex-1 sm:flex-none">
              Publish Project
            </Button>
          )}
          {project.state === 'Published' && (
            <Button variant="outline" className="flex-1 sm:flex-none">
              View Applications
            </Button>
          )}
          {project.state === 'Active' && (
            <Button variant="outline" className="flex-1 sm:flex-none">
              Export Report
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}