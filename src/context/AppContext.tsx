import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { 
  Project, 
  ContractorRole, 
  Task, 
  Contractor, 
  Application, 
  ComplianceChecklist, 
  Timesheet, 
  Payment,
  ProjectState,
  TaskStatus,
  ApplicationStatus,
  TimesheetStatus,
  ComplianceOverallStatus
} from '@/types/entities';
import { 
  mockProjects, 
  mockContractors, 
  mockApplications, 
  mockComplianceChecklists, 
  mockTimesheets, 
  mockPayments 
} from '@/lib/mock-data';

// State interface
interface AppState {
  projects: Project[];
  contractors: Contractor[];
  applications: Application[];
  complianceChecklists: ComplianceChecklist[];
  timesheets: Timesheet[];
  payments: Payment[];
  currentUser: {
    id: string;
    name: string;
    role: 'admin' | 'manager' | 'contractor';
  };
}

// Action types
type AppAction =
  | { type: 'CREATE_PROJECT'; payload: Omit<Project, 'id' | 'createdAt' | 'updatedAt'> }
  | { type: 'UPDATE_PROJECT'; payload: { id: string; updates: Partial<Project> } }
  | { type: 'DELETE_PROJECT'; payload: { id: string } }
  | { type: 'PUBLISH_PROJECT'; payload: { id: string } }
  | { type: 'CREATE_ROLE'; payload: Omit<ContractorRole, 'id'> }
  | { type: 'UPDATE_ROLE'; payload: { id: string; updates: Partial<ContractorRole> } }
  | { type: 'DELETE_ROLE'; payload: { id: string } }
  | { type: 'CREATE_TASK'; payload: Omit<Task, 'id' | 'createdAt' | 'updatedAt'> }
  | { type: 'ADD_TASK'; payload: Task }
  | { type: 'ADD_PAYMENT'; payload: Payment }
  | { type: 'UPDATE_TIMESHEET_STATUS'; payload: { id: string; status: TimesheetStatus } }
  | { type: 'UPDATE_TASK'; payload: { id: string; updates: Partial<Task> } }
  | { type: 'DELETE_TASK'; payload: { id: string } }
  | { type: 'UPDATE_TASK_STATUS'; payload: { id: string; status: TaskStatus } }
  | { type: 'REORDER_TASKS'; payload: { roleId: string; taskIds: string[] } }
  | { type: 'CREATE_APPLICATION'; payload: Omit<Application, 'id' | 'submittedAt'> }
  | { type: 'UPDATE_APPLICATION'; payload: { id: string; updates: Partial<Application> } }
  | { type: 'CREATE_CONTRACTOR'; payload: Omit<Contractor, 'id' | 'createdAt' | 'updatedAt'> }
  | { type: 'UPDATE_CONTRACTOR'; payload: { id: string; updates: Partial<Contractor> } }
  | { type: 'UPDATE_COMPLIANCE'; payload: { contractorId: string; roleId: string; updates: Partial<ComplianceChecklist> } }
  | { type: 'CREATE_TIMESHEET'; payload: Omit<Timesheet, 'id'> }
  | { type: 'UPDATE_TIMESHEET'; payload: { id: string; updates: Partial<Timesheet> } }
  | { type: 'CREATE_PAYMENT'; payload: Omit<Payment, 'id' | 'createdAt'> }
  | { type: 'UPDATE_PAYMENT'; payload: { id: string; updates: Partial<Payment> } }
  | { type: 'ASSIGN_CONTRACTOR'; payload: { roleId: string; contractorId: string } };

// Initial state
const initialState: AppState = {
  projects: mockProjects,
  contractors: mockContractors,
  applications: mockApplications,
  complianceChecklists: mockComplianceChecklists,
  timesheets: mockTimesheets,
  payments: mockPayments,
  currentUser: {
    id: 'admin-1',
    name: 'John Smith',
    role: 'admin'
  }
};

