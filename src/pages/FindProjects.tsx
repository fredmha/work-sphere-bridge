import React, { useState } from "react";
import Header from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, MapPin, Clock, DollarSign } from "lucide-react";
import { Link } from "react-router-dom";

const FindProjects = () => {
  const [openResumeModal, setOpenResumeModal] = useState<number | null>(null);
  const [resumeFile, setResumeFile] = useState<File | null>(null);

  const projects = [
    {
      id: 1,
      title: "123: Data Analysis and Visualization Tool",
      company: "Born",
      category: "Mobile App Development",
      description: "This project involves developing a comprehensive data analysis and visualization tool aimed at enhancing decision-making processes for businesses. The tool will allow users to input raw data and receive insightful visual representations, making complex data more accessible and understandable.",
      duration: "1-5 hrs/wk",
      timeframe: "1-2 wks",
      roles: "2 Role(s)",
      type: "Pay per Task",
      hourlyRate: null,
      perks: [
        "Enhance your portfolio with a high-impact project",
        "Gain experience in data processing and analysis",
        "Work with cutting-edge data technologies",
        "Opportunity to solve real-world business problems"
      ]
    },
    {
      id: 2,
      title: "Mobile E-commerce Platform",
      company: "TechStart",
      category: "Mobile Development",
      description: "Build a modern e-commerce mobile application with React Native. Focus on user experience, payment integration, and performance optimization.",
      duration: "10-20 hrs/wk",
      timeframe: "4-6 wks",
      roles: "3 Role(s)",
      type: "Pay per Hour",
      hourlyRate: "$45-65/hr",
      perks: [
        "Work with modern tech stack",
        "Flexible working hours",
        "Direct client communication",
        "Portfolio enhancement opportunity"
      ]
    }
  ];

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
                {/* <div>
                  <label className="text-sm font-medium text-muted-foreground">Categories</label>
                  <Input placeholder="Categories" className="mt-1" />
                </div>
                
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Project Hours</label>
                  <Input placeholder="Project Hours" className="mt-1" />
                </div>
                
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Project Length</label>
                  <Input placeholder="Project Length" className="mt-1" />
                </div> */}

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
              {projects.map((project) => (
                <Card key={project.id} className="hover:shadow-medium transition-shadow">
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-semibold text-primary">{project.company}</span>
                          <Badge variant="secondary">{project.category}</Badge>
                        </div>
                        <CardTitle className="text-xl mb-2">{project.title}</CardTitle>
                        
                        {/* Condensed project figures row */}
                        <div className="flex items-center gap-6 text-sm text-muted-foreground mb-3">
                          {project.type === "Pay per Hour" || project.type === "Hourly" ? (
                            <>
                              <div className="flex items-center gap-1">
                                <DollarSign className="h-4 w-4" />
                                <span>
                                  {project.hourlyRate
                                    ? (typeof project.hourlyRate === "number"
                                        ? `$${project.hourlyRate}/hr`
                                        : project.hourlyRate)
                                    : "N/A"}
                                </span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                <span>
                                  {/* Expecting project.duration to be like "1-5 hrs/wk" */}
                                  {project.duration ? project.duration : "N/A"}
                                </span>
                              </div>
                              <div className="flex items-center gap-1">
                                <MapPin className="h-4 w-4" />
                                <span>
                                  {/* Expecting project.timeframe to be like "1-2 wks" */}
                                  {project.timeframe ? project.timeframe : "N/A"}
                                </span>
                              </div>
                            </>
                          ) : project.type === "Pay per Task" ? (
                            <>
                              <div className="flex items-center gap-1">
                                <DollarSign className="h-4 w-4" />
                                <span>
                                  {/* No totalTaskValue property, so just show N/A or a placeholder */}
                                  N/A
                                </span>
                              </div>
                            </>
                          ) : (
                            <>
                              <div className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                <span>
                                  {project.duration ? project.duration : "N/A"}
                                </span>
                              </div>
                              <div className="flex items-center gap-1">
                                <MapPin className="h-4 w-4" />
                                <span>
                                  {project.timeframe ? project.timeframe : "N/A"}
                                </span>
                              </div>
                            </>
                          )}
                          <div className="flex items-center gap-1">
                            {/* Use the correct icon import for users, e.g. from lucide-react */}
                            <svg className="h-4 w-4 text-muted-foreground" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a4 4 0 0 0-3-3.87M9 20H4v-2a4 4 0 0 1 3-3.87m9-5a4 4 0 1 0-8 0 4 4 0 0 0 8 0z" />
                            </svg>
                            <span>
                              {Array.isArray(project.roles)
                                ? `${project.roles.length} role${project.roles.length !== 1 ? "s" : ""}`
                                : project.roles}
                            </span>
                          </div>
                        </div>
                        
                        <Badge 
                          variant={project.type === "Pay per Task" ? "default" : "secondary"}
                          className="mb-3"
                        >
                          {project.type}
                          {project.hourlyRate && ` - ${project.hourlyRate}`}
                        </Badge>
                      </div>
                      
                      <div className="flex flex-col gap-2 ml-4">
                        <Button
                          size="sm"
                          onClick={() => setOpenResumeModal(project.id)}
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
                                Quick Apply: {project.title}
                              </h2>
                              <form
                                onSubmit={e => {
                                  e.preventDefault();
                                  if (resumeFile) {
                                    setOpenResumeModal(null);
                                    setResumeFile(null);
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
                      {project.description}
                    </CardDescription>
                    
                    <div>
                      <h4 className="font-semibold mb-2">Perks:</h4>
                      <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                        {project.perks.map((perk, index) => (
                          <li key={index}>{perk}</li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FindProjects;