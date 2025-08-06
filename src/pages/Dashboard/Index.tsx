import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabaseClient';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Plus, 
  Calendar, 
  DollarSign, 
  Users, 
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Clock,
  Loader2
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import type { Database } from '@/types/supabase';

type Tables = Database['public']['Tables'];
type ProjectRow = Tables['projects']['Row'];
type ContractorRoleRow = Tables['ContractorRole']['Row'];

interface ProjectWithRoles extends ProjectRow {
  title: string;
  description: string;
  roles: ContractorRoleRow[];
}

export default function Index() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [projects, setProjects] = useState<ProjectWithRoles[]>([]);
  const [stats, setStats] = useState({
    totalProjects: 0,
    activeProjects: 0,
    totalRoles: 0,
    assignedRoles: 0,
    totalRevenue: 0
  });

  // Fetch projects and calculate stats
  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user?.id || !supabase) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);

        // Fetch projects for the current user
        const { data: projectsData, error: projectsError } = await supabase
          .from('projects')
          .select('*')
          .eq('owner_id', user.id)
          .order('created_at', { ascending: false });

        if (projectsError) throw projectsError;

        // Fetch roles for all projects
        const projectIds = projectsData?.map(p => p.id) || [];
        let allRoles: ContractorRoleRow[] = [];
        
        if (projectIds.length > 0) {
          const { data: rolesData, error: rolesError } = await supabase
            .from('ContractorRole')
            .select('*')
            .in('project_id', projectIds);

          if (rolesError) throw rolesError;
          allRoles = rolesData || [];
        }

        // Transform projects with roles
        const transformedProjects: ProjectWithRoles[] = (projectsData || []).map(project => ({
          ...project,
          title: project.project_name || 'Untitled Project',
          description: project.project_description || 'No description available',
          roles: allRoles.filter(role => role.project_id === project.id)
        }));

        setProjects(transformedProjects);

        // Calculate stats
        const totalProjects = transformedProjects.length;
        const activeProjects = transformedProjects.filter(p => p.status === 'Active').length;
        const totalRoles = allRoles.length;
        const assignedRoles = allRoles.filter(r => r.contractor_id).length;
        
        // Calculate revenue (sum of all role pay rates for assigned roles)
        const totalRevenue = allRoles
          .filter(r => r.contractor_id && r.pay)
          .reduce((sum, role) => sum + (role.pay || 0), 0);

        setStats({
          totalProjects,
          activeProjects,
          totalRoles,
          assignedRoles,
          totalRevenue
        });

      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [user?.id]);

  const handleCreateProject = () => {
    localStorage.removeItem('projectWizardState');
    sessionStorage.removeItem('projectWizardState');
    navigate('/projectwizard');
  };

  const recentProjects = projects.slice(0, 3);
  const projectsByStatus = {
    Draft: projects.filter(p => p.status === 'Draft').length,
    Published: projects.filter(p => p.status === 'Published').length,
    Active: projects.filter(p => p.status === 'Active').length,
    Completed: projects.filter(p => p.status === 'Completed').length,
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
            <p className="text-muted-foreground">Loading dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
            ContractorFlow Dashboard
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage your projects, contractors, and compliance all in one place
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2">
            <Calendar className="w-4 h-4" />
            Schedule Meeting
          </Button>
          <Button onClick={handleCreateProject} className="gap-2 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70">
            <Plus className="w-4 h-4" />
            New Project
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="glass-card border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
            <div className="p-2 bg-primary/10 rounded-lg">
              <TrendingUp className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalProjects}</div>
            <p className="text-xs text-muted-foreground">
              {stats.activeProjects} currently active
            </p>
          </CardContent>
        </Card>

        <Card className="glass-card border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Contractors</CardTitle>
            <div className="p-2 bg-success/10 rounded-lg">
              <Users className="h-4 w-4 text-success" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.assignedRoles}</div>
            <p className="text-xs text-muted-foreground">
              {stats.assignedRoles}/{stats.totalRoles} roles assigned
            </p>
          </CardContent>
        </Card>

        <Card className="glass-card border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Compliance</CardTitle>
            <div className="p-2 bg-warning/10 rounded-lg">
              <CheckCircle2 className="h-4 w-4 text-warning" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.totalRoles > 0 ? Math.round((stats.assignedRoles / stats.totalRoles) * 100) : 0}%
            </div>
            <p className="text-xs text-muted-foreground">
              {stats.assignedRoles}/{stats.totalRoles} roles assigned
            </p>
          </CardContent>
        </Card>

        <Card className="glass-card border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            <div className="p-2 bg-destructive/10 rounded-lg">
              <DollarSign className="h-4 w-4 text-destructive" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Total from assigned roles
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Projects */}
        <div className="lg:col-span-2">
          <Card className="glass-card border-border/50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl">Recent Projects</CardTitle>
                <Link to="/dashboard/projects">
                  <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80">
                    View All
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent className="flex flex-col space-y-4">
              {recentProjects.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No projects yet. Create your first project to get started!</p>
                </div>
              ) : (
                recentProjects.map(project => {
                  const assignedRoles = project.roles.filter(r => r.contractor_id).length;
                  const totalRoles = project.roles.length;
                  const progress = totalRoles > 0 ? (assignedRoles / totalRoles) * 100 : 0;

                  return (
                    <Link key={project.id} to={`/dashboard/project/${project.id}`}>
                      <div className="p-4 rounded-lg border border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-md hover:shadow-primary/5 cursor-pointer group">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h3 className="font-semibold group-hover:text-primary transition-colors">
                              {project.title}
                            </h3>
                            <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                              {project.description}
                            </p>
                          </div>
                          <Badge variant={
                            project.status === 'Active' ? 'default' :
                            project.status === 'Draft' ? 'secondary' :
                            project.status === 'Published' ? 'warning' : 'outline'
                          }>
                            {project.status}
                          </Badge>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>Team Assignment</span>
                            <span>{assignedRoles}/{totalRoles} roles filled</span>
                          </div>
                          <Progress value={progress} className="h-1.5" />
                        </div>
                      </div>
                    </Link>
                  );
                })
              )}
            </CardContent>
          </Card>
        </div>

        {/* Project Status Breakdown */}
        <div className="space-y-6">
          <Card className="glass-card border-border/50">
            <CardHeader>
              <CardTitle className="text-lg">Project Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(projectsByStatus).map(([status, count]) => {
                const getStatusColor = (status: string) => {
                  switch (status) {
                    case 'Draft': return 'text-muted-foreground';
                    case 'Published': return 'text-warning';
                    case 'Active': return 'text-primary';
                    case 'Completed': return 'text-success';
                    default: return 'text-muted-foreground';
                  }
                };

                const getStatusIcon = (status: string) => {
                  switch (status) {
                    case 'Draft': return <Clock className="w-4 h-4" />;
                    case 'Published': return <AlertCircle className="w-4 h-4" />;
                    case 'Active': return <TrendingUp className="w-4 h-4" />;
                    case 'Completed': return <CheckCircle2 className="w-4 h-4" />;
                    default: return <Clock className="w-4 h-4" />;
                  }
                };

                return (
                  <div key={status} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-1.5 rounded ${getStatusColor(status)}`}>
                        {getStatusIcon(status)}
                      </div>
                      <span className="text-sm font-medium">{status}</span>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {count}
                    </Badge>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="glass-card border-border/50">
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col space-y-2">
              <Button 
                onClick={handleCreateProject}
                variant="outline" 
                className="w-full justify-start gap-3 h-auto py-3"
              >
                <Plus className="w-4 h-4" />
                <div className="text-left">
                  <div className="font-medium">Create Project</div>
                  <div className="text-xs text-muted-foreground">Start a new project</div>
                </div>
              </Button>
              
              <Link to="/dashboard/projects">
                <Button variant="outline" className="w-full justify-start gap-3 h-auto py-3">
                  <Users className="w-4 h-4" />
                  <div className="text-left">
                    <div className="font-medium">Manage Projects</div>
                    <div className="text-xs text-muted-foreground">View all projects</div>
                  </div>
                </Button>
              </Link>

              <Link to="/dashboard/contractors">
                <Button variant="outline" className="w-full justify-start gap-3 h-auto py-3">
                  <CheckCircle2 className="w-4 h-4" />
                  <div className="text-left">
                    <div className="font-medium">Contractors</div>
                    <div className="text-xs text-muted-foreground">Manage contractors</div>
                  </div>
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}