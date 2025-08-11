import { Application, Applicant, Interview, Comment, StatusHistory, ApplicantScore, Offer } from '@/types/ats';
import { addDays, subDays, subHours, subMinutes } from 'date-fns';

// Mock Applicants
export const mockApplicants: Applicant[] = [
  {
    id: 'applicant-1',
    firstName: 'Sarah',
    lastName: 'Johnson',
    email: 's.johnson@email.com',
    phone: '+1 (555) 123-4567',
    profilePictureUrl: 'https://images.unsplash.com/photo-1494790108755-2616b15c74c3?w=150&h=150&fit=crop&crop=face',
    resumeUrl: '/mock-files/sarah_johnson_resume.pdf',
    portfolioUrls: ['https://sarah-portfolio.dev', 'https://github.com/sarahj'],
    skills: ['React', 'TypeScript', 'Node.js', 'Tailwind CSS', 'GraphQL', 'AWS'],
    experience: [
      {
        id: 'exp-1',
        company: 'TechCorp Inc.',
        position: 'Senior Frontend Developer',
        startDate: new Date('2021-03-01'),
        endDate: undefined,
        current: true,
        description: 'Led development of React-based dashboard application serving 50k+ users. Implemented responsive design and performance optimizations.',
        skills: ['React', 'TypeScript', 'Redux', 'Webpack']
      },
      {
        id: 'exp-2',
        company: 'StartupXYZ',
        position: 'Frontend Developer',
        startDate: new Date('2019-06-01'),
        endDate: new Date('2021-02-28'),
        current: false,
        description: 'Built user interfaces for mobile-first SaaS platform. Collaborated with design team to implement pixel-perfect designs.',
        skills: ['React', 'JavaScript', 'SCSS', 'Jest']
      }
    ],
    education: [
      {
        id: 'edu-1',
        institution: 'Stanford University',
        degree: 'Bachelor of Science',
        fieldOfStudy: 'Computer Science',
        startDate: new Date('2015-09-01'),
        endDate: new Date('2019-05-01'),
        gpa: 3.8
      }
    ],
    certifications: [
      {
        id: 'cert-1',
        name: 'React Developer Certification',
        issuer: 'Meta',
        issueDate: new Date('2022-08-15'),
        credentialId: 'META-REACT-2022-8901'
      }
    ],
    availabilityDate: new Date('2024-03-15'),
    expectedSalaryRange: {
      min: 70000,
      max: 85000,
      currency: 'USD'
    },
    location: {
      city: 'San Francisco',
      country: 'United States',
      timezone: 'PST'
    },
    workPreferences: {
      remote: true,
      onsite: false,
      hybrid: true,
      partTime: false,
      fullTime: true,
      contract: false
    },
    averageTaskScore: 9.2,
    totalProjectsCompleted: 12,
    createdAt: subDays(new Date(), 30),
    updatedAt: subHours(new Date(), 2)
  },
  {
    id: 'applicant-2',
    firstName: 'Mike',
    lastName: 'Chen',
    email: 'm.chen@email.com',
    phone: '+1 (555) 234-5678',
    profilePictureUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    resumeUrl: '/mock-files/mike_chen_resume.pdf',
    portfolioUrls: ['https://mike-chen-dev.com'],
    skills: ['Vue.js', 'JavaScript', 'Python', 'Django', 'PostgreSQL', 'Docker'],
    experience: [
      {
        id: 'exp-3',
        company: 'DevAgency',
        position: 'Full Stack Developer',
        startDate: new Date('2020-01-01'),
        endDate: undefined,
        current: true,
        description: 'Developed end-to-end web applications using Vue.js and Django. Managed cloud infrastructure and CI/CD pipelines.',
        skills: ['Vue.js', 'Django', 'PostgreSQL', 'AWS', 'Docker']
      }
    ],
    education: [
      {
        id: 'edu-2',
        institution: 'UC Berkeley',
        degree: 'Bachelor of Science',
        fieldOfStudy: 'Computer Science',
        startDate: new Date('2016-09-01'),
        endDate: new Date('2020-05-01'),
        gpa: 3.6
      }
    ],
    certifications: [],
    availabilityDate: new Date('2024-04-01'),
    expectedSalaryRange: {
      min: 75000,
      max: 90000,
      currency: 'USD'
    },
    location: {
      city: 'Seattle',
      country: 'United States',
      timezone: 'PST'
    },
    workPreferences: {
      remote: true,
      onsite: true,
      hybrid: true,
      partTime: false,
      fullTime: true,
      contract: true
    },
    createdAt: subDays(new Date(), 15),
    updatedAt: subHours(new Date(), 6)
  },
  {
    id: 'applicant-3',
    firstName: 'Emma',
    lastName: 'Rodriguez',
    email: 'e.rodriguez@email.com',
    phone: '+1 (555) 345-6789',
    profilePictureUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    resumeUrl: '/mock-files/emma_rodriguez_resume.pdf',
    portfolioUrls: ['https://emma-design.com'],
    skills: ['UI/UX Design', 'Figma', 'Adobe XD', 'Prototyping', 'User Research', 'HTML/CSS'],
    experience: [
      {
        id: 'exp-4',
        company: 'DesignStudio',
        position: 'Senior UX Designer',
        startDate: new Date('2018-05-01'),
        endDate: undefined,
        current: true,
        description: 'Led user experience design for B2B SaaS products. Conducted user research and created design systems.',
        skills: ['Figma', 'User Research', 'Prototyping', 'Design Systems']
      }
    ],
    education: [
      {
        id: 'edu-3',
        institution: 'Art Center College of Design',
        degree: 'Bachelor of Fine Arts',
        fieldOfStudy: 'Interaction Design',
        startDate: new Date('2014-09-01'),
        endDate: new Date('2018-05-01'),
        gpa: 3.9
      }
    ],
    certifications: [
      {
        id: 'cert-2',
        name: 'Google UX Design Certificate',
        issuer: 'Google',
        issueDate: new Date('2021-03-20'),
        credentialId: 'GOOGLE-UX-2021-3456'
      }
    ],
    availabilityDate: new Date('2024-03-01'),
    expectedSalaryRange: {
      min: 65000,
      max: 80000,
      currency: 'USD'
    },
    location: {
      city: 'Austin',
      country: 'United States',
      timezone: 'CST'
    },
    workPreferences: {
      remote: true,
      onsite: false,
      hybrid: true,
      partTime: true,
      fullTime: true,
      contract: true
    },
    averageTaskScore: 8.7,
    totalProjectsCompleted: 8,
    createdAt: subDays(new Date(), 7),
    updatedAt: subHours(new Date(), 1)
  }
];

