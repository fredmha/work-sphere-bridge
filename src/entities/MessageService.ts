import type { Message } from './Message';

export const MessageService = {
  async filter(params: any): Promise<Message[]> {
    // TODO: Implement actual filtering logic or API call
    return [];
  },
  async create(data: Partial<Message>): Promise<Message> {
    // TODO: Implement actual creation logic or API call
    return { ...data, is_read: false } as Message;
  }
}; 