// src/types.ts

// User Roles (example, adjust as needed)
export type UserRole = "admin" | "business" | "contractor" | "other";

// User
export interface User {
  id: string;
  businessName?: string;
  businessWebsite?: string;
  completedSignUp?: boolean;
  currentProjectID?: string; // Project ID
  description?: string;
  emailAddress?: string;
  fullName?: string;
  industry?: string;
  isEmail?: boolean;
  logo?: string; // image URL
  postedFirstProject?: boolean;
  role?: UserRole;
  email: string;
  modifiedDate: string; // ISO date
  createdDate: string; // ISO date
  slug?: string;
}

// Project (matches current Supabase table)
export interface projects {
  id: string;
  project_name: string;
  project_description: string;
  contractor_roles?: any; // Not used yet, can be left as any or a more specific type later
  owner_id: string;
  created_at: string;
}

// Contractor Role
export interface ContractorRole {
  id: string;
  contractor_id?: string; // Contractor ID
  description?: string;
  
 // projects?: string; // Project ID
  owner_id?: string; // User ID
  role?: string;
  pay?: number; //only for timesheet, pay per hour
  score?: number;
  //visibility?: boolean;
  //creator?: string; // User ID
  type?: string; //whether its a paid per task or a timesheet model
  //modifiedDate: string;
  created_at: string;
  //slug?: string;
}

// Contractor
export interface Contractor {
  id: string;
  degree?: string;
  contract?: string; // Contract ID
  currentProject?: string; // Project ID
  email?: string;
  experience?: string;
  fullName?: string;
  interests?: string[];
  isEmail?: boolean;
  linkedUser?: string; // User ID
  linkedinLink?: string;
  password?: string;
  resume?: string; // file URL
  skills?: string[];
  university?: string;
  wam?: string;
  type?: string; //whether its a paid per task or a timesheet model
  wocScore?: number;
  yearOfDegree?: string;
  creator?: string; // User ID
  modifiedDate: string;
  createdDate: string;
  slug?: string;
}

// Offer
export interface Offer {
  id: string;
  applicantComments?: string;
  applicantScore?: number;
  business?: string; // Business ID
  contractor?: string; // Contractor ID
  contractorRole?: string; // Contractor Role ID
  offerMessage?: string;
  owner?: string; // User ID
  project?: string; // Project ID

  receiver?: string; // User ID
  resume?: string; // file URL
  status?: string;
  creator?: string; // User ID
  modifiedDate: string;
  createdDate: string;
  slug?: string;
}

// Contractor Task
export interface ContractorTask {
  id: string;
  description?: string; //description of what needs to be done
  deliverables?: string //what needs to be delivered
  feedback?: string;
  files?: string[]; // List of file URLs
  labels?: string[];
  name?: string;
  ogContractorTask?: string; // Project ID
  owner?: string; // User ID
  priority?: string;
  role?: string; // Contractor Role ID
  price?: number; //price of milestone
  score?: number;
  status?: string;
  visibility?: boolean;
  creator?: string; // User ID
  modifiedDate: string;
  createdDate: string;
  slug?: string;
}

// Contract
export interface Contract {
  id: string;
  additionalNotes?: string;
  autoFillUsingLengthOfBusiness?: boolean;
  contractLength?: string; // date or duration
  contractor?: string; // Contractor ID
  contractorFile?: string[]; // List of file URLs
  contractorRoles?: string[]; // List of Contractor Role IDs
  dailyWorkingHours?: string;
  fileUpload?: string[]; // List of file URLs
  owner?: string; // User ID
  project?: string; // Project ID
  receiver?: string; // User ID
  status?: string;
  typeOfWork?: string;
  workDays?: string[];
  creator?: string; // User ID
  modifiedDate: string;
  createdDate: string;
  slug?: string;
}

export interface business {
  id: string;
  linkeduser?: string;
  businessname?: string;
}
