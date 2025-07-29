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
import { useNavigate } from 'react-router-dom';


interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'login' | 'signup';
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, defaultTab = 'login' }) => {
  const { login, clearAuthData, forceClearCache } = useAuth(); // Only use login from AuthContext, handle signup directly
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [isLoading, setIsLoading] = useState(false);
  const [signupStep, setSignupStep] = useState(1);
  const [showManualSignup, setShowManualSignup] = useState(false);
  const navigate = useNavigate();

  // Login form state
  const [loginData, setLoginData] = useState({ email: '', password: '' });

  // Signup form state - using the correct field names that match your database
  const [signupData, setSignupData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '', // This maps to 'full name' in users table
    userType: '' as '' | 'business' | 'contractor', // This maps to 'role' in users table
    company: '', // This maps to business_name in users table
    degree: '',
    university: '',
    wam: '',
    skills: '',
    interests: '',
    summary: '', // This maps to description in contractor table
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
      alert('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignupStep1 = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
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
      console.log('Starting signup process...');
      
      // STEP 1: Create the user account in Supabase Auth
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

      if (signUpError) {
        console.error('Supabase auth signup error:', signUpError);
        alert('Signup failed: ' + signUpError.message);
        return;
      }

      console.log('Supabase auth signup successful:', signUpData);

      // STEP 2: Wait for the session to be available (polling)
      let userId = signUpData.user?.id;
      let tries = 0;
      let session = signUpData.session;
      
      console.log('Waiting for session to be available...');
      while ((!userId || !session) && tries < 10) {
        await new Promise(res => setTimeout(res, 300));
        const { data: { user: currentUser } } = await supabase.auth.getUser();
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        userId = currentUser?.id;
        session = currentSession;
        tries++;
        console.log(`Try ${tries}: userId=${userId}, session=${!!session}`);
      }
      
      if (!userId) {
        alert('Could not get authenticated user ID after sign up.');
        return;
      }
      
      if (!session) {
        // STEP 3: Try to log the user in explicitly if no session
        console.log('No session after sign up, attempting explicit login...');
        const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
          email: signupData.email,
          password: signupData.password
        });
        console.log('Login result:', loginData, loginError);
        
        // Immediately check if the user is now logged in
        const { data: { user: loggedInUser } } = await supabase.auth.getUser();
        console.log('User after login:', loggedInUser);
        
        if (loginError || !loggedInUser) {
          alert('Login failed after sign up: ' + (loginError?.message || 'No user returned'));
          return;
        }
        userId = loggedInUser.id;
      }
      
      // STEP 4: Only proceed if user is authenticated
      if (!userId) {
        alert('User is not authenticated after sign up.');
        return;
      }
      
      console.log('User authenticated, creating profiles...');

      // STEP 5: Create user record in users table FIRST (This was missing!)
      console.log('Creating user record in users table...');
      
      // Check if user already exists in users table
      const { data: existingUser, error: checkError } = await supabase
        .from('users')
        .select('id')
        .eq('id', userId)
        .single();
      
      if (checkError && checkError.code !== 'PGRST116') { // PGRST116 = no rows returned
        console.error('Error checking existing user:', checkError);
        alert('Error checking user profile: ' + checkError.message);
        return;
      }
      
      if (existingUser) {
        console.log('User already exists in users table, skipping insert');
      } else {
        // Only insert if user doesn't exist
        const { error: userError } = await supabase
          .from('users')
          .insert({
            id: userId, // This must match auth.users.id
            email: signupData.email,
            'full name': signupData.name, // Note: space in field name
            role: signupData.userType, // 'contractor' or 'business'
            business_name: signupData.company || null,
            business_website: null,
            industry: null,
            description: signupData.summary || null,
            completed_sign_up: false,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });

        if (userError) {
          console.error('User table insert error:', userError);
          alert('Failed to create user profile: ' + userError.message);
          return;
        }
        console.log('User record created successfully');
      }

      // STEP 6: Create contractor profile if user is a contractor
      if (signupData.userType === 'contractor') {
        console.log('Creating contractor profile...');
        
        // Check if contractor profile already exists
        const { data: existingContractor, error: checkContractorError } = await supabase
          .from('contractor')
          .select('id')
          .eq('linkeduser', userId)
          .single();
        
        if (checkContractorError && checkContractorError.code !== 'PGRST116') {
          console.error('Error checking existing contractor:', checkContractorError);
          alert('Error checking contractor profile: ' + checkContractorError.message);
          return;
        }
        
        if (existingContractor) {
          console.log('Contractor profile already exists, skipping insert');
        } else {
          const { error: contractorError } = await supabase
            .from('contractor')
            .insert({
              linkeduser: userId, // Foreign key to auth.users.id
              name: signupData.name, // ✅ contractor table HAS name field
              description: signupData.summary || null,
              skills: signupData.skills.split(',').map(s => s.trim()).filter(Boolean),
              interests: signupData.interests.split(',').map(s => s.trim()).filter(Boolean),
              resume: null,
              created_at: new Date().toISOString()
            });
            
          if (contractorError) {
            console.error('Contractor profile creation error:', contractorError);
            alert('Failed to create contractor profile: ' + contractorError.message);
            return;
          }
          console.log('Contractor profile created successfully');
        }
      }
      
      // STEP 7: Create business profile if user is a business
      if (signupData.userType === 'business') {
        console.log('Creating business profile...');
        
        // Check if business profile already exists
        const { data: existingBusiness, error: checkBusinessError } = await supabase
          .from('business')
          .select('id')
          .eq('linkeduser', userId)
          .single();
        
        if (checkBusinessError && checkBusinessError.code !== 'PGRST116') {
          console.error('Error checking existing business:', checkBusinessError);
          alert('Error checking business profile: ' + checkBusinessError.message);
          return;
        }
        
        if (existingBusiness) {
          console.log('Business profile already exists, skipping insert');
        } else {
          const { error: businessError } = await supabase
            .from('business')
            .insert({
              linkeduser: userId, // Foreign key to auth.users.id
              name: signupData.company || null,
              created_at: new Date().toISOString()
            });
          
          if (businessError) {
            console.error('Business profile creation error:', businessError);
            alert('Failed to create business profile: ' + businessError.message);
            return;
          }
          console.log('Business profile created successfully');
        }
      }
      
      console.log('All profiles created successfully, proceeding to step 2');
      alert('Sign up successful! Check your email for confirmation.');
      setSignupStep(2); // Only proceed if everything was successful
      
    } catch (err) {
      console.error('Unexpected error during signup:', err);
      alert('Unexpected error: ' + (err as Error).message);
    } finally {
      setIsLoading(false);
    }
  }; 

  const handleSignupStep2 = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!signupData.email || !signupData.name || !signupData.userType) {
      alert('Please fill all required fields.');
      return;
    }

    // Get the current user's ID from Supabase Auth
    const { data: { user } } = await supabase.auth.getUser();
    const userId = user?.id;
    if (!userId) {
      alert('User not authenticated');
      return;
    }

    console.log('Updating profiles for user:', userId);

    // Update contractor profile with skills and interests if applicable
    if (signupData.userType === 'contractor') {
      const updatePayload = {
        description: signupData.summary,
        skills: signupData.skills.split(',').map(s => s.trim()).filter(Boolean),
        interests: signupData.interests.split(',').map(s => s.trim()).filter(Boolean),
        resume: '', // Update if you have resume upload
      };
      console.log('Attempting contractor update:', updatePayload);
      const { error: contractorError, data: contractorData } = await supabase
        .from('contractor')
        .update(updatePayload)
        .eq('linkeduser', userId);
      console.log('Contractor update result:', { contractorError, contractorData });
      if (contractorError) {
        alert('Failed to update contractor profile: ' + contractorError.message);
        return;
      }
    }

    // Update business profile if applicable
    if (signupData.userType === 'business') {
      const updatePayload = {
        name: signupData.company,
      };
      console.log('Attempting business update:', updatePayload);
      const { error: businessError, data: businessData } = await supabase
        .from('business')
        .update(updatePayload)
        .eq('linkeduser', userId);
      console.log('Business update result:', { businessError, businessData });
      if (businessError) {
        alert('Failed to update business profile: ' + businessError.message);
        return;
      }
    }
    
    // Navigate based on user role
    if (signupData.userType === 'contractor') {
      navigate('/ContractorDashboard');
    } else if (signupData.userType === 'business') {
      navigate('/Dashboard');
    } else {
      navigate('/fuck'); // fallback
    }

    alert('Profile updated successfully!');
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
              
              <div className="text-center">
                <button 
                  type="button" 
                  onClick={() => {
                    clearAuthData();
                    alert('Cache cleared! Please try logging in again.');
                  }}
                  className="text-sm text-gray-500 underline hover:text-gray-700"
                >
                  Having trouble? Clear Cache & Try Again
                </button>
              </div>
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
                  
                  <div className="text-center">
                    <button 
                      type="button" 
                      onClick={() => {
                        clearAuthData();
                        alert('Cache cleared! Please try signing up again.');
                      }}
                      className="text-sm text-gray-500 underline hover:text-gray-700"
                    >
                      Having trouble? Clear Cache & Try Again
                    </button>
                  </div>
                </form>
              ) : (
                <form onSubmit={handleSignupStep2} className="space-y-4">
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
                  
                  <div className="text-center">
                    <button 
                      type="button" 
                      onClick={() => {
                        clearAuthData();
                        alert('Cache cleared! Please try signing up again.');
                      }}
                      className="text-sm text-gray-500 underline hover:text-gray-700"
                    >
                      Having trouble? Clear Cache & Try Again
                    </button>
                  </div>
                </form>
              )
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};