// Mock Applications
export const mockApplications: Application[] = [
  {
    id: 'app-1',
    applicantId: 'applicant-1',
    roleId: 'role-1', // Frontend Developer from existing mock data
    projectId: 'project-1',
    status: 'pending',
    submittedAt: subDays(new Date(), 2),
    applicationMessage: 'I am excited to apply for the Frontend Developer position. With over 5 years of experience in React and TypeScript, I believe I would be a great fit for your team. I have successfully led the development of large-scale applications and am passionate about creating exceptional user experiences.',
    resumeUrl: '/mock-files/sarah_johnson_resume.pdf',
    portfolioUrls: ['https://sarah-portfolio.dev', 'https://github.com/sarahj'],
    expectedSalary: 75000,
    availabilityDate: new Date('2024-03-15'),
    aiScore: 8.5,
    overallScore: 8.5,
    createdAt: subDays(new Date(), 2),
    updatedAt: subHours(new Date(), 2)
  },
  {
    id: 'app-2',
    applicantId: 'applicant-2',
    roleId: 'role-1',
    projectId: 'project-1',
    status: 'interview_scheduled',
    submittedAt: subDays(new Date(), 5),
    applicationMessage: 'I am interested in the Frontend Developer role and believe my full-stack experience would bring valuable perspective to the team. I have experience with Vue.js and am eager to work with React on this project.',
    resumeUrl: '/mock-files/mike_chen_resume.pdf',
    portfolioUrls: ['https://mike-chen-dev.com'],
    expectedSalary: 80000,
    availabilityDate: new Date('2024-04-01'),
    aiScore: 9.1,
    overallScore: 9.1,
    createdAt: subDays(new Date(), 5),
    updatedAt: subHours(new Date(), 6)
  },
  {
    id: 'app-3',
    applicantId: 'applicant-3',
    roleId: 'role-3', // UI/UX Designer from existing mock data
    projectId: 'project-1',
    status: 'offered',
    submittedAt: subDays(new Date(), 10),
    applicationMessage: 'I am thrilled to apply for the UI/UX Designer position. My experience in user research and design systems aligns perfectly with your requirements. I would love to contribute to creating intuitive and beautiful user interfaces.',
    resumeUrl: '/mock-files/emma_rodriguez_resume.pdf',
    portfolioUrls: ['https://emma-design.com'],
    expectedSalary: 70000,
    availabilityDate: new Date('2024-03-01'),
    aiScore: 8.8,
    overallScore: 8.8,
    createdAt: subDays(new Date(), 10),
    updatedAt: subHours(new Date(), 1)
  }
];

