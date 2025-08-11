import { useState } from 'react';
import { Calendar, MapPin, Clock, Star, MessageSquare, FileText, Briefcase, GraduationCap, Award, Plus } from 'lucide-react';
import { Application, ApplicationStatus } from '@/types/ats';
import { getApplicantById, getCommentsByApplicationId, getStatusHistoryByApplicationId, getScoresByApplicationId } from '@/lib/ats-mock-data';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format } from 'date-fns';
import ScoreBreakdownChart from '@/components/ats/ScoreBreakdownChart';

interface ApplicationDetailsProps {
  applicationId: string;
  onScheduleInterview?: (applicationId: string, applicantName: string) => void;
  onOfferInvite?: (applicationId: string, applicantName: string) => void;
  onOpenMessaging?: (applicationId: string, applicantName: string) => void;
  onOpenFeedback?: (applicationId: string, applicantName: string) => void;
}

export function ApplicationDetails({ applicationId, onScheduleInterview, onOfferInvite, onOpenMessaging, onOpenFeedback }: ApplicationDetailsProps) {
  const [newComment, setNewComment] = useState('');
  const [isAddingComment, setIsAddingComment] = useState(false);

  // Get application data
  const application = {
    id: applicationId,
    applicantId: 'applicant-1',
    roleId: 'role-1',
    projectId: 'project-1',
    status: 'pending' as ApplicationStatus,
    submittedAt: new Date(),
    applicationMessage: 'Sample application message',
    aiScore: 8.5,
    overallScore: 8.5,
    createdAt: new Date(),
    updatedAt: new Date()
  } as Application;

  const applicant = getApplicantById(application.applicantId);
  const comments = getCommentsByApplicationId(applicationId);
  const statusHistory = getStatusHistoryByApplicationId(applicationId);
  const scores = getScoresByApplicationId(applicationId);

  if (!applicant) {
    return (
      <div className="w-96 border-l border-border/50 bg-card/50 backdrop-blur-sm p-6 text-center">
        <p className="text-muted-foreground">Application not found</p>
      </div>
    );
  }

  const handleAddComment = () => {
    if (newComment.trim()) {
      // In a real app, this would call an API
      console.log('Adding comment:', newComment);
      setNewComment('');
      setIsAddingComment(false);
    }
  };

  const handleStatusChange = (newStatus: ApplicationStatus) => {
    // In a real app, this would call an API
    console.log('Changing status to:', newStatus);
  };

  const getStatusBadge = (status: ApplicationStatus) => {
    const statusConfig = {
      pending: { label: 'Pending', variant: 'secondary' as const, icon: '🔵' },
      interview_scheduled: { label: 'Interview Scheduled', variant: 'default' as const, icon: '📅' },
      interviewed: { label: 'Interviewed', variant: 'default' as const, icon: '🎯' },
      offered: { label: 'Offered', variant: 'default' as const, icon: '✅' },
      accepted: { label: 'Accepted', variant: 'default' as const, icon: '✅' },
      rejected: { label: 'Rejected', variant: 'destructive' as const, icon: '❌' },
      contracted: { label: 'Contracted', variant: 'default' as const, icon: '📝' }
    };

    const config = statusConfig[status];
    return (
      <Badge variant={config.variant} className="gap-1">
        <span>{config.icon}</span>
        {config.label}
      </Badge>
    );
  };

  return (
    <div className="w-full max-w-xl mx-auto bg-card/50 backdrop-blur-sm overflow-y-auto">
      {/* Applicant Profile Header */}
      <div className="p-6 border-b border-border/50">
        <div className="flex items-start gap-4 mb-4">
          <Avatar className="w-16 h-16">
            <AvatarImage src={applicant.profilePictureUrl} alt={`${applicant.firstName} ${applicant.lastName}`} />
            <AvatarFallback>
              {applicant.firstName[0]}{applicant.lastName[0]}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h3 className="text-lg font-semibold">
              {applicant.firstName} {applicant.lastName}
            </h3>
            <p className="text-sm text-muted-foreground">{applicant.email}</p>
            <p className="text-sm text-muted-foreground">{applicant.phone}</p>
            <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
              <MapPin className="h-3 w-3" />
              {applicant.location.city}, {applicant.location.country}
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Status:</span>
            {getStatusBadge(application.status)}
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Applied:</span>
            <span className="text-sm text-muted-foreground">
              {format(application.submittedAt, 'MMM dd, yyyy')}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Experience:</span>
            <span className="text-sm text-muted-foreground">
              {applicant.experience.length} positions
            </span>
          </div>

          {applicant.averageTaskScore && (
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Task Score:</span>
              <Badge variant="outline">
                {applicant.averageTaskScore.toFixed(1)}/10
              </Badge>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2 mt-4">
          <Button size="sm" variant="outline" onClick={() => onOpenMessaging?.(application.id, `${applicant.firstName} ${applicant.lastName}`)}>
            <MessageSquare className="h-4 w-4 mr-1" />
            Message
          </Button>
          <Button size="sm" variant="default" onClick={() => onScheduleInterview?.(application.id, `${applicant.firstName} ${applicant.lastName}`)}>
            <Calendar className="h-4 w-4 mr-1" />
            Schedule Interview
          </Button>
          <Button size="sm" variant="outline" onClick={() => onOfferInvite?.(application.id, `${applicant.firstName} ${applicant.lastName}`)}>
            <Briefcase className="h-4 w-4 mr-1" />
            Offer / Invite
          </Button>
          <Button size="sm" variant="outline" onClick={() => onOpenFeedback?.(application.id, `${applicant.firstName} ${applicant.lastName}`)}>
            <Star className="h-4 w-4 mr-1" />
            Interview Feedback
          </Button>
        </div>

        {/* Status Change */}
        <div className="mt-4">
          <label className="text-sm font-medium mb-2 block">Update Status:</label>
          <Select value={application.status} onValueChange={handleStatusChange}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="interview_scheduled">Interview Scheduled</SelectItem>
              <SelectItem value="interviewed">Interviewed</SelectItem>
              <SelectItem value="offered">Offered</SelectItem>
              <SelectItem value="accepted">Accepted</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
              <SelectItem value="contracted">Contracted</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* AI Score Breakdown */}
      <Card className="m-4 border-primary/20">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Star className="h-4 w-4 text-primary" />
            AI Analysis Score
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {(() => {
            const sorted = [...scores].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
            const manual = sorted.find((s) => s.scoreType === 'manual_override');
            const ai = sorted.find((s) => s.scoreType === 'ai_initial');
            const selected = manual || ai || sorted[0];
            if (!selected) return (
              <div className="text-sm text-muted-foreground">No AI score available.</div>
            );
            const breakdown = selected.breakdown;
            return (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">Latest score ({selected.scoreType.replace('_', ' ')})</div>
                  <Badge variant="outline" className="text-xs">{selected.score.toFixed(1)}/10</Badge>
                </div>
                <ScoreBreakdownChart breakdown={breakdown} />
                {selected.justification && (
                  <div className="text-xs text-muted-foreground leading-relaxed">
                    {selected.justification}
                  </div>
                )}
              </div>
            );
          })()}
          <Separator />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-success">📋 Key Strengths</h4>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>• Strong skills and experience alignment</li>
                <li>• Relevant education/certifications</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-warning">⚠️ Areas to Explore</h4>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>• Clarify recent project scope and impact</li>
                <li>• Probe into communication/cultural fit</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Experience Summary */}
      <Card className="m-4">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Briefcase className="h-4 w-4" />
            Experience ({applicant.experience.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {applicant.experience.slice(0, 2).map((exp) => (
            <div key={exp.id} className="space-y-1">
              <div className="font-medium text-sm">{exp.position}</div>
              <div className="text-sm text-muted-foreground">{exp.company}</div>
              <div className="text-xs text-muted-foreground">
                {format(exp.startDate, 'MMM yyyy')} - {exp.current ? 'Present' : exp.endDate ? format(exp.endDate, 'MMM yyyy') : 'Unknown'}
              </div>
              <div className="flex flex-wrap gap-1 mt-2">
                {exp.skills.slice(0, 3).map((skill) => (
                  <Badge key={skill} variant="outline" className="text-xs">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Education & Certifications */}
      <div className="grid grid-cols-1 gap-4 m-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <GraduationCap className="h-4 w-4" />
              Education
            </CardTitle>
          </CardHeader>
          <CardContent>
            {applicant.education.map((edu) => (
              <div key={edu.id} className="space-y-1">
                <div className="font-medium text-sm">{edu.degree}</div>
                <div className="text-sm text-muted-foreground">{edu.institution}</div>
                <div className="text-xs text-muted-foreground">{edu.fieldOfStudy}</div>
              </div>
            ))}
          </CardContent>
        </Card>

        {applicant.certifications.length > 0 && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Award className="h-4 w-4" />
                Certifications
              </CardTitle>
            </CardHeader>
            <CardContent>
              {applicant.certifications.map((cert) => (
                <div key={cert.id} className="space-y-1 mb-3 last:mb-0">
                  <div className="font-medium text-sm">{cert.name}</div>
                  <div className="text-sm text-muted-foreground">{cert.issuer}</div>
                  <div className="text-xs text-muted-foreground">
                    {format(cert.issueDate, 'MMM yyyy')}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Comments Section */}
      <Card className="m-4">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Team Comments ({comments.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {comments.map((comment) => (
            <div key={comment.id} className="space-y-2">
              <div className="flex items-start gap-3">
                <Avatar className="w-6 h-6">
                  <AvatarFallback className="text-xs">
                    {comment.authorId === 'user-1' ? 'JM' : 'AH'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">
                      {comment.authorId === 'user-1' ? 'John Manager' : 'Alice HR'}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {format(comment.createdAt, 'MMM dd, HH:mm')}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">{comment.content}</p>
                </div>
              </div>
            </div>
          ))}

          <Separator />

          {isAddingComment ? (
            <div className="space-y-3">
              <Textarea
                placeholder="Add a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="min-h-20"
              />
              <div className="flex gap-2">
                <Button size="sm" onClick={handleAddComment}>
                  Add Comment
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => {
                    setIsAddingComment(false);
                    setNewComment('');
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full"
              onClick={() => setIsAddingComment(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Comment
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}