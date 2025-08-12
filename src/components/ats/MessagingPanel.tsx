import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { getApplicantById, getCommentsByApplicationId, mockApplications } from "@/lib/ats-mock-data";
import { MessageSquare, CalendarClock, Send } from "lucide-react";
//import { createInterviewICS } from "@/lib/ics";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";

interface MessagingPanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  applicationId: string | undefined;
  applicantName: string;
  composeInterview?: boolean;
}

export function MessagingPanel({ open, onOpenChange, applicationId, applicantName, composeInterview }: MessagingPanelProps) {
  const [message, setMessage] = useState(composeInterview ? `Hi ${applicantName}, can you join an interview on ...` : "");
  const [date, setDate] = useState<string>("");
  const [time, setTime] = useState<string>("");
  const [duration, setDuration] = useState<number>(60);
  const { toast } = useToast();

  const applicant = applicationId ? getApplicantById(getAppApplicantId(applicationId)!) : undefined;
  const thread = applicationId ? getCommentsByApplicationId(applicationId) : [];

  const handleSend = () => {
    if (!applicationId) return;
    const when = date && time ? new Date(`${date}T${time}`) : undefined;

    if (composeInterview && when) {
      const ics = createInterviewICS({
        title: `Interview with ${applicantName}`,
        start: when,
        durationMinutes: duration,
        description: message,
        location: 'Video call'
      });
      console.log('ICS attachment:', ics);
      toast({ title: 'Interview scheduled', description: `Scheduled for ${format(when, 'PPpp')}.` });
    } else {
      toast({ title: 'Message sent', description: 'Your message was posted to the thread.' });
    }

    setMessage("");
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="p-0 w-[92vw] sm:w-[420px] md:w-[560px] lg:w-[640px]">
        <SheetHeader className="px-6 pt-6 pb-3 text-left">
          <SheetTitle className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4 text-primary"/> Messages • {applicantName}
          </SheetTitle>
        </SheetHeader>
        <div className="px-6 space-y-4 h-[calc(100vh-5rem)] overflow-y-auto">
          <div className="space-y-3">
            {thread.map((c) => (
              <div key={c.id} className="text-sm">
                <div className="text-muted-foreground text-xs">{format(c.createdAt, 'PPpp')}</div>
                <div>{c.content}</div>
              </div>
            ))}
          </div>

          {composeInterview && (
            <div className="border rounded-lg p-3 bg-card/50">
              <div className="flex items-center gap-2 text-sm font-medium mb-2"><CalendarClock className="h-4 w-4 text-primary"/> Schedule interview</div>
              <div className="grid grid-cols-2 gap-2">
                <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
                <Input type="time" value={time} onChange={(e) => setTime(e.target.value)} />
              </div>
              <div className="mt-2 flex items-center gap-2">
                <Input type="number" min={15} step={15} value={duration} onChange={(e) => setDuration(Number(e.target.value))} className="w-32" />
                <span className="text-sm text-muted-foreground">minutes</span>
              </div>
            </div>
          )}

          <div className="space-y-2 pb-6">
            <Textarea placeholder="Write a message..." value={message} onChange={(e) => setMessage(e.target.value)} />
            <div className="flex justify-end">
              <Button onClick={handleSend}>
                <Send className="h-4 w-4 mr-2"/> Send
              </Button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

function getAppApplicantId(appId: string) {
  return mockApplications.find((a: any) => a.id === appId)?.applicantId as string | undefined;
}

export default MessagingPanel;
