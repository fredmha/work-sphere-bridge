import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, Edit3, Clock, Target } from 'lucide-react';

export default function RoleManager({ roles, onUpdate, onNext, onBack }) {
  const [currentRoles, setCurrentRoles] = useState(roles || []);
  const [editingRole, setEditingRole] = useState(null);
  const [newRole, setNewRole] = useState({
    role: '',
    description: '',
    type: 'milestone',
    pay: null,
    tasks: []
  });

  const addRole = () => {
    if (newRole.role && newRole.description) {
      const roleToAdd = {
        ...newRole,
        tasks: newRole.type === 'milestone' ? [] : []
      };
      setCurrentRoles([...currentRoles, roleToAdd]);
      setNewRole({
        role: '',
        description: '',
        type: 'milestone',
        pay: null,
        tasks: []
      });
    }
  };

  const removeRole = (index) => {
    setCurrentRoles(currentRoles.filter((_, i) => i !== index));
  };

  const editRole = (index) => {
    setEditingRole(index);
    setNewRole(currentRoles[index]);
  };

  const saveEdit = () => {
    if (editingRole !== null) {
      const updatedRoles = [...currentRoles];
      updatedRoles[editingRole] = newRole;
      setCurrentRoles(updatedRoles);
      setEditingRole(null);
      setNewRole({
        role: '',
        description: '',
        type: 'milestone',
        pay: null,
        tasks: []
      });
    }
  };

  const handleNext = () => {
    onUpdate(currentRoles);
    onNext();
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-gray-900">Contractor Roles</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="role" className="text-sm font-medium text-gray-700">
                  Role Name *
                </Label>
                <Input
                  id="role"
                  value={newRole.role}
                  onChange={(e) => setNewRole(prev => ({ ...prev, role: e.target.value }))}
                  placeholder="e.g., Frontend Developer"
                  className="h-12"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="type" className="text-sm font-medium text-gray-700">
                  Payment Type *
                </Label>
                <Select
                  value={newRole.type}
                  onValueChange={(value) => setNewRole(prev => ({ ...prev, type: value, pay: value === 'milestone' ? null : prev.pay }))}
                >
                  <SelectTrigger className="h-12">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="milestone">
                      <div className="flex items-center">
                        <Target className="w-4 h-4 mr-2" />
                        Milestone-based
                      </div>
                    </SelectItem>
                    <SelectItem value="timesheet">
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-2" />
                        Hourly timesheet
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {newRole.type === 'timesheet' && (
                <div className="space-y-2">
                  <Label htmlFor="pay" className="text-sm font-medium text-gray-700">
                    Pay per Hour ($) *
                  </Label>
                  <Input
                    id="pay"
                    type="number"
                    value={newRole.pay || ''}
                    onChange={(e) => setNewRole(prev => ({ ...prev, pay: parseFloat(e.target.value) }))}
                    placeholder="e.g., 65"
                    className="h-12"
                    min="1"
                  />
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="description" className="text-sm font-medium text-gray-700">
                  Role Description *
                </Label>
                <Textarea
                  id="description"
                  value={newRole.description}
                  onChange={(e) => setNewRole(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe the role responsibilities..."
                  rows={4}
                />
              </div>

              <div className="flex gap-2">
                {editingRole !== null ? (
                  <>
                    <Button onClick={saveEdit} className="flex-1 bg-emerald-500 hover:bg-emerald-600">
                      Save Changes
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setEditingRole(null);
                        setNewRole({
                          role: '',
                          description: '',
                          type: 'milestone',
                          pay: null,
                          tasks: []
                        });
                      }}
                    >
                      Cancel
                    </Button>
                  </>
                ) : (
                  <Button onClick={addRole} className="flex-1 bg-emerald-500 hover:bg-emerald-600">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Role
                  </Button>
                )}
              </div>
            </div>
          </div>

          {currentRoles.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Added Roles</h3>
              <div className="grid gap-4">
                {currentRoles.map((role, index) => (
                  <div key={index} className="border rounded-lg p-4 bg-gray-50">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-gray-900">{role.role}</h4>
                          <Badge variant={role.type === 'milestone' ? 'default' : 'secondary'}>
                            {role.type === 'milestone' ? (
                              <><Target className="w-3 h-3 mr-1" />Milestone</>
                            ) : (
                              <><Clock className="w-3 h-3 mr-1" />Timesheet</>
                            )}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{role.description}</p>
                        {role.type === 'timesheet' && (
                          <p className="text-sm font-medium text-emerald-600">
                            Pay per Hour: ${role.pay}/hr
                          </p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => editRole(index)}
                        >
                          <Edit3 className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeRole(index)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-between pt-6">
            <Button variant="outline" onClick={onBack}>
              Back
            </Button>
            <Button 
              onClick={handleNext}
              disabled={currentRoles.length === 0}
              className="bg-emerald-500 hover:bg-emerald-600"
            >
              Continue
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}