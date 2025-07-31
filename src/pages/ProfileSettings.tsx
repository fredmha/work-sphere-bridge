import React, { useState, useEffect } from 'react';
import Header from "@/components/layout/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from '@/lib/supabaseClient';
import { User } from '@/types';
import { useAuth } from "@/context/AuthContext";
import { 
  Edit, 
  Save, 
  MapPin, 
  Calendar, 
  GraduationCap,
  Award,
  Settings,
  Bell,
  CreditCard,
  Shield,
  Star
} from "lucide-react";

const ProfileSettings = () => {
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.fullName || '',
    email: user?.email || '',
    //company: user?.company || '',
   // university: user?.university || '',
   // degree: user?.degree || '',
   // year: user?.year || '',
    //wam: user?.wam || '',
    //summary: user?.summary || '',
    skills: user?.skills?.join(', ') || '',
    interests: user?.interests?.join(', ') || ''
  });

  const handleSave = () => {
    updateProfile({
      ...formData,
      skills: formData.skills.split(',').map(s => s.trim()),
      interests: formData.interests.split(',').map(s => s.trim())
    });
    setIsEditing(false);
  };

  const [pastProjects, setPastProjects] = useState<any[]>([]);          
  useEffect(() => {
    const fetchProjects = async () => {
      if (!user || !supabase) return;

      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("owner_id", user.id);

      if (!error && data) {
        setPastProjects(data);
      }
    };

    fetchProjects();
  }, [user]);
  
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
                          value={formData.name || ""}
                          onChange={async (e) => {
                            const companyName = e.target.value;
                            setFormData({ ...formData, name: companyName });

                            // Search for business in business db where linkeduser matches logged in user and name matches input
                            if (user?.id) {
                              const { data, error } = await supabase
                                .from('business')
                                .select('name')
                                .eq('linkeduser', user.id)
                                .ilike('name', `%${companyName}%`)
                                .single();

                              if (!error && data && data.name) {
                                // Set formData.company to the business name from db
                                setFormData((prev) => ({
                                  ...prev,
                                  company: data.name,
                                }));
                              }
                            }
                          }}
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
                  <div className="flex items-center gap-6">
                    <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="text-2xl font-bold text-primary">
                        {user?.name?.charAt(0)}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          disabled={!isEditing}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="university">University</Label>
                      <Input
                        id="university"
                        value={formData.university}
                        onChange={(e) => setFormData({ ...formData, university: e.target.value })}
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="degree">Degree</Label>
                      <Input
                        id="degree"
                        value={formData.degree}
                        onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="year">Year</Label>
                      <Input
                        id="year"
                        value={formData.year}
                        onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="wam">WAM</Label>
                      <Input
                        id="wam"
                        value={formData.wam}
                        onChange={(e) => setFormData({ ...formData, wam: e.target.value })}
                        disabled={!isEditing}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="summary">Summary</Label>
                    <Textarea
                      id="summary"
                      value={formData.summary}
                      onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                      disabled={!isEditing}
                      rows={4}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="skills">Skills (comma separated)</Label>
                    <Input
                      id="skills"
                      value={formData.skills}
                      onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                      disabled={!isEditing}
                      placeholder="React, Node.js, Python"
                    />
                    {!isEditing && user?.skills && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {user.skills.map((skill, index) => (
                          <Badge key={index} variant="secondary">{skill}</Badge>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="interests">Interests (comma separated)</Label>
                    <Input
                      id="interests"
                      value={formData.interests}
                      onChange={(e) => setFormData({ ...formData, interests: e.target.value })}
                      disabled={!isEditing}
                      placeholder="Software Engineering, AI"
                    />
                    {!isEditing && user?.interests && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {user.interests.map((interest, index) => (
                          <Badge key={index} variant="outline">{interest}</Badge>
                        ))}
                      </div>
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
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <Card>
                    <CardContent className="p-6 text-center">
                      <div className="text-2xl font-bold">6</div>
                      <div className="text-sm text-muted-foreground">Projects Completed</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-6 text-center">
                      <div className="text-2xl font-bold">4.8</div>
                      <div className="text-sm text-muted-foreground">Average Rating</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-6 text-center">
                      <div className="text-2xl font-bold">$12,450</div>
                      <div className="text-sm text-muted-foreground">Total Earned</div>
                    </CardContent>
                  </Card>
                </div>

                {pastProjects.length === 0 ? (
                  <p className="text-muted-foreground">No past projects</p>
                ) : pastProjects.map((project) => (
                  <Card key={project.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">{project.title}</CardTitle>
                          <CardDescription>{project.company} • {project.role}</CardDescription>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="font-medium">{project.rating}</span>
                          </div>
                          <div className="text-sm text-muted-foreground">{project.duration}</div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="text-sm font-medium">Client Feedback:</div>
                        <div className="text-sm text-muted-foreground italic">
                          "{project.feedback}"
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
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
                    <Button variant="outline" className="w-full justify-start">
                      <CreditCard className="h-4 w-4 mr-2" />
                      Payment Methods
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="performance">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5" />
                    Performance Metrics
                  </CardTitle>
                  <CardDescription>Your performance statistics and achievements</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-success">98%</div>
                      <div className="text-sm text-muted-foreground">On-time Delivery</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-success">4.8/5</div>
                      <div className="text-sm text-muted-foreground">Quality Score</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-success">95%</div>
                      <div className="text-sm text-muted-foreground">Response Rate</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-success">6</div>
                      <div className="text-sm text-muted-foreground">Repeat Clients</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettings;