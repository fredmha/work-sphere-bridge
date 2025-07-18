import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  CheckCircle, 
  Edit3, 
  Clock, 
  Target, 
  Calendar, 
  Users, 
  DollarSign,
  Rocket,
  ArrowLeft,
  FileText,
  Star
} from 'lucide-react';
import { useProjectWizard } from './ProjectContext';
import  Project  from '@/entities/Project.json';

export default function AiFinalReview() {
  const { state, actions } = useProjectWizard();
  const [isLaunching, setIsLaunching] = useState(false);

  const projectData = state.aiContext;
  const milestoneRoles = projectData?.contractorRoles?.filter(role => role.type === 'milestone') || [];
  const timesheetRoles = projectData?.contractorRoles?.filter(role => role.type === 'timesheet') || [];

  const calculateTotalMilestoneValue = () => {
    return milestoneRoles.reduce((total, role) => {
      const roleTotal = role.tasks?.reduce((sum, task) => sum + (task.price || 0), 0) || 0;
      return total + roleTotal;
    }, 0);
  };

  const calculateTotalTasks = () => {
    return milestoneRoles.reduce((total, role) => total + (role.tasks?.length || 0), 0);
  };

  const handleEditProject = () => {
    actions.setStep(2);
  };

  const handleEditRoles = () => {
    actions.setStep(3);
  };

  const handleEditTasks = () => {
    actions.setStep(4);
  };

  const handleLaunch = async () => {
    setIsLaunching(true);
    actions.setProcessing(true);

    try {
      const finalProjectData = {
        project: {
          projectName: projectData.projectName,
          projectDescription: projectData.projectDescription,
          category: projectData.category || [],
          duration: projectData.duration || null,
          weeklyHours: projectData.weeklyHours || null,
          incentive: projectData.incentive || [],
          contractorRoles: projectData.contractorRoles || []
        }
      };

      //await Project.create(finalProjectData.project);
      
      // Success feedback
      alert('🎉 Project launched successfully!');
      console.log('Final Project Data:', JSON.stringify(finalProjectData, null, 2));
      
      // Reset wizard
      actions.resetAll();
    } catch (error) {
      console.error('Error launching project:', error);
      alert('❌ Error launching project. Please try again.');
    }

    setIsLaunching(false);
    actions.setProcessing(false);
  };

  const handleBack = () => {
    const hasMilestoneRoles = milestoneRoles.length > 0;
    actions.setStep(hasMilestoneRoles ? 4 : 3);
  };

  const isComplete = projectData?.projectName && 
                    projectData?.projectDescription && 
                    projectData?.contractorRoles?.length > 0 &&
                    projectData.contractorRoles.every(role => {
                      if (role.type === 'timesheet') {
                        return role.pay && role.pay > 0;
                      }
                      return role.tasks && role.tasks.length > 0;
                    });

  return (
    <div className="max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <div className="inline-flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-xl flex items-center justify-center">
            <Rocket className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900">Ready to Launch!</h1>
        </div>
        <p className="text-xl text-gray-600">
          Review your project one last time before we find your perfect team.
        </p>
      </motion.div>

      {/* Project Overview */}
      <Card className="border-none shadow-2xl shadow-gray-200/50 rounded-3xl overflow-hidden mb-8">
        <CardHeader className="p-8 bg-gradient-to-r from-emerald-50 to-blue-50">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                <FileText className="w-8 h-8 text-emerald-600" />
                {projectData?.projectName}
              </CardTitle>
              <div className="flex items-center gap-2 mb-4">
                <Badge variant="secondary" className="bg-emerald-100 text-emerald-800">
                  <Star className="w-3 h-3 mr-1" />
                  AI Generated
                </Badge>
                {projectData?.category?.map((cat, index) => (
                  <Badge key={index} variant="outline">{cat}</Badge>
                ))}
              </div>
            </div>
            <Button variant="outline" onClick={handleEditProject} className="flex items-center gap-2">
              <Edit3 className="w-4 h-4" />
              Edit Project
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-8">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Project Description</h4>
              <p className="text-gray-700 leading-relaxed">{projectData?.projectDescription}</p>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {projectData?.duration && (
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">Duration</p>
                      <p className="font-medium">{projectData.duration}</p>
                    </div>
                  </div>
                )}
                {projectData?.weeklyHours && (
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">Weekly Hours</p>
                      <p className="font-medium">{projectData.weeklyHours} hrs</p>
                    </div>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Contractor Roles</p>
                  <p className="font-medium">{projectData?.contractorRoles?.length || 0} roles</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Project Statistics */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <Card className="border-none shadow-lg rounded-2xl">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <DollarSign className="w-6 h-6 text-emerald-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">${calculateTotalMilestoneValue()}</div>
            <div className="text-sm text-gray-500">Total Milestone Value</div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-lg rounded-2xl">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Target className="w-6 h-6 text-blue-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{calculateTotalTasks()}</div>
            <div className="text-sm text-gray-500">Total Tasks</div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-lg rounded-2xl">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{projectData?.contractorRoles?.length || 0}</div>
            <div className="text-sm text-gray-500">Contractor Roles</div>
          </CardContent>
        </Card>
      </div>

      {/* Available Roles */}
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">Available Roles</h2>
          <Button variant="outline" onClick={handleEditRoles} className="flex items-center gap-2">
            <Edit3 className="w-4 h-4" />
            Edit Roles
          </Button>
        </div>
        
        <AnimatePresence>
          {milestoneRoles.map((role, roleIndex) => (
            <motion.div 
              key={role.role}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: roleIndex * 0.1 }}
              layout
            >
              <Card className="border-none shadow-xl shadow-gray-200/50 rounded-2xl overflow-hidden">
                <CardHeader className="p-6 bg-gradient-to-r from-emerald-50 to-blue-50">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl font-semibold text-gray-900 flex items-center gap-3">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                        {role.role}
                      </CardTitle>
                      <p className="text-gray-600 mt-1">{role.description}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" onClick={handleEditTasks} className="text-emerald-600 border-emerald-300">
                        <Edit3 className="w-4 h-4 mr-1" />
                        Edit Tasks
                      </Button>
                      <Button variant="outline" className="text-emerald-600 border-emerald-300">
                        Apply Now
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <h4 className="font-semibold text-gray-800 mb-3">Tasks & Milestones</h4>
                  {role.tasks && role.tasks.length > 0 ? (
                    <div className="border rounded-lg overflow-hidden">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Task</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead>Deliverables</TableHead>
                            <TableHead>Price</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {role.tasks.map((task, taskIndex) => (
                            <TableRow key={taskIndex}>
                              <TableCell className="font-medium">{task.name}</TableCell>
                              <TableCell className="max-w-xs truncate">{task.description}</TableCell>
                              <TableCell className="max-w-xs truncate">{task.deliverables}</TableCell>
                              <TableCell className="font-bold text-emerald-600">${task.price}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      No tasks defined for this role yet.
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
          
          {timesheetRoles.map((role, roleIndex) => (
            <motion.div 
              key={role.role}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: (milestoneRoles.length + roleIndex) * 0.1 }}
              layout
            >
              <Card className="border-none shadow-xl shadow-gray-200/50 rounded-2xl overflow-hidden">
                <CardHeader className="p-6 bg-gradient-to-r from-blue-50 to-purple-50">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl font-semibold text-gray-900 flex items-center gap-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        {role.role}
                      </CardTitle>
                      <p className="text-gray-600 mt-1">{role.description}</p>
                    </div>
                    <Button variant="outline" className="text-blue-600 border-blue-300">
                      Apply Now
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <Badge className="text-lg px-4 py-2 bg-blue-100 text-blue-800">
                    <Clock className="w-4 h-4 mr-2" />
                    Pay per Hour: ${role.pay}/hr
                  </Badge>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Launch Section */}
      <div className="sticky bottom-0 py-6 bg-white/90 backdrop-blur-lg border-t mt-12 -mx-8 px-8">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={handleBack} className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
            {!isComplete && (
              <div className="text-sm text-amber-600 bg-amber-50 px-3 py-1 rounded-full">
                Complete all roles and tasks to launch
              </div>
            )}
          </div>
          <Button 
            onClick={handleLaunch} 
            disabled={!isComplete || isLaunching}
            size="lg" 
            className="bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 font-semibold shadow-lg shadow-emerald-500/20 px-8"
          >
            {isLaunching ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Launching...
              </>
            ) : (
              <>
                <Rocket className="w-5 h-5 mr-2" />
                Launch Project
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}