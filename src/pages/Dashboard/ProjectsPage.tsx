import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Plus, 
  Search, 
  Filter, 
  Users, 
  Clock, 
  DollarSign, 
  CheckCircle,
  AlertTriangle,
  Calendar,
  MoreVertical,
  Eye,
  Edit,
  Archive
} from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Project, ProjectState } from '@/types/entities';

export function ProjectsPage() {
  const { state, dispatch } = useApp();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<ProjectState | 'all'>('all');

  const filteredProjects = useMemo(() => {
    return state.projects.filter(project => {
      const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          project.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'all' || project.state === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [state.projects, searchQuery, statusFilter]);

  const projectsByStatus = useMemo(() => {
    return {
      Draft: filteredProjects.filter(p => p.state === 'Draft'),
      Published: filteredProjects.filter(p => p.state === 'Published'),
      Active: filteredProjects.filter(p => p.state === 'Active')
    };
  }, [filteredProjects]);

  const handleCreateProject = () => {
    const newProject: Project = {
      id: `project-${Date.now()}`,
      title: 'New Project',
      description: 'Project description',
      state: 'Draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: 'admin',
      roles: []
    };
    
    dispatch({ type: 'CREATE_PROJECT', payload: newProject });
    navigate(`/project/${newProject.id}`);
  };

  const handleViewProject = (projectId: string) => {
    navigate(`/project/${projectId}`);
  };

  const handleArchiveProject = (projectId: string) => {
    dispatch({ type: 'UPDATE_PROJECT', payload: { id: projectId, updates: { state: 'Draft' as ProjectState } } });
  };

  const getStatusBadgeVariant = (status: ProjectState) => {
    switch (status) {
      case 'Draft': return 'secondary';
      case 'Published': return 'default';
      case 'Active': return 'warning';
      default: return 'secondary';
    }
  };

  const getProjectMetrics = (project: Project) => {
    const applications = state.applications.filter(app => 
      project.roles.some(role => role.id === app.roleId)
    );
    const assignedRoles = project.roles.filter(role => role.assignedContractor);
    const complianceIssues = state.complianceChecklists.filter(checklist => 
      project.roles.some(role => role.id === checklist.roleId) &&
      [checklist.abnTfnStatus, checklist.bankDetailsStatus, checklist.superDetailsStatus, 
       checklist.workRightsStatus, checklist.contractStatus, checklist.fairWorkStatus]
        .some(status => status === 'Incomplete' || status === 'Pending Review')
    ).length;

    return {
      roleCount: project.roles.length,
      applicationCount: applications.length,
      assignedCount: assignedRoles.length,
      complianceIssues
    };
  };

  const ProjectCard = ({ project }: { project: Project }) => {
    const metrics = getProjectMetrics(project);
    
    return (
      <Card className="glass-card hover:shadow-lg transition-all duration-300 group">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <CardTitle className="text-lg group-hover:text-primary transition-colors">
                  {project.title}
                </CardTitle>
                <Badge variant={getStatusBadgeVariant(project.state)}>
                  {project.state}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {project.description}
              </p>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleViewProject(project.id)}>
                  <Eye className="w-4 h-4 mr-2" />
                  View Details
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleViewProject(project.id)}>
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Project
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleArchiveProject(project.id)}>
                  <Archive className="w-4 h-4 mr-2" />
                  Archive
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="flex items-center gap-2 text-sm">
              <Users className="w-4 h-4 text-muted-foreground" />
              <span>{metrics.roleCount} roles</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <span>{new Date(project.createdAt).toLocaleDateString()}</span>
            </div>
          </div>

          {project.state === 'Published' && (
            <div className="space-y-2 mb-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Applications</span>
                <span className="font-medium">{metrics.applicationCount}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Open Roles</span>
                <span className="font-medium">{metrics.roleCount - metrics.assignedCount}</span>
              </div>
            </div>
          )}

          {project.state === 'Active' && (
            <div className="space-y-2 mb-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Assigned Roles</span>
                <span className="font-medium">{metrics.assignedCount}/{metrics.roleCount}</span>
              </div>
              {metrics.complianceIssues > 0 && (
                <div className="flex items-center gap-2 text-sm text-warning">
                  <AlertTriangle className="w-4 h-4" />
                  <span>{metrics.complianceIssues} compliance issue{metrics.complianceIssues > 1 ? 's' : ''}</span>
                </div>
              )}
            </div>
          )}

          <Button 
            variant="outline" 
            size="sm" 
            className="w-full"
            onClick={() => handleViewProject(project.id)}
          >
            {project.state === 'Draft' ? 'Continue Editing' : 
             project.state === 'Published' ? 'View Applications' : 
             'Manage Project'}
          </Button>
        </CardContent>
      </Card>
    );
  };

  const ProjectSection = ({ title, projects, emptyMessage }: { 
    title: string; 
    projects: Project[]; 
    emptyMessage: string;
  }) => (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <h2 className="text-xl font-semibold">{title}</h2>
        <Badge variant="secondary">{projects.length}</Badge>
      </div>
      
      {projects.length === 0 ? (
        <Card className="glass-card">
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground">{emptyMessage}</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
          <p className="text-muted-foreground">
            Manage your contractor projects and workflows
          </p>
        </div>
        <Button onClick={handleCreateProject} className="bg-primary">
          <Plus className="w-4 h-4 mr-2" />
          New Project
        </Button>
      </div>

      {/* Filters and Search */}
      <Card className="glass-card">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as ProjectState | 'all')}>
              <SelectTrigger className="w-full sm:w-48">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="Draft">Draft</SelectItem>
                <SelectItem value="Published">Published</SelectItem>
                <SelectItem value="Active">Active</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="glass-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Edit className="w-5 h-5 text-secondary" />
              <div>
                <p className="text-sm text-muted-foreground">Draft Projects</p>
                <p className="text-2xl font-bold">{projectsByStatus.Draft.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="glass-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Eye className="w-5 h-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Published</p>
                <p className="text-2xl font-bold">{projectsByStatus.Published.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="glass-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-warning" />
              <div>
                <p className="text-sm text-muted-foreground">Active</p>
                <p className="text-2xl font-bold">{projectsByStatus.Active.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="glass-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Total Roles</p>
                <p className="text-2xl font-bold">
                  {state.projects.reduce((acc, project) => acc + project.roles.length, 0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Project Sections */}
      <div className="space-y-8">
        <ProjectSection 
          title="Draft Projects" 
          projects={projectsByStatus.Draft}
          emptyMessage="No draft projects. Create a new project to get started."
        />
        
        <ProjectSection 
          title="Published Projects" 
          projects={projectsByStatus.Published}
          emptyMessage="No published projects. Publish a draft project to start receiving applications."
        />
        
        <ProjectSection 
          title="Active Projects" 
          projects={projectsByStatus.Active}
          emptyMessage="No active projects. Assign contractors to published roles to activate projects."
        />
      </div>
    </div>
  );
}