
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ProjectWizardProvider, useProjectWizard } from '../components/wizard/ProjectContext';
import StepIndicator from '../components/wizard/StepIndicator';
import ModeSelection from '../components/wizard/ModeSelection';
import AiDescribeStep from '../components/wizard/AiDescribeStep';
import AiReviewProject from '../components/wizard/AiReviewProject';
import AiReviewRoles from '../components/wizard/AiReviewRoles';
import AiTaskManager from '../components/wizard/AiTaskManager';
import AiFinalReview from '../components/wizard/AiFinalReview';
import ManualProjectInfo from '../components/wizard/ManualProjectInfo';
import ManualRoleManager from '../components/wizard/ManualRoleManager';
import ManualTaskManager from '../components/wizard/ManualTaskManger';
import ManualFinalReview from '../components/wizard/ManualFinalReview';
import Header from '@/components/layout/Header';

function WizardContent() {
  const { state } = useProjectWizard();

  const renderStep = () => {
    if (!state.currentMode) {
      return <ModeSelection />;
    }

    if (state.currentMode === 'ai') {
      switch (state.currentStep) {
        case 1:
          return <AiDescribeStep />;
        case 2:
          return <AiReviewProject />;
        case 3:
          return <AiReviewRoles />;
        case 4:
          return <AiTaskManager />;
        case 5:
          return <AiFinalReview />;
        default:
          return <AiDescribeStep />;
      }
    }

    if (state.currentMode === 'manual') {
      switch (state.currentStep) {
        case 1:
          return <ManualProjectInfo />;
        case 2:
          return <ManualRoleManager />;
        case 3:
          return <ManualTaskManager />;
        case 4:
          return <ManualFinalReview />;
        default:
          return <ManualProjectInfo />;
      }
    }

    return <ModeSelection />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 font-sans">
      <Header />
      <div className="container mx-auto px-4 py-8 md:py-16">
        <div className="max-w-7xl mx-auto">
          
          <AnimatePresence mode="wait">
            {state.isProcessing && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
              >
                <div className="bg-white rounded-2xl p-8 text-center flex flex-col items-center max-w-md mx-4 shadow-2xl">
                  <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-emerald-500 mb-6"></div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">AI is working its magic</h3>
                  <p className="text-gray-600">Creating your perfect project structure...</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <StepIndicator />
          
          <AnimatePresence mode="wait">
            <motion.div
              key={`${state.currentMode}-${state.currentStep}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {renderStep()}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

export default function ProjectWizard() {
  return (
    <ProjectWizardProvider>
      <WizardContent />
    </ProjectWizardProvider>
  );
}