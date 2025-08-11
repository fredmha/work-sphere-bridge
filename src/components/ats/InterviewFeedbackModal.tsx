import { useState } from 'react';
import { MessageSquare, Star, CheckCircle, XCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';

interface InterviewFeedbackModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  applicantName: string;
  interviewId: string;
  interviewDate: Date;
  interviewType: string;
}

export function InterviewFeedbackModal({ 
  open, 
  onOpenChange, 
  applicantName, 
  interviewId,
  interviewDate,
  interviewType
}: InterviewFeedbackModalProps) {
  const [technicalScore, setTechnicalScore] = useState([7]);
  const [communicationScore, setCommunicationScore] = useState([7]);
  const [culturalFitScore, setCulturalFitScore] = useState([7]);
  const [problemSolvingScore, setProblemSolvingScore] = useState([7]);
  const [overallRecommendation, setOverallRecommendation] = useState<string>('');
  const [detailedNotes, setDetailedNotes] = useState('');
  const [followUpRequired, setFollowUpRequired] = useState(false);

  const recommendations = [
    { value: 'strong_hire', label: 'Strong Hire', color: 'bg-green-500', icon: CheckCircle },
    { value: 'hire', label: 'Hire', color: 'bg-green-400', icon: CheckCircle },
    { value: 'no_hire', label: 'No Hire', color: 'bg-red-400', icon: XCircle },
    { value: 'strong_no_hire', label: 'Strong No Hire', color: 'bg-red-500', icon: XCircle }
  ];

  const getOverallScore = () => {
    const scores = [technicalScore[0], communicationScore[0], culturalFitScore[0], problemSolvingScore[0]];
    return (scores.reduce((sum, score) => sum + score, 0) / scores.length).toFixed(1);
  };

  const handleSubmit = () => {
    if (!overallRecommendation || !detailedNotes.trim()) {
      return; // Validation
    }

    // In a real app, this would call an API
    const feedbackData = {
      interviewId,
      technicalScore: technicalScore[0],
      communicationScore: communicationScore[0],
      culturalFitScore: culturalFitScore[0],
      problemSolvingScore: problemSolvingScore[0],
      overallRecommendation,
      notes: detailedNotes,
      followUpRequired,
      submittedAt: new Date()
    };

    console.log('Submitting interview feedback:', feedbackData);
    
    // Close modal and reset form
    onOpenChange(false);
    resetForm();
  };

  const resetForm = () => {
    setTechnicalScore([7]);
    setCommunicationScore([7]);
    setCulturalFitScore([7]);
    setProblemSolvingScore([7]);
    setOverallRecommendation('');
    setDetailedNotes('');
    setFollowUpRequired(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-primary" />
            Interview Feedback - {applicantName}
          </DialogTitle>
          <div className="text-sm text-muted-foreground">
            {interviewDate.toLocaleDateString()} • {interviewType} Interview
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Overall Score Display */}
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 text-primary" />
                <span className="font-medium">Overall Score</span>
              </div>
              <Badge variant="default" className="text-lg">
                {getOverallScore()}/10
              </Badge>
            </div>
          </div>

          {/* Score Categories */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="flex items-center justify-between">
                Technical Skills
                <span className="text-primary font-medium">{technicalScore[0]}/10</span>
              </Label>
              <Slider
                value={technicalScore}
                onValueChange={setTechnicalScore}
                max={10}
                min={1}
                step={1}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label className="flex items-center justify-between">
                Communication
                <span className="text-primary font-medium">{communicationScore[0]}/10</span>
              </Label>
              <Slider
                value={communicationScore}
                onValueChange={setCommunicationScore}
                max={10}
                min={1}
                step={1}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label className="flex items-center justify-between">
                Cultural Fit
                <span className="text-primary font-medium">{culturalFitScore[0]}/10</span>
              </Label>
              <Slider
                value={culturalFitScore}
                onValueChange={setCulturalFitScore}
                max={10}
                min={1}
                step={1}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label className="flex items-center justify-between">
                Problem Solving
                <span className="text-primary font-medium">{problemSolvingScore[0]}/10</span>
              </Label>
              <Slider
                value={problemSolvingScore}
                onValueChange={setProblemSolvingScore}
                max={10}
                min={1}
                step={1}
                className="w-full"
              />
            </div>
          </div>

          {/* Overall Recommendation */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Overall Recommendation</Label>
            <RadioGroup value={overallRecommendation} onValueChange={setOverallRecommendation}>
              <div className="grid grid-cols-2 gap-3">
                {recommendations.map((rec) => (
                  <div key={rec.value} className="flex items-center space-x-2">
                    <RadioGroupItem value={rec.value} id={rec.value} />
                    <Label 
                      htmlFor={rec.value} 
                      className="flex items-center gap-2 cursor-pointer text-sm"
                    >
                      <rec.icon className={`h-4 w-4 ${rec.color.replace('bg-', 'text-')}`} />
                      {rec.label}
                    </Label>
                  </div>
                ))}
              </div>
            </RadioGroup>
          </div>

          {/* Detailed Notes */}
          <div className="space-y-2">
            <Label>Detailed Notes</Label>
            <Textarea
              value={detailedNotes}
              onChange={(e) => setDetailedNotes(e.target.value)}
              placeholder="Provide detailed feedback about the interview. Include specific examples of strengths and areas for improvement..."
              className="min-h-32"
            />
          </div>

          {/* Follow-up Required */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="followUp"
              checked={followUpRequired}
              onCheckedChange={(checked) => setFollowUpRequired(checked as boolean)}
            />
            <Label htmlFor="followUp" className="text-sm cursor-pointer">
              Follow-up interview or assessment required
            </Label>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit}
              disabled={!overallRecommendation || !detailedNotes.trim()}
            >
              Submit Feedback
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}