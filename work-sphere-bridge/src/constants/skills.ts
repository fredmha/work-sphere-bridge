export const SKILL_OPTIONS = [
  "Python", "JavaScript / TypeScript", "React", "Node.js", "C/C++",
  "REST / GraphQL", "SQL", "Excel", "Power BI / Tableau", "TensorFlow",
  "CI/CD", "Figma", "Adobe XD", "User Testing", "Financial Modelling",
  "Xero / QuickBooks", "Market Research", "Content Creation", "Strategy",
  "CRM", "Copywriting", "Project Management"
] as const;

export type Skill = typeof SKILL_OPTIONS[number]; 