export const CONTRACTOR_TYPE_OPTIONS = [
  "task", // Pay per task
  "timesheet" // Pay per hour
] as const;

export type ContractorType = typeof CONTRACTOR_TYPE_OPTIONS[number]; 