// Mock Interviews
export const mockInterviews: Interview[] = [
  {
    id: 'interview-1',
    applicationId: 'app-2',
    interviewerId: 'user-1',
    scheduledAt: addDays(new Date(), 1),
    duration: 60,
    type: 'video',
    meetingUrl: 'https://meet.google.com/abc-defg-hij',
    status: 'scheduled',
    createdAt: subHours(new Date(), 6),
    updatedAt: subHours(new Date(), 6)
  }
];

// Mock Comments
export const mockComments: Comment[] = [
  {
    id: 'comment-1',
    applicationId: 'app-1',
    authorId: 'user-1',
    content: 'Strong technical background. Portfolio shows excellent React work. Recommended for phone interview.',
    mentions: [],
    attachments: [],
    isPrivate: false,
    createdAt: subHours(new Date(), 2),
    updatedAt: subHours(new Date(), 2)
  },
  {
    id: 'comment-2',
    applicationId: 'app-1',
    authorId: 'user-2',
    content: 'Resume looks impressive. @john can you review the technical portfolio?',
    mentions: ['user-1'],
    attachments: [],
    isPrivate: false,
    createdAt: subHours(new Date(), 4),
    updatedAt: subHours(new Date(), 4)
  },
  {
    id: 'comment-3',
    applicationId: 'app-2',
    authorId: 'user-1',
    content: 'Interview scheduled for tomorrow. Focus on React experience since they come from Vue.js background.',
    mentions: [],
    attachments: [],
    isPrivate: true,
    createdAt: subHours(new Date(), 6),
    updatedAt: subHours(new Date(), 6)
  }
];

// Mock Status History
export const mockStatusHistory: StatusHistory[] = [
  {
    id: 'status-1',
    applicationId: 'app-1',
    toStatus: 'pending',
    changedBy: 'system',
    changedAt: subDays(new Date(), 2),
    metadata: { source: 'job_board' }
  },
  {
    id: 'status-2',
    applicationId: 'app-2',
    fromStatus: 'pending',
    toStatus: 'interview_scheduled',
    reason: 'Strong technical background',
    changedBy: 'user-1',
    changedAt: subHours(new Date(), 6)
  },
  {
    id: 'status-3',
    applicationId: 'app-3',
    fromStatus: 'interviewed',
    toStatus: 'offered',
    reason: 'Excellent interview performance',
    notes: 'Strong hire recommendation from all interviewers',
    changedBy: 'user-1',
    changedAt: subHours(new Date(), 1)
  }
];

