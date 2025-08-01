import { supabase } from '@/lib/supabaseClient';
import { ContractorTask } from '@/types';

export class TaskService {
  // Get all tasks for a project
  static async getTasksByProject(projectId: number): Promise<ContractorTask[]> {
    const { data, error } = await supabase
      .from('ContractorTask')
      .select('*')
      .eq('Project', projectId);

    if (error) {
      console.error('Error fetching tasks:', error);
      throw new Error(`Failed to fetch tasks: ${error.message}`);
    }

    return data || [];
  }

  // Get tasks by role
  static async getTasksByRole(roleId: number): Promise<ContractorTask[]> {
    const { data, error } = await supabase
      .from('ContractorTask')
      .select('*')
      .eq('role', roleId);

    if (error) {
      console.error('Error fetching tasks by role:', error);
      throw new Error(`Failed to fetch tasks: ${error.message}`);
    }

    return data || [];
  }

  // Get tasks by owner
  static async getTasksByOwner(ownerId: string): Promise<ContractorTask[]> {
    const { data, error } = await supabase
      .from('ContractorTask')
      .select('*')
      .eq('owner', ownerId);

    if (error) {
      console.error('Error fetching tasks by owner:', error);
      throw new Error(`Failed to fetch tasks: ${error.message}`);
    }

    return data || [];
  }

  // Create a new task
  static async createTask(task: Omit<ContractorTask, 'id' | 'created_at'>): Promise<ContractorTask> {
    const { data, error } = await supabase
      .from('ContractorTask')
      .insert([task])
      .select()
      .single();

    if (error) {
      console.error('Error creating task:', error);
      throw new Error(`Failed to create task: ${error.message}`);
    }

    return data;
  }

  // Update a task
  static async updateTask(taskId: number, updates: Partial<ContractorTask>): Promise<ContractorTask> {
    const { data, error } = await supabase
      .from('ContractorTask')
      .update(updates)
      .eq('id', taskId)
      .select()
      .single();

    if (error) {
      console.error('Error updating task:', error);
      throw new Error(`Failed to update task: ${error.message}`);
    }

    return data;
  }

  // Delete a task
  static async deleteTask(taskId: number): Promise<void> {
    const { error } = await supabase
      .from('ContractorTask')
      .delete()
      .eq('id', taskId);

    if (error) {
      console.error('Error deleting task:', error);
      throw new Error(`Failed to delete task: ${error.message}`);
    }
  }

  // Update task status
  static async updateTaskStatus(taskId: number, status: string): Promise<ContractorTask> {
    return this.updateTask(taskId, { status });
  }

  // Update task priority
  static async updateTaskPriority(taskId: number, priority: string): Promise<ContractorTask> {
    return this.updateTask(taskId, { priority });
  }

  // Add feedback to task
  static async addTaskFeedback(taskId: number, feedback: string): Promise<ContractorTask> {
    return this.updateTask(taskId, { feedback });
  }

  // Update task score
  static async updateTaskScore(taskId: number, score: number): Promise<ContractorTask> {
    return this.updateTask(taskId, { score });
  }
} 