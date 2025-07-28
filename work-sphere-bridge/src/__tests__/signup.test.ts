import { createClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';

describe('Supabase Auth and Contractor Row Flows', () => {
  const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
  const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;
  const supabase = createClient(supabaseUrl!, supabaseAnonKey!);

  it('Simple login: should sign up and log in a user, and check session', async () => {
    const uniqueEmail = `simplelogin_${uuidv4()}@test.com`;
    const password = 'TestPassword123!';
    // Sign up
    await supabase.auth.signUp({
      email: uniqueEmail,
      password,
    });
    // Log in
    const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
      email: uniqueEmail,
      password,
    });
    expect(loginError).toBeNull();
    expect(loginData.user).toBeDefined();
    // Check session
    const { data: { user: loggedInUser } } = await supabase.auth.getUser();
    console.log('[Simple login] User after login:', loggedInUser);
    expect(loggedInUser).toBeDefined();
    expect(loggedInUser?.email).toBe(uniqueEmail);
  });

  it('Login with contractor row: should sign up, insert contractor row, log in, and check session', async () => {
    const uniqueEmail = `contractorlogin_${uuidv4()}@test.com`;
    const password = 'TestPassword123!';
    // Sign up
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: uniqueEmail,
      password,
      options: {
        data: {
          full_name: 'mandem',
         
        }
      }
    });
    expect(signUpError).toBeNull();
    expect(signUpData.user).toBeDefined();
    const userId = signUpData.user?.id;
    expect(userId).toBeDefined();
    // Insert contractor row
    const { error: contractorError, data: contractorData } = await supabase
      .from('Contractor')
      .insert([{
        linkeduser: userId,
        description: 'Test contractor',
        skills: ['Testing'],
        interests: ['QA'],
        resume: '',
        created_at: new Date().toISOString()
      }]);
    expect(contractorError).toBeNull();
    expect(contractorData).toBeDefined();
    // Log in
    const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
      email: uniqueEmail,
      password,
    });
    expect(loginError).toBeNull();
    expect(loginData.user).toBeDefined();
    // Check session
    const { data: { user: loggedInUser } } = await supabase.auth.getUser();
    console.log('[Contractor row] User after login:', loggedInUser);
    expect(loggedInUser).toBeDefined();
    expect(loggedInUser?.email).toBe(uniqueEmail);
  });

  it('Login with no contractor row: should sign up, not insert contractor row, log in, and check session', async () => {
    const uniqueEmail = `nologincontractor_${uuidv4()}@test.com`;
    const password = 'TestPassword123!';
    // Sign up
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      //name: 'Test Contractor',
      email: uniqueEmail,
      password,
    });
    expect(signUpError).toBeNull();
    expect(signUpData.user).toBeDefined();
    // Do NOT insert contractor row
    // Log in
    const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
      email: uniqueEmail,
      password,
    });
    expect(loginError).toBeNull();
    expect(loginData.user).toBeDefined();
    // Check session
    const { data: { user: loggedInUser } } = await supabase.auth.getUser();
    console.log('[No contractor row] User after login:', loggedInUser);
    expect(loggedInUser).toBeDefined();
    expect(loggedInUser?.email).toBe(uniqueEmail);
  });
}); 