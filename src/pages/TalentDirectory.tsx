import Header from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, UserPlus, Eye } from "lucide-react";

const TalentDirectory = () => {
  const filters = [
    { label: "Interests", placeholder: "Interests" },
    { label: "Skills", placeholder: "Skills" },
    { label: "University", placeholder: "University" },
    { label: "Degree", placeholder: "Degrees" },
    { label: "WAM", placeholder: "WAM" },
    { label: "Year of Degree", placeholder: "Year of Degree" }
  ];

  const talents = [
    {
      id: 1,
      name: "Simon",
      university: "Macquarie University",
      year: "Year 2",
      degree: "Bachelor of Information Technology",
      wam: "WAM:85-81",
      rating: "Rating:",
      description: "During my degree, I've completed technical projects such as deploying a Honeypot in Azure to detect brute-force attacks, creating a file integrity monitor with PowerShell, and building an SQL database schema for a university assignment. I've also developed a sign language detection model using Python and OpenCV."
    },
    {
      id: 2,
      name: "Pranav", 
      university: "University of New South Wales (UNSW)",
      year: "Year 5+",
      degree: "Bachelor of Engineering",
      wam: "WAM:75-71",
      rating: "Rating:",
      description: "I am currently studying bachelor of civil engineering and commerce. I have a keen interest in startups and want to learn more about their operation. My skills are: Business: User research and Analysis Engineering: AutoCAD, Revit, SpaceSass, Python (Beginner)"
    },
    {
      id: 3,
      name: "Iqtidar Rahman",
      university: "University of New South Wales (UNSW)", 
      year: "Year 4",
      degree: "Bachelor of Computer Science",
      wam: "WAM:75-71",
      rating: "Rating:",
      description: "I am a results-oriented professional pursuing a double degree in Actuarial Studies and Computer Science at UNSW. With a passion for"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Filters Sidebar */}
          <div className="w-64">
            <Card>
              <CardHeader>
                <CardTitle>Filters</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {filters.map((filter, index) => (
                  <div key={index}>
                    <label className="text-sm font-medium text-muted-foreground">
                      {filter.label}
                    </label>
                    <Input 
                      placeholder={filter.placeholder}
                      className="mt-1"
                    />
                  </div>
                ))}
                
                <Button className="w-full mt-6">
                  Apply Filters
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold mb-4">Talent Selection Arena</h1>
            </div>

            <div className="space-y-6">
              {talents.map((talent) => (
                <Card key={talent.id} className="hover:shadow-medium transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-4 mb-2">
                          <CardTitle className="text-xl">{talent.name}</CardTitle>
                          <Badge variant="outline" className="text-warning font-medium">
                            {talent.wam}
                          </Badge>
                          <Badge variant="outline">
                            {talent.rating}
                          </Badge>
                        </div>
                        
                        <div className="space-y-1 text-sm text-muted-foreground mb-3">
                          <p>{talent.university} {talent.year}</p>
                          <p>{talent.degree}</p>
                        </div>
                        
                        <CardDescription className="leading-relaxed">
                          {talent.description}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="pt-0">
                    <div className="flex gap-3">
                      <Button size="sm" className="gap-2">
                        <UserPlus className="h-4 w-4" />
                        Invite to Project
                      </Button>
                      <Button size="sm" variant="outline" className="gap-2">
                        <MessageSquare className="h-4 w-4" />
                        Message
                      </Button>
                      <Button size="sm" variant="outline" className="gap-2">
                        <Eye className="h-4 w-4" />
                        View More
                      </Button>
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

export default TalentDirectory;