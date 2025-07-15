import Header from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { UserPlus, Eye } from "lucide-react";
import { INTEREST_OPTIONS, Interest } from "@/constants/interests";
import { SKILL_OPTIONS, Skill } from "@/constants/skills";
import React, { useState } from "react";
import Select from 'react-select';
import type { Contractor } from "@/types";

const interestOptions = INTEREST_OPTIONS.map(i => ({ value: i, label: i }));
const skillOptions = SKILL_OPTIONS.map(s => ({ value: s, label: s }));

// Dummy data matching the Contractor interface from types.ts
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

const TalentDirectory = () => {
  const [selectedInterests, setSelectedInterests] = useState<Interest[]>([]);
  const [selectedSkills, setSelectedSkills] = useState<Skill[]>([]);

  // Filtering logic: only show contractors who have ALL selected skills and ALL selected interests
  const filteredContractors = contractors.filter(contractor => {
    const hasAllSkills = selectedSkills.every(skill => contractor.skills?.includes(skill));
    const hasAllInterests = selectedInterests.every(interest => contractor.interests?.includes(interest));
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
              {filteredContractors.map((contractor) => (
                <Card key={contractor.id} className="hover:shadow-medium transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-4 mb-2">
                          <CardTitle className="text-xl">{contractor.fullName}</CardTitle>
                          <Badge variant="outline">
                            {contractor.wocScore !== undefined && contractor.wocScore !== null
                              ? `Rating: ${contractor.wocScore}`
                              : 'Rating: ---'}
                          </Badge>
                        </div>
                        <div className="flex flex-col gap-1 mt-2">
                          <div>
                            <span className="font-medium text-sm text-muted-foreground mr-2">Skills:</span>
                            {contractor.skills?.map((skill: string, i: number) => (
                              <Badge key={`skill-${i}`} variant="secondary" className="bg-blue-100 text-blue-800 mr-1 mb-1">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                          <div>
                            <span className="font-medium text-sm text-muted-foreground mr-2">Interests:</span>
                            {contractor.interests?.map((interest: string, i: number) => (
                              <Badge key={`interest-${i}`} variant="secondary" className="bg-green-100 text-green-800 mr-1 mb-1">
                                {interest}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <CardDescription className="leading-relaxed">
                          {contractor.experience}
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
              {filteredContractors.length === 0 && (
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