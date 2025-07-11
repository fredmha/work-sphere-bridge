import React, { useState } from "react";
import { useParams } from "react-router-dom";
import Header from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { MapPin, Clock, DollarSign, Users, Target } from "lucide-react";

const ProjectDetail = () => {
  const { id } = useParams();
  const [openResumeModal, setOpenResumeModal] = useState<number | null>(null);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  
  // Mock project data - in real app this would come from API
  const project = {
    id: 1,
    title: "123: Data Analysis and Visualization Tool",
    company: "Born",
    category: "Mobile App Development",
    description: "This project involves developing a comprehensive data analysis and visualization tool aimed at enhancing decision-making processes for businesses. The tool will allow users to input raw data and receive insightful visual representations, making complex data more accessible and understandable. The project requires skills in data science, software development, and user interface design. It offers a valuable opportunity to work with cutting-edge data technologies and methodologies in data processing and visualization. Participants will gain hands-on experience in transforming data into actionable insights, a highly sought-after skill in today's data-driven world. The project will also provide exposure to real-world business challenges, enhancing problem-solving and analytical skills. By contributing to this project, contractors will have the chance to significantly impact how businesses interpret and utilize their data.",
    duration: "1-5 hrs/wk",
    timeframe: "1-2 wks",
    type: "Pay per Task",
    roles: [
      {
        id: 1,
        title: "Data Scientist",
        description: "Responsible for designing and implementing data processing algorithms. Reports to the project manager and collaborates with developers to ensure data accuracy and relevance.",
        tasks: [
          {
            title: "Data Collection and Cleaning",
            description: "Gather and clean raw data from various sources",
            amount: 800,
            hours: 15,
            dueDate: "2024-01-15",
            kpis: [
              "Data quality score of 95% or higher",
              "Complete removal of duplicate entries",
              "Standardized data format across all sources"
            ]
          },
          {
            title: "Algorithm Development",
            description: "Develop data processing and analysis algorithms",
            amount: 1200,
            hours: 25,
            dueDate: "2024-02-01",
            kpis: [
              "Algorithm accuracy of 90% or better",
              "Processing time under 2 seconds per dataset",
              "Scalable architecture for large datasets"
            ]
          }
        ]
      },
      {
        id: 2,
        title: "Software Developer",
        description: "Focus on frontend and backend development of the visualization platform.",
        tasks: [
          {
            title: "User Interface Development",
            description: "Create intuitive and responsive user interface",
            amount: 1000,
            hours: 20,
            dueDate: "2024-01-30",
            kpis: [
              "Mobile-responsive design",
              "Loading time under 3 seconds",
              "Cross-browser compatibility"
            ]
          }
        ]
      }
    ],
    perks: [
      "Enhance your portfolio with a high-impact project",
      "Gain experience in data processing and analysis",
      "Work with cutting-edge data technologies",
      "Opportunity to solve real-world business problems"
    ]
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Project Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <span className="font-semibold text-primary">{project.company}</span>
            <Badge variant="secondary">{project.category}</Badge>
          </div>
          
          <h1 className="text-3xl font-bold mb-4">{project.title}</h1>
          
          <div className="flex items-center gap-6 text-muted-foreground mb-6">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>{project.duration}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              <span>{project.timeframe}</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span>{project.roles.length} Role(s)</span>
            </div>
          </div>
          
          <Badge variant="default" className="mb-4">
            {project.type}
          </Badge>
        </div>

        {/* Project Description */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Description</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed">{project.description}</p>
          </CardContent>
        </Card>

        {/* Available Roles */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6">Available Roles</h2>
          
          <div className="space-y-6">
            {project.roles.map((role) => (
              <Card key={role.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Target className="h-5 w-5 text-primary" />
                        {role.title}
                      </CardTitle>
                      <CardDescription className="mt-2">
                        {role.description}
                      </CardDescription>
                    </div>
                    {/* Quick Apply Button and Modal */}
                    <Button onClick={() => setOpenResumeModal(role.id)}>
                       Apply
                    </Button>
                    {openResumeModal === role.id && (
                      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                        <div className="bg-white dark:bg-background rounded-lg shadow-lg max-w-md w-full p-6 relative">
                          <button
                            className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
                            onClick={() => {
                              setOpenResumeModal(null);
                              setResumeFile(null);
                            }}
                            aria-label="Close"
                          >
                            <span aria-hidden="true">&times;</span>
                          </button>
                          <h2 className="text-xl font-bold mb-4">
                            Quick Apply: {role.title}
                          </h2>
                          <form
                            onSubmit={e => {
                              e.preventDefault();
                              if (resumeFile) {
                                // TODO: handle submit logic here
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
                  </div>
                </CardHeader>
                
                <CardContent>
                  <h4 className="font-semibold mb-4">Tasks & Milestones</h4>
                  <div className="space-y-4">
                    {role.tasks.map((task, index) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h5 className="font-semibold">{task.title}</h5>
                            <p className="text-sm text-muted-foreground mt-1">
                              {task.description}
                            </p>
                          </div>
                          <div className="text-right ml-4">
                            <div className="font-semibold text-lg">${task.amount}</div>
                            {/* <div className="text-sm text-muted-foreground">
                              ~{task.hours} hours
                            </div> */}
                            {/* <div className="text-sm text-muted-foreground">
                              //Due: {new Date(task.dueDate).toLocaleDateString()}
                            </div> */}
                          </div>
                        </div>
                        
                        {task.kpis && task.kpis.length > 0 && (
                          <div>
                            <h6 className="font-medium text-sm mb-2">Success Criteria:</h6>
                            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                              {task.kpis.map((kpi, kpiIndex) => (
                                <li key={kpiIndex}>{kpi}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Perks */}
        {/* <Card>
          <CardHeader>
            <CardTitle>Perks</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {project.perks.map((perk, index) => (
                <li key={index} className="flex items-center gap-2">
                  <div className="h-2 w-2 bg-primary rounded-full" />
                  <span className="text-sm">{perk}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card> */}
      </div>
    </div>
  );
};

export default ProjectDetail;