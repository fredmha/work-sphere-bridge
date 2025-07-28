export const INTEREST_OPTIONS = [
  "Software Engineering",
  "Systems & Hardware",
  "Data & Analytics",
  "AI / ML",
  "CyberSecurity",
  "DevOps & Cloud",
  "Product Management",
  "UX / UI Design",
  "Corporate Finance & Investment",
  "Accounting & Audit",
  "Digital Marketing & Growth",
  "Sales & Business Development",
  "Consulting & Strategy",
  "Start-ups & Innovation"
] as const;

export type Interest = typeof INTEREST_OPTIONS[number]; 