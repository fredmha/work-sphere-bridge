import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  Plus, 
  Edit3, 
  Trash2, 
  Save, 
  X, 
  Target, 
  ArrowRight, 
  ArrowLeft,
  DollarSign
} from 'lucide-react';
import { useProjectWizard } from './ProjectContext';

export default function AiTaskManager() {
  const { state, actions } = useProjectWizard();
  const [activeRoleIndex, setActiveRoleIndex] = useState(0);
  const [editingTask, setEditingTask] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTask, setNewTask] = useState({
    name: '',
    description: '',
    deliverables: '',
    price: null
  });

  const roles = state.aiContext?.contractorRoles || [];
  const milestoneRoles = roles.filter(role => role.type === 'milestone');
  const currentRole = milestoneRoles[activeRoleIndex];

  const handleEditTask = (taskIndex) => {
    setEditingTask(taskIndex);
    setNewTask({ ...currentRole.tasks[taskIndex] });
  };

  const handleSaveTask = () => {
    const updatedRoles = [...roles];
    const roleIndex = roles.findIndex(r => r.role === currentRole.role);
    
    if (editingTask !== null) {
      updatedRoles[roleIndex].tasks[editingTask] = { ...newTask };
    }
    
    actions.updateAiContext({
      contractorRoles: updatedRoles
    });
    
    setEditingTask(null);
    setNewTask({
      name: '',
      description: '',
      deliverables: '',
      price: null
    });
  };

  const handleAddTask = () => {
    if (!newTask.name || !newTask.description || !newTask.deliverables || !newTask.price) return;
    
    const updatedRoles = [...roles];
    const roleIndex = roles.findIndex(r => r.role === currentRole.role);
    
    if (!updatedRoles[roleIndex].tasks) {
      updatedRoles[roleIndex].tasks = [];
    }
    
    updatedRoles[roleIndex].tasks.push({ ...newTask });
    
    actions.updateAiContext({
      contractorRoles: updatedRoles
    });
    
    setNewTask({
      name: '',
      description: '',
      deliverables: '',
      price: null
    });
    setShowAddForm(false);
  };

  const handleDeleteTask = (taskIndex) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      const updatedRoles = [...roles];
      const roleIndex = roles.findIndex(r => r.role === currentRole.role);
      
      updatedRoles[roleIndex].tasks.splice(taskIndex, 1);
      
      actions.updateAiContext({
        contractorRoles: updatedRoles
      });
    }
  };

  const handleNext = () => {
    actions.updateAiContext({ currentStep: 'final-review' });
    actions.setStep(5);
  };

  const handleBack = () => {
    actions.setStep(3);
  };

  const getTotalPrice = () => {
    return currentRole?.tasks?.reduce((sum, task) => sum + (task.price || 0), 0) || 0;
  };

  if (milestoneRoles.length === 0) {
    return (
      <div className="max-w-4xl mx-auto text-center py-16">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Target className="w-8 h-8 text-gray-400" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">No Milestone Roles</h2>
        <p className="text-gray-600 mb-8">All your roles are hourly-based. No tasks to configure.</p>
        <Button onClick={handleNext} className="bg-emerald-500 hover:bg-emerald-600">
          Continue to Review
        </Button>
      </div>
    );
  }

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
            <Target className="w-6 h-6 text-emerald-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900">Configure Tasks & Milestones</h1>
        </div>
        <p className="text-xl text-gray-600">
          Define specific tasks and deliverables for each milestone-based role.
        </p>
      </motion.div>

      {/* Role Tabs */}
      <div className="flex flex-wrap gap-2 mb-8">
        {milestoneRoles.map((role, index) => (
          <Button
            key={index}
            variant={activeRoleIndex === index ? "default" : "outline"}
            onClick={() => setActiveRoleIndex(index)}
            className="mb-2 relative"
          >
            {role.role}
            {role.tasks && role.tasks.length > 0 && (
              <span className="ml-2 px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-medium">
                {role.tasks.length}
              </span>
            )}
          </Button>
        ))}
      </div>

      {/* Current Role Header */}
      <Card className="border-none shadow-lg rounded-2xl mb-8">
        <CardHeader className="p-6 bg-gradient-to-r from-emerald-50 to-blue-50">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Target className="w-6 h-6 text-emerald-600" />
                {currentRole.role}
              </CardTitle>
              <p className="text-gray-600 mt-1">{currentRole.description}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Total Value</p>
              <p className="text-2xl font-bold text-emerald-600">${getTotalPrice()}</p>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Tasks Table */}
      {currentRole.tasks && currentRole.tasks.length > 0 && (
        <Card className="border-none shadow-lg rounded-2xl mb-6">
          <CardHeader className="p-6">
            <CardTitle className="text-lg">Current Tasks</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
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
                    <TableCell className="max-w-xs">
                      <div className="truncate">{task.description}</div>
                    </TableCell>
                    <TableCell className="max-w-xs">
                      <div className="truncate">{task.deliverables}</div>
                    </TableCell>
                    <TableCell className="font-bold text-emerald-600">${task.price}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditTask(index)}
                        >
                          <Edit3 className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteTask(index)}
                          className="hover:bg-red-50 hover:text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Edit Task Form */}
      <AnimatePresence>
        {editingTask !== null && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-6"
          >
            <Card className="border-none shadow-xl rounded-2xl ring-2 ring-emerald-500">
              <CardHeader className="p-6 bg-gradient-to-r from-emerald-50 to-blue-50">
                <CardTitle className="flex items-center gap-2">
                  <Edit3 className="w-5 h-5 text-emerald-600" />
                  Edit Task
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="taskName">Task Name</Label>
                      <Input
                        id="taskName"
                        value={newTask.name}
                        onChange={(e) => setNewTask(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="e.g., Landing Page Design"
                        className="h-12"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="taskPrice">Price ($)</Label>
                      <Input
                        id="taskPrice"
                        type="number"
                        value={newTask.price || ''}
                        onChange={(e) => setNewTask(prev => ({ ...prev, price: parseFloat(e.target.value) }))}
                        placeholder="e.g., 1500"
                        className="h-12"
                        min="1"
                      />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="taskDescription">Description</Label>
                      <Textarea
                        id="taskDescription"
                        value={newTask.description}
                        onChange={(e) => setNewTask(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Describe the task..."
                        rows={3}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="taskDeliverables">Deliverables</Label>
                      <Textarea
                        id="taskDeliverables"
                        value={newTask.deliverables}
                        onChange={(e) => setNewTask(prev => ({ ...prev, deliverables: e.target.value }))}
                        placeholder="What will be delivered..."
                        rows={3}
                      />
                    </div>
                  </div>
                </div>
                <div className="flex gap-3 pt-6">
                  <Button onClick={handleSaveTask} className="flex-1 bg-emerald-500 hover:bg-emerald-600">
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </Button>
                  <Button variant="outline" onClick={() => setEditingTask(null)} className="flex-1">
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Task Form */}
      <AnimatePresence>
        {showAddForm ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-6"
          >
            <Card className="border-none shadow-xl rounded-2xl ring-2 ring-blue-500">
              <CardHeader className="p-6 bg-gradient-to-r from-blue-50 to-purple-50">
                <CardTitle className="flex items-center gap-2">
                  <Plus className="w-5 h-5 text-blue-600" />
                  Add New Task
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="newTaskName">Task Name</Label>
                      <Input
                        id="newTaskName"
                        value={newTask.name}
                        onChange={(e) => setNewTask(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="e.g., User Dashboard"
                        className="h-12"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="newTaskPrice">Price ($)</Label>
                      <Input
                        id="newTaskPrice"
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
                      <Label htmlFor="newTaskDescription">Description</Label>
                      <Textarea
                        id="newTaskDescription"
                        value={newTask.description}
                        onChange={(e) => setNewTask(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Describe what needs to be done..."
                        rows={3}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="newTaskDeliverables">Deliverables</Label>
                      <Textarea
                        id="newTaskDeliverables"
                        value={newTask.deliverables}
                        onChange={(e) => setNewTask(prev => ({ ...prev, deliverables: e.target.value }))}
                        placeholder="What will be delivered..."
                        rows={3}
                      />
                    </div>
                  </div>
                </div>
                <div className="flex gap-3 pt-6">
                  <Button 
                    onClick={handleAddTask} 
                    className="flex-1 bg-blue-500 hover:bg-blue-600"
                    disabled={!newTask.name || !newTask.description || !newTask.deliverables || !newTask.price}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Task
                  </Button>
                  <Button variant="outline" onClick={() => setShowAddForm(false)} className="flex-1">
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <Card className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center hover:border-emerald-400 hover:bg-emerald-50/50 transition-all duration-300 cursor-pointer"
                  onClick={() => setShowAddForm(true)}>
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Plus className="w-8 h-8 text-emerald-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Add Task</h3>
              <p className="text-gray-600">Add another task for {currentRole.role}</p>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex justify-between pt-8">
        <Button variant="outline" onClick={handleBack} className="flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back to Roles
        </Button>
        <Button 
          onClick={handleNext} 
          className="bg-emerald-500 hover:bg-emerald-600 flex items-center gap-2"
        >
          Review & Launch
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}