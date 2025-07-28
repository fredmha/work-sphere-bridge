import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Trash2, Edit3, Target } from 'lucide-react';

export default function TaskManager({ roles, onUpdate, onNext, onBack }) {
  const [currentRoles, setCurrentRoles] = useState(roles || []);
  const [activeRoleIndex, setActiveRoleIndex] = useState(0);
  const [newTask, setNewTask] = useState({
    name: '',
    description: '',
    deliverables: '',
    price: null
  });
  const [editingTask, setEditingTask] = useState(null);

  const milestoneRoles = currentRoles.filter(role => role.type === 'milestone');
  const currentRole = milestoneRoles[activeRoleIndex];

  const addTask = () => {
    if (newTask.name && newTask.description && newTask.deliverables && newTask.price) {
      const updatedRoles = [...currentRoles];
      const roleIndex = currentRoles.findIndex(r => r.role === currentRole.role);
      updatedRoles[roleIndex].tasks.push({ ...newTask });
      setCurrentRoles(updatedRoles);
      setNewTask({
        name: '',
        description: '',
        deliverables: '',
        price: null
      });
    }
  };

  const removeTask = (taskIndex) => {
    const updatedRoles = [...currentRoles];
    const roleIndex = currentRoles.findIndex(r => r.role === currentRole.role);
    updatedRoles[roleIndex].tasks.splice(taskIndex, 1);
    setCurrentRoles(updatedRoles);
  };

  const editTask = (taskIndex) => {
    setEditingTask(taskIndex);
    setNewTask(currentRole.tasks[taskIndex]);
  };

  const saveEdit = () => {
    if (editingTask !== null) {
      const updatedRoles = [...currentRoles];
      const roleIndex = currentRoles.findIndex(r => r.role === currentRole.role);
      updatedRoles[roleIndex].tasks[editingTask] = { ...newTask };
      setCurrentRoles(updatedRoles);
      setEditingTask(null);
      setNewTask({
        name: '',
        description: '',
        deliverables: '',
        price: null
      });
    }
  };

  const handleNext = () => {
    // Validate all milestone roles have at least one task
    const allMilestoneRolesHaveTasks = milestoneRoles.every(role => role.tasks.length > 0);
    if (allMilestoneRolesHaveTasks) {
      onUpdate(currentRoles);
      onNext();
    }
  };

  if (milestoneRoles.length === 0) {
    return (
      <Card className="max-w-4xl mx-auto">
        <CardContent className="text-center py-12">
          <Target className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Milestone Roles Found</h3>
          <p className="text-gray-600 mb-6">You don't have any milestone-based roles that require task configuration.</p>
          <div className="flex justify-center gap-4">
            <Button variant="outline" onClick={onBack}>
              Back to Roles
            </Button>
            <Button onClick={() => onNext()} className="bg-emerald-500 hover:bg-emerald-600">
              Continue to Review
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-gray-900">Tasks & Milestones</CardTitle>
          <p className="text-gray-600">Define tasks for milestone-based roles</p>
        </CardHeader>
        <CardContent>
          {/* Role Tabs */}
          <div className="flex flex-wrap gap-2 mb-6">
            {milestoneRoles.map((role, index) => (
              <Button
                key={index}
                variant={activeRoleIndex === index ? "default" : "outline"}
                onClick={() => setActiveRoleIndex(index)}
                className="mb-2"
              >
                {role.role}
                {role.tasks.length > 0 && (
                  <span className="ml-2 px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs">
                    {role.tasks.length}
                  </span>
                )}
              </Button>
            ))}
          </div>

          {/* Task Form */}
          <div className="grid md:grid-cols-2 gap-6 mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="taskName" className="text-sm font-medium text-gray-700">
                  Task Name *
                </Label>
                <Input
                  id="taskName"
                  value={newTask.name}
                  onChange={(e) => setNewTask(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g., Data Collection and Cleaning"
                  className="h-12"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="taskPrice" className="text-sm font-medium text-gray-700">
                  Task Price ($) *
                </Label>
                <Input
                  id="taskPrice"
                  type="number"
                  value={newTask.price || ''}
                  onChange={(e) => setNewTask(prev => ({ ...prev, price: parseFloat(e.target.value) }))}
                  placeholder="e.g., 800"
                  className="h-12"
                  min="1"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="taskDescription" className="text-sm font-medium text-gray-700">
                  Task Description *
                </Label>
                <Textarea
                  id="taskDescription"
                  value={newTask.description}
                  onChange={(e) => setNewTask(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe the task..."
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="taskDeliverables" className="text-sm font-medium text-gray-700">
                  Deliverables *
                </Label>
                <Textarea
                  id="taskDeliverables"
                  value={newTask.deliverables}
                  onChange={(e) => setNewTask(prev => ({ ...prev, deliverables: e.target.value }))}
                  placeholder="What will be delivered..."
                  rows={2}
                />
              </div>
            </div>

            <div className="md:col-span-2">
              <div className="flex gap-2">
                {editingTask !== null ? (
                  <>
                    <Button onClick={saveEdit} className="bg-emerald-500 hover:bg-emerald-600">
                      Save Changes
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setEditingTask(null);
                        setNewTask({
                          name: '',
                          description: '',
                          deliverables: '',
                          price: null
                        });
                      }}
                    >
                      Cancel
                    </Button>
                  </>
                ) : (
                  <Button onClick={addTask} className="bg-emerald-500 hover:bg-emerald-600">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Task
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Tasks Table */}
          {currentRole?.tasks.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Tasks for {currentRole.role}
              </h3>
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Task Name</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Deliverables</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentRole.tasks.map((task, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{task.name}</TableCell>
                        <TableCell className="max-w-xs truncate">{task.description}</TableCell>
                        <TableCell className="max-w-xs truncate">{task.deliverables}</TableCell>
                        <TableCell className="font-medium">${task.price}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => editTask(index)}
                            >
                              <Edit3 className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => removeTask(index)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}

          <div className="flex justify-between pt-6">
            <Button variant="outline" onClick={onBack}>
              Back
            </Button>
            <Button 
              onClick={handleNext}
              disabled={milestoneRoles.some(role => role.tasks.length === 0)}
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