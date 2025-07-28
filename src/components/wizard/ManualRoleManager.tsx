import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useProjectWizard } from './ProjectContext';
import RoleManager from './RoleManager';

export default function ManualRoleManager() {
  const { state, actions } = useProjectWizard();

  // Ensure contractorRoles is initialized
  useEffect(() => {
    if (!state.manualContext?.contractorRoles) {
      actions.updateManualContext({ contractorRoles: [] });
    }
  }, [state.manualContext?.contractorRoles, actions]);

  const handleNext = () => {
    // Get the current roles from the context
    const contractorRoles = state.manualContext?.contractorRoles || [];
    
    // Check if any roles are milestone-based
    const hasMilestoneRoles = contractorRoles.some(role => 
      role && 
      role.type === 'milestone' && 
      role.role && 
      role.description
    );
    
    console.log('ManualRoleManager - Roles found:', contractorRoles.length);
    console.log('ManualRoleManager - Milestone roles:', contractorRoles.filter(role => role?.type === 'milestone').length);
    
    if (hasMilestoneRoles) {
      actions.setStep(3); // Go to task management
    } else {
      actions.setStep(4); // Skip to review if no milestone roles
    }
  };

  const handleUpdate = (updatedRoles) => {
    console.log('ManualRoleManager - handleUpdate called with:', updatedRoles);
    actions.updateManualContext({ contractorRoles: updatedRoles });
  };

  const handleBack = () => {
    actions.setStep(1);
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