// Mock Applicant Scores
export const mockApplicantScores: ApplicantScore[] = [
  {
    id: 'score-1',
    applicationId: 'app-1',
    scoreType: 'ai_initial',
    score: 8.5,
    breakdown: {
      technical: 9,
      experience: 8,
      education: 8,
      skills: 9
    },
    justification: 'Strong React and TypeScript experience. Excellent portfolio. Relevant education background.',
    scoredBy: 'ai',
    createdAt: subDays(new Date(), 2)
  },
  {
    id: 'score-2',
    applicationId: 'app-2',
    scoreType: 'ai_initial',
    score: 9.1,
    breakdown: {
      technical: 9,
      experience: 9,
      education: 8,
      skills: 10
    },
    justification: 'Exceptional full-stack experience. Strong technical skills. Good educational background.',
    scoredBy: 'ai',
    createdAt: subDays(new Date(), 5)
  },
  {
    id: 'score-3',
    applicationId: 'app-3',
    scoreType: 'ai_initial',
    score: 8.8,
    breakdown: {
      technical: 8,
      experience: 9,
      education: 9,
      skills: 9
    },
    justification: 'Excellent design experience. Strong portfolio. Relevant certifications.',
    scoredBy: 'ai',
    createdAt: subDays(new Date(), 10)
  }
];

// Mock Offers
export const mockOffers: Offer[] = [
  {
    id: 'offer-1',
    applicationId: 'app-3',
    position: 'UI/UX Designer',
    salary: {
      amount: 72000,
      currency: 'USD',
      frequency: 'annually'
    },
    benefits: ['Health Insurance', '401k Matching', 'Paid Time Off', 'Professional Development'],
    startDate: new Date('2024-03-15'),
    contractType: 'full_time',
    workArrangement: 'hybrid',
    expiryDate: addDays(new Date(), 7),
    status: 'sent',
    createdAt: subHours(new Date(), 1),
    updatedAt: subHours(new Date(), 1)
  }
];

// Additional seeded data for review
const extraApplicants: Applicant[] = [
  {
    id: 'applicant-4',
    firstName: 'Noah',
    lastName: 'Williams',
    email: 'noah.williams@email.com',
    phone: '+1 (555) 456-7890',
    profilePictureUrl: 'https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?w=150&h=150&fit=crop&crop=face',
    resumeUrl: '/mock-files/noah_williams_resume.pdf',
    portfolioUrls: ['https://noah.dev'],
    skills: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS'],
    experience: [
      { id: 'exp-5', company: 'CloudSoft', position: 'Frontend Engineer', startDate: new Date('2022-01-01'), endDate: undefined, current: true, description: 'Built dashboards', skills: ['React','TS'] },
    ],
    education: [ { id: 'edu-4', institution: 'MIT', degree: 'BS', fieldOfStudy: 'CS', startDate: new Date('2017-09-01'), endDate: new Date('2021-05-01'), gpa: 3.7 } ],
    certifications: [],
    availabilityDate: addDays(new Date(), 10),
    expectedSalaryRange: { min: 80000, max: 95000, currency: 'USD' },
    location: { city: 'Denver', country: 'United States', timezone: 'MST' },
    workPreferences: { remote: true, onsite: false, hybrid: true, partTime: false, fullTime: true, contract: true },
    averageTaskScore: 8.3,
    totalProjectsCompleted: 6,
    createdAt: subDays(new Date(), 20),
    updatedAt: subHours(new Date(), 3),
  },
  {
    id: 'applicant-5',
    firstName: 'Liam',
    lastName: 'Nguyen',
    email: 'liam.nguyen@email.com',
    phone: '+1 (555) 567-8901',
    profilePictureUrl: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=150&h=150&fit=crop&crop=face',
    resumeUrl: '/mock-files/liam_nguyen_resume.pdf',
    portfolioUrls: ['https://liam.codes'],
    skills: ['Node.js', 'React', 'PostgreSQL', 'AWS'],
    experience: [
      { id: 'exp-6', company: 'APIWorks', position: 'Full Stack Dev', startDate: new Date('2020-04-01'), endDate: undefined, current: true, description: 'APIs and UIs', skills: ['Node','React'] },
    ],
    education: [ { id: 'edu-5', institution: 'UCLA', degree: 'BS', fieldOfStudy: 'CS', startDate: new Date('2015-09-01'), endDate: new Date('2019-05-01'), gpa: 3.5 } ],
    certifications: [],
    availabilityDate: addDays(new Date(), 20),
    expectedSalaryRange: { min: 90000, max: 110000, currency: 'USD' },
    location: { city: 'Los Angeles', country: 'United States', timezone: 'PST' },
    workPreferences: { remote: true, onsite: true, hybrid: true, partTime: false, fullTime: true, contract: true },
    averageTaskScore: 8.9,
    totalProjectsCompleted: 10,
    createdAt: subDays(new Date(), 18),
    updatedAt: subHours(new Date(), 5),
  },
  {
    id: 'applicant-6',
    firstName: 'Priya',
    lastName: 'Patel',
    email: 'priya.patel@email.com',
    phone: '+1 (555) 678-9012',
    profilePictureUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&h=150&fit=crop&crop=face',
    resumeUrl: '/mock-files/priya_patel_resume.pdf',
    portfolioUrls: ['https://priya.design'],
    skills: ['UI/UX', 'Figma', 'Design Systems'],
    experience: [
      { id: 'exp-7', company: 'DesignHub', position: 'Product Designer', startDate: new Date('2019-01-01'), endDate: undefined, current: true, description: 'Design systems', skills: ['Figma','UX'] },
    ],
    education: [ { id: 'edu-6', institution: 'RISD', degree: 'BFA', fieldOfStudy: 'Graphic Design', startDate: new Date('2013-09-01'), endDate: new Date('2017-05-01'), gpa: 3.8 } ],
    certifications: [],
    availabilityDate: addDays(new Date(), 5),
    expectedSalaryRange: { min: 70000, max: 90000, currency: 'USD' },
    location: { city: 'New York', country: 'United States', timezone: 'EST' },
    workPreferences: { remote: true, onsite: false, hybrid: true, partTime: true, fullTime: true, contract: true },
    averageTaskScore: 9.0,
    totalProjectsCompleted: 14,
    createdAt: subDays(new Date(), 9),
    updatedAt: subHours(new Date(), 2),
  },
];
mockApplicants.push(...extraApplicants);

