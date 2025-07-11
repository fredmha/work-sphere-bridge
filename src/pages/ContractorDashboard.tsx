import React, { useState } from 'react';
import Header from "@/components/layout/Header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  Clock, 
  FileText, 
  CheckCircle, 
  DollarSign, 
  Upload,
  Calendar,
  MessageSquare,
  Timer,
  Play,
  Pause,
  Save
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const ContractorDashboard = () => {
  const { user } = useAuth();
  const [activeTimer, setActiveTimer] = useState<string | null>(null);
  const [timeEntries, setTimeEntries] = useState<{[key: string]: number}>({});

  const activeProjects = [
    {
      id: "1",
      title: "Data Analysis Tool",
      company: "Born",
      role: "Frontend Developer",
      type: "Pay per Task",
      progress: 75,
      status: "In Progress",
      tasks: [
        {
          id: "t1",
          title: "Design UI Components",
          description: "Create reusable React components for the dashboard",
          amount: 800,
          estimatedHours: 15,
          dueDate: "2024-01-15",
          status: "Confirmed",
          kpis: ["Responsive design", "Accessibility compliance", "Component documentation"]
        },
        {
          id: "t2", 
          title: "Implement Data Visualization",
          description: "Build interactive charts and graphs using D3.js",
          amount: 1200,
          estimatedHours: 20,
          dueDate: "2024-01-22",
          status: "Submitted",
          kpis: ["Interactive charts", "Real-time data updates", "Export functionality"]
        },
        {
          id: "t3",
          title: "API Integration",
          description: "Connect frontend with backend APIs",
          amount: 600,
          estimatedHours: 12,
          dueDate: "2024-01-30",
          status: "Pending",
          kpis: ["Error handling", "Loading states", "Data validation"]
        }
      ]
    },
    {
      id: "2",
      title: "E-commerce Platform",
      company: "TechStart",
      role: "Full Stack Developer", 
      type: "Pay per Hour",
      hourlyRate: 55,
      expectedHours: "20 hrs/week",
      duration: "4-6 weeks",
      progress: 40,
      status: "Active",
      kpis: ["Secure payment processing", "User authentication", "Order management", "Performance optimization"]
    }
  ];

  const applications = [
    {
      id: "1",
      projectTitle: "Mobile App Development",
      company: "StartupCo",
      roleApplied: "React Native Developer",
      status: "Under Review",
      appliedDate: "2024-01-08",
      feedback: "Strong portfolio, scheduling interview"
    },
    {
      id: "2",
      projectTitle: "AI Chatbot Implementation",
      company: "TechFlow",
      roleApplied: "AI Engineer",
      status: "Invited",
      appliedDate: "2024-01-05",
      feedback: "Excellent experience with NLP"
    }
  ];

  const startTimer = (projectId: string) => {
    setActiveTimer(projectId);
    // In real app, this would start tracking time
  };

  const stopTimer = (projectId: string) => {
    setActiveTimer(null);
    // In real app, this would save the time entry
  };

  const submitTask = (taskId: string) => {
    // Handle task submission
    console.log('Submitting task:', taskId);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.name}!</h1>
          <p className="text-muted-foreground">Manage your projects and track your progress</p>
        </div>

        <Tabs defaultValue="active-projects" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="active-projects">Active Projects</TabsTrigger>
            <TabsTrigger value="applications">Applications</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>

          <TabsContent value="active-projects" className="space-y-6">
            {activeProjects.map((project) => (
              <Card key={project.id} className="w-full">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <CardTitle className="text-xl">{project.title}</CardTitle>
                        <Badge variant={project.type === "Pay per Task" ? "default" : "secondary"}>
                          {project.type}
                        </Badge>
                        <Badge variant="outline" className="text-success border-success">
                          {project.status}
                        </Badge>
                      </div>
                      <CardDescription className="text-base">
                        {project.company} • {project.role}
                        {project.type === "Pay per Hour" && (
                          <span> • ${project.hourlyRate}/hr • {project.expectedHours}</span>
                        )}
                      </CardDescription>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-muted-foreground mb-1">Progress</div>
                      <div className="text-2xl font-bold">{project.progress}%</div>
                    </div>
                  </div>
                  <Progress value={project.progress} className="mt-4" />
                </CardHeader>

                <CardContent>
                  {project.type === "Pay per Task" ? (
                    <div className="space-y-4">
                      <h4 className="font-semibold mb-3">Tasks & Milestones</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {["Pending", "Submitted", "Confirmed"].map((status) => (
                          <div key={status} className="space-y-3">
                            <h5 className="font-medium text-center p-2 bg-muted rounded-lg">
                              {status}
                            </h5>
                            {project.tasks?.filter(task => task.status === status).map((task) => (
                              <Card key={task.id} className="p-4">
                                <div className="space-y-2">
                                  <div className="flex items-center justify-between">
                                    <h6 className="font-medium">{task.title}</h6>
                                    <Badge variant="outline">${task.amount}</Badge>
                                  </div>
                                  <p className="text-sm text-muted-foreground">{task.description}</p>
                                  <div className="text-xs text-muted-foreground">
                                    <div>Est. {task.estimatedHours} hours</div>
                                    <div>Due: {task.dueDate}</div>
                                  </div>
                                  <div className="space-y-1">
                                    <div className="text-xs font-medium">KPIs:</div>
                                    <ul className="text-xs space-y-1">
                                      {task.kpis.map((kpi, index) => (
                                        <li key={index} className="flex items-center gap-1">
                                          <CheckCircle className="h-3 w-3 text-success" />
                                          {kpi}
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                  {task.status === "Pending" && (
                                    <div className="space-y-2 pt-2">
                                      <Label>Upload Deliverable:</Label>
                                      <div className="flex gap-2">
                                        <Input type="file" className="flex-1" />
                                        <Button size="sm" onClick={() => submitTask(task.id)}>
                                          <Upload className="h-4 w-4" />
                                        </Button>
                                      </div>
                                      <Textarea placeholder="Add notes..." className="mt-2" />
                                      <Button size="sm" className="w-full">Submit Task</Button>
                                    </div>
                                  )}
                                </div>
                              </Card>
                            ))}
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold">Time Tracking</h4>
                        <div className="flex items-center gap-2">
                          {activeTimer === project.id ? (
                            <Button 
                              size="sm" 
                              variant="destructive"
                              onClick={() => stopTimer(project.id)}
                            >
                              <Pause className="h-4 w-4 mr-2" />
                              Stop Timer
                            </Button>
                          ) : (
                            <Button 
                              size="sm"
                              onClick={() => startTimer(project.id)}
                            >
                              <Play className="h-4 w-4 mr-2" />
                              Start Timer
                            </Button>
                          )}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Hours This Week</Label>
                          <div className="text-2xl font-bold">18.5</div>
                        </div>
                        <div className="space-y-2">
                          <Label>Total Earnings</Label>
                          <div className="text-2xl font-bold">$1,017.50</div>
                        </div>
                      </div>

                      <Card className="p-4">
                        <h5 className="font-medium mb-3">Add Time Entry</h5>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Date</Label>
                            <Input type="date" />
                          </div>
                          <div className="space-y-2">
                            <Label>Hours</Label>
                            <Input type="number" placeholder="8.0" step="0.5" />
                          </div>
                        </div>
                        <div className="space-y-2 mt-4">
                          <Label>Description</Label>
                          <Textarea placeholder="What did you work on?" />
                        </div>
                        <Button className="w-full mt-4">
                          <Save className="h-4 w-4 mr-2" />
                          Save Time Entry
                        </Button>
                      </Card>

                      <div className="space-y-2">
                        <h5 className="font-medium">Project KPIs & Expectations:</h5>
                        <ul className="space-y-1">
                          {project.kpis?.map((kpi, index) => (
                            <li key={index} className="flex items-center gap-2 text-sm">
                              <CheckCircle className="h-4 w-4 text-success" />
                              {kpi}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="applications" className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Your Applications</h3>
              {applications.map((application) => (
                <Card key={application.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{application.projectTitle}</CardTitle>
                        <CardDescription>
                          {application.company} • {application.roleApplied}
                        </CardDescription>
                      </div>
                      <Badge variant={
                        application.status === "Invited" ? "default" :
                        application.status === "Under Review" ? "secondary" : "outline"
                      }>
                        {application.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          Applied: {application.appliedDate}
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-sm font-medium">Feedback:</div>
                        <div className="text-sm text-muted-foreground">{application.feedback}</div>
                      </div>
                      <div className="flex gap-2 pt-2">
                        <Button variant="outline" size="sm">
                          <MessageSquare className="h-4 w-4 mr-2" />
                          Message
                        </Button>
                        <Button variant="outline" size="sm">
                          <FileText className="h-4 w-4 mr-2" />
                          View Application
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Profile & Settings</CardTitle>
                <CardDescription>
                  Manage your profile information and account settings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button>
                  Go to Profile Page
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ContractorDashboard;