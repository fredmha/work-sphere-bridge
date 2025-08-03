import React, { useState } from 'react';
import Header from "@/components/layout/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabaseClient";
import {
  Edit,
  Save,
  Award,
  Settings,
  Bell,
  CreditCard,
  Shield,
  Star,
  Upload
} from "lucide-react";

const ProfileSettings = () => {
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.fullName || '',
    email: user?.email || '',
    description: user?.contractorProfile?.description || user?.description || '',
    skills: user?.contractorProfile?.skills?.join(', ') || '',
    interests: user?.contractorProfile?.interests?.join(', ') || '',
    resume: user?.contractorProfile?.resume || ''
  });

  const handleSave = async () => {
    await updateProfile({
      fullName: formData.name,
      ...(user?.role === 'contractor'
        ? {
            description: formData.description,
            contractorProfile: {
              description: formData.description,
              skills: formData.skills.split(',').map(s => s.trim()),
              interests: formData.interests.split(',').map(s => s.trim()),
              resume: formData.resume,
            },
          }
        : {}),
    });
    setIsEditing(false);
  };

  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user || !supabase) return;
    const { data: uploadData, error } = await supabase.storage
      .from('resumes')
      .upload(`${user.id}/${file.name}`, file, { upsert: true });
    if (error) {
      console.error('Resume upload failed:', error);
      return;
    }
    const {
      data: { publicUrl },
    } = supabase.storage.from('resumes').getPublicUrl(uploadData.path);
    setFormData({ ...formData, resume: publicUrl });
  };

  const pastProjects = [
    {
      id: "1",
      title: "React Dashboard Development",
      company: "TechCorp",
      role: "Frontend Developer",
      duration: "3 months",
      rating: 4.8,
      feedback: "Excellent work on UI components and responsive design. Very professional and delivered ahead of schedule.",
    },
    {
      id: "2",
      title: "API Integration Project",
      company: "StartupXYZ",
      role: "Full Stack Developer",
      duration: "2 months",
      rating: 4.9,
      feedback: "Outstanding problem-solving skills and clean code. Great communication throughout the project.",
    }
  ];

  if (user?.role === 'business') {
    return (
      <div className="min-h-screen bg-background">
        <Header />

        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-2">Company Profile & Settings</h1>
              <p className="text-muted-foreground">Manage your business account and preferences</p>
            </div>

            <Tabs defaultValue="profile" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="profile">Company Profile</TabsTrigger>
                <TabsTrigger value="projects">Projects</TabsTrigger>
                <TabsTrigger value="settings">Account Settings</TabsTrigger>
                <TabsTrigger value="billing">Billing & Payments</TabsTrigger>
              </TabsList>

              <TabsContent value="profile">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Company Information</CardTitle>
                        <CardDescription>Update your company profile and contact details</CardDescription>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsEditing(!isEditing)}
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        {isEditing ? 'Cancel' : 'Edit'}
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="company-name">Company Name</Label>
                        <Input
                          id="company-name"
                          value={user?.businessProfile?.name || formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          disabled={!isEditing}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="contact-email">Contact Email</Label>
                        <Input
                          id="contact-email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          disabled={!isEditing}
                        />
                      </div>
                    </div>

                    {isEditing && (
                      <div className="flex gap-2">
                        <Button onClick={handleSave}>
                          <Save className="h-4 w-4 mr-2" />
                          Save Changes
                        </Button>
                        <Button variant="outline" onClick={() => setIsEditing(false)}>
                          Cancel
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="projects">
                <Card>
                  <CardHeader>
                    <CardTitle>Company Projects</CardTitle>
                    <CardDescription>Manage your posted projects and teams</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button>Go to Dashboard</Button>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="settings">
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Settings className="h-5 w-5" />
                        Account Settings
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <Button variant="outline" className="w-full justify-start">
                        <Shield className="h-4 w-4 mr-2" />
                        Change Password
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <Bell className="h-4 w-4 mr-2" />
                        Notification Preferences
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="billing">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CreditCard className="h-5 w-5" />
                      Billing & Payments
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">Payment methods and billing history</p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
  
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Profile & Settings</h1>
            <p className="text-muted-foreground">Manage your contractor profile and account preferences</p>
          </div>
  
          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="projects">Past Projects</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
              <TabsTrigger value="performance">Performance</TabsTrigger>
            </TabsList>
  
            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Profile Information</CardTitle>
                      <CardDescription>Your public profile information visible to businesses</CardDescription>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsEditing(!isEditing)}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      {isEditing ? 'Cancel' : 'Edit Profile'}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      disabled={!isEditing}
                    />
                  </div>
  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
                      disabled={!isEditing}
                    />
                  </div>
  
                  <div className="space-y-2">
                    <Label htmlFor="description">Profile Summary</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={e => setFormData({ ...formData, description: e.target.value })}
                      disabled={!isEditing}
                      rows={4}
                    />
                  </div>
  
                  <div className="space-y-2">
                    <Label htmlFor="skills">Skills (comma separated)</Label>
                    <Input
                      id="skills"
                      value={formData.skills}
                      onChange={e => setFormData({ ...formData, skills: e.target.value })}
                      disabled={!isEditing}
                      placeholder="React, Node.js, Python"
                    />
                    {!isEditing && !!formData.skills && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {formData.skills.split(',').map((skill, idx) => (
                          <Badge key={idx}>{skill.trim()}</Badge>
                        ))}
                      </div>
                    )}
                  </div>
  
                  <div className="space-y-2">
                    <Label htmlFor="interests">Interests (comma separated)</Label>
                    <Input
                      id="interests"
                      value={formData.interests}
                      onChange={e => setFormData({ ...formData, interests: e.target.value })}
                      disabled={!isEditing}
                      placeholder="Software Engineering, AI"
                    />
                    {!isEditing && !!formData.interests && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {formData.interests.split(',').map((i, idx) => (
                          <Badge key={idx} variant="outline">{i.trim()}</Badge>
                        ))}
                      </div>
                    )}
                  </div>
  
                  <div className="space-y-2">
                    <Label htmlFor="resume">Resume</Label>
                    {isEditing ? (
                      <div className="flex items-center gap-2">
                        <Input
                          id="resume"
                          type="file"
                          accept=".pdf,.doc,.docx"
                          onChange={handleResumeUpload}
                          disabled={!isEditing}
                        />
                        {formData.resume && (
                          <a
                            href={formData.resume}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="underline text-blue-600"
                          >
                            View Uploaded Resume
                          </a>
                        )}
                      </div>
                    ) : (
                      formData.resume && (
                        <a
                          href={formData.resume}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="underline text-blue-600"
                        >
                          View Uploaded Resume
                        </a>
                      )
                    )}
                  </div>
  
                  {isEditing && (
                    <div className="flex gap-2">
                      <Button onClick={handleSave}>
                        <Save className="h-4 w-4 mr-2" />
                        Save Changes
                      </Button>
                      <Button variant="outline" onClick={() => setIsEditing(false)}>
                        Cancel
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
  
            <TabsContent value="projects">
              <Card>
                <CardHeader>
                  <CardTitle>Past Projects</CardTitle>
                  <CardDescription>Project experience and feedback</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {pastProjects.map(proj => (
                    <div key={proj.id} className="border rounded-xl p-4 mb-2">
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="font-semibold">{proj.title}</div>
                          <div className="text-muted-foreground text-sm">{proj.company} – {proj.role}</div>
                          <div className="text-xs text-muted-foreground">{proj.duration}</div>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-500" />
                          <span className="font-bold">{proj.rating}</span>
                        </div>
                      </div>
                      <div className="mt-2 text-sm">{proj.feedback}</div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>
  
            <TabsContent value="settings">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Account Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button variant="outline" className="w-full justify-start">
                    <Shield className="h-4 w-4 mr-2" />
                    Change Password
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Bell className="h-4 w-4 mr-2" />
                    Notification Preferences
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
  
            <TabsContent value="performance">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5" />
                    Performance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Performance metrics and achievements coming soon.</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
 export default ProfileSettings;