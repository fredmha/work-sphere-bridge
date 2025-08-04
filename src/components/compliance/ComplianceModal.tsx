import { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { ComplianceItemStatus } from '@/types/entities';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  FileText,
  User,
  CreditCard,
  Shield,
  Building,
  Award,
  Briefcase
} from 'lucide-react';
import { ComplianceItemModal } from './ComplianceItemModal';

interface ComplianceModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contractorId: string | null;
  roleId: string | null;
}

interface ComplianceItem {
  id: string;
  title: string;
  description: string;
  status: ComplianceItemStatus;
  icon: React.ElementType;
  required: boolean;
}

export function ComplianceModal({ 
  open, 
  onOpenChange, 
  contractorId, 
  roleId 
}: ComplianceModalProps) {
  const { state } = useApp();
  const [activeItem, setActiveItem] = useState<string | null>(null);

  const contractor = contractorId ? state.contractors.find(c => c.id === contractorId) : null;
  const role = roleId ? state.projects
    .flatMap(p => p.roles)
    .find(r => r.id === roleId) : null;

  const checklist = (contractorId && roleId) ? state.complianceChecklists.find(
    c => c.contractorId === contractorId && c.roleId === roleId
  ) : null;

  const complianceItems: ComplianceItem[] = [
    {
      id: 'abnTfn',
      title: role?.type === 'Timesheet' ? 'Tax File Number (TFN)' : 'Australian Business Number (ABN)',
      description: role?.type === 'Timesheet' 
        ? 'Employee tax file number and declaration'
        : 'Independent contractor business number',
      status: checklist?.abnTfnStatus || 'Incomplete',
      icon: FileText,
      required: true
    },
    {
      id: 'bankDetails',
      title: 'Bank Account Details',
      description: 'Account name, BSB and account number for payments',
      status: checklist?.bankDetailsStatus || 'Incomplete',
      icon: CreditCard,
      required: true
    },
    {
      id: 'superDetails',
      title: 'Superannuation Details',
      description: 'Super fund details and membership information',
      status: checklist?.superDetailsStatus || 'Incomplete',
      icon: Building,
      required: role?.type === 'Timesheet'
    },
    {
      id: 'workRights',
      title: 'Work Rights Verification',
      description: 'Proof of right to work in Australia',
      status: checklist?.workRightsStatus || 'Incomplete',
      icon: Shield,
      required: true
    },
    {
      id: 'contract',
      title: 'Signed Contract',
      description: 'Upload signed employment or contractor agreement',
      status: checklist?.contractStatus || 'Incomplete',
      icon: Award,
      required: true
    },
    {
      id: 'fairWork',
      title: 'Fair Work Information Statement',
      description: 'Acknowledgment of Fair Work statement receipt',
      status: checklist?.fairWorkStatus || 'Incomplete',
      icon: Briefcase,
      required: role?.type === 'Timesheet'
    }
  ].filter(item => item.required);

  const getStatusIcon = (status: ComplianceItemStatus) => {
    switch (status) {
      case 'Complete': return <CheckCircle className="w-5 h-5 text-success" />;
      case 'Pending Review': return <Clock className="w-5 h-5 text-warning" />;
      case 'Incomplete': return <XCircle className="w-5 h-5 text-muted-foreground" />;
      default: return <XCircle className="w-5 h-5 text-muted-foreground" />;
    }
  };

  const getStatusVariant = (status: ComplianceItemStatus) => {
    switch (status) {
      case 'Complete': return 'default';
      case 'Pending Review': return 'secondary';
      case 'Incomplete': return 'outline';
      default: return 'outline';
    }
  };

  const completedItems = complianceItems.filter(item => item.status === 'Complete').length;
  const totalItems = complianceItems.length;
  const completionPercentage = Math.round((completedItems / totalItems) * 100);

  if (!contractor || !role) {
    return null;
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl glass-modal">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <div className="flex items-center gap-3">
                <User className="w-6 h-6 text-primary" />
                <div>
                  <div className="text-lg font-semibold">{contractor.name}</div>
                  <div className="text-sm text-muted-foreground font-normal">
                    {role.name} - Compliance Checklist
                  </div>
                </div>
              </div>
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* Progress Overview */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Completion Progress</span>
                <Badge variant={completionPercentage === 100 ? 'default' : 'secondary'}>
                  {completedItems}/{totalItems} Complete
                </Badge>
              </div>
              <Progress value={completionPercentage} className="h-3" />
              <p className="text-xs text-muted-foreground">
                {completionPercentage === 100 
                  ? 'All compliance requirements completed'
                  : `${totalItems - completedItems} items remaining`
                }
              </p>
            </div>

            {/* Compliance Items */}
            <div className="space-y-3">
              {complianceItems.map(item => {
                const IconComponent = item.icon;
                
                return (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-4 rounded-lg border border-border/50 hover:border-border transition-colors cursor-pointer"
                    onClick={() => setActiveItem(item.id)}
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-background/50 rounded-lg">
                        <IconComponent className="w-5 h-5 text-muted-foreground" />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-sm">{item.title}</div>
                        <div className="text-xs text-muted-foreground">{item.description}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Badge variant={getStatusVariant(item.status)} className="text-xs">
                        {item.status}
                      </Badge>
                      {getStatusIcon(item.status)}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Gating Warning */}
            {completionPercentage < 100 && (
              <div className="p-4 bg-warning/10 border border-warning/20 rounded-lg">
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-warning mt-0.5" />
                  <div>
                    <p className="font-medium text-sm text-warning mb-1">Compliance Required</p>
                    <p className="text-xs text-muted-foreground">
                      This contractor cannot submit work or receive payments until all compliance items are complete.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex justify-end gap-2 pt-4 border-t border-border/50">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Close
              </Button>
              {completionPercentage === 100 && (
                <Button>
                  Generate Compliance Report
                </Button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Individual Item Modal */}
      <ComplianceItemModal
        open={!!activeItem}
        onOpenChange={(open) => !open && setActiveItem(null)}
        itemId={activeItem}
        contractorId={contractorId}
        roleId={roleId}
        roleType={role?.type}
      />
    </>
  );
}