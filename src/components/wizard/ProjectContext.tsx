import React, { createContext, useContext, useReducer, useEffect, ReactNode, Dispatch } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { generateProjectWithOpenAI, OpenAIError } from '@/lib/openai';

// --- Types ---
export type ProjectWizardMode = 'ai' | 'manual' | null;
export interface ProjectWizardState {
  currentMode: ProjectWizardMode;
  currentStep: number;
  aiContext: any;
  manualContext: any;
  isProcessing: boolean;
  openaiResponse: any; // Store OpenAI API response
  isCompleting: boolean; // Track completion state
  lastError: string | null; // Store last error message for display
}
export interface ProjectWizardActions {
  setMode: (mode: ProjectWizardMode) => void;
  setStep: (step: number) => void;
  updateAiContext: (data: any) => void;
  updateManualContext: (data: any) => void;
  resetAi: () => void;
  resetManual: () => void;
  setProcessing: (processing: boolean) => void;
  resetAll: () => void;
  // New OpenAI and Supabase actions
  generateProjectWithAI: (description: string) => Promise<void>;
  completeProject: () => Promise<void>;
  setOpenAIResponse: (response: any) => void;
  setCompleting: (completing: boolean) => void;
  clearError: () => void; // Clear error state
}
export interface ProjectWizardContextType {
  state: ProjectWizardState;
  actions: ProjectWizardActions;
}

const initialState: ProjectWizardState = {
  currentMode: null,
  currentStep: 0,
  aiContext: null,
  manualContext: null,
  isProcessing: false,
  openaiResponse: null,
  isCompleting: false,
  lastError: null
};

const ProjectWizardContext = createContext<ProjectWizardContextType | undefined>(undefined);

function projectReducer(state: ProjectWizardState, action: any): ProjectWizardState {
  switch (action.type) {
    case 'SET_MODE':
      return {
        ...state,
        currentMode: action.payload,
        currentStep: action.payload ? 1 : 0,
        lastError: null // Clear errors when starting new mode
      };
    case 'SET_STEP':
      return {
        ...state,
        currentStep: action.payload
      };
    case 'UPDATE_AI_CONTEXT':
      return {
        ...state,
        aiContext: {
          ...state.aiContext,
          ...action.payload
        }
      };
    case 'UPDATE_MANUAL_CONTEXT':
      return {
        ...state,
        manualContext: {
          ...state.manualContext,
          ...action.payload
        }
      };
    case 'RESET_AI':
      return {
        ...state,
        aiContext: null,
        openaiResponse: null,
        lastError: null,
        currentStep: state.currentMode === 'ai' ? 1 : state.currentStep
      };
    case 'RESET_MANUAL':
      return {
        ...state,
        manualContext: null,
        currentStep: state.currentMode === 'manual' ? 1 : state.currentStep
      };
    case 'SET_PROCESSING':
      return {
        ...state,
        isProcessing: action.payload
      };
    case 'SET_OPENAI_RESPONSE':
      return {
        ...state,
        openaiResponse: action.payload,
        lastError: null // Clear errors on successful response
      };
    case 'SET_COMPLETING':
      return {
        ...state,
        isCompleting: action.payload
      };
    case 'SET_ERROR':
      return {
        ...state,
        lastError: action.payload
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        lastError: null
      };
    case 'RESET_ALL':
      return {
        ...initialState
      };
    default:
      return state;
  }
}

// Supabase sync function
const syncToSupabase = async (projectData: any, ownerId: string) => {
  if (!supabase) {
    throw new Error('Supabase client not configured');
  }

  try {
    const { data, error } = await supabase
      .from('projects')
      .insert([{
        project_name: projectData.projectName,
        project_description: projectData.projectDescription,
        owner_id: ownerId,
      }])
      .select();

    if (error) {
      console.error('Supabase insert error:', error);
      throw new Error(`Database error: ${error.message}`);
    }

    return data;
  } catch (error) {
    console.error('Supabase sync failed:', error);
    throw error;
  }
};

