import React, { useState } from "react";
import Header from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, MapPin, Clock, DollarSign } from "lucide-react";
import { Link } from "react-router-dom";
import type { Project, ContractorRole, ContractorTask } from '@/types';
import { CONTRACTOR_TYPE_OPTIONS, ContractorType } from '@/constants/contractorType';

// Dummy roles
const roles: ContractorRole[] = [
  {
    id: "role-1",
    role: "Data Analyst",
    description: "Analyze and visualize data",
   // category: ["Data"],
    originalProject: "project-1",
    score: 80,
    modifiedDate: "2024-01-15T10:00:00Z",
    createdDate: "2024-01-01T10:00:00Z"
  },
  {
    id: "role-2",
    role: "Frontend Developer",
    description: "Build React Native app",
   // category: ["Development"],
    originalProject: "project-2",
    score: 85,
    modifiedDate: "2024-01-15T10:00:00Z",
    createdDate: "2024-01-01T10:00:00Z"
  },
  {
    id: "role-3",
    role: "Backend Developer",
    description: "API and DB integration",
    category: ["Development"],
    originalProject: "project-2",
    score: 82,
    modifiedDate: "2024-01-15T10:00:00Z",
    createdDate: "2024-01-01T10:00:00Z"
  }
];

// Dummy tasks
const tasks: ContractorTask[] = [
  {
    id: "task-1",
    name: "Data Cleaning",
    description: "Clean raw data for analysis",
    role: "role-1",
    status: "Pending",
    priority: "High",
    price: 100,
    modifiedDate: "2024-01-15T10:00:00Z",
    createdDate: "2024-01-01T10:00:00Z"
  },
  {
    id: "task-2",
    name: "Build Charts",
    description: "Create data visualizations",
    role: "role-1",
    status: "Submitted",
    priority: "Medium",
    price: 150,
    modifiedDate: "2024-01-15T10:00:00Z",
    createdDate: "2024-01-01T10:00:00Z"
  },
  {
    id: "task-3",
    name: "Setup API",
    description: "Develop backend API",
    role: "role-3",
    status: "Confirmed",
    priority: "High",
    price: 200,
    modifiedDate: "2024-01-15T10:00:00Z",
    createdDate: "2024-01-01T10:00:00Z"
  }
];

// Dummy projects
const projects: Project[] = [
  {
    id: "project-1",
    projectName: "Data Analysis and Visualization Tool",
    business: "Born",
    category: ["Mobile App Development"],
    projectDescription: "Develop a comprehensive data analysis and visualization tool for businesses.",
    duration: "1-5 hrs/wk",
    incentive: ["Enhance your portfolio", "Gain experience in data processing", "Work with cutting-edge tech", "Solve real-world problems"],
    status: "Active",
    contractorRoles: roles.filter(r => r.originalProject === "project-1"),
    weeklyHours: 5,
    modifiedDate: "2024-01-15T10:00:00Z",
    createdDate: "2024-01-01T10:00:00Z"
  },
  {
    id: "project-2",
    projectName: "Mobile E-commerce Platform",
    business: "TechStart",
    category: ["Mobile Development"],
    projectDescription: "Build a modern e-commerce mobile application with React Native.",
    duration: "10-20 hrs/wk",
    incentive: ["Work with modern tech stack", "Flexible hours", "Direct client communication", "Portfolio enhancement"],
    status: "Active",
    contractorRoles: roles.filter(r => r.originalProject === "project-2"),
    weeklyHours: 15,
    modifiedDate: "2024-01-15T10:00:00Z",
    createdDate: "2024-01-01T10:00:00Z"
  }
];

// Helper: Infer project type
const getProjectType = (project: Project) => (project.weeklyHours && project.weeklyHours > 0 ? "timesheet" : "task");
// Helper: Get hourly rate (dummy for demo)
const getHourlyRate = (project: Project) => (getProjectType(project) === "timesheet" ? "$45-65/hr" : null);
// Helper: Get timeframe (dummy for demo)
const getTimeframe = (project: Project) => (getProjectType(project) === "timesheet" ? "4-6 wks" : null);

// Helper: Get number of roles for a project
const getRoleCount = (projectId: string) => roles.filter(r => r.originalProject === projectId).length;
// Helper: Get number of tasks for a project
const getTaskCount = (projectId: string) => {
  const projectRoleIds = roles.filter(r => r.originalProject === projectId).map(r => r.id);
  return tasks.filter(t => projectRoleIds.includes(t.role || "")).length;
};

