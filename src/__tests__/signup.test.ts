import { createClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';

describe('Supabase Sign Up Flows', () => {
  const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
  const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;
  const supabase = createClient(supabaseUrl!, supabaseAnonKey!);

  // Helper to delete user by email (cleanup)
  const deleteUserByEmail = async (email: string) => {
    // Supabase does not allow deleting users via anon key, so this is a placeholder.
    // You may need to manually clean up users in the dashboard or use a service role key.
  };

  it('should sign up a contractor and create a contractor profile', async () => {
    const uniqueEmail = `contractor_${uuidv4()}@test.com`;
    const password = 'TestPassword123!';
    const signupData = {
      email: uniqueEmail,
      password,
      confirmPassword: password,
      name: 'Test Contractor',
      userType: 'contractor',
      company: '',
      degree: 'BSc Computer Science',
      university: 'Test University',
      wam: '80',
      skills: 'Testing, Jest, Automation',
      interests: 'QA, Automation, DevOps',
      summary: 'A test contractor for integration testing.',
      year: '2025',
      _customSkill: ''
    };

    // Sign up
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
    expect(signUpError).toBeNull();
    expect(signUpData.user).toBeDefined();
    const userId = signUpData.user?.id;
    expect(userId).toBeDefined();

    // Insert into Contractor table (match AuthModal)
    const { error: contractorError, data: contractorData } = await supabase
      .from('contractor')
      .insert([{
        linkeduser: userId,
        //description: signupData.summary,
        //skills: signupData.skills.split(',').map(s => s.trim()),
        //interests: signupData.interests.split(',').map(s => s.trim()),
        //resume: '',
        created_at: new Date().toISOString()
      }]);
    expect(contractorError).toBeNull();
    expect(contractorData).toBeDefined();
  });

  it('should sign up a business and create a business profile', async () => {
    const uniqueEmail = `business_${uuidv4()}@test.com`;
    const password = 'TestPassword123!';
    const signupData = {
      email: uniqueEmail,
      password,
      confirmPassword: password,
      name: 'Test Business',
      userType: 'business',
      company: 'Test Company',
      degree: '',
      university: '',
      wam: '',
      skills: '',
      interests: '',
      summary: '',
      year: '',
      _customSkill: ''
    };

    // Sign up
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
    expect(signUpError).toBeNull();
    expect(signUpData.user).toBeDefined();
    const userId = signUpData.user?.id;
    expect(userId).toBeDefined();

    // Insert into business table (match AuthModal)
    const { error: businessError, data: businessData } = await supabase
      .from('business')
      .insert([{
        linkeduser: userId,
        name: signupData.company,
        created_at: new Date().toISOString()
      }]);
    expect(businessError).toBeNull();
    expect(businessData).toBeDefined();
  });
}); 