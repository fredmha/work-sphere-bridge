import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Search, 
  Filter, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  ExternalLink,
  CheckCircle,
  AlertCircle,
  Clock,
  Eye,
  FileText,
  Download
} from 'lucide-react';
import { ComplianceModal } from '@/components/compliance/ComplianceModal';
import { cn } from '@/lib/utils';

export const ContractorsPage = () => {
  const { state } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'pending' | 'complete'>('all');
  const [selectedContractor, setSelectedContractor] = useState<string | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showCompliance, setShowCompliance] = useState(false);

  const contractors = state.contractors || [];

  // Get compliance status for contractor
  const getContractorCompliance = (contractorId: string) => {
    const checklists = state.complianceChecklists?.filter(c => c.contractorId === contractorId) || [];
    if (checklists.length === 0) return { status: 'incomplete', percentage: 0 };
    
    const totalItems = checklists.length * 6; // 6 items per checklist
    const completedItems = checklists.reduce((acc, checklist) => {
      return acc + Object.values(checklist.items).filter(status => status === 'Complete').length;
    }, 0);
    
    const percentage = Math.round((completedItems / totalItems) * 100);
    
    if (percentage === 100) return { status: 'complete', percentage };
    if (percentage > 0) return { status: 'pending', percentage };
    return { status: 'incomplete', percentage };
  };

  // Get contractor's active projects
  const getContractorProjects = (contractorId: string) => {
    return state.projects?.filter(project => 
      project.roles.some(role => role.assignedContractor === contractorId)
    ) || [];
  };

  // Filter contractors
  const filteredContractors = contractors.filter(contractor => {
    const matchesSearch = contractor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         contractor.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (!matchesSearch) return false;
    
    if (filterStatus === 'all') return true;
    
    const compliance = getContractorCompliance(contractor.id);
    return compliance.status === filterStatus;
  });

  // Stats calculation
  const stats = {
    total: contractors.length,
    active: contractors.filter(c => getContractorProjects(c.id).length > 0).length,
    pending: contractors.filter(c => getContractorCompliance(c.id).status === 'pending').length,
    complete: contractors.filter(c => getContractorCompliance(c.id).status === 'complete').length
  };

  const selectedContractorData = selectedContractor ? 
    contractors.find(c => c.id === selectedContractor) : null;

  const getStatusBadge = (status: string, percentage: number) => {
    switch (status) {
      case 'complete':
        return <Badge variant="default" className="bg-success text-success-foreground"><CheckCircle className="h-3 w-3 mr-1" />Complete</Badge>;
      case 'pending':
        return <Badge variant="secondary"><Clock className="h-3 w-3 mr-1" />{percentage}% Complete</Badge>;
      default:
        return <Badge variant="outline"><AlertCircle className="h-3 w-3 mr-1" />Incomplete</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Contractors</h1>
        <p className="text-muted-foreground">
          Manage contractor profiles, compliance status, and project assignments
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Contractors</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
            <CheckCircle className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.active}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Compliance</CardTitle>
            <Clock className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pending}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Compliance Complete</CardTitle>
            <CheckCircle className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.complete}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search contractors..."
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
            variant={filterStatus === 'active' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilterStatus('active')}
          >
            Active ({stats.active})
          </Button>
          <Button
            variant={filterStatus === 'pending' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilterStatus('pending')}
          >
            Pending ({stats.pending})
          </Button>
          <Button
            variant={filterStatus === 'complete' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilterStatus('complete')}
          >
            Complete ({stats.complete})
          </Button>
        </div>
      </div>

      {/* Contractors Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredContractors.map((contractor) => {
          const compliance = getContractorCompliance(contractor.id);
          const projects = getContractorProjects(contractor.id);

          return (
            <Card key={contractor.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={contractor.profilePicture} />
                    <AvatarFallback>
                      {contractor.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold truncate">{contractor.name}</h3>
                    <p className="text-sm text-muted-foreground truncate">{contractor.email}</p>
                  </div>
                  {getStatusBadge(compliance.status, compliance.percentage)}
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {/* Contact Info */}
                <div className="space-y-1 text-sm">
                  {contractor.phone && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Phone className="h-3 w-3" />
                      <span>{contractor.phone}</span>
                    </div>
                  )}
                  {contractor.location && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      <span>{contractor.location}</span>
                    </div>
                  )}
                </div>

                {/* Compliance Progress */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Compliance</span>
                    <span>{compliance.percentage}%</span>
                  </div>
                  <Progress value={compliance.percentage} className="h-2" />
                </div>

                {/* Active Projects */}
                {projects.length > 0 && (
                  <div className="text-sm">
                    <span className="text-muted-foreground">Active in </span>
                    <span className="font-medium">{projects.length} project{projects.length !== 1 ? 's' : ''}</span>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedContractor(contractor.id);
                      setShowDetails(true);
                    }}
                  >
                    <Eye className="h-3 w-3 mr-1" />
                    View
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedContractor(contractor.id);
                      setShowCompliance(true);
                    }}
                  >
                    <FileText className="h-3 w-3 mr-1" />
                    Compliance
                  </Button>
                  {contractor.portfolioUrl && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => window.open(contractor.portfolioUrl, '_blank')}
                    >
                      <ExternalLink className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredContractors.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <User className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">No contractors found</h3>
            <p className="text-muted-foreground">
              {searchQuery ? 'Try adjusting your search criteria' : 'No contractors match the selected filters'}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Contractor Details Modal */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Contractor Details</DialogTitle>
            <DialogDescription>
              Complete profile and project information
            </DialogDescription>
          </DialogHeader>
          
          {selectedContractorData && (
            <Tabs defaultValue="profile" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="profile">Profile</TabsTrigger>
                <TabsTrigger value="compliance">Compliance</TabsTrigger>
                <TabsTrigger value="projects">Projects</TabsTrigger>
              </TabsList>
              
              <TabsContent value="profile" className="space-y-4">
                <div className="flex items-start gap-4">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={selectedContractorData.profilePicture} />
                    <AvatarFallback className="text-lg">
                      {selectedContractorData.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-2">
                    <h3 className="text-2xl font-bold">{selectedContractorData.name}</h3>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span>{selectedContractorData.email}</span>
                      </div>
                      {selectedContractorData.phone && (
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <span>{selectedContractorData.phone}</span>
                        </div>
                      )}
                      {selectedContractorData.location && (
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span>{selectedContractorData.location}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {selectedContractorData.portfolioUrl && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Portfolio</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Button
                        variant="outline"
                        onClick={() => window.open(selectedContractorData.portfolioUrl, '_blank')}
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        View Portfolio
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
              
              <TabsContent value="compliance" className="space-y-4">
                <div className="space-y-4">
                  {/* ... compliance details would be shown here ... */}
                  <p className="text-muted-foreground">
                    Use the "View Compliance" button to see detailed compliance status
                  </p>
                  <Button
                    onClick={() => {
                      setShowDetails(false);
                      setShowCompliance(true);
                    }}
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    View Compliance Checklist
                  </Button>
                </div>
              </TabsContent>
              
              <TabsContent value="projects" className="space-y-4">
                <div className="space-y-4">
                  {getContractorProjects(selectedContractorData.id).map(project => (
                    <Card key={project.id}>
                      <CardHeader>
                        <CardTitle className="text-lg">{project.title}</CardTitle>
                        <CardDescription>{project.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{project.state}</Badge>
                          <span className="text-sm text-muted-foreground">
                            {project.roles.filter(r => r.assignedContractor === selectedContractorData.id).length} role(s) assigned
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  
                  {getContractorProjects(selectedContractorData.id).length === 0 && (
                    <p className="text-muted-foreground text-center py-8">
                      No active projects
                    </p>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>

      {/* Compliance Modal */}
      {selectedContractor && (
        <ComplianceModal
          open={showCompliance}
          onOpenChange={setShowCompliance}
          contractorId={selectedContractor}
          roleId={selectedContractor} // Using contractor ID as roleId for now
        />
      )}
    </div>
  );

};

export default ContractorsPage;