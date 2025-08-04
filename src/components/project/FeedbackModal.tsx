import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Star } from 'lucide-react';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (rating: number, feedback: string) => void;
  title: string;
  description: string;
}

export function FeedbackModal({ isOpen, onClose, onSubmit, title, description }: FeedbackModalProps) {
  const [rating, setRating] = useState([7]);
  const [feedback, setFeedback] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(rating[0], feedback);
    
    // Reset form
    setRating([7]);
    setFeedback('');
    onClose();
  };

  const getRatingColor = (value: number) => {
    if (value >= 8) return 'text-green-500';
    if (value >= 6) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getRatingLabel = (value: number) => {
    if (value >= 9) return 'Excellent';
    if (value >= 8) return 'Very Good';
    if (value >= 7) return 'Good';
    if (value >= 6) return 'Satisfactory';
    if (value >= 5) return 'Fair';
    return 'Needs Improvement';
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Star className="w-5 h-5 text-warning" />
            {title}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <p className="text-sm text-muted-foreground">{description}</p>

          <div className="space-y-4">
            <Label>Rating (1-10)</Label>
            <div className="space-y-3">
              <Slider
                value={rating}
                onValueChange={setRating}
                max={10}
                min={1}
                step={1}
                className="w-full"
              />
              <div className="flex items-center justify-between text-sm">
                <span className={`font-medium ${getRatingColor(rating[0])}`}>
                  {rating[0]}/10 - {getRatingLabel(rating[0])}
                </span>
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.floor(rating[0] / 2) }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-warning text-warning" />
                  ))}
                  {rating[0] % 2 === 1 && (
                    <Star className="w-4 h-4 text-warning" style={{ clipPath: 'inset(0 50% 0 0)' }} />
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="feedback">Feedback</Label>
            <Textarea
              id="feedback"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Provide detailed feedback on the work quality, communication, and areas for improvement..."
              rows={4}
              required
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Submit Feedback</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}