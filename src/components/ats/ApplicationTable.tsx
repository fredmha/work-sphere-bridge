import { useState, useEffect } from 'react';
import { Search, Filter, Eye, MessageSquare, FileText, MoreHorizontal, Users } from 'lucide-react';
import { Application, ApplicationStatus } from '@/types/ats';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import ScoreChips from '@/components/ats/ScoreChips';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/context/AuthContext';
import type { Database } from '@/types/supabase';

type Tables = Database['public']['Tables'];
type ApplicationRow = Tables['application']['Row'];
type ContractorRow = Tables['contractor']['Row'];
type UserRow = Tables['users']['Row'];

interface ApplicationTableProps {
  applications?: Application[];
  onApplicationSelect: (applicationId: string) => void;
  selectedApplicationId?: string;
  onScheduleInterview?: (applicationId: string, applicantName: string) => void;
  onOfferInvite?: (applicationId: string, applicantName: string) => void;
  onOpenMessaging?: (applicationId: string, applicantName: string) => void;
  onOpenFeedback?: (applicationId: string, applicantName: string) => void;
  roleId?: string; // filter applications by role only
  projectId?: string; // optional: filter by project when role not set
}

export function ApplicationTable({ 
  applications: propApplications, 
  onApplicationSelect, 
  selectedApplicationId, 
  onScheduleInterview, 
  onOfferInvite, 
  onOpenMessaging, 
  onOpenFeedback,
  roleId,
  projectId
}: ApplicationTableProps) {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<ApplicationStatus | 'all'>('all');
  const [selectedApplications, setSelectedApplications] = useState<Set<string>>(new Set());
  const [supabaseApplications, setSupabaseApplications] = useState<ApplicationRow[]>([]);
  const [supabaseContractors, setSupabaseContractors] = useState<ContractorRow[]>([]);
  const [supabaseUsers, setSupabaseUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch applications and related data from Supabase — filter by role only
  useEffect(() => {
    const fetchData = async () => {
      if (!supabase) {
        // Supabase is not configured; stop loading and rely on props fallback
        setLoading(false);
        return;
      }
      try {
        setLoading(true);

        let query = supabase.from('application').select('*');
        if (roleId) {
          const roleIdNum = parseInt(roleId as unknown as string);
          if (!Number.isNaN(roleIdNum)) {
            query = query.eq('roleid', roleIdNum);
          }
        } else if (projectId) {
          const projectIdNum = parseInt(projectId as unknown as string);
          if (!Number.isNaN(projectIdNum)) {
            query = query.eq('projectid', projectIdNum);
          }
        } else {
          // If no role or project selected, show nothing (avoid loading all applications)
          setSupabaseApplications([]);
          setSupabaseContractors([]);
          setSupabaseUsers([]);
          setLoading(false);
          return;
        }

        const { data: applicationsData, error: applicationsError } = await query;
        if (applicationsError) throw applicationsError;

        const contractorIds = [...new Set(applicationsData?.map(app => app.contractorid).filter(Boolean) || [])];
        let contractorsData: ContractorRow[] = [];
        if (contractorIds.length > 0) {
          const { data, error } = await supabase
            .from('contractor')
            .select('*')
            .in('id', contractorIds);
          if (error) throw error;
          contractorsData = data || [];
        } else {
          contractorsData = [];
        }

        const userIds = [...new Set(contractorsData?.map(c => c.linkeduser).filter(Boolean) || [])];
        let usersData: UserRow[] = [];
        if (userIds.length > 0) {
          const { data, error } = await supabase
            .from('users')
            .select('*')
            .in('id', userIds);
          if (error) throw error;
          usersData = data || [];
        } else {
          usersData = [];
        }

        setSupabaseApplications(applicationsData || []);
        setSupabaseContractors(contractorsData || []);
        setSupabaseUsers(usersData || []);
      } catch (error) {
        console.error('Error fetching applications:', error);
        setSupabaseApplications([]);
        setSupabaseContractors([]);
        setSupabaseUsers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [roleId, projectId]);

  // Helper function to get contractor by ID
  const getContractorById = (id: number) => {
    return supabaseContractors.find(contractor => contractor.id === id);
  };

  // Helper function to get user by ID
  const getUserById = (id: string) => {
    return supabaseUsers.find(user => user.id === id);
  };

  // Helper function to get applicant name from contractor and user data
  // Prefer contractor.name, fallback to linked user full name
  const getApplicantName = (contractorId: number) => {
    const contractor = getContractorById(contractorId);
    if (!contractor) return 'Unknown Applicant';

    if (contractor.name && contractor.name.trim().length > 0) {
      return contractor.name;
    }

    const user = getUserById(contractor.linkeduser || '');
    if (user && user['full name']) return user['full name'];

    return 'Unknown Applicant';
  };

  // Helper function to get applicant email
  // Prefer contractor.email if present, otherwise fallback to linked user's email
  const getApplicantEmail = (contractorId: number) => {
    const contractor = getContractorById(contractorId);
    if (!contractor) return '';

    const contractorEmail = (contractor as unknown as { email?: string }).email;
    if (contractorEmail) return contractorEmail;

    const user = getUserById(contractor.linkeduser || '');
    return user?.email || '';
  };

  // Helper function to get applicant location from contractor data
  const getApplicantLocation = (contractorId: number) => {
    const contractor = getContractorById(contractorId);
    return contractor?.location || 'Location not specified';
  };

  // Helper function to get applicant profile picture from contractor data
  const getApplicantProfilePic = (contractorId: number) => {
    const contractor = getContractorById(contractorId);
    return contractor?.profilepic || '';
  };

  // Helper function to get applicant average task score from contractor data
  const getApplicantTaskScore = (contractorId: number) => {
    const contractor = getContractorById(contractorId);
    return contractor?.avgtaskscore || null;
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { label: 'Pending', variant: 'secondary' as const, icon: '🔵' },
      interview_scheduled: { label: 'Interview Scheduled', variant: 'default' as const, icon: '📅' },
      interviewed: { label: 'Interviewed', variant: 'default' as const, icon: '🎯' },
      offered: { label: 'Offered', variant: 'default' as const, icon: '✅' },
      accepted: { label: 'Accepted', variant: 'default' as const, icon: '✅' },
      rejected: { label: 'Rejected', variant: 'destructive' as const, icon: '❌' },
      contracted: { label: 'Contracted', variant: 'default' as const, icon: '📝' }
    };

    const config = statusConfig[status as ApplicationStatus] || { label: status, variant: 'secondary' as const, icon: '❓' };
    return (
      <Badge variant={config.variant} className="gap-1">
        <span>{config.icon}</span>
        {config.label}
      </Badge>
    );
  };

  // Use Supabase data if available, otherwise fall back to props
  const applicationsToShow = supabaseApplications.length > 0 ? supabaseApplications : (propApplications || []);
  
  const filteredApplications = applicationsToShow.filter(app => {
    // Handle both Supabase and prop application types
    if ('contractorid' in app) {
      // Supabase application
      const applicantName = getApplicantName(app.contractorid || 0);
      const applicantEmail = getApplicantEmail(app.contractorid || 0);

      const matchesSearch = 
        applicantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        applicantEmail.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = statusFilter === 'all' || app.status === statusFilter;

      return matchesSearch && matchesStatus;
    } else {
      // Prop application (legacy type)
      const matchesSearch = 
        (app.applicantId || '').toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = statusFilter === 'all' || app.status === statusFilter;

      return matchesSearch && matchesStatus;
    }
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
      setSelectedApplications(new Set(filteredApplications.map(app => {
        if ('contractorid' in app) {
          return app.id.toString();
        } else {
          return app.id;
        }
      })));
    }
  };

  return (
    <div className="flex-1 flex flex-col min-w-0 h-full">
      {/* Search and Filter Bar */}
      <div className="p-3 sm:p-4 border-b border-border/50 bg-card/30 backdrop-blur-sm">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-3">
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
            <SelectTrigger className="w-full sm:w-48">
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
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-sm text-muted-foreground">
          <span>Showing {filteredApplications.length} applicants</span>
          {selectedApplications.size > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-xs sm:text-sm">Selected: {selectedApplications.size}</span>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="text-xs sm:text-sm">
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
      <div className="flex-1 min-h-0 overflow-auto">
        {loading ? (
          <div className="text-center text-muted-foreground py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Loading applications...</p>
          </div>
        ) : (
          <>
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
              // Handle both Supabase and prop application types
              if ('contractorid' in application) {
                // Supabase application
                const applicantName = getApplicantName(application.contractorid || 0);
                const applicantEmail = getApplicantEmail(application.contractorid || 0);
                const applicantLocation = getApplicantLocation(application.contractorid || 0);
                const applicantProfilePic = getApplicantProfilePic(application.contractorid || 0);
                const applicantTaskScore = getApplicantTaskScore(application.contractorid || 0);

                const isSelected = selectedApplicationId === application.id.toString();
                const isChecked = selectedApplications.has(application.id.toString());

                return (
                  <TableRow
                    key={application.id}
                    className={cn(
                      "cursor-pointer hover:bg-muted/50",
                      isSelected && "bg-primary/5 border-l-2 border-l-primary"
                    )}
                    onClick={() => onApplicationSelect(application.id.toString())}
                  >
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <Checkbox
                        checked={isChecked}
                        onCheckedChange={() => toggleApplicationSelection(application.id.toString())}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        {applicantProfilePic && (
                          <img
                            src={applicantProfilePic}
                            alt={applicantName}
                            className="w-8 h-8 rounded-full object-cover"
                          />
                        )}
                        <div>
                          <div className="font-medium">
                            {applicantName}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {applicantLocation}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-sm">{applicantEmail || 'No email'}</TableCell>
                    <TableCell>{getStatusBadge(application.status || 'pending')}</TableCell>
                    <TableCell>
                      <ScoreChips 
                        ai={application.aiscore || 0} 
                        task={applicantTaskScore} 
                        interview={undefined} 
                      />
                    </TableCell>
                    <TableCell className="hidden sm:table-cell text-sm text-muted-foreground">
                      {new Date(application.created_at).toLocaleDateString()}
                    </TableCell>
                     <TableCell onClick={(e) => e.stopPropagation()}>
                       <div className="flex items-center gap-1">
                         <Button variant="ghost" size="sm" title="View Details" className="hidden sm:flex">
                           <Eye className="h-4 w-4" />
                         </Button>
                         <Button variant="ghost" size="sm" title="Message" onClick={() => onOpenMessaging?.(application.id.toString(), applicantName)} className="hidden sm:flex">
                           <MessageSquare className="h-4 w-4" />
                         </Button>
                         <Button variant="ghost" size="sm" title="View Resume" className="hidden md:flex">
                           <FileText className="h-4 w-4" />
                         </Button>
                         <DropdownMenu>
                           <DropdownMenuTrigger asChild>
                             <Button variant="ghost" size="sm">
                               <MoreHorizontal className="h-4 w-4" />
                             </Button>
                           </DropdownMenuTrigger>
                           <DropdownMenuContent>
                             <DropdownMenuItem onClick={() => onScheduleInterview?.(application.id.toString(), applicantName)}>Schedule Interview</DropdownMenuItem>
                             <DropdownMenuItem onClick={() => onOpenFeedback?.(application.id.toString(), applicantName)}>Interview Feedback</DropdownMenuItem>
                             <DropdownMenuItem onClick={() => onOfferInvite?.(application.id.toString(), applicantName)}>Offer / Invite</DropdownMenuItem>
                             <DropdownMenuItem>Override Score</DropdownMenuItem>
                             <DropdownMenuItem className="text-destructive">Reject Application</DropdownMenuItem>
                           </DropdownMenuContent>
                         </DropdownMenu>
                       </div>
                     </TableCell>
                  </TableRow>
                );
              } else {
                // Prop application (legacy type) - render minimal info
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
                        <div>
                          <div className="font-medium">
                            {application.applicantId || 'Unknown Applicant'}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Legacy Application
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-sm">N/A</TableCell>
                    <TableCell>{getStatusBadge(application.status)}</TableCell>
                    <TableCell>
                      <ScoreChips 
                        ai={application.aiScore || 0} 
                        task={undefined} 
                        interview={undefined} 
                      />
                    </TableCell>
                    <TableCell className="hidden sm:table-cell text-sm text-muted-foreground">
                      {new Date(application.submittedAt).toLocaleDateString()}
                    </TableCell>
                     <TableCell onClick={(e) => e.stopPropagation()}>
                       <div className="flex items-center gap-1">
                         <Button variant="ghost" size="sm" title="View Details" className="hidden sm:flex">
                           <Eye className="h-4 w-4" />
                         </Button>
                         <Button variant="ghost" size="sm" title="Message" onClick={() => onOpenMessaging?.(application.id, application.applicantId || 'Unknown')} className="hidden sm:flex">
                           <MessageSquare className="h-4 w-4" />
                         </Button>
                         <Button variant="ghost" size="sm" title="View Resume" className="hidden md:flex">
                           <FileText className="h-4 w-4" />
                         </Button>
                         <DropdownMenu>
                           <DropdownMenuTrigger asChild>
                             <Button variant="ghost" size="sm">
                               <MoreHorizontal className="h-4 w-4" />
                             </Button>
                           </DropdownMenuTrigger>
                           <DropdownMenuContent>
                             <DropdownMenuItem onClick={() => onScheduleInterview?.(application.id, application.applicantId || 'Unknown')}>Schedule Interview</DropdownMenuItem>
                             <DropdownMenuItem onClick={() => onOpenFeedback?.(application.id, application.applicantId || 'Unknown')}>Interview Feedback</DropdownMenuItem>
                             <DropdownMenuItem onClick={() => onOfferInvite?.(application.id, application.applicantId || 'Unknown')}>Offer / Invite</DropdownMenuItem>
                             <DropdownMenuItem>Override Score</DropdownMenuItem>
                             <DropdownMenuItem className="text-destructive">Reject Application</DropdownMenuItem>
                           </DropdownMenuContent>
                         </DropdownMenu>
                       </div>
                     </TableCell>
                  </TableRow>
                );
              }
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
          </>
        )}
      </div>
    </div>
  );
}