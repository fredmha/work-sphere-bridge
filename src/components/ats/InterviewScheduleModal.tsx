import { useState } from 'react';
import { Calendar, Clock, Video, Phone, MapPin } from 'lucide-react';
import { InterviewType } from '@/types/ats';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface InterviewScheduleModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  applicantName: string;
  applicationId: string;
}

export function InterviewScheduleModal({ 
  open, 
  onOpenChange, 
  applicantName, 
  applicationId 
}: InterviewScheduleModalProps) {
  const [interviewType, setInterviewType] = useState<InterviewType>('video');
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState('');
  const [duration, setDuration] = useState('60');
  const [interviewer, setInterviewer] = useState('');
  const [location, setLocation] = useState('');
  const [meetingUrl, setMeetingUrl] = useState('https://meet.google.com/new');
  const [notes, setNotes] = useState('');

  const timeSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
    '15:00', '15:30', '16:00', '16:30', '17:00', '17:30'
  ];

  const interviewers = [
    { id: 'user-1', name: 'John Manager' },
    { id: 'user-2', name: 'Alice HR' },
    { id: 'user-3', name: 'Bob Senior Dev' }
  ];

  const handleSchedule = () => {
    if (!selectedDate || !selectedTime || !interviewer) {
      return; // Validation
    }

    // In a real app, this would call an API
    const interviewData = {
      applicationId,
      type: interviewType,
      scheduledAt: new Date(`${format(selectedDate, 'yyyy-MM-dd')}T${selectedTime}`),
      duration: parseInt(duration),
      interviewerId: interviewer,
      location: interviewType === 'in_person' ? location : undefined,
      meetingUrl: interviewType === 'video' ? meetingUrl : undefined,
      notes
    };

    console.log('Scheduling interview:', interviewData);
    
    // Close modal and reset form
    onOpenChange(false);
    resetForm();
  };

  const resetForm = () => {
    setInterviewType('video');
    setSelectedDate(undefined);
    setSelectedTime('');
    setDuration('60');
    setInterviewer('');
    setLocation('');
    setMeetingUrl('https://meet.google.com/new');
    setNotes('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Schedule Interview - {applicantName}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Interview Type */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Interview Type</Label>
            <RadioGroup value={interviewType} onValueChange={(value: InterviewType) => setInterviewType(value)}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="phone" id="phone" />
                <Label htmlFor="phone" className="flex items-center gap-2 cursor-pointer">
                  <Phone className="h-4 w-4" />
                  Phone Call
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="video" id="video" />
                <Label htmlFor="video" className="flex items-center gap-2 cursor-pointer">
                  <Video className="h-4 w-4" />
                  Video Call
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="in_person" id="in_person" />
                <Label htmlFor="in_person" className="flex items-center gap-2 cursor-pointer">
                  <MapPin className="h-4 w-4" />
                  In-Person
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Date & Time Selection */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !selectedDate && "text-muted-foreground"
                    )}
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    disabled={(date) => date < new Date()}
                    initialFocus
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label>Time</Label>
              <Select value={selectedTime} onValueChange={setSelectedTime}>
                <SelectTrigger>
                  <Clock className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Select time" />
                </SelectTrigger>
                <SelectContent>
                  {timeSlots.map((time) => (
                    <SelectItem key={time} value={time}>
                      {time}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Duration & Interviewer */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Duration</Label>
              <Select value={duration} onValueChange={setDuration}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30">30 minutes</SelectItem>
                  <SelectItem value="45">45 minutes</SelectItem>
                  <SelectItem value="60">60 minutes</SelectItem>
                  <SelectItem value="90">90 minutes</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Interviewer</Label>
              <Select value={interviewer} onValueChange={setInterviewer}>
                <SelectTrigger>
                  <SelectValue placeholder="Select interviewer" />
                </SelectTrigger>
                <SelectContent>
                  {interviewers.map((person) => (
                    <SelectItem key={person.id} value={person.id}>
                      {person.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Location/Meeting URL */}
          {interviewType === 'video' && (
            <div className="space-y-2">
              <Label>Meeting URL</Label>
              <Input
                value={meetingUrl}
                onChange={(e) => setMeetingUrl(e.target.value)}
                placeholder="https://meet.google.com/xxx-xxx-xxx"
              />
            </div>
          )}

          {interviewType === 'in_person' && (
            <div className="space-y-2">
              <Label>Location</Label>
              <Input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Office address or meeting room"
              />
            </div>
          )}

          {/* Notes */}
          <div className="space-y-2">
            <Label>Notes (Optional)</Label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any special instructions or focus areas for the interview..."
              className="min-h-20"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleSchedule}
              disabled={!selectedDate || !selectedTime || !interviewer}
            >
              Schedule Interview
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}