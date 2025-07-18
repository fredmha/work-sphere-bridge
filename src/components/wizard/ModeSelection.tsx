import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Bot, Settings, Sparkles, RotateCcw } from 'lucide-react';
import { useProjectWizard } from './ProjectContext';

export default function ModeSelection() {
  const { state, actions } = useProjectWizard();

  const handleModeSelect = (mode) => {
    actions.setMode(mode);
  };

  const handleResetAi = () => {
    actions.resetAi();
  };

  const handleResetManual = () => {
    actions.resetManual();
  };

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="text-center mb-16"
      >
        <h1 className="text-6xl font-bold text-gray-900 mb-6 tracking-tight">
          Create Your Perfect Project
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
          Choose your path to build something amazing. We'll help you every step of the way.
        </p>
      </motion.div>
      
      <div className="grid md:grid-cols-2 gap-8 w-full max-w-6xl">
        {/* AI-Assisted Setup */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative"
        >
          <Card className="relative rounded-3xl p-10 bg-white/70 backdrop-blur-xl border border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-500 cursor-pointer group overflow-hidden"
                onClick={() => handleModeSelect('ai')}>
            
            {/* Background Gradient */}
            <div className="absolute -top-20 -right-20 w-80 h-80 bg-gradient-to-br from-emerald-400/30 via-blue-500/30 to-purple-500/30 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-700" />
            
            <div className="relative z-10">
              {/* AI Context Status */}
              {state.aiContext && (
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                    Progress saved
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleResetAi();
                    }}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <RotateCcw className="w-4 h-4 mr-1" />
                    Reset AI
                  </Button>
                </div>
              )}

              <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300">
                <Sparkles className="w-10 h-10 text-white animate-pulse" />
              </div>
              
              <h2 className="text-3xl font-bold text-gray-900 mb-4">AI-Assisted Setup</h2>
              <p className="text-gray-600 mb-8 leading-relaxed">
                Simply describe your project and let our AI create the perfect structure. 
                We'll handle roles, tasks, and pricing suggestions.
              </p>
              
              <div className="space-y-3 mb-8">
                <div className="flex items-center text-sm text-gray-700">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full mr-3"></div>
                  Smart role recommendations
                </div>
                <div className="flex items-center text-sm text-gray-700">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full mr-3"></div>
                  Automated task breakdown
                </div>
                <div className="flex items-center text-sm text-gray-700">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full mr-3"></div>
                  Intelligent pricing suggestions
                </div>
              </div>
              
              <Button 
                size="lg" 
                className="w-full bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white font-semibold text-lg py-7 group-hover:scale-105 transition-all duration-300 shadow-lg shadow-emerald-500/25"
              >
                <Bot className="w-6 h-6 mr-3" />
                {state.aiContext ? 'Continue with AI' : 'Start with AI'}
              </Button>
            </div>
          </Card>
        </motion.div>

        {/* Manual Setup */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="relative"
        >
          <Card className="relative rounded-3xl p-10 bg-white/90 backdrop-blur-xl border border-gray-200/50 shadow-2xl hover:shadow-3xl transition-all duration-500 cursor-pointer group overflow-hidden"
                onClick={() => handleModeSelect('manual')}>
            
            {/* Background Pattern */}
            <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-gradient-to-tr from-gray-200/40 to-slate-300/40 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-700" />
            
            <div className="relative z-10">
              {/* Manual Context Status */}
              {state.manualContext && (
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                    Progress saved
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleResetManual();
                    }}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <RotateCcw className="w-4 h-4 mr-1" />
                    Reset Manual
                  </Button>
                </div>
              )}

              <div className="w-20 h-20 bg-gradient-to-br from-gray-700 to-slate-800 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300">
                <Settings className="w-10 h-10 text-white" />
              </div>
              
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Manual Setup</h2>
              <p className="text-gray-600 mb-8 leading-relaxed">
                For those who know exactly what they want. Configure every detail 
                yourself with complete control over your project structure.
              </p>
              
              <div className="space-y-3 mb-8">
                <div className="flex items-center text-sm text-gray-700">
                  <div className="w-2 h-2 bg-gray-500 rounded-full mr-3"></div>
                  Complete customization
                </div>
                <div className="flex items-center text-sm text-gray-700">
                  <div className="w-2 h-2 bg-gray-500 rounded-full mr-3"></div>
                  Advanced configuration
                </div>
                <div className="flex items-center text-sm text-gray-700">
                  <div className="w-2 h-2 bg-gray-500 rounded-full mr-3"></div>
                  Precise control
                </div>
              </div>
              
              <Button 
                size="lg" 
                variant="outline"
                className="w-full font-semibold text-lg py-7 group-hover:scale-105 transition-all duration-300 border-2 hover:bg-gray-50"
              >
                <Settings className="w-6 h-6 mr-3" />
                {state.manualContext ? 'Continue Manual Setup' : 'Manual Setup'}
              </Button>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}