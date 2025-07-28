import React from 'react';
import { motion } from 'framer-motion';
import { useProjectWizard } from './ProjectContext';
import ProjectSummary from './ProjectSummary';

export default function ManualFinalReview() {
  const { state, actions } = useProjectWizard();
  
  const handleLaunch = async () => {
    try {
      await actions.completeManualProject();
    } catch (error) {
      console.error("Failed to launch project:", error);
      // Error handling is already done in completeManualProject
    }
  };

  const handleBack = () => {
    const hasMilestoneRoles = state.manualContext.contractorRoles.some(role => role.type === 'milestone');
    if (hasMilestoneRoles) {
      actions.setStep(3);
    } else {
      actions.setStep(2);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeInOut' }}
    >
      <ProjectSummary
        projectData={state.manualContext}
        onSubmit={handleLaunch}
        onBack={handleBack}
        isCompleting={state.isCompleting}
      />
    </motion.div>
  );
}