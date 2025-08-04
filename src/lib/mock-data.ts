// Mock data for development and testing
import { Project, Contractor, Application, ContractorRole, Task, ComplianceChecklist, Timesheet, Payment } from '@/types/entities';

export const mockContractors: Contractor[] = [
  {
    id: 'contractor-1',
    name: 'Sarah Chen',
    email: 'sarah.chen@example.com',
    phone: '+61 400 123 456',
    location: 'Sydney, NSW',
    profilePicture: 'https://images.unsplash.com/photo-1494790108755-2616b612e1aa?w=400',
    portfolioUrl: 'https://sarahchen.portfolio.com',
    profileDetails: {
      name: 'Sarah Chen',
      email: 'sarah.chen@example.com',
      phone: '+61 400 123 456',
      portfolio: 'https://sarahchen.portfolio.com'
    },
    complianceData: {
      abn: '12345678901',
      bankDetails: {
        accountName: 'Sarah Chen',
        bsb: '123456',
        accountNumber: '987654321'
      },
      superannuationDetails: {
        fundName: 'AustralianSuper',
        usi: 'ASF0001AU',
        memberNumber: 'MS123456789'
      },
      workRights: {
        documentType: 'passport',
        documentNumber: 'N1234567',
        expiryDate: '2030-12-31'
      },
      fairWorkAcknowledgment: true
    },
    applications: [],
    createdAt: '2024-01-15T09:00:00Z',
    updatedAt: '2024-01-15T09:00:00Z'
  },
  {
    id: 'contractor-2',
    name: 'Marcus Rodriguez',
    email: 'marcus.r@example.com',
    phone: '+61 400 765 432',
    location: 'Melbourne, VIC',
    profilePicture: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
    portfolioUrl: 'https://marcusdev.com',
    profileDetails: {
      name: 'Marcus Rodriguez',
      email: 'marcus.r@example.com',
      phone: '+61 400 765 432',
      portfolio: 'https://marcusdev.com'
    },
    complianceData: {
      tfn: '123456789',
      bankDetails: {
        accountName: 'Marcus Rodriguez',
        bsb: '654321',
        accountNumber: '123456789'
      },
      superannuationDetails: {
        fundName: 'REST Super',
        usi: 'RSE0001AU',
        memberNumber: 'RS987654321'
      },
      workRights: {
        documentType: 'birth_certificate',
        documentNumber: 'BC987654'
      },
      fairWorkAcknowledgment: true
    },
    applications: [],
    createdAt: '2024-01-20T14:30:00Z',
    updatedAt: '2024-01-20T14:30:00Z'
  }
];

export const mockTasks: Task[] = [
  {
    id: 'task-1',
    roleId: 'role-1',
    name: 'User Authentication System',
    description: 'Implement secure user authentication with JWT tokens',
    deliverables: 'Login/signup components, JWT middleware, password reset functionality',
    price: 2500,
    status: 'Pending',
    labels: ['backend', 'security'],
    files: [],
    position: 0,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z'
  },
  {
    id: 'task-2',
    roleId: 'role-1',
    name: 'Database Schema Design',
    description: 'Design and implement the core database schema',
    deliverables: 'ERD diagrams, migration scripts, seed data',
    price: 1800,
    status: 'Submitted',
    labels: ['database', 'design'],
    files: [],
    position: 1,
    createdAt: '2024-01-16T11:00:00Z',
    updatedAt: '2024-01-25T15:30:00Z'
  },
  {
    id: 'task-3',
    roleId: 'role-1',
    name: 'API Integration',
    description: 'Integrate with third-party payment APIs',
    deliverables: 'API endpoints, error handling, documentation',
    price: 3200,
    status: 'Completed',
    labels: ['api', 'integration'],
    files: [],
    position: 2,
    createdAt: '2024-01-18T09:30:00Z',
    updatedAt: '2024-01-30T16:45:00Z'
  }
];

export const mockRoles: ContractorRole[] = [
  {
    id: 'role-1',
    projectId: 'project-1',
    name: 'Senior Full-Stack Developer',
    roleName: 'Senior Full-Stack Developer',
    description: 'Lead developer responsible for backend architecture and API development',
    type: 'Milestone',
    roleType: 'Milestone',
    payRate: 2500,
    assignedContractor: 'contractor-1',
    complianceStatus: 'complete',
    status: 'assigned',
    applications: [],
    tasks: mockTasks.filter(task => task.roleId === 'role-1'),
    position: 0
  },
  {
    id: 'role-2',
    projectId: 'project-1',
    name: 'UI/UX Designer',
    roleName: 'UI/UX Designer',
    description: 'Design user interfaces and user experience flows',
    type: 'Timesheet',
    roleType: 'Timesheet',
    payRate: 85,
    assignedContractor: 'contractor-2',
    complianceStatus: 'awaiting_review',
    status: 'assigned',
    applications: [],
    position: 1
  },
  {
    id: 'role-3',
    projectId: 'project-2',
    name: 'Frontend Developer',
    roleName: 'Frontend Developer',
    description: 'React developer for client-side development',
    type: 'Milestone',
    roleType: 'Milestone',
    payRate: 2000,
    complianceStatus: 'incomplete',
    status: 'open',
    applications: [],
    tasks: [],
    position: 0
  }
];

