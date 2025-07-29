import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, User, FileText, GraduationCap, Briefcase } from 'lucide-react';

interface Props {
  data: any;
  onDataUpdate: (data: any) => void;
  onNext: () => void;
  onBack: () => void;
  onComplete: () => void;
  user?: any;
}

export default function WelcomeStep({ data, onNext, user }: Props) {
  const features = [
    {
      icon: User,
      title: "Complete Profile",
      description: "Tell us about your background, skills, and interests"
    },
    {
      icon: FileText,
      title: "Upload Resume",
      description: "Share your experience and qualifications"
    },
    {
      icon: GraduationCap,
      title: "Academic Info",
      description: "Add your education and achievements"
    },
    {
      icon: Briefcase,
      title: "Professional Goals",
      description: "Define your career objectives and preferences"
    }
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <Badge variant="outline" className="mb-4 text-primary border-primary/20">
          Welcome to Born
        </Badge>
        <h1 className="text-4xl font-bold mb-4">
          Complete Your Profile
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Let's get to know you better so we can match you with the perfect opportunities. 
          This will only take a few minutes.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {features.map((feature, index) => (
          <Card key={index} className="hover:shadow-medium transition-shadow">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <feature.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>

      <div className="text-center">
        <Button 
          size="lg" 
          onClick={onNext}
          className="gap-2 px-8"
        >
          Get Started
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}