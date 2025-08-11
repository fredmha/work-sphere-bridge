// Application Tracking System (ATS) Type Definitions

export type ApplicationStatus = 
  | 'pending'
  | 'interview_scheduled'
  | 'interviewed'
  | 'offered'
  | 'accepted'
  | 'rejected'
  | 'contracted';

export type InterviewType = 'phone' | 'video' | 'in_person';
export type InterviewStatus = 'scheduled' | 'completed' | 'cancelled' | 'no_show';
export type ScoreType = 'ai_initial' | 'manual_override' | 'interview' | 'task_performance';
export type OfferStatus = 'draft' | 'sent' | 'accepted' | 'rejected' | 'expired' | 'withdrawn';

export interface Application {
  id: string;
  applicantId: string;
  roleId: string;
  projectId: string;
  status: ApplicationStatus;
  submittedAt: Date;
  applicationMessage: string;
  resumeUrl?: string;
  portfolioUrls: string[];
  expectedSalary?: number;
  availabilityDate: Date;
  aiScore: number; // 1-10
  manualScore?: number; // 1-10, overrides AI
  scoreJustification?: string;
  overallScore: number; // Computed from AI + manual + performance
  createdAt: Date;
  updatedAt: Date;
}

export interface Applicant {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  profilePictureUrl?: string;
  resumeUrl?: string;
  portfolioUrls: string[];
  skills: string[];
  experience: ExperienceEntry[];
  education: EducationEntry[];
  certifications: CertificationEntry[];
  availabilityDate: Date;
  expectedSalaryRange: {
    min: number;
    max: number;
    currency: string;
  };
  location: {
    city: string;
    country: string;
    timezone: string;
  };
  workPreferences: {
    remote: boolean;
    onsite: boolean;
    hybrid: boolean;
    partTime: boolean;
    fullTime: boolean;
    contract: boolean;
  };
  averageTaskScore?: number; // From completed work
  totalProjectsCompleted?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ExperienceEntry {
  id: string;
  company: string;
  position: string;
  startDate: Date;
  endDate?: Date;
  current: boolean;
  description: string;
  skills: string[];
}

export interface EducationEntry {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startDate: Date;
  endDate?: Date;
  gpa?: number;
}

export interface CertificationEntry {
  id: string;
  name: string;
  issuer: string;
  issueDate: Date;
  expiryDate?: Date;
  credentialId?: string;
}

export interface Interview {
  id: string;
  applicationId: string;
  interviewerId: string; // User conducting interview
  scheduledAt: Date;
  duration: number; // minutes
  type: InterviewType;
  location?: string; // For in-person interviews
  meetingUrl?: string; // For video interviews
  status: InterviewStatus;
  feedback?: InterviewFeedback;
  createdAt: Date;
  updatedAt: Date;
}

export interface InterviewFeedback {
  technicalScore: number; // 1-10
  communicationScore: number; // 1-10
  culturalFitScore: number; // 1-10
  overallRecommendation: 'strong_hire' | 'hire' | 'no_hire' | 'strong_no_hire';
  notes: string;
  followUpRequired: boolean;
  submittedAt: Date;
}

export interface ApplicantScore {
  id: string;
  applicationId: string;
  scoreType: ScoreType;
  score: number; // 1-10
  breakdown: ScoreBreakdown;
  justification: string;
  scoredBy: string; // 'ai' or userId
  createdAt: Date;
}

export interface ScoreBreakdown {
  technical: number;
  experience: number;
  education: number;
  skills: number;
  cultural_fit?: number;
  communication?: number;
}

export interface Comment {
  id: string;
  applicationId: string;
  parentCommentId?: string; // For threading
  authorId: string;
  content: string;
  mentions: string[]; // Array of mentioned userIds
  attachments: string[]; // File URLs
  isPrivate: boolean; // Visible only to internal team
  createdAt: Date;
  updatedAt: Date;
}

export interface StatusHistory {
  id: string;
  applicationId: string;
  fromStatus?: ApplicationStatus;
  toStatus: ApplicationStatus;
  reason?: string;
  notes?: string;
  changedBy: string; // userId
  changedAt: Date;
  metadata?: Record<string, any>; // Additional context
}

export interface Offer {
  id: string;
  applicationId: string;
  position: string;
  salary: {
    amount: number;
    currency: string;
    frequency: 'hourly' | 'monthly' | 'annually';
  };
  benefits: string[];
  startDate: Date;
  contractType: 'full_time' | 'part_time' | 'contract' | 'freelance';
  workArrangement: 'remote' | 'onsite' | 'hybrid';
  offerLetterUrl?: string;
  expiryDate: Date;
  status: OfferStatus;
  response?: OfferResponse;
  createdAt: Date;
  updatedAt: Date;
}

export interface OfferResponse {
  status: 'accepted' | 'rejected' | 'counter_offer';
  message?: string;
  counterOffer?: Partial<Offer>;
  respondedAt: Date;
}

// Utility types for UI components
export interface ApplicationWithApplicant extends Application {
  applicant: Applicant;
}

export interface ApplicationWithDetails extends ApplicationWithApplicant {
  interviews: Interview[];
  comments: Comment[];
  statusHistory: StatusHistory[];
  scores: ApplicantScore[];
  offer?: Offer;
}

export interface ProjectWithApplications {
  projectId: string;
  projectTitle: string;
  roles: RoleWithApplications[];
}

export interface RoleWithApplications {
  roleId: string;
  roleTitle: string;
  roleType: string;
  status: string;
  applicationCount: number;
  applications: ApplicationWithApplicant[];
}

// Filter and search types
export interface ApplicationFilters {
  status?: ApplicationStatus[];
  scoreRange?: { min: number; max: number };
  skills?: string[];
  experience?: { min: number; max: number };
  location?: string[];
  availability?: Date;
}

export interface ApplicationSearchParams {
  query?: string;
  filters?: ApplicationFilters;
  sortBy?: 'name' | 'score' | 'date' | 'status';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}