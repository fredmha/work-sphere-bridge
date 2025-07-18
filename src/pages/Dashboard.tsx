import { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import Header from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Calendar, Users, Clock, DollarSign, Plus } from "lucide-react";
import type { Contractor, ContractorRole, ContractorTask, Project } from '@/types';
import { CONTRACTOR_TYPE_OPTIONS, ContractorType } from '@/constants/contractorType';
import { useNavigate } from 'react-router-dom';

const columns = ["Pending", "Submitted", "Confirmed"];
const navigate = useNavigate();
const Dashboard = () => {
  // Dummy data matching types.ts structure
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
    },
    {
      id: "contractor-2",
      fullName: "Big nozzabigga",
      email: "big@example.com",
      skills: ["Marketing", "SEO", "Content"],
      interests: ["Digital Marketing & Growth", "Sales & Business Development"],
      experience: "3 years",
      type: "task",
      wocScore: 92,
      modifiedDate: "2024-01-15T10:00:00Z",
      createdDate: "2024-01-01T10:00:00Z"
    },
    {
      id: "contractor-3",
      fullName: "John Doe",
      email: "john@example.com",
      skills: ["Mobile Development", "React Native"],
      interests: ["Start-ups & Innovation", "Product Management"],
      experience: "4 years",
      type: "timesheet",
      wocScore: 78,
      modifiedDate: "2024-01-15T10:00:00Z",
      createdDate: "2024-01-01T10:00:00Z"
    },
    {
      id: "contractor-4",
      fullName: "Jane Smith",
      email: "jane@example.com",
      skills: ["UI/UX", "Figma", "Design"],
      interests: ["UX / UI Design", "Consulting & Strategy"],
      experience: "6 years",
      type: "timesheet",
      wocScore: 88,
      modifiedDate: "2024-01-15T10:00:00Z",
      createdDate: "2024-01-01T10:00:00Z"
    }
  ];

  const contractorRoles: ContractorRole[] = [
    {
      id: "role-1",
      role: "Software Engineer",
      description: "Building a software engine",
      category: ["Development"],
      contractor: "contractor-1",
      originalProject: "project-1",
      score: 85,
      modifiedDate: "2024-01-15T10:00:00Z",
      createdDate: "2024-01-01T10:00:00Z"
    },
    {
      id: "role-2",
      role: "Marketing Specialist",
      description: "User engagement marketing",
      category: ["Marketing"],
      contractor: "contractor-2",
      originalProject: "project-1",
      score: 92,
      modifiedDate: "2024-01-15T10:00:00Z",
      createdDate: "2024-01-01T10:00:00Z"
    },
    {
      id: "role-3",
      role: "Mobile Developer",
      description: "Mobile app development",
      category: ["Development"],
      contractor: "contractor-3",
      originalProject: "project-2",
      score: 78,
      modifiedDate: "2024-01-15T10:00:00Z",
      createdDate: "2024-01-01T10:00:00Z"
    },
    {
      id: "role-4",
      role: "UI/UX Designer",
      description: "Design and user experience",
      category: ["Design"],
      contractor: "contractor-4",
      originalProject: "project-2",
      score: 88,
      modifiedDate: "2024-01-15T10:00:00Z",
      createdDate: "2024-01-01T10:00:00Z"
    }
  ];

  const contractorTasks: ContractorTask[] = [
    {
      id: "task-1",
      name: "Building a software engine",
      description: "Develop core software engine components",
      role: "role-1",
      status: "Pending",
      priority: "High",
      price: 500,
      modifiedDate: "2024-01-15T10:00:00Z",
      createdDate: "2024-01-01T10:00:00Z"
    },
    {
      id: "task-2",
      name: "Building a software engine",
      description: "Implement user interface components",
      role: "role-1",
      status: "Submitted",
      priority: "Medium",
      price: 300,
      modifiedDate: "2024-01-15T10:00:00Z",
      createdDate: "2024-01-01T10:00:00Z"
    },
    {
      id: "task-3",
      name: "Building a software engine",
      description: "Marketing campaign implementation",
      role: "role-2",
      status: "Confirmed",
      priority: "High",
      price: 400,
      modifiedDate: "2024-01-15T10:00:00Z",
      createdDate: "2024-01-01T10:00:00Z"
    }
  ];

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

  const projects: Project[] = [
    {
      id: "project-1",
      projectName: "Convose user engagement marketer",
      projectDescription: "Marketing campaign for user engagement",
      business: "business-1",
      status: "Active",
      contractorRoles: contractorRoles.filter(role => role.originalProject === "project-1"),
      category: ["Marketing", "Development"],
      weeklyHours: 20,
      modifiedDate: "2024-01-15T10:00:00Z",
      createdDate: "2024-01-01T10:00:00Z"
    },
    {
      id: "project-2",
      projectName: "Mobile App Development",
      projectDescription: "Complete mobile application development",
      status: "Active",
      contractorRoles: contractorRoles.filter(role => role.originalProject === "project-2"),
      category: ["Development", "Design"],
      weeklyHours: 40,
      modifiedDate: "2024-01-15T10:00:00Z",
      createdDate: "2024-01-01T10:00:00Z"
    }
  ];
  
  // Dummy business data related to 'business-1'


  // Helper: Get contractor name by role ID
  const getContractorNameByRoleId = (roleId: string): string => {
    const role = contractorRoles.find(r => r.id === roleId);
    if (role) {
      const contractor = contractors.find(c => c.id === role.contractor);
      return contractor?.fullName || "Unknown";
    }
    return "Unknown";
  };

  // Helper: Get tasks by project
  const getTasksByProject = (projectId: string): ContractorTask[] => {
    const projectRoles = contractorRoles.filter(role => role.originalProject === projectId);
    const roleIds = projectRoles.map(role => role.id);
    return contractorTasks.filter(task => roleIds.includes(task.role || ""));
  };

  // Helper: Get timesheets by project (simulated)
  const getTimesheetsByProject = (projectId: string) => {
    const projectRoles = contractorRoles.filter(role => role.originalProject === projectId);
    return projectRoles.map(role => {
      const contractor = contractors.find(c => c.id === role.contractor);
      return {
        contractor: contractor?.fullName || "Unknown",
        role: role.role || "Unknown",
        hours: Math.floor(Math.random() * 20) + 30, // Random hours for demo
        status: Math.random() > 0.5 ? "Approved" : "Pending"
      };
    });
  };



  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Dashboard Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Project Dashboard</h1>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Create a Project
            navigate('/ProjectWizard');
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-2xl font-bold">12</p>
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
                  <p className="text-2xl font-bold">48</p>
                  <p className="text-sm text-muted-foreground">Contractors</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-2xl font-bold">156</p>
                  <p className="text-sm text-muted-foreground">Hours This Week</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-2xl font-bold">$24.5k</p>
                  <p className="text-sm text-muted-foreground">Total Budget</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Projects List */}
        <div className="space-y-6">
          {projects.map((project) => {
            const projectTasks = getTasksByProject(project.id);
            const projectTimesheets = getTimesheetsByProject(project.id);
            const progress = Math.floor((projectTasks.filter(t => t.status === "Confirmed").length / projectTasks.length) * 100) || 0;
            const projectType = projectTasks.length > 0 ? "Pay per Task" : "Pay per Hour";
            
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
                      <CardTitle>{project.projectName}</CardTitle>
                      <CardDescription> {project.business}</CardDescription>
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
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <h4 className="font-semibold mb-3 text-center">Pending</h4>
                            <div className="space-y-2">
                              {projectTasks.filter(task => task.status === "Pending").map((task) => (
                                <Card key={task.id} className="p-3">
                                  <p className="font-medium text-sm">{task.name}</p>
                                  <p className="text-xs text-muted-foreground">{getContractorNameByRoleId(task.role || "")}</p>
                                  <div className="flex justify-center mt-2">
                                    <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white">Confirm</Button>
                                  </div>
                                </Card>
                              ))}
                            </div>
                          </div>
                          
                          <div>
                            <h4 className="font-semibold mb-3 text-center">Submitted</h4>
                            <div className="space-y-2">
                              {projectTasks.filter(task => task.status === "Submitted").map((task) => (
                                <Card key={task.id} className="p-3 bg-warning/10">
                                  <p className="font-medium text-sm">{task.name}</p>
                                  <p className="text-xs text-muted-foreground">{getContractorNameByRoleId(task.role || "")}</p>
                                  <div className="flex justify-center mt-2">
                                    <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white">Confirm</Button>
                                  </div>
                                </Card>
                              ))}
                            </div>
                          </div>
                          
                          <div>
                            <h4 className="font-semibold mb-3 text-center">Confirmed</h4>
                            <div className="space-y-2">
                              {projectTasks.filter(task => task.status === "Confirmed").map((task) => (
                                <Card key={task.id} className="p-3 bg-success/10">
                                  <p className="font-medium text-sm">{task.name}</p>
                                  <p className="text-xs text-muted-foreground">{getContractorNameByRoleId(task.role || "")}</p>
                                </Card>
                              ))}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex justify-center">
                          <Button className="gap-2">
                            <Plus className="h-4 w-4" />
                            Add Task
                          </Button>
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
          })}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;