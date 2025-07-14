import Header from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Calendar, Users, Clock, DollarSign, Plus } from "lucide-react";

const Dashboard = () => {
  const projects = [
    {
      id: 1,
      title: "Convose user engagement marketer",
      company: "Atlassian",
      status: "Active",
      type: "Pay per Task",
      progress: 75,
      roles: 2,
      tasks: [
        { title: "Building a software engine", status: "Pending", assignee: "Brandon Cheung" },
        { title: "Building a software engine", status: "Submitted", assignee: "Brandon Cheung" },
        { title: "Building a software engine", status: "Confirmed", assignee: "Big nozzabigga" }
      ]
    },
    {
      id: 2,
      title: "Mobile App Development",
      company: "TechStart",
      status: "Active", 
      type: "Pay per Hour",
      progress: 45,
      roles: 3,
      timesheets: [
        { contractor: "John Doe", role: "bosh", hours: 40,  status: "Approved" },
        { contractor: "Jane Smith", role: "bosh", hours: 35, status: "Pending" }
      ]
    }
  ];

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
          {projects.map((project) => (
            <Card key={project.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline">{project.status}</Badge>
                      <Badge variant={project.type === "Pay per Task" ? "default" : "secondary"}>
                        {project.type}
                      </Badge>
                    </div>
                    <CardTitle>{project.title}</CardTitle>
                    <CardDescription>{project.company}</CardDescription>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Progress</p>
                    <p className="text-2xl font-bold">{project.progress}%</p>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="mb-4">
                  <Progress value={project.progress} className="h-2" />
                </div>
                
                <Tabs defaultValue={project.type === "Pay per Task" ? "tasks" : "timesheets"}>
                  <TabsList>
                    {project.type === "Pay per Task" ? (
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
                  
                  {project.type === "Pay per Task" && (
                    <TabsContent value="tasks" className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <h4 className="font-semibold mb-3 text-center">Pending</h4>
                          <div className="space-y-2">
                            {project.tasks?.filter(task => task.status === "Pending").map((task, index) => (
                              <Card key={index} className="p-3">
                                <p className="font-medium text-sm">{task.title}</p>
                                <p className="text-xs text-muted-foreground">{task.assignee}</p>
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
                            {project.tasks?.filter(task => task.status === "Submitted").map((task, index) => (
                              <Card key={index} className="p-3 bg-warning/10">
                                <p className="font-medium text-sm">{task.title}</p>
                                <p className="text-xs text-muted-foreground">{task.assignee}</p>
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
                            {project.tasks?.filter(task => task.status === "Confirmed").map((task, index) => (
                              <Card key={index} className="p-3 bg-success/10">
                                <p className="font-medium text-sm">{task.title}</p>
                                <p className="text-xs text-muted-foreground">{task.assignee}</p>
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
                  
                  {project.type === "Pay per Hour" && (
                    <TabsContent value="timesheets" className="space-y-4">
                      <div className="space-y-3">
                        {project.timesheets?.map((timesheet, index) => (
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
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;