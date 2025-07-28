export interface Task {
  id: string;
  application_id: string;
  description: string;
  price: number;
  status: string;
  created_date?: string;
} 