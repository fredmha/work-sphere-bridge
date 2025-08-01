import { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import Header from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Calendar, Users, Clock, DollarSign, Plus } from "lucide-react";
import type { Contractor, ContractorRole, ContractorTask, projects } from '@/types';
import { CONTRACTOR_TYPE_OPTIONS, ContractorType } from '@/constants/contractorType';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/context/AuthContext';

const columns = ["Pending", "Submitted", "Confirmed"];

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [projects, setProjects] = useState<any[]>([]);
  const [contractorRoles, setContractorRoles] = useState<any[]>([]);
  const [contractorTasks, setContractorTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch projects and related data from Supabase
  useEffect(() => {
    const fetchProjects = async () => {
      if (!user) return;

      try {
        setLoading(true);
        
        // Fetch projects owned by the current user
        const { data: projectsData, error: projectsError } = await supabase
          .from('projects')
          .select('*')
          .eq('owner_id', user.id);

        if (projectsError) {
          console.error('Error fetching projects:', projectsError);
          return;
        }

        setProjects(projectsData || []);

        // Fetch contractor roles for these projects
        if (projectsData && projectsData.length > 0) {
          const { data: rolesData, error: rolesError } = await supabase
            .from('ContractorRole')
            .select('*')
            .eq('owner_id', user.id);

          if (rolesError) {
            console.error('Error fetching contractor roles:', rolesError);
          } else {
            setContractorRoles(rolesData || []);
          }

          // For now, we'll use empty tasks since ContractorTask table doesn't exist yet
          setContractorTasks([]);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [user]);

  // Dummy data for contractors (fallback)
  const contractors: Contractor[] = [
    {
      id: "contractor-1",
      fullName: "Brandon Cheung",
      email: "brandon@example.com",
      skills: ["React", "TypeScript", "Node.js"],
      interests: ["Software Engineering", "AI / ML"],
      experience: "5 years",
      type: "task",
      wocScore: 85,
      modifiedDate: "2024-01-15T10:00:00Z",
      createdDate: "2024-01-01T10:00:00Z"
    }
  ];

  // Dummy data for business (fallback)
  const business = [
    {
      id: "business-1",
      name: "Convose Inc.",
      description: "A company focused on user engagement and marketing solutions.",
      industry: "Marketing & Technology",
      createdDate: "2023-12-01T09:00:00Z",
      modifiedDate: "2024-01-10T12:00:00Z"
    }
  ];


  // Helper: Get contractor name by role ID
  const getContractorNameByRoleId = (roleId: number): string => {
    const role = contractorRoles.find(r => r.id === roleId);
    if (role) {
      return role.role || "Unknown";
    }
    return "Unknown";
  };

  // Helper: Get tasks by project
  const getTasksByProject = (projectId: number): any[] => {
    // For now, return empty array since ContractorTask table doesn't exist
    return [];
  };

  // Helper: Get timesheets by project (simulated)
  const getTimesheetsByProject = (projectId: number) => {
    const projectRoles = contractorRoles.filter(role => role.owner_id === user?.id && role.project_id === projectId);
    return projectRoles.map(role => {
      return {
        contractor: "Contractor", // We'll need to join with contractors table later
        role: role.role || "Unknown",
        hours: Math.floor(Math.random() * 20) + 30, // Random hours for demo
        status: Math.random() > 0.5 ? "Approved" : "Pending"
      };
    });
  };

  const handleCreateProject = () => {
    // Clear any existing project wizard state
    localStorage.removeItem('projectWizardState');
    sessionStorage.removeItem('projectWizardState');
    navigate('/ProjectWizard');
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Dashboard Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Project Dashboard</h1>
          <Button className="gap-2" onClick={handleCreateProject}>
            <Plus className="h-4 w-4" />
            Create a Project
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-2xl font-bold">{projects.length}</p>
                  <p className="text-sm text-muted-foreground">Active Projects</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-2xl font-bold">{contractorRoles.length}</p>
                  <p className="text-sm text-muted-foreground">Contractor Roles</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-2xl font-bold">{contractorTasks.length}</p>
                  <p className="text-sm text-muted-foreground">Total Tasks</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-2xl font-bold">${contractorTasks.reduce((sum, task) => sum + (task.price || 0), 0).toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">Total Budget</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Projects List */}
        <div className="space-y-6">
          {loading ? (
            <Card>
              <CardContent className="p-8 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading your projects...</p>
              </CardContent>
            </Card>
          ) : projects.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-muted-foreground mb-4">No projects found. Create your first project to get started!</p>
                <Button onClick={handleCreateProject}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Project
                </Button>
              </CardContent>
            </Card>
          ) : (
            projects.map((project) => {
            const projectTasks = getTasksByProject(project.id);
            const projectTimesheets = getTimesheetsByProject(project.id);
            const progress = projectTasks.length > 0 ? Math.floor((projectTasks.filter(t => t.status === "Confirmed").length / projectTasks.length) * 100) : 0;
            const projectType: string = "Pay per Hour"; // Default to hourly since tasks aren't implemented yet
            
            return (
              <Card key={project.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline">{project.status}</Badge>
                        <Badge variant={projectType === "Pay per Task" ? "default" : "secondary"}>
                          {projectType}
                        </Badge>
                      </div>
                      <CardTitle>{project.project_name}</CardTitle>
                      <CardDescription>{project.project_description}</CardDescription>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Progress</p>
                      <p className="text-2xl font-bold">{progress}%</p>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="mb-4">
                    <Progress value={progress} className="h-2" />
                  </div>
                  
                  <Tabs defaultValue={projectType === "Pay per Task" ? "tasks" : "timesheets"}>
                    <TabsList>
                      {projectType === "Pay per Task" ? (
                        <>
                          <TabsTrigger value="tasks">Tasks</TabsTrigger>
                          <TabsTrigger value="payments">Payments</TabsTrigger>
                        </>
                      ) : (
                        <>
                          <TabsTrigger value="timesheets">Timesheets</TabsTrigger>
                          <TabsTrigger value="payments">Payments</TabsTrigger>
                        </>
                      )}
                      <TabsTrigger value="team">Team</TabsTrigger>
                    </TabsList>
                    
                    {projectType === "Pay per Task" && (
                      <TabsContent value="tasks" className="space-y-4">
                        <div className="text-center text-muted-foreground py-8">
                          Task management coming soon when ContractorTask table is implemented
                        </div>
                      </TabsContent>
                    )}
                    
                    {projectType === "Pay per Hour" && (
                      <TabsContent value="timesheets" className="space-y-4">
                        <div className="space-y-3">
                          {projectTimesheets.map((timesheet, index) => (
                            <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                              <div>
                                <p className="font-medium">{timesheet.contractor}</p>
                                <p className="text-sm text-muted-foreground">{timesheet.role}</p>
                              </div>
                              <div className="text-center">
                                <p className="font-semibold">{timesheet.hours}h</p>
                              </div>
                              <div>
                                <Badge variant={timesheet.status === "Approved" ? "default" : "secondary"}>
                                  {timesheet.status}
                                </Badge>
                              </div>
                              <div className="flex gap-2">
                                {timesheet.status === "Pending" && (
                                  <>
                                    <Button size="sm" variant="outline">Reject</Button>
                                    <Button size="sm">Approve</Button>
                                  </>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </TabsContent>
                    )}
                    
                    <TabsContent value="payments">
                      <p className="text-center text-muted-foreground py-8">
                        Payment management interface coming soon
                      </p>
                    </TabsContent>
                    
                    <TabsContent value="team">
                      <p className="text-center text-muted-foreground py-8">
                        Team management interface coming soon
                      </p>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            );
          })
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;