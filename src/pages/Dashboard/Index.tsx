import { useApp } from '@/contexts/AppContext';
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
  Clock
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Index() {
  const { state } = useApp();

  const totalProjects = state.projects.length;
  const activeProjects = state.projects.filter(p => p.state === 'Active').length;
  const totalContractors = state.contractors.length;
  const totalRoles = state.projects.flatMap(p => p.roles).length;
  const assignedRoles = state.projects.flatMap(p => p.roles).filter(r => r.assignedContractor).length;

  // Calculate compliance stats
  const totalComplianceItems = state.complianceChecklists.length * 6; // 6 items per checklist
  const completedComplianceItems = state.complianceChecklists.reduce((sum, checklist) => {
    const items = [
      checklist.abnTfnStatus,
      checklist.bankDetailsStatus,
      checklist.superDetailsStatus,
      checklist.workRightsStatus,
      checklist.contractStatus,
      checklist.fairWorkStatus
    ];
    return sum + items.filter(status => status === 'Complete').length;
  }, 0);

  const recentProjects = state.projects.slice(0, 3);
  const projectsByStatus = {
    Draft: state.projects.filter(p => p.state === 'Draft').length,
    Published: state.projects.filter(p => p.state === 'Published').length,
    Active: state.projects.filter(p => p.state === 'Active').length,
    Completed: state.projects.filter(p => p.state === 'Completed').length,
  };

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
          <Button className="gap-2 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70">
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
            <div className="text-2xl font-bold">{totalProjects}</div>
            <p className="text-xs text-muted-foreground">
              {activeProjects} currently active
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
            <div className="text-2xl font-bold">{totalContractors}</div>
            <p className="text-xs text-muted-foreground">
              {assignedRoles}/{totalRoles} roles assigned
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
              {totalComplianceItems > 0 ? Math.round((completedComplianceItems / totalComplianceItems) * 100) : 0}%
            </div>
            <p className="text-xs text-muted-foreground">
              {completedComplianceItems}/{totalComplianceItems} items complete
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
            <div className="text-2xl font-bold">$24,580</div>
            <p className="text-xs text-muted-foreground">
              +12% from last month
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
                <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80">
                  View All
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentProjects.map(project => {
                const assignedRoles = project.roles.filter(r => r.assignedContractor).length;
                const totalRoles = project.roles.length;
                const progress = totalRoles > 0 ? (assignedRoles / totalRoles) * 100 : 0;

                return (
                  <Link key={project.id} to={`/project/${project.id}`}>
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
                          project.state === 'Active' ? 'default' :
                          project.state === 'Draft' ? 'secondary' :
                          project.state === 'Published' ? 'warning' : 'outline'
                        }>
                          {project.state}
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
              })}
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
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start gap-3 h-auto py-3">
                <Plus className="w-4 h-4" />
                <div className="text-left">
                  <div className="font-medium">Create Project</div>
                  <div className="text-xs text-muted-foreground">Start a new project</div>
                </div>
              </Button>
              
              <Button variant="outline" className="w-full justify-start gap-3 h-auto py-3">
                <Users className="w-4 h-4" />
                <div className="text-left">
                  <div className="font-medium">Manage Contractors</div>
                  <div className="text-xs text-muted-foreground">View all contractors</div>
                </div>
              </Button>

              <Button variant="outline" className="w-full justify-start gap-3 h-auto py-3">
                <CheckCircle2 className="w-4 h-4" />
                <div className="text-left">
                  <div className="font-medium">Review Compliance</div>
                  <div className="text-xs text-muted-foreground">Check pending items</div>
                </div>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}