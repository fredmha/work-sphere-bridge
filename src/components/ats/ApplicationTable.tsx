import { useState } from 'react';
import { Search, Filter, Eye, MessageSquare, FileText, MoreHorizontal, Users } from 'lucide-react';
import { Application, ApplicationStatus } from '@/types/ats';
import { getApplicantById } from '@/lib/ats-mock-data';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import ScoreChips from '@/components/ats/ScoreChips';

interface ApplicationTableProps {
  applications: Application[];
  onApplicationSelect: (applicationId: string) => void;
  selectedApplicationId?: string;
  onScheduleInterview?: (applicationId: string, applicantName: string) => void;
  onOfferInvite?: (applicationId: string, applicantName: string) => void;
  onOpenMessaging?: (applicationId: string, applicantName: string) => void;
  onOpenFeedback?: (applicationId: string, applicantName: string) => void;
}

export function ApplicationTable({ applications, onApplicationSelect, selectedApplicationId, onScheduleInterview, onOfferInvite, onOpenMessaging, onOpenFeedback }: ApplicationTableProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<ApplicationStatus | 'all'>('all');
  const [selectedApplications, setSelectedApplications] = useState<Set<string>>(new Set());

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

  const filteredApplications = applications.filter(app => {
    const applicant = getApplicantById(app.applicantId);
    if (!applicant) return false;

    const matchesSearch = 
      applicant.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      applicant.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      applicant.email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const toggleApplicationSelection = (applicationId: string) => {
    const newSelected = new Set(selectedApplications);
    if (newSelected.has(applicationId)) {
      newSelected.delete(applicationId);
    } else {
      newSelected.add(applicationId);
    }
    setSelectedApplications(newSelected);
  };

  const toggleSelectAll = () => {
    if (selectedApplications.size === filteredApplications.length) {
      setSelectedApplications(new Set());
    } else {
      setSelectedApplications(new Set(filteredApplications.map(app => app.id)));
    }
  };

  return (
    <div className="flex-1 flex flex-col">
      {/* Search and Filter Bar */}
      <div className="p-4 border-b border-border/50 bg-card/30 backdrop-blur-sm">
        <div className="flex items-center gap-4 mb-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search applicants..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={(value: ApplicationStatus | 'all') => setStatusFilter(value)}>
            <SelectTrigger className="w-48">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
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
        
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>Showing {filteredApplications.length} applicants</span>
          {selectedApplications.size > 0 && (
            <div className="flex items-center gap-2">
              <span>Selected: {selectedApplications.size}</span>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    Bulk Actions
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>Schedule Interviews</DropdownMenuItem>
                  <DropdownMenuItem>Send Email</DropdownMenuItem>
                  <DropdownMenuItem>Update Status</DropdownMenuItem>
                  <DropdownMenuItem className="text-destructive">Reject Selected</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </div>
      </div>

      {/* Applications Table */}
      <div className="flex-1 overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox
                  checked={selectedApplications.size === filteredApplications.length && filteredApplications.length > 0}
                  onCheckedChange={toggleSelectAll}
                />
              </TableHead>
              <TableHead>Name</TableHead>
              <TableHead className="hidden md:table-cell">Email</TableHead>
              <TableHead>Pipeline Stage</TableHead>
              <TableHead>Scores</TableHead>
              <TableHead className="hidden sm:table-cell">Applied</TableHead>
              <TableHead className="w-32">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredApplications.map((application) => {
              const applicant = getApplicantById(application.applicantId);
              if (!applicant) return null;

              const isSelected = selectedApplicationId === application.id;
              const isChecked = selectedApplications.has(application.id);

              return (
                <TableRow
                  key={application.id}
                  className={cn(
                    "cursor-pointer hover:bg-muted/50",
                    isSelected && "bg-primary/5 border-l-2 border-l-primary"
                  )}
                  onClick={() => onApplicationSelect(application.id)}
                >
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <Checkbox
                      checked={isChecked}
                      onCheckedChange={() => toggleApplicationSelection(application.id)}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      {applicant.profilePictureUrl && (
                        <img
                          src={applicant.profilePictureUrl}
                          alt={`${applicant.firstName} ${applicant.lastName}`}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                      )}
                      <div>
                        <div className="font-medium">
                          {applicant.firstName} {applicant.lastName}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {applicant.location.city}, {applicant.location.country}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-sm">{applicant.email}</TableCell>
                  <TableCell>{getStatusBadge(application.status)}</TableCell>
                  <TableCell>
                    <ScoreChips ai={application.aiScore} task={applicant.averageTaskScore ?? null} interview={undefined} />
                  </TableCell>
                  <TableCell className="hidden sm:table-cell text-sm text-muted-foreground">
                    {new Date(application.submittedAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="sm" title="View Details">
                        <Eye className="h-4 w-4" />
                      </Button>
<Button variant="ghost" size="sm" title="Message" onClick={() => onOpenMessaging?.(application.id, `${applicant.firstName} ${applicant.lastName}`)}>
                        <MessageSquare className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" title="View Resume">
                        <FileText className="h-4 w-4" />
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
<DropdownMenuContent>
                          <DropdownMenuItem onClick={() => onScheduleInterview?.(application.id, `${applicant.firstName} ${applicant.lastName}`)}>Schedule Interview</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => onOpenFeedback?.(application.id, `${applicant.firstName} ${applicant.lastName}`)}>Interview Feedback</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => onOfferInvite?.(application.id, `${applicant.firstName} ${applicant.lastName}`)}>Offer / Invite</DropdownMenuItem>
                          <DropdownMenuItem>Override Score</DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">Reject Application</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>

        {filteredApplications.length === 0 && (
          <div className="text-center text-muted-foreground py-12">
            <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-medium mb-2">No applications found</h3>
            <p>Try adjusting your search or filter criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
}