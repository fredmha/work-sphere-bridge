import { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
//import { ProjectRoleTree } from '@/components/ats/ProjectRoleTree';
import { ApplicationTable } from '@/components/ats/ApplicationTable';
import { ApplicationDetails } from '@/components/ats/ApplicationDetails';
import { getApplicationsByRoleId, getInterviewsByApplicationId } from '@/lib/ats-mock-data';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { UserCheck, Users, Calendar, CheckCircle } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { InterviewScheduleModal } from '@/components/ats/InterviewScheduleModal';
import { OfferModal } from '@/components/ats/OfferModal';
import { InterviewFeedbackModal } from '@/components/ats/InterviewFeedbackModal';
import PipelineBoard from '@/components/ats/PipelineBoard';
import MessagingPanel from '@/components/ats/MessagingPanel';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
export function ApplicationManagementPage() {
  const { state } = useApp();
  const [selectedRoleId, setSelectedRoleId] = useState<string>();
  const [selectedProjectId, setSelectedProjectId] = useState<string>();
  const [selectedApplicationId, setSelectedApplicationId] = useState<string>();

  const [currentTab, setCurrentTab] = useState<string>(() => localStorage.getItem('ats:lastView') || 'table');

  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [offerOpen, setOfferOpen] = useState(false);
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [messagingOpen, setMessagingOpen] = useState(false);
  const [composeInterview, setComposeInterview] = useState(false);
  const [actionApplicantName, setActionApplicantName] = useState<string>('');
  const [actionRoleTitle, setActionRoleTitle] = useState<string>('');
  const [actionProjectTitle, setActionProjectTitle] = useState<string>('');

  const [feedbackInterviewId, setFeedbackInterviewId] = useState<string>('');
  const [feedbackInterviewDate, setFeedbackInterviewDate] = useState<Date>(new Date());
  const [feedbackInterviewType, setFeedbackInterviewType] = useState<string>('video');

  useEffect(() => {
    localStorage.setItem('ats:lastView', currentTab);
  }, [currentTab]);

  const handleRoleSelect = (roleId: string, projectId: string) => {
    setSelectedRoleId(roleId);
    setSelectedProjectId(projectId);
    setSelectedApplicationId(undefined); // Reset application selection
  };

  const handleApplicationSelect = (applicationId: string) => {
    setSelectedApplicationId(applicationId);
  };

  const openMessagingFor = (applicationId: string, applicantName: string, composeInt?: boolean) => {
    setSelectedApplicationId(applicationId);
    setActionApplicantName(applicantName);
    setComposeInterview(!!composeInt);
    setMessagingOpen(true);
  };

  const openScheduleFor = (applicationId: string, applicantName: string) => {
    setSelectedApplicationId(applicationId);
    setActionApplicantName(applicantName);
    setScheduleOpen(true);
  };

  const openOfferFor = (applicationId: string, applicantName: string) => {
    setSelectedApplicationId(applicationId);
    setActionApplicantName(applicantName);
    setActionRoleTitle(selectedRole?.name || '');
    setActionProjectTitle(selectedProject?.title || '');
    setOfferOpen(true);
  };

  const openFeedbackFor = (applicationId: string, applicantName: string) => {
    setSelectedApplicationId(applicationId);
    setActionApplicantName(applicantName);
    const interviews = getInterviewsByApplicationId(applicationId).sort((a, b) => new Date(b.scheduledAt).getTime() - new Date(a.scheduledAt).getTime());
    if (interviews[0]) {
      setFeedbackInterviewId(interviews[0].id);
      setFeedbackInterviewDate(interviews[0].scheduledAt);
      setFeedbackInterviewType(interviews[0].type);
      setFeedbackOpen(true);
    } else {
      console.warn('No interviews found for application', applicationId);
    }
  };
  // Get applications for selected role
  const selectedRoleApplications = selectedRoleId ? getApplicationsByRoleId(selectedRoleId) : [];

  // Get role and project details
  const selectedProject = selectedProjectId ? state.projects.find(p => p.id === selectedProjectId) : undefined;
  const selectedRole = selectedProject?.roles.find(r => r.id === selectedRoleId);

  // Calculate summary statistics
  const totalApplications = state.projects.reduce((total, project) => 
    total + project.roles.reduce((roleTotal, role) => 
      roleTotal + getApplicationsByRoleId(role.id).length, 0
    ), 0
  );

  const pendingApplications = state.projects.reduce((total, project) => 
    total + project.roles.reduce((roleTotal, role) => 
      roleTotal + getApplicationsByRoleId(role.id).filter(app => app.status === 'pending').length, 0
    ), 0
  );

  const interviewsScheduled = state.projects.reduce((total, project) => 
    total + project.roles.reduce((roleTotal, role) => 
      roleTotal + getApplicationsByRoleId(role.id).filter(app => app.status === 'interview_scheduled').length, 0
    ), 0
  );

  const offersExtended = state.projects.reduce((total, project) => 
    total + project.roles.reduce((roleTotal, role) => 
      roleTotal + getApplicationsByRoleId(role.id).filter(app => app.status === 'offered').length, 0
    ), 0
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/98 to-primary/5">
      {/* Header */}
      <div className="border-b border-border/50 bg-card/50 backdrop-blur-sm">
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                Application Management
              </h1>
              <p className="text-muted-foreground mt-1">
                Track and manage contractor applications across all projects
              </p>
            </div>
            <div className="flex items-center gap-2">
              <UserCheck className="h-6 w-6 text-primary" />
              <Badge variant="outline" className="text-sm">
                ATS System
              </Badge>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-6">
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{totalApplications}</div>
                  <div className="text-sm text-muted-foreground">Total Applications</div>
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-warning/10 rounded-lg">
                  <UserCheck className="h-5 w-5 text-warning" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{pendingApplications}</div>
                  <div className="text-sm text-muted-foreground">Pending Review</div>
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/10 rounded-lg">
                  <Calendar className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{interviewsScheduled}</div>
                  <div className="text-sm text-muted-foreground">Interviews Scheduled</div>
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-success/10 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-success" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{offersExtended}</div>
                  <div className="text-sm text-muted-foreground">Offers Extended</div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex h-[calc(100vh-200px)] min-w-0">
        {/* Left Panel - Project/Role Tree */}
        {/* <ProjectRoleTree
          onRoleSelect={handleRoleSelect}
          selectedRoleId={selectedRoleId}
        /> */}

        {/* Main Panel - Application Table */}
        {selectedRoleId ? (
          <div className="flex-1 min-w-0 flex">
            <div className="flex-1 flex flex-col">
              <div className="p-4 border-b border-border/50 bg-card/30 backdrop-blur-sm">
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <div>
                    <h2 className="text-xl font-semibold">{selectedRole?.name}</h2>
                    <p className="text-sm text-muted-foreground">{selectedProject?.title} • {selectedRoleApplications.length} applications</p>
                  </div>
                  <Badge variant="secondary">{selectedRole?.status}</Badge>
                </div>
                <div className="mt-4">
                  <Tabs value={currentTab} onValueChange={setCurrentTab}>
                    <TabsList className="w-full sm:w-auto overflow-x-auto">
                      <TabsTrigger value="pipeline">Pipeline</TabsTrigger>
                      <TabsTrigger value="table">Applications</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
              </div>

              <div className="flex-1 min-h-0">
                {currentTab === 'pipeline' ? (
                  <PipelineBoard 
                    applications={selectedRoleApplications}
                    onApplicationSelect={handleApplicationSelect}
                    onOpenMessaging={openMessagingFor}
                    onScheduleInterview={openScheduleFor}
                  />
                ) : (
                  <ApplicationTable
                    applications={selectedRoleApplications}
                    onApplicationSelect={handleApplicationSelect}
                    selectedApplicationId={selectedApplicationId}
                    onScheduleInterview={openScheduleFor}
                    onOfferInvite={openOfferFor}
                    onOpenFeedback={openFeedbackFor}
                    onOpenMessaging={openMessagingFor}
                  />
                )}
              </div>
            </div>

              {/* Details Overlay - right side on all breakpoints */}
              {selectedApplicationId && (
                <Sheet 
                  open={!!selectedApplicationId}
                  onOpenChange={(open) => { if (!open) setSelectedApplicationId(undefined); }}
                >
                  <SheetContent side="right" className="p-0 w-[92vw] sm:w-[420px] md:w-[560px] lg:w-[680px] xl:w-[760px]">
                    <SheetHeader className="px-6 pt-6 pb-0 text-left">
                      <SheetTitle>Application Details</SheetTitle>
                    </SheetHeader>
                    <div className="overflow-y-auto h-[calc(100vh-5rem)]">
                      <ApplicationDetails 
                        applicationId={selectedApplicationId}
                        onScheduleInterview={openScheduleFor}
                        onOfferInvite={openOfferFor}
                        onOpenFeedback={openFeedbackFor}
                        onOpenMessaging={openMessagingFor}
                      />
                    </div>
                  </SheetContent>
                </Sheet>
              )}
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <UserCheck className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
              <h3 className="text-xl font-medium mb-2">Select a Role</h3>
              <p className="text-muted-foreground max-w-md">
                Choose a project and contractor role from the left panel to view and manage applications.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Overlays */}
      <MessagingPanel 
        open={messagingOpen}
        onOpenChange={setMessagingOpen}
        applicationId={selectedApplicationId}
        applicantName={actionApplicantName}
        composeInterview={composeInterview}
      />

      {/* Modals */}
      <InterviewScheduleModal 
        open={scheduleOpen}
        onOpenChange={setScheduleOpen}
        applicantName={actionApplicantName}
        applicationId={selectedApplicationId || ''}
      />
      <OfferModal 
        open={offerOpen}
        onOpenChange={setOfferOpen}
        applicantName={actionApplicantName}
        applicationId={selectedApplicationId || ''}
        roleTitle={actionRoleTitle}
        projectTitle={actionProjectTitle}
      />
      <InterviewFeedbackModal 
        open={feedbackOpen}
        onOpenChange={setFeedbackOpen}
        applicantName={actionApplicantName}
        interviewId={feedbackInterviewId}
        interviewDate={feedbackInterviewDate}
        interviewType={feedbackInterviewType}
      />
    </div>
  );
}