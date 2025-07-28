import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Bot, Sparkles, ArrowRight, Lightbulb, AlertCircle, ArrowLeft } from 'lucide-react';
import { useProjectWizard } from './ProjectContext';

const suggestedPrompts = [
  "We need a mobile app developer to build iOS/Android apps, paid per milestone, plus a UI designer for screens, also per milestone.",
  "Looking for a full-stack developer paid hourly to maintain our web platform, and a DevOps engineer for cloud infrastructure, also hourly.",
  "Need a data scientist for ML model development with 3 specific deliverables, and a backend developer paid per hour for API work.",
  "Seeking a WordPress developer for 5 custom pages at $500 each, plus a copywriter for content at $50/hour."
];

export default function AiDescribeStep() {
  const { state, actions } = useProjectWizard();
  const [description, setDescription] = useState(state.aiContext?.rawDescription || '');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalyze = async () => {
    if (!description.trim()) return;

    setIsAnalyzing(true);
    try {
      await actions.generateProjectWithAI(description);
    } catch (error) {
      console.error('AI analysis failed:', error);
    }
    setIsAnalyzing(false);
  };

  const handleUseSuggestion = (suggestion) => {
    setDescription(suggestion);
    if (state.lastError) actions.clearError();
  };

  const handleBack = () => {
    actions.setMode(null); // Go back to Mode Selection
  };

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
    if (state.lastError) actions.clearError();
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
          <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-xl flex items-center justify-center">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900">Tell us about your project</h1>
        </div>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Describe what you want to build and who you need to hire. Be as detailed as possible.
        </p>
      </motion.div>

      {/* Error Display */}
      {state.lastError && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="font-medium">
              {state.lastError}
            </AlertDescription>
          </Alert>
        </motion.div>
      )}

      <Card className="border-none shadow-2xl shadow-gray-200/50 rounded-3xl overflow-hidden mb-8">
        <CardHeader className="bg-gradient-to-r from-emerald-50 to-blue-50 p-8">
          <CardTitle className="flex items-center gap-2 text-xl">
            <Sparkles className="w-5 h-5 text-emerald-500" />
            Project Description
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8">
          <div className="space-y-6">
            <Textarea
              value={description}
              onChange={handleDescriptionChange}
              placeholder="Example: We need a backend developer to build an API for our mobile app, paid by the hour at around $75/hr. We also need a UI designer to create 5 landing pages, paid per page at $500 each. The project should take about 3 months..."
              rows={8}
              className="text-base leading-relaxed resize-none border-2 focus:border-emerald-500 transition-colors"
            />
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-500">
                {description.length} characters
              </div>
              <Button
                onClick={handleAnalyze}
                disabled={!description.trim() || isAnalyzing || state.isProcessing}
                size="lg"
                className="bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 font-semibold"
              >
                {isAnalyzing || state.isProcessing ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 mr-2" />
                    Analyze with AI
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Suggested Prompts */}
      <Card className="border-none shadow-xl shadow-gray-200/30 rounded-2xl">
        <CardHeader className="p-6">
          <CardTitle className="flex items-center gap-2 text-lg text-gray-800">
            <Lightbulb className="w-5 h-5 text-amber-500" />
            Need inspiration? Try these examples:
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 pt-0">
          <div className="grid gap-3">
            {suggestedPrompts.map((prompt, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Badge
                  variant="outline"
                  className="w-full justify-start p-4 h-auto cursor-pointer hover:bg-gray-50 transition-colors text-left text-wrap"
                  onClick={() => handleUseSuggestion(prompt)}
                >
                  {prompt}
                </Badge>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Back Button at the very bottom */}
      <div className="flex justify-between mt-6">
        <Button variant="outline" onClick={handleBack} className="flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
      </div>
    </div>
  );
}