export function ProjectWizardProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(projectReducer, initialState, (initial) => {
    try {
      const saved = localStorage.getItem('projectWizardState');
      return saved ? { ...initial, ...JSON.parse(saved) } : initial;
    } catch {
      return initial;
    }
  });

  useEffect(() => {
    localStorage.setItem('projectWizardState', JSON.stringify(state));
  }, [state]);

  const actions: ProjectWizardActions = {
    setMode: (mode) => dispatch({ type: 'SET_MODE', payload: mode }),
    setStep: (step) => dispatch({ type: 'SET_STEP', payload: step }),
    updateAiContext: (data) => dispatch({ type: 'UPDATE_AI_CONTEXT', payload: data }),
    updateManualContext: (data) => dispatch({ type: 'UPDATE_MANUAL_CONTEXT', payload: data }),
    resetAi: () => dispatch({ type: 'RESET_AI' }),
    resetManual: () => dispatch({ type: 'RESET_MANUAL' }),
    setProcessing: (processing) => dispatch({ type: 'SET_PROCESSING', payload: processing }),
    setOpenAIResponse: (response) => dispatch({ type: 'SET_OPENAI_RESPONSE', payload: response }),
    setCompleting: (completing) => dispatch({ type: 'SET_COMPLETING', payload: completing }),
    clearError: () => dispatch({ type: 'CLEAR_ERROR' }),
    resetAll: () => {
      localStorage.removeItem('projectWizardState');
      dispatch({ type: 'RESET_ALL' });
    },
    // OpenAI project generation with improved error handling
    generateProjectWithAI: async (description: string) => {
      dispatch({ type: 'SET_PROCESSING', payload: true });
      dispatch({ type: 'CLEAR_ERROR' }); // Clear any previous errors
      
      try {
        console.log('Starting AI project generation...');
        const aiResponse = await generateProjectWithOpenAI(description);
        
        console.log('AI generation successful:', aiResponse);
        dispatch({ type: 'SET_OPENAI_RESPONSE', payload: aiResponse });
        dispatch({ type: 'UPDATE_AI_CONTEXT', payload: {
          rawDescription: description,
          ...aiResponse,
          currentStep: 'review-project'
        }});
        dispatch({ type: 'SET_STEP', payload: 2 });
        
      } catch (error) {
        console.error('AI generation failed:', error);
        
        // Handle OpenAI-specific errors with detailed messages
        if (error instanceof OpenAIError) {
          const errorMessage = `OpenAI Error (${error.code || 'UNKNOWN'}): ${error.message}`;
          console.error('OpenAI Error Details:', {
            message: error.message,
            status: error.status,
            code: error.code,
            type: error.type
          });
          dispatch({ type: 'SET_ERROR', payload: errorMessage });
        } else {
          const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
          dispatch({ type: 'SET_ERROR', payload: `AI Analysis Failed: ${errorMessage}` });
        }
        
        throw error; // Re-throw to allow component-level handling
      } finally {
        dispatch({ type: 'SET_PROCESSING', payload: false });
      }
    },
    // Complete project and sync to Supabase
    completeProject: async () => {
      dispatch({ type: 'SET_COMPLETING', payload: true });
      try {
        const projectData = state.aiContext;
        if (!projectData) {
          throw new Error('No project data to complete');
        }

        // Get the current user
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError || !user) {
          throw new Error('User not authenticated');
        }

        const finalProjectData = {
          projectName: projectData.projectName,
          projectDescription: projectData.projectDescription,
        };

        // Sync to Supabase (only allowed fields)
        await syncToSupabase(finalProjectData, user.id);

        // Success feedback
        alert('🎉 Project launched successfully and saved to database!');
        console.log('Final Project Data:', JSON.stringify(finalProjectData, null, 2));

        // Reset wizard
        dispatch({ type: 'RESET_ALL' });
      } catch (error) {
        console.error('Project completion failed:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        alert(`❌ Error completing project: ${errorMessage}`);
        throw error;
      } finally {
        dispatch({ type: 'SET_COMPLETING', payload: false });
      }
    }
  };

  return (
    <ProjectWizardContext.Provider value={{ state, actions }}>
      {children}
    </ProjectWizardContext.Provider>
  );
}

export function useProjectWizard(): ProjectWizardContextType {
  const context = useContext(ProjectWizardContext);
  if (!context) {
    throw new Error('useProjectWizard must be used within ProjectWizardProvider');
  }
  return context;
}

export { ProjectWizardContext };