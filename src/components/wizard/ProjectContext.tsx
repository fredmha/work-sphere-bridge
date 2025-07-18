import React, { createContext, useContext, useReducer, useEffect, ReactNode, Dispatch } from 'react';

// --- Types ---
export type ProjectWizardMode = 'ai' | 'manual' | null;
export interface ProjectWizardState {
  currentMode: ProjectWizardMode;
  currentStep: number;
  aiContext: any;
  manualContext: any;
  isProcessing: boolean;
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
  isProcessing: false
};

const ProjectWizardContext = createContext<ProjectWizardContextType | undefined>(undefined);

function projectReducer(state: ProjectWizardState, action: any): ProjectWizardState {
  switch (action.type) {
    case 'SET_MODE':
      return {
        ...state,
        currentMode: action.payload,
        currentStep: action.payload ? 1 : 0
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
    case 'RESET_ALL':
      return {
        ...initialState
      };
    default:
      return state;
  }
}

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
    resetAll: () => {
      localStorage.removeItem('projectWizardState');
      dispatch({ type: 'RESET_ALL' });
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