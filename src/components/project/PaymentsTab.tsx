import { Project } from '@/types/entities';
import { useApp } from '@/context/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { 
  DollarSign,
  Calendar,
  FileText,
  Download,
  CreditCard,
  AlertCircle
} from 'lucide-react';

interface PaymentsTabProps {
  project: Project;
}

export function PaymentsTab({ project }: PaymentsTabProps) {
  const { state } = useApp();

  const getContractorById = (id: string) => {
    return state.contractors.find(c => c.id === id);
  };

  const getPaymentsByProject = () => {
    return state.payments.filter(payment => {
      // Find if this payment is for a role in this project
      const role = project.roles.find(r => r.id === payment.roleId);
      return !!role;
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Paid': return 'default';
      case 'Pending': return 'secondary';
      case 'Blocked': return 'destructive';
      default: return 'secondary';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Paid': return <CreditCard className="w-4 h-4" />;
      case 'Pending': return <Calendar className="w-4 h-4" />;
      case 'Blocked': return <AlertCircle className="w-4 h-4" />;
      default: return <DollarSign className="w-4 h-4" />;
    }
  };

  const payments = getPaymentsByProject();
  const totalPaid = payments
    .filter(p => p.status === 'Paid')
    .reduce((sum, p) => sum + p.amount, 0);
  const totalPending = payments
    .filter(p => p.status === 'Pending')
    .reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="space-y-6">
      {/* Payment Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="glass-card border-border/50">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-success/10 rounded-lg">
                <CreditCard className="w-6 h-6 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Paid</p>
                <p className="text-2xl font-bold text-success">
                  ${totalPaid.toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-border/50">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-warning/10 rounded-lg">
                <Calendar className="w-6 h-6 text-warning" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold text-warning">
                  ${totalPending.toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-border/50">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <DollarSign className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Payments</p>
                <p className="text-2xl font-bold text-primary">
                  {payments.length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Payments Table */}
      <Card className="glass-card border-border/50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Payment History</CardTitle>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {payments.length > 0 ? (
            <div className="rounded-lg border border-border/50 overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead>Contractor</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="w-24">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payments.map(payment => {
                    const role = project.roles.find(r => r.id === payment.roleId);
                    const contractor = role?.assignedContractor ? getContractorById(role.assignedContractor) : null;

                    return (
                      <TableRow key={payment.id} className="hover:bg-muted/20">
                        <TableCell>
                          <div className="flex items-center gap-3">
                            {contractor && (
                              <>
                                <Avatar className="w-8 h-8">
                                  <AvatarImage src={contractor.profilePicture} />
                                  <AvatarFallback className="text-xs">
                                    {contractor.name.split(' ').map(n => n[0]).join('')}
                                  </AvatarFallback>
                                </Avatar>
                                <span className="font-medium">{contractor.name}</span>
                              </>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="font-medium">{role?.name}</span>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-xs">
                            {payment.taskId ? 'Milestone' : 'Timesheet'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <span className="font-semibold">${payment.amount.toLocaleString()}</span>
                        </TableCell>
                        <TableCell>
                          <Badge variant={getStatusColor(payment.status)} className="flex items-center gap-1 w-fit">
                            {getStatusIcon(payment.status)}
                            {payment.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-muted-foreground">
                            {payment.paymentDate ? new Date(payment.paymentDate).toLocaleDateString() : 'Pending'}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <FileText className="w-4 h-4" />
                            </Button>
                            {payment.status === 'Pending' && (
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <CreditCard className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-12">
              <DollarSign className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Payments Yet</h3>
              <p className="text-muted-foreground">
                Payments will appear here once work is completed and approved.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}