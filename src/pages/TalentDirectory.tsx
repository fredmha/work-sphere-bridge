import Header from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, UserPlus, Eye } from "lucide-react";
import { INTEREST_OPTIONS, Interest } from "@/constants/interests";
import { SKILL_OPTIONS, Skill } from "@/constants/skills";
import React, { useState } from "react";
import Select from 'react-select';

const interestOptions = INTEREST_OPTIONS.map(i => ({ value: i, label: i }));
const skillOptions = SKILL_OPTIONS.map(s => ({ value: s, label: s }));

const TalentDirectory = () => {
  // State for selected filters
  const [selectedInterests, setSelectedInterests] = useState<Interest[]>([]);
  const [selectedSkills, setSelectedSkills] = useState<Skill[]>([]);

  // Example talents (replace with real data from Supabase in production)
  const talents = [
    {
      id: 1,
      name: "Simon",
      university: "Macquarie University",
      skills: ["Python", "SQL", "React", "Node.js", "Docker", "Kubernetes"],
      interests: ["AI / ML", "CyberSecurity", "Cloud Computing", "Software Engineering"],
      year: "Year 2",
      degree: "Bachelor of Information Technology",
      wam: "WAM:85-81",
      rating: "4.5",
      description:
        "During my degree, I've completed technical projects such as deploying a Honeypot in Azure to detect brute-force attacks, creating a file integrity monitor with PowerShell, and building an SQL database schema for a university assignment. I've also developed a sign language detection model using Python and OpenCV."
    },
    {
      id: 2,
      name: "Pranav",
      university: "University of New South Wales (UNSW)",
      year: "Year 5+",
      degree: "Bachelor of Engineering",
      wam: "WAM:75-71",
      rating: "Rating:",
      skills: ["AutoCAD", "Revit", "Python"],
      interests: ["Start-ups & Innovation", "Product Management"],
      description:
        "I am currently studying bachelor of civil engineering and commerce. I have a keen interest in startups and want to learn more about their operation. My skills are: Business: User research and Analysis Engineering: AutoCAD, Revit, SpaceSass, Python (Beginner)"
    },
    {
      id: 3,
      name: "Iqtidar Rahman",
      university: "University of New South Wales (UNSW)",
      year: "Year 4",
      degree: "Bachelor of Computer Science",
      wam: "WAM:75-71",
      rating: "Rating:",
      skills: ["Python", "JavaScript / TypeScript", "React"],
      interests: ["Consulting & Strategy", "Data & Analytics", "Software Engineering"],
      description:
        "I am a results-oriented professional pursuing a double degree in Actuarial Studies and Computer Science at UNSW. With a passion for"
    }
  ];

  // Filtering logic: only show talents who have ALL selected skills and ALL selected interests
  const filteredTalents = talents.filter(talent => {
    const hasAllSkills = selectedSkills.every(skill => talent.skills.includes(skill));
    const hasAllInterests = selectedInterests.every(interest => talent.interests.includes(interest));
    return hasAllSkills && hasAllInterests;
  });

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
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Interests</label>
                  <Select
                    isMulti
                    options={interestOptions}
                    value={interestOptions.filter(opt => selectedInterests.includes(opt.value))}
                    onChange={opts => setSelectedInterests(opts.map(opt => opt.value as Interest))}
                    placeholder="Select interests..."
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Skills</label>
                  <Select
                    isMulti
                    options={skillOptions}
                    value={skillOptions.filter(opt => selectedSkills.includes(opt.value))}
                    onChange={opts => setSelectedSkills(opts.map(opt => opt.value as Skill))}
                    placeholder="Select skills..."
                  />
                </div>
                <Button className="w-full mt-6" onClick={e => e.preventDefault()}>
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
              {filteredTalents.map((talent) => (
                <Card key={talent.id} className="hover:shadow-medium transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-4 mb-2">
                          <CardTitle className="text-xl">{talent.name}</CardTitle>
                          <Badge variant="outline">
                            {talent.rating === null || talent.rating === undefined || talent.rating === ''
                              ? 'Rating: ---'
                              : `Rating: ${talent.rating}`}
                          </Badge>
                        </div>
                        <div className="flex flex-col gap-1 mt-2">
                          <div>
                            <span className="font-medium text-sm text-muted-foreground mr-2">Skills:</span>
                            {talent.skills.map((skill: string, i: number) => (
                              <Badge key={`skill-${i}`} variant="secondary" className="bg-blue-100 text-blue-800 mr-1 mb-1">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                          <div>
                            <span className="font-medium text-sm text-muted-foreground mr-2">Interests:</span>
                            {talent.interests.map((interest: string, i: number) => (
                              <Badge key={`interest-${i}`} variant="secondary" className="bg-green-100 text-green-800 mr-1 mb-1">
                                {interest}
                              </Badge>
                            ))}
                          </div>
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
                        <Eye className="h-4 w-4" />
                        View More
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {filteredTalents.length === 0 && (
                <div className="text-center text-muted-foreground mt-8">No talent matches your selected filters.</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TalentDirectory;