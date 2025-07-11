import Header from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Eye, MessageSquare, FileText, UserCheck, Star } from "lucide-react";

const ApplicationManagement = () => {
  const projects = [
    {
      id: 1,
      title: "UI Design for Bubble-based Platform",
      applicants: 3
    },
    {
      id: 2,
      title: "123: Data Analysis and Visualization Tool", 
      applicants: 4
    },
    {
      id: 3,
      title: "Internal Document Portal Development",
      applicants: 0
    }
  ];

  const roles = [
    {
      id: 1,
      title: "Data Scientist",
      count: 3
    },
    {
      id: 2, 
      title: "Software Developer",
      count: 1
    }
  ];

  const applicants = [
    {
      id: 1,
      name: "test1",
      email: "fred123121111@gme.com",
      averageScore: 0,
      applicantScore: 6.7,
      status: "Received Contract",
      message: "testing123",
      feedback: "Relevance Score: The applicant's skills in JavaScript, MongoDB, and software development align well with the project requirements for data analysis and visualization, but there is no explicit mention of data science or user interface design experience. Performance Score: No tasks were provided, so a baseline score was assigned. This limits the ability to assess task-specific performance. Message Score: No application message was provided, resulting in a baseline score. This prevents evaluation of the applicant's motivation and clarity. Resume Score: The resume is strong with relevant technical skills and recent academic projects, but lacks direct experience in data analysis and visualization. Profile Score: The interests and skills listed align well with the project context, particularly in software engineering and JavaScript, but there is no mention of data analysis tools like Power BI or Tableau."
    },
    {
      id: 2,
      name: "fred",
      email: "fre1d111111@gme.com", 
      averageScore: 0,
      applicantScore: 6,
      status: "Pending",
      message: "",
      feedback: ""
    },
    {
      id: 3,
      name: "f",
      email: "1123123123@gme.com",
      averageScore: 0, 
      applicantScore: 6.7,
      status: "Pending",
      message: "",
      feedback: ""
    }
  ];

  const selectedApplicant = applicants[0];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Application Management</h1>
        <p className="text-muted-foreground mb-8">Manage your project applications with ease</p>

        <div className="flex gap-8">
          {/* Sidebar */}
          <div className="w-80 space-y-6">
            {/* Projects */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Projects</CardTitle>
                <CardDescription>Select a project</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {projects.map((project) => (
                  <div 
                    key={project.id}
                    className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                      project.id === 2 ? 'bg-primary/10 border-primary' : 'hover:bg-muted/50'
                    }`}
                  >
                    <p className="font-medium text-sm">{project.title}</p>
                    <p className="text-xs text-muted-foreground">{project.applicants}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Roles */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Roles</CardTitle>
                <CardDescription>Select a Contractor Role</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {roles.map((role) => (
                  <div 
                    key={role.id}
                    className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                      role.id === 1 ? 'bg-primary/10 border-primary' : 'hover:bg-muted/50'
                    }`}
                  >
                    <p className="font-medium text-sm">{role.title}</p>
                    <p className="text-xs text-muted-foreground">{role.count}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Applicants Table */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Applicants</CardTitle>
                <CardDescription>Select a candidate</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2 font-medium">Name</th>
                        <th className="text-left p-2 font-medium">Email</th>
                        <th className="text-left p-2 font-medium">Avg. Task Score</th>
                        <th className="text-left p-2 font-medium">Applicant Score</th>
                        <th className="text-left p-2 font-medium">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {applicants.map((applicant) => (
                        <tr 
                          key={applicant.id} 
                          className={`border-b cursor-pointer transition-colors ${
                            applicant.id === 1 ? 'bg-primary/5' : 'hover:bg-muted/30'
                          }`}
                        >
                          <td className="p-2">{applicant.name}</td>
                          <td className="p-2">{applicant.email}</td>
                          <td className="p-2">
                            <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                              <span className="text-xs">—</span>
                            </div>
                          </td>
                          <td className="p-2">
                            <div className="w-8 h-8 bg-warning text-warning-foreground rounded-full flex items-center justify-center">
                              <span className="text-xs font-medium">{applicant.applicantScore}</span>
                            </div>
                          </td>
                          <td className="p-2">
                            <Badge variant={applicant.status === "Received Contract" ? "default" : "secondary"}>
                              {applicant.status}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Selected Applicant Details */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <UserCheck className="h-5 w-5" />
                    {selectedApplicant.name}
                  </CardTitle>
                  <CardDescription>{selectedApplicant.email}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 mb-4">
                    <Badge variant="outline" className="gap-1">
                      <Star className="h-3 w-3" />
                      Overall: {selectedApplicant.applicantScore}/10
                    </Badge>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <UserCheck className="h-4 w-4 text-primary" />
                      <span className="text-sm font-medium">Invited</span>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="gap-2">
                        <FileText className="h-4 w-4" />
                        View Resume
                      </Button>
                      <Button size="sm" variant="outline" className="gap-2">
                        <Eye className="h-4 w-4" />
                        View Profile
                      </Button>
                      <Button size="sm" variant="outline" className="gap-2">
                        <MessageSquare className="h-4 w-4" />
                        Message
                      </Button>
                    </div>
                  </div>

                  {selectedApplicant.message && (
                    <div className="mt-4">
                      <h4 className="font-medium mb-2">Application Message:</h4>
                      <p className="text-sm text-muted-foreground bg-muted/30 p-3 rounded">
                        {selectedApplicant.message}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Application Comments</CardTitle>
                </CardHeader>
                <CardContent>
                  {selectedApplicant.feedback ? (
                    <div className="text-sm text-muted-foreground leading-relaxed">
                      {selectedApplicant.feedback}
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-sm">No comments available</p>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Contractor Role Assignment */}
            <div className="mt-6 flex items-center gap-2 text-sm">
              <span className="flex items-center gap-1">
                <div className="w-3 h-3 bg-primary rounded-full" />
                Contractor Roles (Assigned): 
              </span>
              <span className="text-muted-foreground">1</span>
              
              <span className="flex items-center gap-1 ml-4">
                <div className="w-3 h-3 bg-warning rounded-full" />
                Pending Contractor Roles (Offer): 
              </span>
              <span className="text-muted-foreground">2</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationManagement;