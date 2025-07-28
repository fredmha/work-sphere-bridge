export interface Message {
  application_id: string;
  content: string;
  sender: 'contractor' | 'client';
  timestamp: string;
  is_read: boolean;
} 