const extraApplications: Application[] = [
  { id: 'app-4', applicantId: 'applicant-4', roleId: 'role-1', projectId: 'project-1', status: 'pending', submittedAt: subDays(new Date(), 1), applicationMessage: 'Excited to apply for FE role.', resumeUrl: '/mock-files/noah_williams_resume.pdf', portfolioUrls: ['https://noah.dev'], expectedSalary: 90000, availabilityDate: addDays(new Date(), 10), aiScore: 7.9, overallScore: 7.9, createdAt: subDays(new Date(), 1), updatedAt: subHours(new Date(), 1) },
  { id: 'app-5', applicantId: 'applicant-5', roleId: 'role-1', projectId: 'project-1', status: 'interview_scheduled', submittedAt: subDays(new Date(), 3), applicationMessage: 'Full stack experience with Node/React.', resumeUrl: '/mock-files/liam_nguyen_resume.pdf', portfolioUrls: ['https://liam.codes'], expectedSalary: 105000, availabilityDate: addDays(new Date(), 20), aiScore: 8.2, overallScore: 8.2, createdAt: subDays(new Date(), 3), updatedAt: subHours(new Date(), 2) },
  { id: 'app-6', applicantId: 'applicant-6', roleId: 'role-3', projectId: 'project-1', status: 'offered', submittedAt: subDays(new Date(), 8), applicationMessage: 'Seasoned designer focused on systems.', resumeUrl: '/mock-files/priya_patel_resume.pdf', portfolioUrls: ['https://priya.design'], expectedSalary: 82000, availabilityDate: addDays(new Date(), 5), aiScore: 9.0, overallScore: 9.0, createdAt: subDays(new Date(), 8), updatedAt: subHours(new Date(), 2) },
  { id: 'app-7', applicantId: 'applicant-4', roleId: 'role-1', projectId: 'project-1', status: 'accepted', submittedAt: subDays(new Date(), 12), applicationMessage: 'Accepted offer; ready for onboarding.', resumeUrl: '/mock-files/noah_williams_resume.pdf', portfolioUrls: ['https://noah.dev'], expectedSalary: 92000, availabilityDate: addDays(new Date(), 10), aiScore: 8.1, overallScore: 8.1, createdAt: subDays(new Date(), 12), updatedAt: subHours(new Date(), 4) },
  { id: 'app-8', applicantId: 'applicant-5', roleId: 'role-1', projectId: 'project-1', status: 'contracted', submittedAt: subDays(new Date(), 20), applicationMessage: 'Currently on project.', resumeUrl: '/mock-files/liam_nguyen_resume.pdf', portfolioUrls: ['https://liam.codes'], expectedSalary: 100000, availabilityDate: addDays(new Date(), 30), aiScore: 8.4, overallScore: 8.4, createdAt: subDays(new Date(), 20), updatedAt: subHours(new Date(), 6) },
];
mockApplications.push(...extraApplications);