const FindProjects = () => {
  const [openResumeModal, setOpenResumeModal] = useState<string | null>(null);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [appliedProjects, setAppliedProjects] = useState<string[]>([]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <div className="bg-primary text-primary-foreground py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Find Your Next Exciting Project!
          </h1>
          <p className="text-xl mb-8 opacity-90">
            Discover exciting contractor opportunities tailored to your skills and interests!
          </p>
          
          <div className="max-w-2xl mx-auto flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input 
                placeholder="Search Projects" 
                className="pl-10 bg-background text-foreground"
              />
            </div>
            <Button variant="secondary">
              Reset Search
            </Button>
            <Button variant="secondary">
              Find Projects
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Filters Sidebar */}
          <div className="w-64 space-y-6">
            <div className="bg-card p-6 rounded-lg border">
              <div className="flex items-center gap-2 mb-4">
                <Filter className="h-4 w-4" />
                <h3 className="font-semibold">Filters</h3>
              </div>
              
              <div className="space-y-4">
                

                <div>
                  <label className="text-sm font-medium text-muted-foreground mb-1 block">Type</label>
                  <div className="relative">
                    <select
                      className="block w-full appearance-none bg-background border border-input rounded-md px-3 py-2 pr-8 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
                      defaultValue=""
                    >
                      <option value="" disabled>
                        Select Type
                      </option>
                      <option value="hourly">Hourly</option>
                      <option value="pay-per-task">Pay per Task</option>
                    </select>
                    <svg
                      className="pointer-events-none absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
                
                <Button className="w-full">Apply Filters</Button>
                <Button variant="outline" className="w-full">Clear Filters</Button>
              </div>
            </div>
          </div>

          {/* Projects List */}
          <div className="flex-1">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Available Projects</h2>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">All</Button>
                <Button variant="outline" size="sm">Saved</Button>
              </div>
            </div>

            <div className="space-y-6">
              {projects.map((project) => {
                const type = getProjectType(project);
                const hourlyRate = getHourlyRate(project);
                const timeframe = getTimeframe(project);
                return (
                  <Card key={project.id} className="hover:shadow-medium transition-shadow">
                    <CardHeader className="pb-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-semibold text-primary">{project.business}</span>
                            {project.category?.map((cat, i) => (
                              <Badge key={i} variant="secondary">{cat}</Badge>
                            ))}
                          </div>
                          <CardTitle className="text-xl mb-2">{project.projectName}</CardTitle>
                          <div className="flex items-center gap-6 text-sm text-muted-foreground mb-3">
                            {type === "timesheet" ? (
                              <>
                                <div className="flex items-center gap-1">
                                  <DollarSign className="h-4 w-4" />
                                  <span>{hourlyRate || "N/A"}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Clock className="h-4 w-4" />
                                  <span>{project.duration || "N/A"}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <MapPin className="h-4 w-4" />
                                  <span>{timeframe || "N/A"}</span>
                                </div>
                              </>
                            ) : (
                              <div className="flex items-center gap-1">
                                <DollarSign className="h-4 w-4" />
                                <span>N/A</span>
                              </div>
                            )}
                            <div className="flex items-center gap-1">
                              <svg className="h-4 w-4 text-muted-foreground" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a4 4 0 0 0-3-3.87M9 20H4v-2a4 4 0 0 1 3-3.87m9-5a4 4 0 1 0-8 0 4 4 0 0 0 8 0z" />
                              </svg>
                              <span>{getRoleCount(project.id)} role{getRoleCount(project.id) !== 1 ? "s" : ""}</span>
                            </div>
                            {/* <div className="flex items-center gap-1">
                              <svg className="h-4 w-4 text-muted-foreground" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 7h18M3 12h18M3 17h18" />
                              </svg>
                              <span>{getTaskCount(project.id)} task{getTaskCount(project.id) !== 1 ? "s" : ""}</span>
                            </div> */}
                          </div>
                          <Badge 
                            variant={type === "task" ? "default" : "secondary"}
                            className="mb-3"
                          >
                            {type === "task" ? "Pay per Task" : "Pay per Hour"}
                            {hourlyRate && ` - ${hourlyRate}`}
                          </Badge>
                        </div>
                        
                        <div className="flex flex-col gap-2 ml-4">
                          <Button
                            size="sm"
                            onClick={() => setOpenResumeModal(project.id)}
                            disabled={appliedProjects.includes(project.id)}
                            style={{ display: appliedProjects.includes(project.id) ? 'none' : undefined }}
                          >
                            Quick Apply
                          </Button>
                          {/* Modal for uploading resume */}
                          {openResumeModal === project.id && (
                            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                              <div className="bg-white dark:bg-background rounded-lg shadow-lg max-w-md w-full p-6 relative">
                                <button
                                  className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
                                  onClick={() => setOpenResumeModal(null)}
                                  aria-label="Close"
                                >
                                  <span aria-hidden="true">&times;</span>
                                </button>
                                <h2 className="text-xl font-bold mb-4">
                                  Quick Apply: {project.projectName}
                                </h2>
                                <form
                                  onSubmit={e => {
                                    e.preventDefault();
                                    if (resumeFile) {
                                      setOpenResumeModal(null);
                                      setResumeFile(null);
                                      setAppliedProjects(prev => [...prev, project.id]);
                                    }
                                  }}
                                >
                                  <label className="block mb-2 font-medium">
                                    Upload your resume
                                  </label>
                                  <input
                                    type="file"
                                    accept=".pdf,.doc,.docx"
                                    className="mb-4 block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
                                    onChange={e => setResumeFile(e.target.files?.[0] || null)}
                                    required
                                  />
                                  <div className="flex gap-2 justify-end">
                                    <Button
                                      type="button"
                                      variant="outline"
                                      onClick={() => {
                                        setOpenResumeModal(null);
                                        setResumeFile(null);
                                      }}
                                    >
                                      Cancel
                                    </Button>
                                    <Button type="submit" disabled={!resumeFile}>
                                      Submit Application
                                    </Button>
                                  </div>
                                </form>
                              </div>
                            </div>
                          )}
                          <Link to={`/projects/${project.id}`}>
                            <Button variant="outline" size="sm" className="w-full">
                              View Details
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="pt-0">
                      <CardDescription className="mb-4">
                        {project.projectDescription}
                      </CardDescription>
                      
                      <div>
                        <h4 className="font-semibold mb-2">Perks:</h4>
                        <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                          {project.incentive?.map((perk, index) => (
                            <li key={index}>{perk}</li>
                          ))}
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FindProjects;