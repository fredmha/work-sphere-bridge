import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Search, 
  Filter,
  DollarSign,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  User,
  Building,
  Calendar,
  FileText,
  Download,
  CreditCard,
  TrendingUp,
  Banknote,
  Receipt
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface PaymentOverview {
  id: string;
  contractorId: string;
  contractorName: string;
  contractorEmail: string;
  contractorAvatar?: string;
  roleId: string;
  roleName: string;
  projectName: string;
  amount: number;
  currency: string;
  status: 'Pending' | 'Paid' | 'Blocked';
  paymentDate?: string;
  paymentType: 'task' | 'timesheet';
  itemDescription: string;
  complianceComplete: boolean;
  payrooTransactionId?: string;
  auditLog: Array<{
    action: string;
    timestamp: string;
    userId: string;
    details: Record<string, any>;
  }>;
}

export const PaymentsPage = () => {
  const { state, dispatch } = useApp();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'paid' | 'blocked'>('all');
  const [selectedPayment, setSelectedPayment] = useState<PaymentOverview | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [processingPayment, setProcessingPayment] = useState<string | null>(null);

  // Build payment overview data from mock data
  const paymentOverviews: PaymentOverview[] = [];

  // Add existing payments from mock data
  state.payments?.forEach(payment => {
    const contractor = state.contractors?.find(c => c.id === payment.contractorId);
    const role = state.projects?.flatMap(p => p.roles).find(r => r.id === payment.roleId);
    const project = state.projects?.find(p => p.roles.some(r => r.id === payment.roleId));
    
    if (contractor && role && project) {
      // Check compliance status
      const compliance = state.complianceChecklists?.find(
        c => c.contractorId === payment.contractorId && c.roleId === payment.roleId
      );
      const complianceComplete = compliance?.overallStatus === 'complete';

      let itemDescription = '';
      if (payment.taskId) {
        // Find task from role tasks
        const task = state.projects?.flatMap(p => p.roles).flatMap(r => r.tasks || []).find(t => t.id === payment.taskId);
        itemDescription = task ? `Task: ${task.name}` : 'Milestone Payment';
      } else if (payment.timesheetId) {
        const timesheet = state.timesheets?.find(t => t.id === payment.timesheetId);
        itemDescription = timesheet ? 
          `Timesheet: ${timesheet.periodStart} - ${timesheet.periodEnd}` : 
          'Timesheet Payment';
      }

      paymentOverviews.push({
        id: payment.id,
        contractorId: contractor.id,
        contractorName: contractor.name,
        contractorEmail: contractor.email,
        contractorAvatar: contractor.profilePicture,
        roleId: role.id,
        roleName: role.name,
        projectName: project.title,
        amount: payment.amount,
        currency: payment.currency,
        status: payment.status,
        paymentDate: payment.paymentDate,
        paymentType: payment.taskId ? 'task' : 'timesheet',
        itemDescription,
        complianceComplete,
        payrooTransactionId: payment.payrooTransactionId,
        auditLog: payment.auditLog
      });
    }
  });

  // Add eligible pending payments (completed tasks and approved timesheets)
  state.projects?.forEach(project => {
    project.roles.forEach(role => {
      if (role.assignedContractor) {
        const contractor = state.contractors?.find(c => c.id === role.assignedContractor);
        const compliance = state.complianceChecklists?.find(
          c => c.contractorId === role.assignedContractor && c.roleId === role.id
        );
        const complianceComplete = compliance?.overallStatus === 'complete';

        if (contractor) {
          // Check for completed tasks without payments
          if (role.type === 'Milestone') {
            role.tasks?.forEach(task => {
              if (task.status === 'Completed' || task.status === 'Accepted') {
                const existingPayment = paymentOverviews.find(p => 
                  p.contractorId === contractor.id && 
                  p.itemDescription.includes(task.name)
                );
                
                if (!existingPayment) {
                  paymentOverviews.push({
                    id: `pending-${task.id}`,
                    contractorId: contractor.id,
                    contractorName: contractor.name,
                    contractorEmail: contractor.email,
                    contractorAvatar: contractor.profilePicture,
                    roleId: role.id,
                    roleName: role.name,
                    projectName: project.title,
                    amount: task.price,
                    currency: 'AUD',
                    status: complianceComplete ? 'Pending' : 'Blocked',
                    paymentType: 'task',
                    itemDescription: `Task: ${task.name}`,
                    complianceComplete,
                    auditLog: []
                  });
                }
              }
            });
          }

          // Check for approved timesheets without payments
          if (role.type === 'Timesheet') {
            state.timesheets?.forEach(timesheet => {
              if (timesheet.roleId === role.id && timesheet.status === 'Approved') {
                const existingPayment = paymentOverviews.find(p => 
                  p.contractorId === contractor.id && 
                  p.itemDescription.includes(timesheet.periodStart)
                );
                
                if (!existingPayment) {
                  const totalHours = timesheet.entries.reduce((sum, entry) => sum + entry.hours, 0);
                  const amount = Math.round(totalHours * role.payRate);
                  
                  paymentOverviews.push({
                    id: `pending-${timesheet.id}`,
                    contractorId: contractor.id,
                    contractorName: contractor.name,
                    contractorEmail: contractor.email,
                    contractorAvatar: contractor.profilePicture,
                    roleId: role.id,
                    roleName: role.name,
                    projectName: project.title,
                    amount,
                    currency: 'AUD',
                    status: complianceComplete ? 'Pending' : 'Blocked',
                    paymentType: 'timesheet',
                    itemDescription: `Timesheet: ${timesheet.periodStart} - ${timesheet.periodEnd}`,
                    complianceComplete,
                    auditLog: []
                  });
                }
              }
            });
          }
        }
      }
    });
  });

  // Filter payments
  const filteredPayments = paymentOverviews.filter(payment => {
    const matchesSearch = 
      payment.contractorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.contractorEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.projectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.roleName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.itemDescription.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (!matchesSearch) return false;
    
    if (filterStatus === 'all') return true;
    return payment.status.toLowerCase() === filterStatus;
  });

  // Calculate stats
  const stats = {
    total: paymentOverviews.length,
    pending: paymentOverviews.filter(p => p.status === 'Pending').length,
    paid: paymentOverviews.filter(p => p.status === 'Paid').length,
    blocked: paymentOverviews.filter(p => p.status === 'Blocked').length,
    totalValue: paymentOverviews.reduce((sum, p) => sum + p.amount, 0),
    pendingValue: paymentOverviews.filter(p => p.status === 'Pending').reduce((sum, p) => sum + p.amount, 0),
    paidValue: paymentOverviews.filter(p => p.status === 'Paid').reduce((sum, p) => sum + p.amount, 0)
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Paid':
        return <CheckCircle className="h-4 w-4 text-success" />;
      case 'Pending':
        return <Clock className="h-4 w-4 text-warning" />;
      case 'Blocked':
        return <XCircle className="h-4 w-4 text-destructive" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'Paid':
        return 'default';
      case 'Pending':
        return 'secondary';
      case 'Blocked':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const handleProcessPayment = async (payment: PaymentOverview) => {
    if (!payment.complianceComplete) {
      toast({
        title: "Payment Blocked",
        description: "Cannot process payment - compliance requirements not met",
        variant: "destructive"
      });
      return;
    }

    setProcessingPayment(payment.id);

    // Simulate payment processing
    setTimeout(() => {
      // Create new payment record
      const newPayment = {
        id: `payment-${Date.now()}`,
        contractorId: payment.contractorId,
        roleId: payment.roleId,
        taskId: payment.paymentType === 'task' ? payment.id.replace('pending-', '') : undefined,
        timesheetId: payment.paymentType === 'timesheet' ? payment.id.replace('pending-', '') : undefined,
        amount: payment.amount,
        currency: payment.currency,
        status: 'Paid' as const,
        paymentDate: new Date().toISOString(),
        payrooTransactionId: `PRO_TX_${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
        auditLog: [
          {
            action: 'payment_initiated',
            timestamp: new Date().toISOString(),
            userId: 'admin-1',
            details: { amount: payment.amount, type: payment.paymentType }
          },
          {
            action: 'payment_completed',
            timestamp: new Date().toISOString(),
            userId: 'system',
            details: { transactionId: `PRO_TX_${Math.random().toString(36).substr(2, 9).toUpperCase()}` }
          }
        ],
        createdAt: new Date().toISOString()
      };

      dispatch({ type: 'ADD_PAYMENT', payload: newPayment });

      setProcessingPayment(null);
      toast({
        title: "Payment Processed",
        description: `Payment of $${payment.amount} successfully processed via Payroo`,
        variant: "default"
      });
    }, 2000);
  };

  const formatCurrency = (amount: number, currency: string = 'AUD') => {
    return new Intl.NumberFormat('en-AU', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Payments</h1>
        <p className="text-muted-foreground">
          Process payments, track payment status, and manage financial compliance
        </p>
      </div>

      {/* Critical Alerts */}
      {stats.blocked > 0 && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>{stats.blocked}</strong> payment{stats.blocked !== 1 ? 's are' : ' is'} blocked due to incomplete compliance.
          </AlertDescription>
        </Alert>
      )}

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Payments</CardTitle>
            <Receipt className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">
              {formatCurrency(stats.totalValue)} total value
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pending}</div>
            <p className="text-xs text-muted-foreground">
              {formatCurrency(stats.pendingValue)} to process
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Paid</CardTitle>
            <CheckCircle className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.paid}</div>
            <p className="text-xs text-muted-foreground">
              {formatCurrency(stats.paidValue)} processed
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Blocked</CardTitle>
            <XCircle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.blocked}</div>
            <p className="text-xs text-muted-foreground">
              Compliance required
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search payments..."
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
            variant={filterStatus === 'pending' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilterStatus('pending')}
          >
            Pending ({stats.pending})
          </Button>
          <Button
            variant={filterStatus === 'paid' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilterStatus('paid')}
          >
            Paid ({stats.paid})
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
          Export
        </Button>
      </div>

      {/* Payments List */}
      <div className="space-y-4">
        {filteredPayments.map((payment) => (
          <Card key={payment.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={payment.contractorAvatar} />
                    <AvatarFallback>
                      {payment.contractorName.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-1">
                    <h3 className="font-semibold">{payment.contractorName}</h3>
                    <p className="text-sm text-muted-foreground">{payment.contractorEmail}</p>
                    <div className="flex items-center gap-2 text-sm">
                      <Building className="h-3 w-3 text-muted-foreground" />
                      <span className="text-muted-foreground">{payment.projectName}</span>
                      <span className="text-muted-foreground">•</span>
                      <span className="font-medium">{payment.roleName}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{payment.itemDescription}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-2xl font-bold">{formatCurrency(payment.amount, payment.currency)}</p>
                    <p className="text-sm text-muted-foreground capitalize">{payment.paymentType} payment</p>
                  </div>
                  <Badge variant={getStatusVariant(payment.status)}>
                    {getStatusIcon(payment.status)}
                    <span className="ml-1">{payment.status}</span>
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Payment Details */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Type:</span>
                  <p className="font-medium capitalize">{payment.paymentType}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Currency:</span>
                  <p className="font-medium">{payment.currency}</p>
                </div>
                {payment.paymentDate && (
                  <div>
                    <span className="text-muted-foreground">Paid:</span>
                    <p className="font-medium">{new Date(payment.paymentDate).toLocaleDateString()}</p>
                  </div>
                )}
                {payment.payrooTransactionId && (
                  <div>
                    <span className="text-muted-foreground">Transaction ID:</span>
                    <p className="font-medium font-mono text-xs">{payment.payrooTransactionId}</p>
                  </div>
                )}
              </div>

              {/* Compliance Warning */}
              {!payment.complianceComplete && (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    Payment blocked - contractor compliance requirements not met. Complete compliance checklist to enable payment processing.
                  </AlertDescription>
                </Alert>
              )}

              {/* Actions */}
              <div className="flex gap-2 pt-2">
                {payment.status === 'Pending' && (
                  <Button
                    onClick={() => handleProcessPayment(payment)}
                    disabled={!payment.complianceComplete || processingPayment === payment.id}
                    className="mr-2"
                  >
                    {processingPayment === payment.id ? (
                      <>
                        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <CreditCard className="h-4 w-4 mr-2" />
                        Process Payment
                      </>
                    )}
                  </Button>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSelectedPayment(payment);
                    setShowPaymentModal(true);
                  }}
                >
                  <FileText className="h-3 w-3 mr-1" />
                  View Details
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredPayments.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <DollarSign className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">No payments found</h3>
            <p className="text-muted-foreground">
              {searchQuery ? 'Try adjusting your search criteria' : 'No payments match the selected filters'}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Payment Details Modal */}
      <Dialog open={showPaymentModal} onOpenChange={setShowPaymentModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Payment Details</DialogTitle>
            <DialogDescription>
              Complete payment information and audit trail
            </DialogDescription>
          </DialogHeader>
          
          {selectedPayment && (
            <Tabs defaultValue="details" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="details">Payment Details</TabsTrigger>
                <TabsTrigger value="audit">Audit Trail</TabsTrigger>
              </TabsList>
              
              <TabsContent value="details" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold mb-2">Contractor</h4>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={selectedPayment.contractorAvatar} />
                        <AvatarFallback>
                          {selectedPayment.contractorName.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{selectedPayment.contractorName}</p>
                        <p className="text-sm text-muted-foreground">{selectedPayment.contractorEmail}</p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Project & Role</h4>
                    <p className="font-medium">{selectedPayment.projectName}</p>
                    <p className="text-sm text-muted-foreground">{selectedPayment.roleName}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Payment Amount</h4>
                    <p className="text-2xl font-bold">{formatCurrency(selectedPayment.amount, selectedPayment.currency)}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Status</h4>
                    <Badge variant={getStatusVariant(selectedPayment.status)}>
                      {getStatusIcon(selectedPayment.status)}
                      <span className="ml-1">{selectedPayment.status}</span>
                    </Badge>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Work Item</h4>
                  <p className="text-muted-foreground">{selectedPayment.itemDescription}</p>
                </div>

                {selectedPayment.payrooTransactionId && (
                  <div>
                    <h4 className="font-semibold mb-2">Payroo Transaction</h4>
                    <p className="font-mono text-sm">{selectedPayment.payrooTransactionId}</p>
                  </div>
                )}

                <div>
                  <h4 className="font-semibold mb-2">Compliance Status</h4>
                  <Badge variant={selectedPayment.complianceComplete ? 'default' : 'destructive'}>
                    {selectedPayment.complianceComplete ? (
                      <>
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Complete
                      </>
                    ) : (
                      <>
                        <XCircle className="h-3 w-3 mr-1" />
                        Incomplete
                      </>
                    )}
                  </Badge>
                </div>
              </TabsContent>
              
              <TabsContent value="audit" className="space-y-4">
                <div className="space-y-3">
                  {selectedPayment.auditLog.length > 0 ? (
                    selectedPayment.auditLog.map((entry, index) => (
                      <Card key={index}>
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-medium">{entry.action.replace('_', ' ').toUpperCase()}</p>
                              <p className="text-sm text-muted-foreground">By: {entry.userId}</p>
                              {entry.details && (
                                <p className="text-sm text-muted-foreground mt-1">
                                  {JSON.stringify(entry.details, null, 2)}
                                </p>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {new Date(entry.timestamp).toLocaleString()}
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <p className="text-muted-foreground text-center py-8">
                      No audit trail available
                    </p>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PaymentsPage;