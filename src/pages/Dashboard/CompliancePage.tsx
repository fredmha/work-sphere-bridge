import React, { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Search, 
  Filter,
  CheckCircle,
  AlertCircle,
  Clock,
  XCircle,
  FileText,
  Download,
  AlertTriangle,
  Calendar,
  User,
  Building
} from 'lucide-react';
import { ComplianceModal } from '@/components/compliance/ComplianceModal';
import { cn } from '@/lib/utils';

interface ComplianceOverview {
  contractorId: string;
  contractorName: string;
  contractorEmail: string;
  contractorAvatar?: string;
  roleId: string;
  roleName: string;
  projectName: string;
  overallStatus: 'incomplete' | 'awaiting_review' | 'complete';
  completionPercentage: number;
  items: {
    abnOrTfn: string;
    bankDetails: string;
    superannuation: string;
    workRights: string;
    signedContract: string;
    fairWorkAcknowledgment: string;
  };
  blockers: string[];
  expiryAlerts: string[];
}

export const CompliancePage = () => {
  const { state } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'incomplete' | 'awaiting_review' | 'complete' | 'blocked'>('all');
  const [selectedCompliance, setSelectedCompliance] = useState<{ contractorId: string; roleId: string } | null>(null);
  const [showComplianceModal, setShowComplianceModal] = useState(false);

  // Build compliance overview data
  const complianceOverviews: ComplianceOverview[] = [];
  
  state.projects?.forEach(project => {
    project.roles.forEach(role => {
      if (role.assignedContractor) {
        const contractor = state.contractors?.find(c => c.id === role.assignedContractor);
        const checklist = state.complianceChecklists?.find(
          c => c.contractorId === role.assignedContractor && c.roleId === role.id
        );
        
        if (contractor && checklist) {
          const completedItems = Object.values(checklist.items).filter(status => status === 'Complete').length;
          const totalItems = Object.keys(checklist.items).length;
          const completionPercentage = Math.round((completedItems / totalItems) * 100);
          
          // Check for blockers
          const blockers: string[] = [];
          if (checklist.items.abnOrTfn === 'Incomplete') blockers.push('ABN/TFN missing');
          if (checklist.items.bankDetails === 'Incomplete') blockers.push('Bank details missing');
          if (checklist.items.workRights === 'Incomplete') blockers.push('Work rights not verified');
          if (checklist.items.signedContract === 'Incomplete') blockers.push('Contract not signed');
          
          // Check for expiry alerts (mock data for now)
          const expiryAlerts: string[] = [];
          if (contractor.complianceData.workRights?.expiryDate) {
            const expiryDate = new Date(contractor.complianceData.workRights.expiryDate);
            const now = new Date();
            const daysUntilExpiry = Math.ceil((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
            
            if (daysUntilExpiry <= 30 && daysUntilExpiry > 0) {
              expiryAlerts.push(`Visa expires in ${daysUntilExpiry} days`);
            } else if (daysUntilExpiry <= 0) {
              expiryAlerts.push('Visa has expired');
              blockers.push('Expired visa');
            }
          }

          complianceOverviews.push({
            contractorId: contractor.id,
            contractorName: contractor.name,
            contractorEmail: contractor.email,
            contractorAvatar: contractor.profilePicture,
            roleId: role.id,
            roleName: role.name,
            projectName: project.title,
            overallStatus: checklist.overallStatus,
            completionPercentage,
            items: checklist.items,
            blockers,
            expiryAlerts
          });
        }
      }
    });
  });

  // Filter compliance data
  const filteredCompliance = complianceOverviews.filter(item => {
    const matchesSearch = 
      item.contractorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.contractorEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.projectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.roleName.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (!matchesSearch) return false;
    
    if (filterStatus === 'all') return true;
    if (filterStatus === 'blocked') return item.blockers.length > 0;
    return item.overallStatus === filterStatus;
  });

  // Calculate stats
  const stats = {
    total: complianceOverviews.length,
    complete: complianceOverviews.filter(c => c.overallStatus === 'complete').length,
    awaiting: complianceOverviews.filter(c => c.overallStatus === 'awaiting_review').length,
    incomplete: complianceOverviews.filter(c => c.overallStatus === 'incomplete').length,
    blocked: complianceOverviews.filter(c => c.blockers.length > 0).length,
    expiring: complianceOverviews.filter(c => c.expiryAlerts.length > 0).length
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'complete':
        return <CheckCircle className="h-4 w-4 text-success" />;
      case 'awaiting_review':
        return <Clock className="h-4 w-4 text-warning" />;
      case 'incomplete':
        return <AlertCircle className="h-4 w-4 text-destructive" />;
      default:
        return <XCircle className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'complete':
        return 'default';
      case 'awaiting_review':
        return 'secondary';
      case 'incomplete':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const getItemStatusIcon = (status: string) => {
    switch (status) {
      case 'Complete':
        return <CheckCircle className="h-3 w-3 text-success" />;
      case 'Pending Review':
        return <Clock className="h-3 w-3 text-warning" />;
      case 'Incomplete':
        return <XCircle className="h-3 w-3 text-destructive" />;
      default:
        return <AlertCircle className="h-3 w-3 text-muted-foreground" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Compliance Management</h1>
        <p className="text-muted-foreground">
          Monitor contractor compliance status, track document requirements, and manage regulatory obligations
        </p>
      </div>

      {/* Critical Alerts */}
      {stats.blocked > 0 && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>{stats.blocked}</strong> contractor{stats.blocked !== 1 ? 's have' : ' has'} compliance blockers preventing work authorization.
          </AlertDescription>
        </Alert>
      )}

      {stats.expiring > 0 && (
        <Alert>
          <Calendar className="h-4 w-4" />
          <AlertDescription>
            <strong>{stats.expiring}</strong> document{stats.expiring !== 1 ? 's are' : ' is'} expiring soon and require attention.
          </AlertDescription>
        </Alert>
      )}

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Assignments</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Complete</CardTitle>
            <CheckCircle className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.complete}</div>
            <p className="text-xs text-muted-foreground">
              {stats.total > 0 ? Math.round((stats.complete / stats.total) * 100) : 0}% of total
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Awaiting Review</CardTitle>
            <Clock className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.awaiting}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Incomplete</CardTitle>
            <AlertCircle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.incomplete}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Blocked</CardTitle>
            <XCircle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.blocked}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Expiring Soon</CardTitle>
            <Calendar className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.expiring}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by contractor, project, or role..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <Button
            variant={filterStatus === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilterStatus('all')}
          >
            All ({stats.total})
          </Button>
          <Button
            variant={filterStatus === 'incomplete' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilterStatus('incomplete')}
          >
            Incomplete ({stats.incomplete})
          </Button>
          <Button
            variant={filterStatus === 'awaiting_review' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilterStatus('awaiting_review')}
          >
            Review ({stats.awaiting})
          </Button>
          <Button
            variant={filterStatus === 'complete' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilterStatus('complete')}
          >
            Complete ({stats.complete})
          </Button>
          <Button
            variant={filterStatus === 'blocked' ? 'destructive' : 'outline'}
            size="sm"
            onClick={() => setFilterStatus('blocked')}
          >
            Blocked ({stats.blocked})
          </Button>
        </div>
        <Button variant="outline" size="sm">
          <Download className="h-4 w-4 mr-2" />
          Export Report
        </Button>
      </div>

      {/* Compliance List */}
      <div className="space-y-4">
        {filteredCompliance.map((item) => (
          <Card key={`${item.contractorId}-${item.roleId}`} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={item.contractorAvatar} />
                    <AvatarFallback>
                      {item.contractorName.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-1">
                    <h3 className="font-semibold">{item.contractorName}</h3>
                    <p className="text-sm text-muted-foreground">{item.contractorEmail}</p>
                    <div className="flex items-center gap-2 text-sm">
                      <Building className="h-3 w-3 text-muted-foreground" />
                      <span className="text-muted-foreground">{item.projectName}</span>
                      <span className="text-muted-foreground">•</span>
                      <span className="font-medium">{item.roleName}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={getStatusVariant(item.overallStatus)}>
                    {getStatusIcon(item.overallStatus)}
                    <span className="ml-1 capitalize">{item.overallStatus.replace('_', ' ')}</span>
                  </Badge>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedCompliance({ contractorId: item.contractorId, roleId: item.roleId });
                      setShowComplianceModal(true);
                    }}
                  >
                    <FileText className="h-3 w-3 mr-1" />
                    View Details
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Compliance Progress */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Compliance Progress</span>
                  <span className="font-medium">{item.completionPercentage}%</span>
                </div>
                <Progress value={item.completionPercentage} className="h-2" />
              </div>

              {/* Compliance Items Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
                <div className="flex items-center gap-2">
                  {getItemStatusIcon(item.items.abnOrTfn)}
                  <span>ABN/TFN</span>
                </div>
                <div className="flex items-center gap-2">
                  {getItemStatusIcon(item.items.bankDetails)}
                  <span>Bank Details</span>
                </div>
                <div className="flex items-center gap-2">
                  {getItemStatusIcon(item.items.superannuation)}
                  <span>Superannuation</span>
                </div>
                <div className="flex items-center gap-2">
                  {getItemStatusIcon(item.items.workRights)}
                  <span>Work Rights</span>
                </div>
                <div className="flex items-center gap-2">
                  {getItemStatusIcon(item.items.signedContract)}
                  <span>Contract</span>
                </div>
                <div className="flex items-center gap-2">
                  {getItemStatusIcon(item.items.fairWorkAcknowledgment)}
                  <span>Fair Work</span>
                </div>
              </div>

              {/* Alerts and Blockers */}
              {(item.blockers.length > 0 || item.expiryAlerts.length > 0) && (
                <div className="space-y-2">
                  {item.blockers.map((blocker, index) => (
                    <Alert key={index} variant="destructive">
                      <XCircle className="h-4 w-4" />
                      <AlertDescription className="text-sm">
                        <strong>Blocker:</strong> {blocker}
                      </AlertDescription>
                    </Alert>
                  ))}
                  {item.expiryAlerts.map((alert, index) => (
                    <Alert key={index}>
                      <Calendar className="h-4 w-4" />
                      <AlertDescription className="text-sm">
                        <strong>Expiry Alert:</strong> {alert}
                      </AlertDescription>
                    </Alert>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredCompliance.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">No compliance records found</h3>
            <p className="text-muted-foreground">
              {searchQuery ? 'Try adjusting your search criteria' : 'No compliance records match the selected filters'}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Compliance Modal */}
      {selectedCompliance && (
        <ComplianceModal
          open={showComplianceModal}
          onOpenChange={setShowComplianceModal}
          contractorId={selectedCompliance.contractorId}
          roleId={selectedCompliance.roleId}
        />
      )}
    </div>
  );
};

export default CompliancePage;