export const mockProjects: Project[] = [
  {
    id: 'project-1',
    title: 'E-commerce Platform Rebuild',
    description: 'Complete rebuild of legacy e-commerce platform with modern technologies',
    state: 'Active',
    roles: mockRoles.filter(role => role.projectId === 'project-1'),
    createdAt: '2024-01-10T08:00:00Z',
    updatedAt: '2024-01-15T12:30:00Z',
    createdBy: 'admin-1'
  },
  {
    id: 'project-2',
    title: 'Mobile App Development',
    description: 'React Native mobile app for customer engagement',
    state: 'Published',
    roles: mockRoles.filter(role => role.projectId === 'project-2'),
    createdAt: '2024-01-12T10:15:00Z',
    updatedAt: '2024-01-20T14:45:00Z',
    createdBy: 'admin-1'
  },
  {
    id: 'project-3',
    title: 'Data Analytics Dashboard',
    description: 'Business intelligence dashboard for sales analytics',
    state: 'Draft',
    roles: [],
    createdAt: '2024-01-25T09:30:00Z',
    updatedAt: '2024-01-25T09:30:00Z',
    createdBy: 'admin-1'
  },
  {
    id: 'project-4',
    title: 'Legacy System Migration',
    description: 'Migration from legacy systems to cloud-based infrastructure',
    state: 'Completed',
    roles: [],
    createdAt: '2023-11-01T08:00:00Z',
    updatedAt: '2023-12-15T17:00:00Z',
    createdBy: 'admin-1'
  }
];

export const mockApplications: Application[] = [
  {
    id: 'app-1',
    contractorId: 'contractor-1',
    roleId: 'role-3',
    coverLetter: 'I am very interested in this frontend development role. I have 5+ years of React experience and have worked on similar e-commerce projects.',
    status: 'Submitted',
    submittedAt: '2024-01-22T10:30:00Z'
  },
  {
    id: 'app-2',
    contractorId: 'contractor-2',
    roleId: 'role-3',
    coverLetter: 'Hello! I\'d love to contribute to this project. My background in both design and frontend development makes me a great fit.',
    status: 'Reviewed',
    submittedAt: '2024-01-23T14:15:00Z',
    reviewedAt: '2024-01-24T09:00:00Z',
    reviewedBy: 'admin-1'
  }
];

export const mockComplianceChecklists: ComplianceChecklist[] = [
  {
    contractorId: 'contractor-1',
    roleId: 'role-1',
    abnTfnStatus: 'Complete',
    bankDetailsStatus: 'Complete',
    superDetailsStatus: 'Complete',
    workRightsStatus: 'Complete',
    contractStatus: 'Complete',
    fairWorkStatus: 'Complete',
    items: {
      abnOrTfn: 'Complete',
      bankDetails: 'Complete',
      superannuation: 'Complete',
      workRights: 'Complete',
      signedContract: 'Complete',
      fairWorkAcknowledgment: 'Complete'
    },
    overallStatus: 'complete',
    completedAt: '2024-01-20T16:00:00Z'
  },
  {
    contractorId: 'contractor-2',
    roleId: 'role-2',
    abnTfnStatus: 'Complete',
    bankDetailsStatus: 'Complete',
    superDetailsStatus: 'Complete',
    workRightsStatus: 'Complete',
    contractStatus: 'Pending Review',
    fairWorkStatus: 'Complete',
    items: {
      abnOrTfn: 'Complete',
      bankDetails: 'Complete',
      superannuation: 'Complete',
      workRights: 'Complete',
      signedContract: 'Pending Review',
      fairWorkAcknowledgment: 'Complete'
    },
    overallStatus: 'awaiting_review'
  }
];

export const mockTimesheets: Timesheet[] = [
  {
    id: 'timesheet-1',
    roleId: 'role-2',
    contractorId: 'contractor-2',
    periodStart: '2024-01-22',
    periodEnd: '2024-01-28',
    entries: [
      { date: '2024-01-22', hours: 8, description: 'User interface wireframes' },
      { date: '2024-01-23', hours: 7.5, description: 'Prototype development' },
      { date: '2024-01-24', hours: 8, description: 'Design system creation' },
      { date: '2024-01-25', hours: 6, description: 'User testing preparation' }
    ],
    status: 'Pending Approval',
    comments: 'Focused on core user flows this week'
  }
];

export const mockPayments: Payment[] = [
  {
    id: 'payment-1',
    contractorId: 'contractor-1',
    roleId: 'role-1',
    taskId: 'task-3',
    amount: 3200,
    currency: 'AUD',
    status: 'Paid',
    paymentDate: '2024-01-31T10:00:00Z',
    payrooTransactionId: 'PRO_TX_123456',
    auditLog: [
      {
        action: 'payment_initiated',
        timestamp: '2024-01-31T09:45:00Z',
        userId: 'admin-1',
        details: { amount: 3200, task: 'task-3' }
      },
      {
        action: 'payment_completed',
        timestamp: '2024-01-31T10:00:00Z',
        userId: 'system',
        details: { transactionId: 'PRO_TX_123456' }
      }
    ],
    createdAt: '2024-01-31T09:45:00Z'
  }
];