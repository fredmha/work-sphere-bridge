import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useParams } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  roleId: string;
  availableContractors?: { id: string; name: string }[];
  onTaskAdded?: () => void;
}

export function AddTaskModal({ isOpen, onClose, roleId, availableContractors = [], onTaskAdded }: AddTaskModalProps) {
  const { id: projectId } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    deliverables: '',
    price: '',
    priority: 'Medium'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!projectId || !user) return;

    setIsLoading(true);
    
    try {
      const { error } = await supabase
        .from('ContractorTask')
        .insert({
          name: formData.name,
          description: formData.description,
          deliverables: formData.deliverables,
          price: parseFloat(formData.price) || 0,
          priority: formData.priority,
          status: 'Pending',
          Project: parseInt(projectId),
          role: parseInt(roleId),
          owner: user.id
        });

      if (error) throw error;

      // Reset form
      setFormData({
        name: '',
        description: '',
        deliverables: '',
        price: '',
        priority: 'Medium'
      });
      
      // Notify parent component to refresh tasks
      onTaskAdded?.();
      onClose();
      
    } catch (error) {
      console.error('Error creating task:', error);
      alert('Failed to create task. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Add New Task</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="taskName">Task Name</Label>
            <Input
              id="taskName"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter task name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe the task requirements"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="deliverables">Deliverables</Label>
            <Textarea
              id="deliverables"
              value={formData.deliverables}
              onChange={(e) => setFormData({ ...formData, deliverables: e.target.value })}
              placeholder="What should be delivered upon completion"
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="price">Price ($)</Label>
            <Input
              id="price"
              type="number"
              step="0.01"
              min="0"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              placeholder="0.00"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="priority">Priority</Label>
            <Select
              value={formData.priority}
              onValueChange={(value) => setFormData({ ...formData, priority: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Low">Low</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="High">High</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {availableContractors.length > 0 && (
            <div className="space-y-2">
              <Label htmlFor="contractor">Assign to Contractor (Optional)</Label>
              <Select
                value={formData.assignedContractor}
                onValueChange={(value) => setFormData({ ...formData, assignedContractor: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select contractor" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Unassigned</SelectItem>
                  {availableContractors.map((contractor) => (
                    <SelectItem key={contractor.id} value={contractor.id}>
                      {contractor.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Adding...' : 'Add Task'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}