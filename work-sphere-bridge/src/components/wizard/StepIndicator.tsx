import React from 'react';
import { motion } from 'framer-motion';
import { useProjectWizard } from './ProjectContext';

const aiSteps = [
  { id: 1, name: 'Describe', description: 'Tell us about your project' },
  { id: 2, name: 'Review Project', description: 'Confirm project details' },
  { id: 3, name: 'Review Roles', description: 'Configure contractor roles' },
  { id: 4, name: 'Tasks', description: 'Define milestones & tasks' },
  { id: 5, name: 'Launch', description: 'Review and submit' }
];

const manualSteps = [
  { id: 1, name: 'Project Info', description: 'Basic project details' },
  { id: 2, name: 'Roles', description: 'Define contractor roles' },
  { id: 3, name: 'Tasks', description: 'Configure deliverables' },
  { id: 4, name: 'Launch', description: 'Review and submit' }
];

export default function StepIndicator() {
  const { state, actions } = useProjectWizard();
  
  if (!state.currentMode || state.currentStep === 0) return null;
  
  const steps = state.currentMode === 'ai' ? aiSteps : manualSteps;
  const currentStep = state.currentStep;

  return (
    <div className="w-full max-w-5xl mx-auto mb-12">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <React.Fragment key={step.id}>
            <div className="flex items-center text-center flex-col">
              <motion.div
                animate={currentStep >= step.id ? "active" : "inactive"}
                variants={{
                  active: { 
                    scale: 1.1, 
                    backgroundColor: "#10B981", 
                    color: "#ffffff",
                    boxShadow: "0 0 20px rgba(16, 185, 129, 0.3)"
                  },
                  inactive: { 
                    scale: 1, 
                    backgroundColor: "#F3F4F6", 
                    color: "#6B7280",
                    boxShadow: "none"
                  }
                }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold"
              >
                {currentStep > step.id ? '✓' : step.id}
              </motion.div>
              <div className="mt-3 max-w-24">
                <p className={`text-sm font-medium transition-colors ${
                  currentStep >= step.id ? 'text-gray-900' : 'text-gray-500'
                }`}>
                  {step.name}
                </p>
                <p className="text-xs text-gray-400 mt-1 hidden sm:block">
                  {step.description}
                </p>
              </div>
            </div>
            {index < steps.length - 1 && (
              <motion.div className="flex-1 h-1 mx-4 rounded-full bg-gray-200">
                <motion.div
                  className="h-1 rounded-full bg-emerald-500"
                  initial={{ width: '0%' }}
                  animate={{ width: currentStep > step.id ? '100%' : '0%' }}
                  transition={{ duration: 0.5, ease: 'easeInOut' }}
                />
              </motion.div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}