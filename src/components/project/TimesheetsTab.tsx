import { useState } from 'react';
import { Project, Timesheet, TimesheetStatus, TimesheetEntry } from '@/types/entities';
import { useApp } from '@/context/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { FeedbackModal } from './FeedbackModal';
import { 
  Calendar, 
  Clock, 
  DollarSign, 
  Plus,
  Check,
  X,
  User,
  FileText
} from 'lucide-react';

interface TimesheetsTabProps {
  project: Project;
}

export function TimesheetsTab({ project }: TimesheetsTabProps) {
  const { state, dispatch } = useApp();
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [showEntryForm, setShowEntryForm] = useState(false);
  const [feedbackModal, setFeedbackModal] = useState<{
    isOpen: boolean;
    timesheetId?: string;
    contractorName?: string;
  }>({ isOpen: false });

  const timesheetRoles = project.roles.filter(role => role.type === 'Timesheet');
  const currentRole = selectedRole 
    ? timesheetRoles.find(r => r.id === selectedRole)
    : timesheetRoles[0];

  const getContractorById = (id: string) => {
    return state.contractors.find(c => c.id === id);
  };

  const getRoleTimesheets = (roleId: string) => {
    return state.timesheets.filter(t => t.roleId === roleId);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending Approval': return 'warning';
      case 'Approved': return 'default';
      case 'Rejected': return 'destructive';
      default: return 'secondary';
    }
  };

  const calculateTotal = (timesheet: Timesheet) => {
    const totalHours = timesheet.entries.reduce((sum, entry) => sum + entry.hours, 0);
    const rate = currentRole?.payRate || 0;
    return totalHours * rate;
  };

  const handleTimesheetApproval = (timesheet: Timesheet) => {
    const contractor = getContractorById(timesheet.contractorId);
    const total = calculateTotal(timesheet);
    
    // Move to payments section
    dispatch({
      type: 'ADD_PAYMENT',
      payload: {
        id: `payment-${Date.now()}`,
        contractorId: timesheet.contractorId,
        roleId: timesheet.roleId,
        timesheetId: timesheet.id,
        amount: total,
        currency: 'AUD',
        status: 'Pending',
        auditLog: [],
        createdAt: new Date().toISOString()
      }
    });
    
    // Update timesheet status
    dispatch({
      type: 'UPDATE_TIMESHEET_STATUS',
      payload: { id: timesheet.id, status: 'Approved' }
    });
    
    // Trigger feedback modal
    setFeedbackModal({
      isOpen: true,
      timesheetId: timesheet.id,
      contractorName: contractor?.name || 'Contractor'
    });
  };

  const handleFeedbackSubmit = (rating: number, feedback: string) => {
    console.log('Timesheet feedback submitted:', { 
      timesheetId: feedbackModal.timesheetId, 
      rating, 
      feedback 
    });
    
    setFeedbackModal({ isOpen: false });
  };

  const TimesheetCard = ({ timesheet }: { timesheet: Timesheet }) => {
    const contractor = getContractorById(timesheet.contractorId);
    const totalHours = timesheet.entries.reduce((sum, entry) => sum + entry.hours, 0);
    const totalAmount = calculateTotal(timesheet);

    return (
      <Card key={timesheet.id} className="glass-card border-border/50">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {contractor && (
                <Avatar className="w-10 h-10">
                  <AvatarImage src={contractor.profilePicture} />
                  <AvatarFallback>
                    {contractor.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
              )}
              <div>
                <p className="font-medium">{contractor?.name}</p>
                <p className="text-sm text-muted-foreground">
                  {new Date(timesheet.periodStart).toLocaleDateString()} - {new Date(timesheet.periodEnd).toLocaleDateString()}
                </p>
              </div>
            </div>
            <Badge variant={getStatusColor(timesheet.status) as any}>
              {timesheet.status}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-background/30 rounded">
              <div className="text-lg font-bold text-primary">{totalHours}h</div>
              <div className="text-xs text-muted-foreground">Total Hours</div>
            </div>
            <div className="text-center p-3 bg-background/30 rounded">
              <div className="text-lg font-bold text-success">${totalAmount.toLocaleString()}</div>
              <div className="text-xs text-muted-foreground">Total Amount</div>
            </div>
          </div>

          <div className="flex gap-2">
            {timesheet.status === 'Pending Approval' && (
              <>
                <Button 
                  size="sm" 
                  variant="default" 
                  className="flex-1"
                  onClick={() => handleTimesheetApproval(timesheet)}
                >
                  <Check className="w-4 h-4 mr-2" />
                  Approve
                </Button>
                <Button size="sm" variant="outline">
                  <X className="w-4 h-4 mr-2" />
                  Reject
                </Button>
              </>
            )}
            <Button size="sm" variant="ghost">
              View Details
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  if (timesheetRoles.length === 0) {
    return (
      <div className="text-center py-12">
        <Clock className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
        <h3 className="text-lg font-semibold mb-2">No Timesheet Roles</h3>
        <p className="text-muted-foreground">
          This project only has milestone-based roles. Timesheets are only available for hourly roles.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Role Selector */}
      {timesheetRoles.length > 1 && (
        <div className="flex gap-2 flex-wrap">
          {timesheetRoles.map(role => {
            const contractor = role.assignedContractor ? getContractorById(role.assignedContractor) : null;
            
            return (
              <Button
                key={role.id}
                variant={selectedRole === role.id || (!selectedRole && role === timesheetRoles[0]) ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedRole(role.id)}
                className="flex items-center gap-2"
              >
                {contractor && (
                  <Avatar className="w-4 h-4">
                    <AvatarImage src={contractor.profilePicture} />
                    <AvatarFallback className="text-xs">
                      {contractor.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                )}
                {role.name}
              </Button>
            );
          })}
        </div>
      )}

      {/* Current Role Info */}
      {currentRole && (
        <Card className="glass-card border-border/50">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">{currentRole.name}</CardTitle>
              <div className="flex items-center gap-2">
                <Badge variant="outline">Timesheet Role</Badge>
                <span className="text-sm text-muted-foreground">
                  ${currentRole.payRate}/hour
                </span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                {currentRole.description}
              </p>
              {currentRole.assignedContractor && (
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">
                    {getContractorById(currentRole.assignedContractor)?.name}
                  </span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Timesheets */}
      {currentRole && currentRole.assignedContractor && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Submitted Timesheets</h3>
            <Button onClick={() => setShowEntryForm(!showEntryForm)} variant="outline" size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Log Hours
            </Button>
          </div>

          {getRoleTimesheets(currentRole.id).map(timesheet => (
            <TimesheetCard key={timesheet.id} timesheet={timesheet} />
          ))}

          {getRoleTimesheets(currentRole.id).length === 0 && (
            <div className="text-center py-8 glass-card rounded-lg border border-border/50">
              <FileText className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Timesheets Logged</h3>
              <p className="text-muted-foreground">
                No timesheets have been submitted for this role yet.
              </p>
            </div>
          )}
        </div>
      )}

      {!currentRole?.assignedContractor && (
        <div className="text-center py-8 glass-card rounded-lg border border-border/50">
          <User className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Contractor Assigned</h3>
          <p className="text-muted-foreground">
            Assign a contractor to this role to start tracking hours.
          </p>
        </div>
      )}

      {/* Feedback Modal */}
      <FeedbackModal
        isOpen={feedbackModal.isOpen}
        onClose={() => setFeedbackModal({ isOpen: false })}
        onSubmit={handleFeedbackSubmit}
        title="Rate Timesheet Work"
        description={`Please rate the quality of work submitted by ${feedbackModal.contractorName} and provide feedback.`}
      />
    </div>
  );
}