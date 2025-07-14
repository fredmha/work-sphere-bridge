import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/context/AuthContext';
import { Mail, Lock, User, Building2 } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { supabase } from '@/lib/supabaseClient';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'login' | 'signup';
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, defaultTab = 'login' }) => {
  const { login, signup } = useAuth();
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [isLoading, setIsLoading] = useState(false);
  const [signupStep, setSignupStep] = useState(1);
  const [showManualSignup, setShowManualSignup] = useState(false);

  // Login form state
  const [loginData, setLoginData] = useState({ email: '', password: '' });

  // Signup form state
  const [signupData, setSignupData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    userType: '' as '' | 'business' | 'contractor',
    company: '',
    degree: '',
    university: '',
    wam: '',
    skills: '',
    interests: '',
    summary: '',
    year: '',
    _customSkill: ''
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await login(loginData.email, loginData.password);
      onClose();
    } catch (error) {
      console.error('Login failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignupStep1 = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signupData.email || !signupData.name || !signupData.password || !signupData.confirmPassword || !signupData.userType) {
      alert('Please fill all required fields.');
      return;
    }
    if (signupData.password !== signupData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    setIsLoading(true);
    try {
      // Connect to Supabase Auth
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: signupData.email,
        password: signupData.password,
        options: {
          data: {
            full_name: signupData.name,
            user_type: signupData.userType
          }
        }
      });

      if (!signUpError && signUpData.user) {
        // Insert into your custom user table
        const { error: dbError } = await supabase
          .from('user')
          .insert([
            {
              id: signUpData.user.id, // Use the Auth user ID as the primary key
              email: signupData.email,
              "full name": signupData.name, // <-- use the exact column name
              // ...any other fields
            }
          ]);
        if (dbError) {
          alert('User created, but failed to insert into user table: ' + dbError.message);
        }
      }
      alert('Sign up successful! Check your email for confirmation.');
      setSignupStep(2); // Only proceed if successful
    } catch (err) {
      alert('Unexpected error: ' + (err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // Only allow 'business' or 'contractor' for userType
      if (signupData.userType !== 'business' && signupData.userType !== 'contractor') {
        alert('Please select a user type.');
        setIsLoading(false);
        return;
      }
      // Omit _customSkill from userData
      const { _customSkill, ...restSignupData } = signupData;
      const userData = {
        name: signupData.name,
        userType: signupData.userType,
        ...(signupData.userType === 'business' ? {
          company: signupData.company
        } : {
          degree: signupData.degree,
          university: signupData.university,
          wam: signupData.wam,
          skills: signupData.skills.split(',').map(s => s.trim()),
          interests: signupData.interests.split(',').map(s => s.trim()),
          summary: signupData.summary,
          year: signupData.year
        })
      };
      await signup(signupData.email, signupData.password, userData);
      setSignupStep(1);
      onClose();
    } catch (error) {
      console.error('Signup failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => { setSignupStep(1); setShowManualSignup(false); onClose(); }}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold">
            Welcome to B🔗rn
          </DialogTitle>
        </DialogHeader>
        <Tabs value={activeTab} onValueChange={(value) => { setActiveTab(value as 'login' | 'signup'); setSignupStep(1); setShowManualSignup(false); }}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>
          <TabsContent value="login" className="space-y-4">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="login-email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="Enter your email"
                    className="pl-10"
                    value={loginData.email}
                    onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="login-password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    id="login-password"
                    type="password"
                    placeholder="Enter your password"
                    className="pl-10"
                    value={loginData.password}
                    onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                    required
                  />
                </div>
              </div>
              
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>
            
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
              </div>
            </div>
            
            <Button variant="outline" className="w-full">
              <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Continue with Google
            </Button>
          </TabsContent>
          
          <TabsContent value="signup" className="space-y-4">
            {!showManualSignup ? (
              <div className="flex flex-col gap-6 items-center">
                <div className="flex flex-col items-center gap-2 w-full">
                  <Label className="text-base font-semibold">I am a:</Label>
                  <div className="flex gap-4 items-center">
                    <Button
                      variant={signupData.userType === 'contractor' ? 'default' : 'outline'}
                      onClick={() => setSignupData({ ...signupData, userType: 'contractor' })}
                    >
                      Contractor
                    </Button>
                    <Button
                      variant={signupData.userType === 'business' ? 'default' : 'outline'}
                      onClick={() => setSignupData({ ...signupData, userType: 'business' })}
                    >
                      Business
                    </Button>
                  </div>
                </div>
                <Button
                  variant="outline"
                  className="w-full"
                  disabled={!signupData.userType}
                  onClick={() => alert('Google sign up not implemented')}
                >
                  <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  Sign up with Google
                </Button>
                <div className="w-full flex items-center gap-2">
                  <div className="flex-1 border-t" />
                  <span className="text-xs text-muted-foreground">or</span>
                  <div className="flex-1 border-t" />
                </div>
                <Button
                  className="w-full"
                  variant="default"
                  disabled={!signupData.userType}
                  onClick={() => setShowManualSignup(true)}
                >
                  Sign up with Email
                </Button>
              </div>
            ) : (
              // ... existing two-step manual sign up form ...
              signupStep === 1 ? (
                <form onSubmit={handleSignupStep1} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                      <Input
                        id="signup-email"
                        type="email"
                        placeholder="Enter your email"
                        className="pl-10"
                        value={signupData.email}
                        onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-name">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                      <Input
                        id="signup-name"
                        type="text"
                        placeholder="Enter your full name"
                        className="pl-10"
                        value={signupData.name}
                        onChange={(e) => setSignupData({ ...signupData, name: e.target.value })}
                        required
                      />
                    </div>
                  </div>
              
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                      <Input
                        id="signup-password"
                        type="password"
                        placeholder="Create a password"
                        className="pl-10"
                        value={signupData.password}
                        onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                      <Input
                        id="confirm-password"
                        type="password"
                        placeholder="Confirm your password"
                        className="pl-10"
                        value={signupData.confirmPassword}
                        onChange={(e) => setSignupData({ ...signupData, confirmPassword: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? 'Continue...' : 'Continue'}
                  </Button>
                  <Button type="button" variant="outline" className="w-full" onClick={() => setShowManualSignup(false)}>
                    Back
                  </Button>
                </form>
              ) : (
                <form onSubmit={handleSignup} className="space-y-4">
                  {signupData.userType === 'business' ? (
                    <div className="space-y-2">
                      <Label htmlFor="company">Company Name</Label>
                      <div className="relative">
                        <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                        <Input
                          id="company"
                          type="text"
                          placeholder="Enter your company name"
                          className="pl-10"
                          value={signupData.company}
                          onChange={(e) => setSignupData({ ...signupData, company: e.target.value })}
                          required
                        />
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex flex-col items-center space-y-4">
                        <Label htmlFor="interests" className="text-center w-full text-base font-medium">
                          What Interests You?
                        </Label>
                        <div className="text-center text-sm text-muted-foreground mb-2">
                          Select the areas you're passionate about (choose multiple)
                        </div>
                        <div className="flex flex-wrap justify-center gap-2 w-full">
                          {[
                            "Software Engineering",
                            "Systems & Hardware",
                            "Data & Analytics",
                            "AI / ML",
                            "CyberSecurity",
                            "DevOps & Cloud",
                            "Product Management",
                            "UX / UI Design",
                            "Corporate Finance & Investment",
                            "Accounting & Audit",
                            "Digital Marketing & Growth",
                            "Sales & Business Development",
                            "Consulting & Strategy",
                            "Start-ups & Innovation"
                          ].map((interest) => {
                            const selected = signupData.interests
                              .split(",")
                              .map((i) => i.trim())
                              .filter(Boolean)
                              .includes(interest);
                            return (
                              <button
                                type="button"
                                key={interest}
                                className={`px-3 py-1 rounded-full border text-sm font-medium transition
                                  ${selected
                                    ? "bg-primary text-primary-foreground border-primary"
                                    : "bg-muted text-muted-foreground border-muted-foreground/30 hover:bg-primary/10"}
                                `}
                                onClick={() => {
                                  let interestsArr = signupData.interests
                                    .split(",")
                                    .map((i) => i.trim())
                                    .filter(Boolean);
                                  if (selected) {
                                    interestsArr = interestsArr.filter((i) => i !== interest);
                                  } else {
                                    interestsArr = [...interestsArr, interest];
                                  }
                                  setSignupData({
                                    ...signupData,
                                    interests: interestsArr.join(", ")
                                  });
                                }}
                              >
                                {interest}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label
                          htmlFor="skills"
                          className="block text-center text-base font-semibold mb-1"
                        >
                          Skills
                        </Label>
                        <div className="text-center text-sm text-muted-foreground mb-2">
                          Select your skillset!
                        </div>
                        
                        <div className="flex flex-wrap justify-center gap-2 w-full">
                          {[
                            "Python", "JavaScript / TypeScript", "React", "Node.js", "C/C++",
                            "REST / GraphQL", "SQL", "Excel", "Power BI / Tableau", "TensorFlow",
                            "CI/CD", "Figma", "Adobe XD", "User Testing", "Financial Modelling",
                            "Xero / QuickBooks", "Market Research", "Content Creation", "Strategy",
                            "CRM", "Copywriting", "Project Management"
                          ].map((skill) => (
                            <button
                              type="button"
                              key={skill}
                              className={`px-3 py-1 rounded-full border text-sm font-medium transition
                                ${signupData.skills.split(',').map(s => s.trim()).includes(skill)
                                  ? "bg-primary text-primary-foreground border-primary"
                                  : "bg-muted text-muted-foreground border-muted-foreground hover:bg-primary/10"}
                              `}
                              onClick={() => {
                                const skillsArr = signupData.skills
                                  ? signupData.skills.split(',').map(s => s.trim()).filter(Boolean)
                                  : [];
                                if (skillsArr.includes(skill)) {
                                  // Remove skill
                                  const newSkills = skillsArr.filter(s => s !== skill).join(', ');
                                  setSignupData({ ...signupData, skills: newSkills });
                                } else {
                                  // Add skill
                                  const newSkills = [...skillsArr, skill].join(', ');
                                  setSignupData({ ...signupData, skills: newSkills });
                                }
                              }}
                            >
                              {skill}
                            </button>
                          ))}
                        
                        </div>
                      </div>
                      

                      <div className="space-y-2 mt-4">
                        <Label htmlFor="summary">Brief Summary</Label>
                        <Textarea
                          id="summary"
                          placeholder="Tell us about yourself..."
                          value={signupData.summary}
                          onChange={(e) => setSignupData({ ...signupData, summary: e.target.value })}
                        />
                      </div>
                    </>
                  )}
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? 'Creating Account...' : 'Create Account'}
                  </Button>
                  <Button type="button" variant="outline" className="w-full" onClick={() => setSignupStep(1)}>
                    Back
                  </Button>
                </form>
              )
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};