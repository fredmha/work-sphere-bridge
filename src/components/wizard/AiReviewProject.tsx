import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Edit3, ArrowRight, ArrowLeft } from 'lucide-react';
import { useProjectWizard } from './ProjectContext';

export default function AiReviewProject() {
  const { state, actions } = useProjectWizard();
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({
    projectName: state.aiContext?.projectName || '',
    projectDescription: state.aiContext?.projectDescription || ''
  });

  const handleSave = () => {
    actions.updateAiContext(editedData);
    setIsEditing(false);
  };

  const handleNext = () => {
    if (isEditing) {
      handleSave();
    }
    actions.updateAiContext({ currentStep: 'review-roles' });
    actions.setStep(3);
  };

  const handleBack = () => {
    actions.setStep(1);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <div className="inline-flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
            <CheckCircle className="w-6 h-6 text-emerald-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900">Review Your Project</h1>
        </div>
        <p className="text-xl text-gray-600">
          Our AI has analyzed your description. Feel free to make any adjustments.
        </p>
      </motion.div>

      <Card className="border-none shadow-2xl shadow-gray-200/50 rounded-3xl overflow-hidden mb-8">
        <CardHeader className="bg-gradient-to-r from-emerald-50 to-blue-50 p-8">
          <div className="flex justify-between items-center">
            <CardTitle className="text-xl">Project Details</CardTitle>
            <Button
              variant="outline"
              onClick={() => setIsEditing(!isEditing)}
              className="flex items-center gap-2"
            >
              <Edit3 className="w-4 h-4" />
              {isEditing ? 'Cancel' : 'Edit'}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-8">
          {isEditing ? (
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="projectName">Project Name</Label>
                <Input
                  id="projectName"
                  value={editedData.projectName}
                  onChange={(e) => setEditedData(prev => ({ ...prev, projectName: e.target.value }))}
                  className="text-lg font-semibold"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="projectDescription">Project Description</Label>
                <Textarea
                  id="projectDescription"
                  value={editedData.projectDescription}
                  onChange={(e) => setEditedData(prev => ({ ...prev, projectDescription: e.target.value }))}
                  rows={4}
                  className="text-base"
                />
              </div>
              <Button onClick={handleSave} className="w-full bg-emerald-500 hover:bg-emerald-600">
                Save Changes
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {state.aiContext?.projectName}
                </h3>
                <div className="inline-flex items-center gap-2 mb-4">
                  <Badge variant="secondary" className="bg-emerald-100 text-emerald-800">
                    AI Generated
                  </Badge>
                </div>
              </div>
              <div>
                <p className="text-gray-700 leading-relaxed text-lg">
                  {state.aiContext?.projectDescription}
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Roles Preview */}
      {state.aiContext?.contractorRoles?.length > 0 && (
        <Card className="border-none shadow-xl shadow-gray-200/30 rounded-2xl mb-8">
          <CardHeader className="p-6">
            <CardTitle className="text-lg">Detected Roles ({state.aiContext.contractorRoles.length})</CardTitle>
          </CardHeader>
          <CardContent className="p-6 pt-0">
            <div className="grid gap-3">
              {state.aiContext.contractorRoles.map((role, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-semibold text-gray-900">{role.role}</h4>
                    <p className="text-sm text-gray-600 capitalize">{role.type} based</p>
                  </div>
                  <Badge variant={role.type === 'milestone' ? 'default' : 'secondary'}>
                    {role.type === 'milestone' ? `${role.tasks?.length || 0} tasks` : `$${role.pay}/hr`}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex justify-between">
        <Button variant="outline" onClick={handleBack} className="flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back to Description
        </Button>
        <Button onClick={handleNext} className="bg-emerald-500 hover:bg-emerald-600 flex items-center gap-2">
          Review Roles
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}