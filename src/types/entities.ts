// Core entity types based on the data model documentation

export type ProjectState = 'Draft' | 'Published' | 'Active' | 'Completed';
export type RoleType = 'Milestone' | 'Timesheet';
export type TaskStatus = 'Pending' | 'Submitted' | 'Completed' | 'Accepted';
export type ApplicationStatus = 'Submitted' | 'Reviewed' | 'Rejected' | 'Offered' | 'Accepted';
export type TimesheetStatus = 'Pending Approval' | 'Approved' | 'Rejected';
export type PaymentStatus = 'Pending' | 'Paid' | 'Blocked';
export type ComplianceItemStatus = 'Incomplete' | 'Pending Review' | 'Complete';
export type ComplianceOverallStatus = 'incomplete' | 'awaiting_review' | 'complete';

export interface Project {
  id: string;
  title: string;
  description: string;
  state: ProjectState;
  roles: ContractorRole[];
  createdAt: string;
  updatedAt: string;
  createdBy: string; // admin/business user
}

export interface ContractorRole {
  id: string;
  projectId: string;
  name: string; // alias for roleName
  roleName: string;
  description: string;
  type: RoleType; // alias for roleType
  roleType: RoleType;
  payRate: number; // hourly rate or default per-milestone
  assignedContractor?: string; // Contractor ID
  complianceStatus: ComplianceOverallStatus;
  status: 'open' | 'assigned'; // New status field
  applications: Application[];
  tasks?: Task[]; // only for Milestone roles
  position: number; // for ordering
}

export interface Task {
  id: string;
  roleId: string;
  name: string;
  description: string;
  deliverables: string;
  price: number;
  status: TaskStatus;
  labels: string[];
  files: FileAttachment[];
  position: number; // for ordering
  createdAt: string;
  updatedAt: string;
}

export interface Contractor {
  id: string;
  // Flattened properties for easier access
  name: string;
  email: string;
  phone?: string;
  location?: string;
  profilePicture?: string;
  portfolioUrl?: string;
  profileDetails: {
    name: string;
    email: string;
    phone: string;
    portfolio: string;
  };
  complianceData: {
    // For independent contractors
    abn?: string; // 11-digit Australian Business Number
    
    // For employees
    tfn?: string; // 9-digit Tax File Number
    
    // Required for all
    bankDetails?: {
      accountName: string;
      bsb: string; // 6 digits
      accountNumber: string; // up to 9 digits
    };
    
    superannuationDetails?: {
      fundName: string;
      usi: string; // Unique Superannuation Identifier
      memberNumber: string;
    };
    
    workRights?: {
      documentType: 'passport' | 'birth_certificate' | 'visa';
      documentNumber: string;
      expiryDate?: string;
      vevoCheckResult?: string;
    };
    
    signedContract?: FileAttachment;
    fairWorkAcknowledgment: boolean;
  };
  applications: Application[];
  createdAt: string;
  updatedAt: string;
}

export interface Application {
  id: string;
  contractorId: string;
  roleId: string;
  coverLetter: string;
  status: ApplicationStatus;
  submittedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
}

export interface Offer {
  id: string;
  applicationId: string;
  payTerms: string;
  startDate: string;
  contractFile: FileAttachment;
  expiryDate?: string;
  createdAt: string;
  acceptedAt?: string;
}

export interface Timesheet {
  id: string;
  roleId: string;
  contractorId: string;
  periodStart: string;
  periodEnd: string;
  entries: TimesheetEntry[];
  status: TimesheetStatus;
  approvedBy?: string;
  approvedAt?: string;
  comments?: string;
  notes?: string;
}

export interface TimesheetEntry {
  date: string;
  hours: number;
  description?: string;
}

export interface Payment {
  id: string;
  contractorId: string;
  roleId: string;
  taskId?: string; // for milestone payments
  timesheetId?: string; // for timesheet payments
  amount: number;
  currency: string; // default 'AUD'
  status: PaymentStatus;
  paymentDate?: string;
  payrooTransactionId?: string;
  auditLog: PaymentAuditEntry[];
  createdAt: string;
}

export interface PaymentAuditEntry {
  action: string;
  timestamp: string;
  userId: string;
  details: Record<string, any>;
}

export interface ComplianceChecklist {
  contractorId: string;
  roleId: string;
  // Flattened properties for easier access  
  abnTfnStatus: ComplianceItemStatus;
  bankDetailsStatus: ComplianceItemStatus;
  superDetailsStatus: ComplianceItemStatus;
  workRightsStatus: ComplianceItemStatus;
  contractStatus: ComplianceItemStatus;
  fairWorkStatus: ComplianceItemStatus;
  items: {
    abnOrTfn: ComplianceItemStatus;
    bankDetails: ComplianceItemStatus;
    superannuation: ComplianceItemStatus | 'not_applicable';
    workRights: ComplianceItemStatus;
    signedContract: ComplianceItemStatus;
    fairWorkAcknowledgment: ComplianceItemStatus;
  };
  overallStatus: ComplianceOverallStatus;
  completedAt?: string;
}

export interface AuditLog {
  id: string;
  userId: string;
  action: string;
  entityType: string;
  entityId: string;
  details: Record<string, any>;
  timestamp: string;
  ipAddress?: string;
}

export interface FileAttachment {
  id: string;
  filename: string;
  mimeType: string;
  size: number;
  storageUrl: string;
  uploadedBy: string;
  uploadedAt: string;
  entityType: string;
  entityId: string;
}