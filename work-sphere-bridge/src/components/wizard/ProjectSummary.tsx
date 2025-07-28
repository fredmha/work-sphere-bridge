
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Clock, Target, CheckCircle, FileText, Users, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useProjectWizard } from './ProjectContext';

export default function ProjectSummary({ projectData, onSubmit, onBack }) {
  const { state, actions } = useProjectWizard();
  const milestoneRoles = projectData.contractorRoles?.filter(role => role.type === 'milestone') || [];
  const timesheetRoles = projectData.contractorRoles?.filter(role => role.type === 'timesheet') || [];

  const calculateTotalMilestoneValue = () => {
    return milestoneRoles.reduce((total, role) => {
      const roleTotal = role.tasks?.reduce((sum, task) => sum + (task.price || 0), 0) || 0;
      return total + roleTotal;
    }, 0);
  };

  const handleSubmit = () => {
    const projectJson = {
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

    onSubmit(projectJson);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeInOut' }}
      className="space-y-8 max-w-6xl mx-auto" // Added max-w-6xl mx-auto back for centering
    >
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 tracking-tight">Review Your Project</h1>
        <p className="text-lg text-gray-500 mt-2">One final look before we find your perfect team.</p>
      </div>
      
      {/* Project Overview Card */}
      <motion.div layout>
        <Card className="border-none shadow-2xl shadow-gray-200/80 rounded-2xl overflow-hidden">
          <CardHeader className="p-8 bg-gray-50/50 border-b">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2 flex items-center">
                  {projectData.projectName}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {projectData.category?.map((cat, index) => (
                    <Badge key={index} variant="secondary" className="bg-emerald-100 text-emerald-800">{cat}</Badge>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                {projectData.duration && (
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>{projectData.duration}</span>
                  </div>
                )}
                {projectData.weeklyHours && (
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>{projectData.weeklyHours} hrs/wk</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  <span>{projectData.contractorRoles?.length || 0} roles</span>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-8">
            <div className="prose max-w-none text-gray-700">
              <p>{projectData.projectDescription}</p>
            </div>
            {projectData.incentive && projectData.incentive.length > 0 && (
              <div className="mt-6">
                <h4 className="text-sm font-semibold text-gray-900 mb-2">Perks</h4>
                <div className="flex flex-wrap gap-2">
                  {projectData.incentive.map((inc, index) => (
                    <Badge key={index} variant="outline">{inc}</Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
      
      {/* Available Roles Section */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Available Roles</h2>
        <AnimatePresence>
          {milestoneRoles.map((role, roleIndex) => (
            <motion.div 
              key={role.role} // Using role.role as key as per outline
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: roleIndex * 0.1 }}
              layout
            >
              <Card className="border-none shadow-xl shadow-gray-200/50 rounded-2xl overflow-hidden">
                <CardHeader className="p-6 flex flex-row justify-between items-start">
                  <div>
                    <CardTitle className="text-xl font-semibold text-gray-900 flex items-center gap-3">
                      <Target className="w-5 h-5 text-emerald-500" />
                      {role.role}
                    </CardTitle>
                    <p className="text-gray-600 mt-1">{role.description}</p>
                  </div>
                  <Button variant="outline" className="text-emerald-600 border-emerald-300 hover:bg-emerald-50">
                    Apply Now
                  </Button>
                </CardHeader>
                <CardContent className="px-6 pb-6">
                  <h4 className="font-semibold text-gray-800 mb-3">Tasks & Milestones</h4>
                  <div className="border rounded-lg">
                    {role.tasks?.map((task, taskIndex) => (
                      <div key={taskIndex} className={`flex justify-between items-center p-4 ${taskIndex < role.tasks.length - 1 ? 'border-b' : ''}`}>
                        <div>
                          <p className="font-medium text-gray-900">{task.name}</p>
                          <p className="text-sm text-gray-500">{task.description}</p>
                        </div>
                        <p className="text-lg font-bold text-emerald-600">${task.price}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
          
          {timesheetRoles.map((role, roleIndex) => (
            <motion.div 
              key={role.role} // Using role.role as key as per outline
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: (milestoneRoles.length + roleIndex) * 0.1 }}
              layout
            >
              <Card className="border-none shadow-xl shadow-gray-200/50 rounded-2xl overflow-hidden">
                <CardHeader className="p-6 flex flex-row justify-between items-start">
                  <div>
                    <CardTitle className="text-xl font-semibold text-gray-900 flex items-center gap-3">
                      <Clock className="w-5 h-5 text-blue-500" />
                      {role.role}
                    </CardTitle>
                    <p className="text-gray-600 mt-1">{role.description}</p>
                  </div>
                  <Button variant="outline" className="text-blue-600 border-blue-300 hover:bg-blue-50">
                    Apply Now
                  </Button>
                </CardHeader>
                <CardContent className="px-6 pb-6">
                  <Badge className="text-base bg-blue-100 text-blue-800 hover:bg-blue-200">
                    Pay per Hour: ${role.pay}/hr
                  </Badge>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="sticky bottom-0 py-4 bg-white/80 backdrop-blur-lg border-t mt-8 -mx-8 px-8">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <Button variant="ghost" onClick={onBack}>
            Go Back
          </Button>
          <Button onClick={handleSubmit} size="lg" className="bg-emerald-600 hover:bg-emerald-700 font-semibold shadow-lg shadow-emerald-500/20">
            <CheckCircle className="w-5 h-5 mr-2" />
            Launch Project
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
