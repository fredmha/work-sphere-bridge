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
import { useAuth } from "@/context/AuthContext";
import {
  Edit,
  Save,
  Settings,
  Bell,
  CreditCard,
  Shield,
  Award,
  Star
} from "lucide-react";

type FormData = {
  company: string;
  email: string;
  name: string;
  university: string;
  degree: string;
  year: string;
  wam: string;
  summary: string;
  skills: string;
  interests: string;
};

const ProfileSettings: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    company: '',
    email: user?.email || '',
    name: user?.['full name'] || user?.['fullName'] || '',
    university: user?.university || '',
    degree: user?.degree || '',
    year: user?.year || '',
    wam: user?.wam || '',
    summary: user?.summary || '',
    skills: user?.skills?.join(', ') || '',
    interests: user?.interests?.join(', ') || ''
  });

  // Load business name
  useEffect(() => {
    if (user?.role === 'business' && user.id) {
      (async () => {
        const { data, error } = await supabase
          .from('business')
          .select('name')
          .eq('linkeduser', user.id)
          .single();
        if (!error && data?.name !== undefined) {
          setFormData(f => ({ ...f, company: data.name || '' }));
        }
      })();
    }
  }, [user]);

  // Save handler
  const handleSave = async () => {
    setLoading(true);
    try {
      // Update email on user record
      if (formData.email !== user?.email) {
        await updateProfile({ email: formData.email });
      }

      if (user?.role === 'business' && user.id) {
        const { error } = await supabase
          .from('business')
          .update({ name: formData.company })
          .eq('linkeduser', user.id);
        if (error) throw error;
      } else {
        // Contractor fields
        await updateProfile({
          fullName: formData.name,
          university: formData.university,
          degree: formData.degree,
          year: formData.year,
          wam: formData.wam,
          summary: formData.summary,
          skills: formData.skills.split(',').map(s => s.trim()),
          interests: formData.interests.split(',').map(s => s.trim())
        });
      }

      setIsEditing(false);
    } catch (err) {
      console.error('Update failed:', err);
    } finally {
      setLoading(false);
    }
  };

  // Business view
  if (user?.role === 'business') {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-2">Company Profile & Settings</h1>
            <p className="text-muted-foreground mb-6">Manage your business account and preferences</p>

            <Tabs defaultValue="profile" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="profile">Company Profile</TabsTrigger>
                <TabsTrigger value="projects">Projects</TabsTrigger>
                <TabsTrigger value="settings">Account Settings</TabsTrigger>
                <TabsTrigger value="billing">Billing & Payments</TabsTrigger>
              </TabsList>

              <TabsContent value="profile">
  <Card>
    <CardHeader className="relative pb-0">
      <div>
        <CardTitle>Company Information</CardTitle>
        <CardDescription>Update your company details</CardDescription>
      </div>
      <div className="absolute top-4 right-4">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setIsEditing(prev => !prev)}
          disabled={loading}
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
            value={formData.company}
            onChange={e => setFormData(f => ({ ...f, company: e.target.value }))}
            disabled={!isEditing || loading}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="contact-email">Contact Email</Label>
          <Input
            id="contact-email"
            type="email"
            value={formData.email}
            onChange={e => setFormData(f => ({ ...f, email: e.target.value }))}
            disabled={!isEditing || loading}
          />
        </div>
      </div>

      {isEditing && (
        <div className="flex flex-col items-end gap-2">
          <Button
            type="button"
            onClick={handleSave}
            disabled={loading}
          >
            <Save className="h-4 w-4 mr-2" />
            {loading ? 'Saving...' : 'Save Changes'}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsEditing(false)}
            disabled={loading}
          >
            Cancel
          </Button>
        </div>
      )}
    </CardContent>
  </Card>
</TabsContent>


              {/* Remaining tabs unchanged */}
            </Tabs>
          </div>
        </div>
      </div>
    );
  }

  // Contractor view
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Profile & Settings</h1>
          <p className="text-muted-foreground mb-6">Manage your contractor profile</p>

          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="projects">Past Projects</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
              <TabsTrigger value="performance">Performance</TabsTrigger>
            </TabsList>

            <TabsContent value="profile">
              <Card>
                <CardHeader className="flex items-center justify-between">
                  <div>
                    <CardTitle>Profile Information</CardTitle>
                    <CardDescription>Your public profile visible to businesses</CardDescription>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => setIsEditing(!isEditing)}>
                    <Edit className="h-4 w-4 mr-2" />
                    {isEditing ? 'Cancel' : 'Edit Profile'}
                  </Button>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center gap-6">
                    <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="text-2xl font-bold text-primary">{user?.['full name']?.charAt(0)}</span>
                    </div>
                    <div className="flex-1 space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={e => setFormData(f => ({ ...f, name: e.target.value }))}
                        disabled={!isEditing}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={e => setFormData(f => ({ ...f, email: e.target.value }))}
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="university">University</Label>
                      <Input
                        id="university"
                        value={formData.university}
                        onChange={e => setFormData(f => ({ ...f, university: e.target.value }))}
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="degree">Degree</Label>
                      <Input
                        id="degree"
                        value={formData.degree}
                        onChange={e => setFormData(f => ({ ...f, degree: e.target.value }))}
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="year">Year}</Label>
                      <Input
                        id="year"
                        value={formData.year}
                        onChange={e => setFormData(f => ({ ...f, year: e.target.value }))}
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="wam">WAM}</Label>
                      <Input
                        id="wam"
                        value={formData.wam}
                        onChange={e => setFormData(f => ({ ...f, wam: e.target.value }))}
                        disabled={!isEditing}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="summary">Summary</Label>
                    <Textarea
                      id="summary"
                      value={formData.summary}
                      onChange={e => setFormData(f => ({ ...f, summary: e.target.value }))}
                      disabled={!isEditing}
                      rows={4}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="skills">Skills (comma separated)</Label>
                    <Input
                      id="skills"
                      value={formData.skills}
                      onChange={e => setFormData(f => ({ ...f, skills: e.target.value }))}
                      disabled={!isEditing}
                      placeholder="React, Node.js, Python"
                    />
                    {!isEditing && user?.skills && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {user.skills.map((skill, idx) => <Badge key={idx}>{skill}</Badge>)}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="interests">Interests (comma separated)</Label>
                    <Input
                      id="interests"
                      value={formData.interests}
                      onChange={e => setFormData(f => ({ ...f, interests: e.target.value }))}
                      disabled={!isEditing}
                      placeholder="Software Engineering, AI"
                    />
                    {!isEditing && user?.interests && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {user.interests.map((i, idx) => <Badge key={idx} variant="outline">{i}</Badge>)}
                      </div>
                    )}
                  </div>

                  {isEditing && (
                    <div className="flex gap-2">
                      <Button onClick={handleSave}><Save className="h-4 w-4 mr-2"/>Save Changes</Button>
                      <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Past Projects, Settings & Performance tabs unchanged */}

          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettings;