import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Edit3, 
  Trash2, 
  Save, 
  X, 
  Users, 
  Clock, 
  Target, 
  ArrowRight, 
  ArrowLeft 
} from 'lucide-react';
import { useProjectWizard } from './ProjectContext';

export default function AiReviewRoles() {
  const { state, actions } = useProjectWizard();
  const [editingRole, setEditingRole] = useState(null);
  const [newRole, setNewRole] = useState({
    role: '',
    description: '',
    type: 'milestone',
    pay: null,
    tasks: []
  });
  const [showAddForm, setShowAddForm] = useState(false);

  const roles = state.aiContext?.contractorRoles || [];

  const handleEditRole = (index) => {
    setEditingRole(index);
    setNewRole({ ...roles[index] });
  };

  const handleSaveRole = () => {
    const updatedRoles = [...roles];
    if (editingRole !== null) {
      updatedRoles[editingRole] = { ...newRole };
    }
    
    actions.updateAiContext({
      contractorRoles: updatedRoles
    });
    
    setEditingRole(null);
    setNewRole({
      role: '',
      description: '',
      type: 'milestone',
      pay: null,
      tasks: []
    });
  };

  const handleAddRole = () => {
    if (!newRole.role || !newRole.description) return;
    
    const roleToAdd = {
      ...newRole,
      tasks: newRole.type === 'milestone' ? (newRole.tasks || []) : []
    };
    
    actions.updateAiContext({
      contractorRoles: [...roles, roleToAdd]
    });
    
    setNewRole({
      role: '',
      description: '',
      type: 'milestone',
      pay: null,
      tasks: []
    });
    setShowAddForm(false);
  };

  const handleDeleteRole = (index) => {
    if (window.confirm('Are you sure you want to delete this role?')) {
      const updatedRoles = roles.filter((_, i) => i !== index);
      actions.updateAiContext({
        contractorRoles: updatedRoles
      });
    }
  };

  const handleNext = () => {
    const hasMilestoneRoles = roles.some(role => role.type === 'milestone');
    if (hasMilestoneRoles) {
      actions.updateAiContext({ currentStep: 'review-tasks' });
      actions.setStep(4);
    } else {
      actions.updateAiContext({ currentStep: 'final-review' });
      actions.setStep(5);
    }
  };

  const handleBack = () => {
    actions.setStep(2);
  };

  const RoleCard = ({ role, index, isEditing }) => (
    <Card className={`border-none shadow-lg rounded-2xl overflow-hidden transition-all duration-300 ${
      isEditing ? 'ring-2 ring-emerald-500 shadow-emerald-500/20' : 'hover:shadow-xl'
    }`}>
      <CardHeader className="p-6 bg-gradient-to-r from-gray-50 to-gray-100">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
              role.type === 'milestone' 
                ? 'bg-emerald-100 text-emerald-600' 
                : 'bg-blue-100 text-blue-600'
            }`}>
              {role.type === 'milestone' ? <Target className="w-6 h-6" /> : <Clock className="w-6 h-6" />}
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">{role.role}</h3>
              <Badge variant={role.type === 'milestone' ? 'default' : 'secondary'} className="mt-1">
                {role.type === 'milestone' ? 'Milestone Based' : 'Hourly Rate'}
              </Badge>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleEditRole(index)}
              className="hover:bg-gray-100"
            >
              <Edit3 className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleDeleteRole(index)}
              className="hover:bg-red-50 hover:text-red-600"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <p className="text-gray-700 mb-4">{role.description}</p>
        
        {role.type === 'timesheet' && (
          <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
            <Clock className="w-5 h-5 text-blue-600" />
            <span className="font-semibold text-blue-900">
              ${role.pay}/hour
            </span>
          </div>
        )}
        
        {role.type === 'milestone' && (
          <div className="flex items-center gap-2 p-3 bg-emerald-50 rounded-lg">
            <Target className="w-5 h-5 text-emerald-600" />
            <span className="font-semibold text-emerald-900">
              {role.tasks?.length || 0} tasks defined
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );

  const RoleEditForm = ({ role, onSave, onCancel }) => (
    <Card className="border-none shadow-xl rounded-2xl overflow-hidden ring-2 ring-emerald-500">
      <CardHeader className="p-6 bg-gradient-to-r from-emerald-50 to-blue-50">
        <CardTitle className="flex items-center gap-2">
          <Edit3 className="w-5 h-5 text-emerald-600" />
          Edit Role
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="roleName">Role Name</Label>
            <Input
              id="roleName"
              value={role.role}
              onChange={(e) => setNewRole(prev => ({ ...prev, role: e.target.value }))}
              placeholder="e.g., Frontend Developer"
              className="h-12"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="roleDescription">Role Description</Label>
            <Textarea
              id="roleDescription"
              value={role.description}
              onChange={(e) => setNewRole(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Describe the role responsibilities..."
              rows={3}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="roleType">Payment Type</Label>
            <Select
              value={role.type}
              onValueChange={(value) => setNewRole(prev => ({ 
                ...prev, 
                type: value, 
                pay: value === 'milestone' ? null : prev.pay 
              }))}
            >
              <SelectTrigger className="h-12">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="milestone">Milestone Based</SelectItem>
                <SelectItem value="timesheet">Hourly Rate</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {role.type === 'timesheet' && (
            <div className="space-y-2">
              <Label htmlFor="rolePay">Hourly Rate ($)</Label>
              <Input
                id="rolePay"
                type="number"
                value={role.pay || ''}
                onChange={(e) => setNewRole(prev => ({ ...prev, pay: parseFloat(e.target.value) }))}
                placeholder="e.g., 75"
                className="h-12"
                min="1"
              />
            </div>
          )}
          
          <div className="flex gap-3 pt-4">
            <Button onClick={onSave} className="flex-1 bg-emerald-500 hover:bg-emerald-600">
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
            <Button variant="outline" onClick={onCancel} className="flex-1">
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <div className="inline-flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
            <Users className="w-6 h-6 text-emerald-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900">Review & Edit Roles</h1>
        </div>
        <p className="text-xl text-gray-600">
          Fine-tune your contractor roles and payment structures.
        </p>
      </motion.div>

      <div className="space-y-6">
        <AnimatePresence>
          {roles.map((role, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              {editingRole === index ? (
                <RoleEditForm
                  role={newRole}
                  onSave={handleSaveRole}
                  onCancel={() => setEditingRole(null)}
                />
              ) : (
                <RoleCard role={role} index={index} isEditing={editingRole === index} />
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Add New Role */}
        <AnimatePresence>
          {showAddForm ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Card className="border-none shadow-xl rounded-2xl overflow-hidden ring-2 ring-blue-500">
                <CardHeader className="p-6 bg-gradient-to-r from-blue-50 to-purple-50">
                  <CardTitle className="flex items-center gap-2">
                    <Plus className="w-5 h-5 text-blue-600" />
                    Add New Role
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="newRoleName">Role Name</Label>
                      <Input
                        id="newRoleName"
                        value={newRole.role}
                        onChange={(e) => setNewRole(prev => ({ ...prev, role: e.target.value }))}
                        placeholder="e.g., Backend Developer"
                        className="h-12"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="newRoleDescription">Role Description</Label>
                      <Textarea
                        id="newRoleDescription"
                        value={newRole.description}
                        onChange={(e) => setNewRole(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Describe what this role will do..."
                        rows={3}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="newRoleType">Payment Type</Label>
                      <Select
                        value={newRole.type}
                        onValueChange={(value) => setNewRole(prev => ({ 
                          ...prev, 
                          type: value, 
                          pay: value === 'milestone' ? null : prev.pay 
                        }))}
                      >
                        <SelectTrigger className="h-12">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="milestone">Milestone Based</SelectItem>
                          <SelectItem value="timesheet">Hourly Rate</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    {newRole.type === 'timesheet' && (
                      <div className="space-y-2">
                        <Label htmlFor="newRolePay">Hourly Rate ($)</Label>
                        <Input
                          id="newRolePay"
                          type="number"
                          value={newRole.pay || ''}
                          onChange={(e) => setNewRole(prev => ({ ...prev, pay: parseFloat(e.target.value) }))}
                          placeholder="e.g., 85"
                          className="h-12"
                          min="1"
                        />
                      </div>
                    )}
                    
                    <div className="flex gap-3 pt-4">
                      <Button 
                        onClick={handleAddRole} 
                        className="flex-1 bg-blue-500 hover:bg-blue-600"
                        disabled={!newRole.role || !newRole.description}
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Role
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => setShowAddForm(false)} 
                        className="flex-1"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center hover:border-blue-400 hover:bg-blue-50/50 transition-all duration-300 cursor-pointer"
                    onClick={() => setShowAddForm(true)}>
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Plus className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Add Another Role</h3>
                <p className="text-gray-600">Need more contractor roles for your project?</p>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex justify-between pt-8">
        <Button variant="outline" onClick={handleBack} className="flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back to Project
        </Button>
        <Button 
          onClick={handleNext} 
          className="bg-emerald-500 hover:bg-emerald-600 flex items-center gap-2"
          disabled={roles.length === 0}
        >
          {roles.some(role => role.type === 'milestone') ? 'Configure Tasks' : 'Review & Launch'}
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}