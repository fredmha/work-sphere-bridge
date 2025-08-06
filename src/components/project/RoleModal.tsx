import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Plus, Edit3, Save, X } from 'lucide-react';
import type { Database } from '@/types/supabase';

type Tables = Database['public']['Tables'];
type ContractorRoleRow = Tables['ContractorRole']['Row'];

interface RoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (role: Partial<ContractorRoleRow>) => void;
  role?: ContractorRoleRow | null;
  projectId: number;
}

export function RoleModal({ isOpen, onClose, onSave, role, projectId }: RoleModalProps) {
  const [formData, setFormData] = useState({
    role: '',
    description: '',
    type: 'Milestone' as 'Milestone' | 'Timesheet',
    pay: null as number | null,
  });

  const isEditing = !!role;

  useEffect(() => {
    if (role) {
      setFormData({
        role: role.role || '',
        description: role.description || '',
        type: (role.type === 'milestone' ? 'Milestone' : role.type === 'timesheet' ? 'Timesheet' : 'Milestone') as 'Milestone' | 'Timesheet',
        pay: role.pay,
      });
    } else {
      setFormData({
        role: '',
        description: '',
        type: 'Milestone',
        pay: null,
      });
    }
  }, [role, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.role || !formData.description) {
      return;
    }

    const roleData: Partial<ContractorRoleRow> = {
      role: formData.role,
      description: formData.description,
      type: formData.type === 'Milestone' ? 'milestone' : 'timesheet',
      pay: formData.type === 'Timesheet' ? formData.pay : null,
      project_id: projectId,
      contractor_id: null,
      created_at: new Date().toISOString(),
    };

    onSave(roleData);
    onClose();
  };

  const handleClose = () => {
    setFormData({
      role: '',
      description: '',
      type: 'Milestone',
      pay: null,
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {isEditing ? (
              <>
                <Edit3 className="w-5 h-5" />
                Edit Role
              </>
            ) : (
              <>
                <Plus className="w-5 h-5" />
                Add New Role
              </>
            )}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="roleName">Role Name *</Label>
              <Input
                id="roleName"
                value={formData.role}
                onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
                placeholder="e.g., Frontend Developer"
                className="h-12"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="roleType">Payment Type *</Label>
              <Select
                value={formData.type}
                onValueChange={(value: 'Milestone' | 'Timesheet') => 
                  setFormData(prev => ({ 
                    ...prev, 
                    type: value, 
                    pay: value === 'Milestone' ? null : prev.pay 
                  }))
                }
              >
                <SelectTrigger className="h-12">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Milestone">Milestone Based</SelectItem>
                  <SelectItem value="Timesheet">Hourly Rate</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {formData.type === 'Timesheet' && (
            <div className="space-y-2">
              <Label htmlFor="rolePay">Hourly Rate ($) *</Label>
              <Input
                id="rolePay"
                type="number"
                value={formData.pay || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, pay: parseFloat(e.target.value) || null }))}
                placeholder="e.g., 75"
                className="h-12"
                min="1"
                required={formData.type === 'Timesheet'}
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="roleDescription">Role Description *</Label>
            <Textarea
              id="roleDescription"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Describe the role responsibilities, requirements, and expectations..."
              rows={4}
              required
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button 
              type="submit" 
              className="flex-1"
              disabled={!formData.role || !formData.description || (formData.type === 'Timesheet' && !formData.pay)}
            >
              <Save className="w-4 h-4 mr-2" />
              {isEditing ? 'Save Changes' : 'Add Role'}
            </Button>
            <Button 
              type="button"
              variant="outline" 
              onClick={handleClose} 
              className="flex-1"
            >
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
} 