// Reducer function
function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'CREATE_PROJECT': {
      const newProject: Project = {
        ...action.payload,
        id: `project-${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      return {
        ...state,
        projects: [...state.projects, newProject]
      };
    }

    case 'UPDATE_PROJECT': {
      return {
        ...state,
        projects: state.projects.map(project =>
          project.id === action.payload.id
            ? { ...project, ...action.payload.updates, updatedAt: new Date().toISOString() }
            : project
        )
      };
    }

    case 'DELETE_PROJECT': {
      return {
        ...state,
        projects: state.projects.filter(project => project.id !== action.payload.id)
      };
    }

    case 'PUBLISH_PROJECT': {
      return {
        ...state,
        projects: state.projects.map(project =>
          project.id === action.payload.id
            ? { ...project, state: 'Published' as ProjectState, updatedAt: new Date().toISOString() }
            : project
        )
      };
    }

    case 'CREATE_ROLE': {
      const newRole: ContractorRole = {
        ...action.payload,
        id: `role-${Date.now()}`,
      };
      
      return {
        ...state,
        projects: state.projects.map(project =>
          project.id === action.payload.projectId
            ? { 
                ...project, 
                roles: [...project.roles, newRole],
                updatedAt: new Date().toISOString()
              }
            : project
        )
      };
    }

    case 'UPDATE_ROLE': {
      return {
        ...state,
        projects: state.projects.map(project => ({
          ...project,
          roles: project.roles.map(role =>
            role.id === action.payload.id
              ? { ...role, ...action.payload.updates }
              : role
          )
        }))
      };
    }

    case 'CREATE_TASK': {
      const newTask: Task = {
        ...action.payload,
        id: `task-${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      return {
        ...state,
        projects: state.projects.map(project => ({
          ...project,
          roles: project.roles.map(role =>
            role.id === action.payload.roleId && role.tasks
              ? { ...role, tasks: [...role.tasks, newTask] }
              : role
          )
        }))
      };
    }

    case 'UPDATE_TASK': {
      return {
        ...state,
        projects: state.projects.map(project => ({
          ...project,
          roles: project.roles.map(role => ({
            ...role,
            tasks: role.tasks?.map(task =>
              task.id === action.payload.id
                ? { ...task, ...action.payload.updates, updatedAt: new Date().toISOString() }
                : task
            )
          }))
        }))
      };
    }

    case 'UPDATE_TASK_STATUS': {
      return {
        ...state,
        projects: state.projects.map(project => ({
          ...project,
          roles: project.roles.map(role => ({
            ...role,
            tasks: role.tasks?.map(task =>
              task.id === action.payload.id
                ? { ...task, status: action.payload.status, updatedAt: new Date().toISOString() }
                : task
            )
          }))
        }))
      };
    }

    case 'CREATE_APPLICATION': {
      const newApplication: Application = {
        ...action.payload,
        id: `app-${Date.now()}`,
        submittedAt: new Date().toISOString(),
      };

      return {
        ...state,
        applications: [...state.applications, newApplication]
      };
    }

    case 'UPDATE_APPLICATION': {
      return {
        ...state,
        applications: state.applications.map(app =>
          app.id === action.payload.id
            ? { ...app, ...action.payload.updates }
            : app
        )
      };
    }

    case 'ASSIGN_CONTRACTOR': {
      return {
        ...state,
        projects: state.projects.map(project => ({
          ...project,
          roles: project.roles.map(role =>
            role.id === action.payload.roleId
              ? { ...role, assignedContractor: action.payload.contractorId }
              : role
          ),
          state: project.roles.some(role => role.id === action.payload.roleId) 
            ? 'Active' as ProjectState 
            : project.state
        }))
      };
    }

    case 'UPDATE_COMPLIANCE': {
      return {
        ...state,
        complianceChecklists: state.complianceChecklists.map(checklist =>
          checklist.contractorId === action.payload.contractorId && 
          checklist.roleId === action.payload.roleId
            ? { ...checklist, ...action.payload.updates }
            : checklist
        )
      };
    }

    case 'CREATE_TIMESHEET': {
      const newTimesheet: Timesheet = {
        ...action.payload,
        id: `timesheet-${Date.now()}`,
      };

      return {
        ...state,
        timesheets: [...state.timesheets, newTimesheet]
      };
    }

    case 'UPDATE_TIMESHEET': {
      return {
        ...state,
        timesheets: state.timesheets.map(timesheet =>
          timesheet.id === action.payload.id
            ? { ...timesheet, ...action.payload.updates }
            : timesheet
        )
      };
    }

    case 'CREATE_PAYMENT': {
      const newPayment: Payment = {
        ...action.payload,
        id: `payment-${Date.now()}`,
        createdAt: new Date().toISOString(),
      };

      return {
        ...state,
        payments: [...state.payments, newPayment]
      };
    }

    case 'ADD_TASK': {
      return {
        ...state,
        projects: state.projects.map(project => ({
          ...project,
          roles: project.roles.map(role =>
            role.id === action.payload.roleId && role.tasks
              ? { ...role, tasks: [...role.tasks, action.payload] }
              : role
          )
        }))
      };
    }

    case 'ADD_PAYMENT': {
      return {
        ...state,
        payments: [...state.payments, action.payload]
      };
    }

    case 'UPDATE_TIMESHEET_STATUS': {
      return {
        ...state,
        timesheets: state.timesheets.map(timesheet =>
          timesheet.id === action.payload.id
            ? { ...timesheet, status: action.payload.status }
            : timesheet
        )
      };
    }

    default:
      return state;
  }
}

// Context
const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
} | null>(null);

// Provider component
export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

// Custom hook
export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}