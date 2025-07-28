import React from 'react';
import { motion } from 'framer-motion';
import { useProjectWizard } from './ProjectContext';
import RoleManager from './RoleManager';

export default function ManualRoleManager() {
  const { state, actions } = useProjectWizard();

  const handleNext = () => {
    const hasMilestoneRoles = state.manualContext.contractorRoles.some(role => role.type === 'milestone');
    if (hasMilestoneRoles) {
      actions.setStep(3);
    } else {
      actions.setStep(4); // Skip to review if no milestone roles
    }
  };

  const handleBack = () => {
    actions.setStep(1);
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
      <RoleManager
        roles={state.manualContext?.contractorRoles || []}
        onUpdate={handleUpdate}
        onNext={handleNext}
        onBack={handleBack}
      />
    </motion.div>
  );
}