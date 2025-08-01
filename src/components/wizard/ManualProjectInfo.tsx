import React from 'react';
import { motion } from 'framer-motion';
import { useProjectWizard } from './ProjectContext';
import ProjectInfoForm from './ProjectInfoForm';

export default function ManualProjectInfo() {
  const { state, actions } = useProjectWizard();
  
  const initialData = {
    projectName: '',
    projectDescription: '',
    category: [],
    duration: '',
    weeklyHours: null,
    incentive: [],
    contractorRoles: []
  };

  const handleNext = () => {
    actions.setStep(2);
  };

  const handleBack = () => {
    actions.resetAll();
    actions.setMode(null);
  };
  
  const handleUpdate = (data) => {
    actions.updateManualContext(data);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.5, ease: 'easeInOut' }}
    >
      <ProjectInfoForm
        projectData={state.manualContext || initialData}
        onUpdate={handleUpdate}
        onNext={handleNext}
        onBack={handleBack}
      />
    </motion.div>
  );
}