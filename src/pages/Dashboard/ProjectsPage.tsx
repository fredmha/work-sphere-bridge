import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthProvider';
import { supabase } from '@/lib/supabaseClient';
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
import type { Database } from '@/types/supabase';

type Tables = Database['public']['Tables'];
type ProjectRow = Tables['projects']['Row'];
type ContractorRoleRow = Tables['ContractorRole']['Row'];

// Define the project status type based on the database schema
type ProjectStatus = 'Draft' | 'Published' | 'Active';

// Extended project type that includes computed fields
interface Project extends ProjectRow {
  title: string;
  description: string;
  roles: ContractorRoleRow[];
}

export function ProjectsPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<ProjectStatus | 'all'>('all');
  const [projects, setProjects] = useState<Project[]>([]);
  const [contractorRoles, setContractorRoles] = useState<ContractorRoleRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch projects and roles on component mount
  useEffect(() => {
    const fetchData = async () => {
      if (!user?.id || !supabase) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        // Fetch projects for the current user
        const { data: projectsData, error: projectsError } = await supabase
          .from('projects')
          .select('*')
          .eq('owner_id', user.id);

        if (projectsError) throw projectsError;

        // Fetch contractor roles for the current user
        const { data: rolesData, error: rolesError } = await supabase
          .from('ContractorRole')
          .select('*')
          .eq('owner_id', user.id);

        if (rolesError) throw rolesError;

        // Transform projects to include computed fields
        const transformedProjects: Project[] = (projectsData || []).map(project => {
          // Get roles for this specific project using the project_id relationship
          const projectRoles = (rolesData || []).filter(role => 
            role.project_id === project.id
          );

          return {
            ...project,
            title: project.project_name || 'Untitled Project',
            description: project.project_description || 'No description available',
            roles: projectRoles
          };
        });

        setProjects(transformedProjects);
        setContractorRoles(rolesData || []);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch projects');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user?.id]);

  const filteredProjects = useMemo(() => {
    return projects.filter(project => {
      const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          project.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'all' || project.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [projects, searchQuery, statusFilter]);

  const projectsByStatus = useMemo(() => {
    return {
      Draft: filteredProjects.filter(p => p.status === 'Draft'),
      Published: filteredProjects.filter(p => p.status === 'Published'),
      Active: filteredProjects.filter(p => p.status === 'Active')
    };
  }, [filteredProjects]);

  const handleCreateProject = () => {
    localStorage.removeItem('projectWizardState');
    sessionStorage.removeItem('projectWizardState');
    navigate('/projectwizard');
  };

  const handleViewProject = (projectId: number) => {
    navigate(`/dashboard/project/${projectId}`);
  };

  const handleArchiveProject = async (projectId: number) => {
    if (!supabase) return;

    try {
      // Update project status to Draft (archived)
      const { error } = await supabase
        .from('projects')
        .update({ status: 'Draft' })
        .eq('id', projectId);

      if (error) throw error;

      // Update local state
      setProjects(prev => prev.map(project => 
        project.id === projectId 
          ? { ...project, status: 'Draft' }
          : project
      ));
    } catch (err) {
      console.error('Error archiving project:', err);
      setError(err instanceof Error ? err.message : 'Failed to archive project');
    }
  };

  const getStatusBadgeVariant = (status: ProjectStatus) => {
    switch (status) {
      case 'Draft': return 'secondary';
      case 'Published': return 'default';
      case 'Active': return 'destructive';
      default: return 'secondary';
    }
  };

  const getProjectMetrics = (project: Project) => {
    // Get roles for this specific project
    const projectRoles = project.roles;
    const assignedRoles = projectRoles.filter(role => role.contractor_id);
    
    // For now, we'll use placeholder values for applications and compliance issues
    // since these tables aren't in the current schema
    const applicationCount = 0; // Would need applications table
    const complianceIssues = 0; // Would need compliance table

    return {
      roleCount: projectRoles.length,
      applicationCount,
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
                <Badge variant={getStatusBadgeVariant(project.status as ProjectStatus)}>
                  {project.status}
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
              <span>{new Date(project.created_at).toLocaleDateString()}</span>
            </div>
          </div>

          {project.status === 'Published' && (
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

          {project.status === 'Active' && (
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
            {project.status === 'Draft' ? 'Continue Editing' : 
             project.status === 'Published' ? 'View Applications' : 
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

  if (isLoading) {
    return (
      <div className="container mx-auto space-y-6 p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading projects...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto space-y-6 p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <AlertTriangle className="w-12 h-12 text-destructive mx-auto mb-4" />
            <p className="text-destructive mb-2">Error loading projects</p>
            <p className="text-muted-foreground text-sm">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto space-y-6 p-6">
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
            <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as ProjectStatus | 'all')}>
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
                  {projects.reduce((acc, project) => acc + project.roles.length, 0)}
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

export default ProjectsPage;