# Project Wizard - Contractor Hiring Platform

A comprehensive React TypeScript application for managing contractor hiring and project management with AI-assisted project creation and Supabase backend integration.

## 🚀 Quick Start

## Git Workflow (Terminal)

# 1. Sync with remote to get latest
git pull origin main

# 2. Create and switch to a feature branch
git checkout -b feature-branch
# OR: git switch -c feature-branch

# Work on your changes...

# 3. Stage changes
git add <file>        # or use: git add .

# 4. Commit your work
git commit -m "Describe your change clearly"

# 5. Push your branch to remote (first time)
git push -u origin feature-branch

# Once your feature is ready:
git checkout main
git pull

# Merge your feature and push
git merge feature-branch
git push origin main

# Optional: delete branch if merged
git branch -d feature-branch


### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account
- OpenAI API key

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd project-wizard

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
```

### Environment Configuration

Create a `.env` file in your project root:

```env
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# OpenAI Configuration (Frontend - for development only)
# Note: In production, this should be moved to a backend server for security
VITE_OPENAI_API_KEY=your_openai_api_key_here
```

### Database Setup

Run the following SQL in your Supabase SQL editor:

```sql
-- Projects table
CREATE TABLE projects (
  id SERIAL PRIMARY KEY,
  project_name TEXT NOT NULL,
  project_description TEXT,
  category TEXT[],
  duration TEXT,
  weekly_hours INTEGER,
  incentive TEXT[],
  contractor_roles JSONB,
  owner_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  email TEXT,
  full_name TEXT,
  role TEXT,
  business_name TEXT,
  business_website TEXT,
  industry TEXT,
  logo TEXT,
  description TEXT,
  completed_sign_up BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Contractor profiles
CREATE TABLE contractor (
  id SERIAL PRIMARY KEY,
  linkeduser UUID REFERENCES auth.users(id),
  skills TEXT[],
  interests TEXT[],
  resume TEXT,
  description TEXT,
  experience TEXT,
  degree TEXT,
  university TEXT,
  wam TEXT,
  year_of_degree TEXT,
  linkedin_link TEXT,
  type TEXT,
  woc_score INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Business profiles
CREATE TABLE business (
  id SERIAL PRIMARY KEY,
  linkeduser UUID REFERENCES auth.users(id),
  businessname TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Development

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linting
npm run lint
```

## 📁 Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── auth/            # Authentication components
│   ├── layout/          # Layout components (Header, etc.)
│   ├── ui/              # Base UI components (shadcn/ui)
│   └── wizard/          # Project wizard components
├── context/             # React Context providers
├── hooks/               # Custom React hooks
├── lib/                 # Utility libraries and API clients
├── pages/               # Page components
├── types/               # TypeScript type definitions
└── constants/           # Application constants
```

## 🔧 Core Technologies

- **Frontend**: React 18, TypeScript, Vite
- **UI Framework**: shadcn/ui with Radix UI primitives
- **Styling**: Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Auth + Real-time)
- **AI Integration**: OpenAI GPT-4 API
- **State Management**: React Context + React Query
- **Routing**: React Router DOM
- **Forms**: React Hook Form + Zod validation
- **Drag & Drop**: @hello-pangea/dnd

## 🏗️ Architecture Overview

### Authentication Flow
The application uses Supabase Auth with a custom `AuthContext` that manages:
- User authentication state
- Profile data synchronization
- Role-based access control (Business/Contractor)

### Project Creation Flow
1. **AI-Assisted Mode**: Uses OpenAI to generate project structure
2. **Manual Mode**: User creates project structure manually
3. **Wizard Steps**: Guided interface for project setup
4. **Database Sync**: Projects saved to Supabase

### Data Flow
```
User Input → OpenAI API → Project Context → Wizard Steps → Supabase Database
```

## 📚 API Documentation

### Authentication API

#### `useAuth()` Hook
Provides authentication state and methods.

```typescript
const { user, isAuthenticated, isLoading, login, signup, logout, updateProfile } = useAuth();
```

**Methods:**
- `login(email: string, password: string)`: Authenticate user
- `signup(email: string, password: string, userData: Partial<User>)`: Register new user
- `logout()`: Sign out user
- `updateProfile(data: Partial<User>)`: Update user profile

**State:**
- `user: User | null`: Current authenticated user
- `isAuthenticated: boolean`: Authentication status
- `isLoading: boolean`: Loading state

#### User Interface
```typescript
interface User {
  id: string;
  email: string | null;
  fullName: string | null;
  role: string | null;
  businessName: string | null;
  businessWebsite: string | null;
  industry: string | null;
  logo: string | null;
  description: string | null;
  completedSignUp: boolean | null;
  contractorProfile?: {
    skills: string[] | null;
    interests: string[] | null;
    resume: string | null;
    description: string | null;
  };
  businessProfile?: {
    name: string | null;
  };
}
```

### Project Wizard API

#### `useProjectWizard()` Hook
Manages project creation wizard state and AI integration.

```typescript
const { state, actions } = useProjectWizard();
```

**State Properties:**
- `currentMode: 'ai' | 'manual' | null`: Current wizard mode
- `currentStep: number`: Current step in wizard
- `aiContext: AIProjectData | null`: AI-generated project data
- `isProcessing: boolean`: AI processing state
- `lastError: string | null`: Last error message

**Actions:**
- `setMode(mode: ProjectWizardMode)`: Set wizard mode
- `setStep(step: number)`: Navigate to specific step
- `generateProjectWithAI(description: string)`: Generate project with OpenAI
- `completeProject()`: Save project to database
- `clearError()`: Clear error state

#### AI Project Data Structure
```typescript
interface AIProjectData {
  projectName: string;
  projectDescription: string;
  category?: string[];
  duration?: string;
  weeklyHours?: number;
  contractorRoles: ContractorRole[];
  rawDescription?: string;
}

interface ContractorRole {
  role: string;
  description: string;
  type: 'milestone' | 'timesheet';
  pay?: number;
  tasks?: Array<{
    name: string;
    description: string;
    deliverables: string;
    price: number;
  }>;
}
```

### OpenAI API

#### `generateProjectWithOpenAI(description: string)`
Generates structured project data from natural language description.

```typescript
import { generateProjectWithOpenAI, OpenAIError } from '@/lib/openai';

try {
  const projectData = await generateProjectWithOpenAI("Build a React e-commerce app");
  console.log(projectData.projectName); // "E-commerce React Application"
} catch (error) {
  if (error instanceof OpenAIError) {
    console.error('OpenAI Error:', error.message, error.status);
  }
}
```

**Error Handling:**
- `OpenAIError`: Custom error class with status codes and detailed messages
- Handles API key validation, rate limits, and parsing errors
- Provides debugging information for development

### Project Management API

#### `useCreateProject()` Hook
Manages project creation and database operations.

```typescript
const { createProject, loading, error } = useCreateProject();

const handleCreate = async () => {
  const project = await createProject({
    projectName: "My Project",
    projectDescription: "Project description"
  });
  
  if (project) {
    console.log('Project created:', project.id);
  }
};
```

## 🧩 Component Documentation

### Layout Components

#### `Header`
Main navigation component with user menu and project creation.

```typescript
import Header from '@/components/layout/Header';

<Header />
```

**Features:**
- User authentication status
- Navigation menu
- Project creation button
- User profile dropdown

### Wizard Components

#### `ModeSelection`
Allows users to choose between AI-assisted or manual project creation.

```typescript
import { ModeSelection } from '@/components/wizard/ModeSelection';

<ModeSelection />
```

#### `AiDescribeStep`
AI-powered project description input with OpenAI integration.

```typescript
import { AiDescribeStep } from '@/components/wizard/AiDescribeStep';

<AiDescribeStep />
```

**Features:**
- Natural language project description
- AI processing with loading states
- Error handling and display
- Suggestion prompts

#### `AiReviewProject`
Review and edit AI-generated project details.

```typescript
import { AiReviewProject } from '@/components/wizard/AiReviewProject';

<AiReviewProject />
```

#### `AiReviewRoles`
Manage contractor roles and tasks generated by AI.

```typescript
import { AiReviewRoles } from '@/components/wizard/AiReviewRoles';

<AiReviewRoles />
```

#### `AiTaskManager`
Create and manage project tasks and milestones.

```typescript
import { AiTaskManager } from '@/components/wizard/AiTaskManager';

<AiTaskManager />
```

#### `StepIndicator`
Visual progress indicator for wizard steps.

```typescript
import { StepIndicator } from '@/components/wizard/StepIndicator';

<StepIndicator currentStep={2} totalSteps={5} />
```

### Page Components

#### `Dashboard`
Main business dashboard for project management.

```typescript
import Dashboard from '@/pages/Dashboard';

<Dashboard />
```

**Features:**
- Project overview with drag-and-drop kanban
- Contractor management
- Task tracking
- Analytics and metrics

#### `ContractorDashboard`
Dashboard for contractors to view and manage their work.

```typescript
import ContractorDashboard from '@/pages/ContractorDashboard';

<ContractorDashboard />
```

#### `FindProjects`
Browse and search available projects.

```typescript
import FindProjects from '@/pages/FindProjects';

<FindProjects />
```

#### `ProjectDetail`
Detailed view of a specific project.

```typescript
import ProjectDetail from '@/pages/ProjectDetail';

<ProjectDetail />
```

#### `ProjectWizard`
Main project creation wizard page.

```typescript
import ProjectWizard from '@/pages/ProjectWizard';

<ProjectWizard />
```

## 🔄 State Management

### Context Providers

The application uses React Context for global state management:

1. **AuthProvider**: Manages authentication state
2. **ProjectWizardProvider**: Manages project creation wizard state
3. **QueryClientProvider**: Manages server state with React Query

### State Flow

```
User Action → Context Action → State Update → UI Re-render → Database Sync
```

## 🎨 UI Components

The application uses shadcn/ui components with Tailwind CSS styling:

### Available Components
- `Button`, `Card`, `Input`, `Select`
- `Dialog`, `Modal`, `Toast`
- `Tabs`, `Accordion`, `Badge`
- `Progress`, `Avatar`, `Dropdown`
- And many more...

### Usage Example
```typescript
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

<Card>
  <CardHeader>
    <CardTitle>Project Title</CardTitle>
  </CardHeader>
  <CardContent>
    <Button>Create Project</Button>
  </CardContent>
</Card>
```

## 🗄️ Database Schema

### Core Tables

#### `projects`
```sql
- id: SERIAL PRIMARY KEY
- project_name: TEXT NOT NULL
- project_description: TEXT
- category: TEXT[]
- duration: TEXT
- weekly_hours: INTEGER
- incentive: TEXT[]
- contractor_roles: JSONB
- owner_id: UUID REFERENCES auth.users(id)
- created_at: TIMESTAMP WITH TIME ZONE
- updated_at: TIMESTAMP WITH TIME ZONE
```

#### `users`
```sql
- id: UUID PRIMARY KEY REFERENCES auth.users(id)
- email: TEXT
- full_name: TEXT
- role: TEXT
- business_name: TEXT
- business_website: TEXT
- industry: TEXT
- logo: TEXT
- description: TEXT
- completed_sign_up: BOOLEAN
- created_at: TIMESTAMP WITH TIME ZONE
- updated_at: TIMESTAMP WITH TIME ZONE
```

#### `contractor`
```sql
- id: SERIAL PRIMARY KEY
- linkeduser: UUID REFERENCES auth.users(id)
- skills: TEXT[]
- interests: TEXT[]
- resume: TEXT
- description: TEXT
- experience: TEXT
- degree: TEXT
- university: TEXT
- wam: TEXT
- year_of_degree: TEXT
- linkedin_link: TEXT
- type: TEXT
- woc_score: INTEGER
- created_at: TIMESTAMP WITH TIME ZONE
```

## 🔒 Security Considerations

### Current Implementation (Development)
- OpenAI API key exposed in frontend (for development only)
- Supabase Row Level Security (RLS) should be configured
- Environment variables for sensitive data

### Production Recommendations
1. **Move OpenAI calls to backend server**
2. **Implement proper RLS policies**
3. **Add rate limiting**
4. **Validate all user inputs**
5. **Use HTTPS in production**

## 🧪 Testing

### Running Tests
```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage
```

### Test Structure
```
src/__tests__/
├── components/     # Component tests
├── hooks/         # Hook tests
├── utils/         # Utility tests
└── integration/   # Integration tests
```

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Environment Variables for Production
```env
VITE_SUPABASE_URL=your_production_supabase_url
VITE_SUPABASE_ANON_KEY=your_production_supabase_anon_key
# Remove OpenAI key from frontend in production
```

### Deployment Platforms
- **Vercel**: Recommended for React apps
- **Netlify**: Alternative with good CI/CD
- **AWS S3 + CloudFront**: For custom hosting

## 🐛 Troubleshooting

### Common Issues

#### OpenAI API Errors
- **401 Unauthorized**: Check API key in `.env`
- **429 Rate Limited**: Wait and retry
- **Parse Errors**: Check console for raw AI response

#### Supabase Connection Issues
- **Authentication Errors**: Verify Supabase URL and keys
- **RLS Policy Errors**: Check database policies
- **Real-time Issues**: Verify WebSocket connections

#### Build Errors
- **TypeScript Errors**: Run `npm run lint` to identify issues
- **Missing Dependencies**: Run `npm install`
- **Environment Variables**: Ensure all required vars are set

### Debug Mode
Enable detailed logging by checking browser console for:
- API request/response details
- Error stack traces
- State changes and context updates
- Database operation logs

## 📈 Performance Optimization

### Current Optimizations
- React Query for server state caching
- Lazy loading of components
- Optimized bundle splitting with Vite
- Tailwind CSS purging

### Recommended Improvements
1. **Implement React.memo** for expensive components
2. **Add Suspense boundaries** for better loading states
3. **Optimize images** with next-gen formats
4. **Implement service worker** for offline support

## 🤝 Contributing

### Development Workflow
1. Create feature branch from `main`
2. Implement changes with tests
3. Run linting and tests
4. Submit pull request
5. Code review and merge

### Code Standards
- TypeScript strict mode
- ESLint configuration
- Prettier formatting
- Conventional commits

## 📞 Support

For technical support or questions:
- Check the troubleshooting section
- Review console logs for errors
- Consult Supabase and OpenAI documentation
- Create an issue in the repository

---

**Note**: This documentation is comprehensive and should help your cofounder understand the entire codebase structure, APIs, and usage patterns. The application is a full-featured contractor hiring platform with AI-assisted project creation capabilities.