const extraInterviews: Interview[] = [
  { id: 'interview-2', applicationId: 'app-5', interviewerId: 'user-1', scheduledAt: addDays(new Date(), 2), duration: 45, type: 'video', meetingUrl: 'https://meet.example.com/xyz', status: 'scheduled', createdAt: subHours(new Date(), 1), updatedAt: subHours(new Date(), 1) },
  { id: 'interview-3', applicationId: 'app-2', interviewerId: 'user-2', scheduledAt: addDays(new Date(), 1), duration: 60, type: 'phone', meetingUrl: '', status: 'scheduled', createdAt: subHours(new Date(), 3), updatedAt: subHours(new Date(), 3) },
];
mockInterviews.push(...extraInterviews);

const extraComments: Comment[] = [
  { id: 'comment-4', applicationId: 'app-4', authorId: 'user-1', content: 'Looks promising for FE.', mentions: [], attachments: [], isPrivate: false, createdAt: subMinutes(new Date(), 50), updatedAt: subMinutes(new Date(), 50) },
  { id: 'comment-5', applicationId: 'app-6', authorId: 'user-2', content: 'Design work is stellar.', mentions: [], attachments: [], isPrivate: false, createdAt: subMinutes(new Date(), 70), updatedAt: subMinutes(new Date(), 70) },
];
mockComments.push(...extraComments);

const extraOffers: Offer[] = [
  { id: 'offer-2', applicationId: 'app-6', position: 'Product Designer', salary: { amount: 83000, currency: 'USD', frequency: 'annually' }, benefits: ['Health', 'PTO'], startDate: addDays(new Date(), 14), contractType: 'full_time', workArrangement: 'remote', expiryDate: addDays(new Date(), 10), status: 'sent', createdAt: subHours(new Date(), 1), updatedAt: subHours(new Date(), 1) },
];
mockOffers.push(...extraOffers);

// Helper functions to get related data
export const getApplicantById = (id: string): Applicant | undefined => {
  return mockApplicants.find(applicant => applicant.id === id);
};

export const getApplicationsByRoleId = (roleId: string): Application[] => {
  return mockApplications.filter(app => app.roleId === roleId);
};

export const getApplicationsByProjectId = (projectId: string): Application[] => {
  return mockApplications.filter(app => app.projectId === projectId);
};

export const getCommentsByApplicationId = (applicationId: string): Comment[] => {
  return mockComments.filter(comment => comment.applicationId === applicationId);
};

export const getStatusHistoryByApplicationId = (applicationId: string): StatusHistory[] => {
  return mockStatusHistory.filter(status => status.applicationId === applicationId);
};

export const getInterviewsByApplicationId = (applicationId: string): Interview[] => {
  return mockInterviews.filter(interview => interview.applicationId === applicationId);
};

export const getScoresByApplicationId = (applicationId: string): ApplicantScore[] => {
  return mockApplicantScores.filter(score => score.applicationId === applicationId);
};

export const getOfferByApplicationId = (applicationId: string): Offer | undefined => {
  return mockOffers.find(offer => offer.applicationId === applicationId);
};