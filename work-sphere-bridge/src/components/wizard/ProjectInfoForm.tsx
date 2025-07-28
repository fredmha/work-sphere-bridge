
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { X, Plus } from 'lucide-react';
import { motion } from 'framer-motion';

const categoryOptions = [
  'Mobile App Development', 'Web Development', 'Data Science', 'Machine Learning',
  'UI/UX Design', 'Backend Development', 'DevOps', 'Quality Assurance', 'Product Management'
];

const incentiveOptions = [
  'Remote Work', 'Flexible Hours', 'Performance Bonus', 'Equity Options',
  'Professional Development', 'Health Benefits', 'Paid Time Off'
];

export default function ProjectInfoForm({ projectData, onUpdate, onNext, onBack }) {
  const [formData, setFormData] = useState(projectData);
  const [newCategory, setNewCategory] = useState('');
  const [newIncentive, setNewIncentive] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.projectName && formData.projectDescription) {
      onUpdate(formData);
      onNext();
    }
  };

  const addCategory = () => {
    if (newCategory && !formData.category?.includes(newCategory)) {
      setFormData(prev => ({
        ...prev,
        category: [...(prev.category || []), newCategory]
      }));
      setNewCategory('');
    }
  };

  const removeCategory = (categoryToRemove) => {
    setFormData(prev => ({
      ...prev,
      category: prev.category?.filter(cat => cat !== categoryToRemove) || []
    }));
  };

  const addIncentive = () => {
    if (newIncentive && !formData.incentive?.includes(newIncentive)) {
      setFormData(prev => ({
        ...prev,
        incentive: [...(prev.incentive || []), newIncentive]
      }));
      setNewIncentive('');
    }
  };

  const removeIncentive = (incentiveToRemove) => {
    setFormData(prev => ({
      ...prev,
      incentive: prev.incentive?.filter(inc => inc !== incentiveToRemove) || []
    }));
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.5, ease: 'easeInOut' }}
    >
      <Card className="max-w-4xl mx-auto border-none shadow-2xl shadow-gray-200/80 rounded-2xl">
        <CardHeader className="p-8">
          <CardTitle className="text-3xl font-bold text-gray-900 tracking-tight">Tell us about your project</CardTitle>
          <p className="text-gray-500">This information will help us find the best talent for your needs.</p>
        </CardHeader>
        <CardContent className="p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-2">
              <Label htmlFor="projectName" className="text-sm font-medium text-gray-700">
                Project Name *
              </Label>
              <Input
                id="projectName"
                value={formData.projectName || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, projectName: e.target.value }))}
                placeholder="e.g., 'E-commerce Platform Overhaul'"
                className="h-12 text-base"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="projectDescription" className="text-sm font-medium text-gray-700">
                Project Description *
              </Label>
              <Textarea
                id="projectDescription"
                value={formData.projectDescription || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, projectDescription: e.target.value }))}
                placeholder="Describe the project goals, scope, and key deliverables..."
                rows={5}
                className="text-base"
                required
              />
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <Label htmlFor="duration" className="text-sm font-medium text-gray-700">
                  Expected Duration
                </Label>
                <Select
                  value={formData.duration || ''}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, duration: value }))}
                >
                  <SelectTrigger className="h-12 text-base">
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1-3 months">1-3 months</SelectItem>
                    <SelectItem value="3-6 months">3-6 months</SelectItem>
                    <SelectItem value="6-12 months">6-12 months</SelectItem>
                    <SelectItem value="12+ months">12+ months</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="weeklyHours" className="text-sm font-medium text-gray-700">
                  Weekly Commitment
                </Label>
                <Input
                  id="weeklyHours"
                  type="number"
                  value={formData.weeklyHours || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, weeklyHours: parseInt(e.target.value) }))}
                  placeholder="e.g., 20 hrs/week"
                  className="h-12 text-base"
                  min="1"
                  max="80"
                />
              </div>
            </div>

            <div className="space-y-4">
              <Label className="text-sm font-medium text-gray-700">Categories</Label>
              <div className="p-4 border rounded-lg bg-gray-50/50">
                <div className="flex flex-wrap gap-2 mb-3">
                  {formData.category?.map((category, index) => (
                    <Badge key={index} variant="secondary" className="px-3 py-1 text-sm bg-emerald-100 text-emerald-800 hover:bg-emerald-200">
                      {category}
                      <button
                        type="button"
                        onClick={() => removeCategory(category)}
                        className="ml-2 rounded-full hover:bg-black/10 p-0.5"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Select value={newCategory} onValueChange={setNewCategory}>
                    <SelectTrigger className="flex-1 bg-white">
                      <SelectValue placeholder="Add a category..." />
                    </SelectTrigger>
                    <SelectContent>
                      {categoryOptions.map(option => (
                        <SelectItem key={option} value={option}>{option}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button type="button" onClick={addCategory} variant="outline" className="bg-white">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <Label className="text-sm font-medium text-gray-700">Perks & Incentives</Label>
              <div className="p-4 border rounded-lg bg-gray-50/50">
                <div className="flex flex-wrap gap-2 mb-3">
                  {formData.incentive?.map((incentive, index) => (
                    <Badge key={index} variant="secondary" className="px-3 py-1 text-sm bg-blue-100 text-blue-800 hover:bg-blue-200">
                      {incentive}
                      <button
                        type="button"
                        onClick={() => removeIncentive(incentive)}
                        className="ml-2 rounded-full hover:bg-black/10 p-0.5"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Select value={newIncentive} onValueChange={setNewIncentive}>
                    <SelectTrigger className="flex-1 bg-white">
                      <SelectValue placeholder="Add an incentive..." />
                    </SelectTrigger>
                    <SelectContent>
                      {incentiveOptions.map(option => (
                        <SelectItem key={option} value={option}>{option}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button type="button" onClick={addIncentive} variant="outline" className="bg-white">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex justify-between pt-8 border-t">
              <Button type="button" variant="ghost" onClick={onBack}>
                Back
              </Button>
              <Button type="submit" size="lg" className="bg-emerald-600 hover:bg-emerald-700 font-semibold shadow-lg shadow-emerald-500/20">
                Continue to Roles
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}
