import Header from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Eye, MessageSquare, FileText, UserCheck, Star } from "lucide-react";
import { ApplicationTable } from "@/components/ats/ApplicationTable";
import { useState } from "react";

const ApplicationManagement = () => {
  const [selectedProjectId, setSelectedProjectId] = useState<string>('2'); // Default to project 2
  const [selectedApplicationId, setSelectedApplicationId] = useState<string>('1');
  const [selectedRoleId, setSelectedRoleId] = useState<string>('1');

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

  const handleProjectSelect = (projectId: number) => {
    setSelectedProjectId(projectId.toString());
    setSelectedApplicationId(''); // Reset application selection
  };

  const handleApplicationSelect = (applicationId: string) => {
    setSelectedApplicationId(applicationId);
  };

  const handleScheduleInterview = (applicationId: string, applicantName: string) => {
    console.log('Schedule interview for:', applicationId, applicantName);
  };

  const handleOfferInvite = (applicationId: string, applicantName: string) => {
    console.log('Offer/Invite for:', applicationId, applicantName);
  };

  const handleOpenMessaging = (applicationId: string, applicantName: string) => {
    console.log('Open messaging for:', applicationId, applicantName);
  };

  const handleOpenFeedback = (applicationId: string, applicantName: string) => {
    console.log('Open feedback for:', applicationId, applicantName);
  };

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
                      project.id.toString() === selectedProjectId ? 'bg-primary/10 border-primary' : 'hover:bg-muted/50'
                    }`}
                    onClick={() => handleProjectSelect(project.id)}
                  >
                    <p className="font-medium text-sm">{project.title}</p>
                    <p className="text-xs text-muted-foreground">{project.applicants} applicants</p>
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
            {/* Applications Table */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Applications</CardTitle>
                <CardDescription>View and manage applications for the selected project</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <ApplicationTable
                  onApplicationSelect={handleApplicationSelect}
                  selectedApplicationId={selectedApplicationId}
                  onScheduleInterview={handleScheduleInterview}
                  onOfferInvite={handleOfferInvite}
                  onOpenMessaging={handleOpenMessaging}
                  onOpenFeedback={handleOpenFeedback}
                  roleId={selectedRoleId}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationManagement;