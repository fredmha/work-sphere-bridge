import React from 'react';
import { motion } from 'framer-motion';
import { useProjectWizard } from './ProjectContext';
import TaskManager from './TaskManager';

export default function ManualTaskManager() {
  const { state, actions } = useProjectWizard();

  const handleNext = () => {
    actions.setStep(4);
  };

  const handleBack = () => {
    actions.setStep(2);
  };

  const handleUpdate = (updatedRoles) => {
    actions.updateManualContext({ contractorRoles: updatedRoles });
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.5, ease: 'easeInOut' }}
    >
      <TaskManager
        roles={state.manualContext?.contractorRoles || []}
        onUpdate={handleUpdate}
        onNext={handleNext}
        onBack={handleBack}
      />
    </motion.div>
  );
}