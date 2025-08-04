import { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { 
  FileText,
  CreditCard,
  Shield,
  Building,
  Award,
  Briefcase,
  Upload,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';

interface ComplianceItemModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  itemId: string | null;
  contractorId: string | null;
  roleId: string | null;
  roleType?: 'Milestone' | 'Timesheet';
}

export function ComplianceItemModal({
  open,
  onOpenChange,
  itemId,
  contractorId,
  roleId,
  roleType
}: ComplianceItemModalProps) {
  const { state, dispatch } = useApp();
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [files, setFiles] = useState<File[]>([]);

  const contractor = contractorId ? state.contractors.find(c => c.id === contractorId) : null;
  const checklist = (contractorId && roleId) ? state.complianceChecklists.find(
    c => c.contractorId === contractorId && c.roleId === roleId
  ) : null;

  if (!itemId || !contractor) return null;

  const getItemConfig = (id: string) => {
    switch (id) {
      case 'abnTfn':
        return {
          title: roleType === 'Timesheet' ? 'Tax File Number (TFN)' : 'Australian Business Number (ABN)',
          icon: FileText,
          description: roleType === 'Timesheet'
            ? 'Enter your 9-digit Tax File Number for payroll tax calculations'
            : 'Enter your 11-digit Australian Business Number for contractor payments',
          fields: [
            {
              name: roleType === 'Timesheet' ? 'tfn' : 'abn',
              label: roleType === 'Timesheet' ? 'Tax File Number' : 'Australian Business Number',
              type: 'text',
              placeholder: roleType === 'Timesheet' ? '123 456 789' : '12 345 678 901',
              required: true,
              pattern: roleType === 'Timesheet' ? '\\d{3}\\s\\d{3}\\s\\d{3}' : '\\d{2}\\s\\d{3}\\s\\d{3}\\s\\d{3}'
            }
          ]
        };
      
      case 'bankDetails':
        return {
          title: 'Bank Account Details',
          icon: CreditCard,
          description: 'Provide your bank account details for payment processing',
          fields: [
            { name: 'accountName', label: 'Account Name', type: 'text', required: true },
            { name: 'bsb', label: 'BSB', type: 'text', placeholder: '123-456', required: true, pattern: '\\d{3}-?\\d{3}' },
            { name: 'accountNumber', label: 'Account Number', type: 'text', placeholder: '12345678', required: true }
          ]
        };
      
      case 'superDetails':
        return {
          title: 'Superannuation Details',
          icon: Building,
          description: 'Your superannuation fund details for compulsory contributions',
          fields: [
            { name: 'fundName', label: 'Super Fund Name', type: 'text', required: true },
            { name: 'memberNumber', label: 'Member Number', type: 'text', required: true },
            { name: 'usi', label: 'Unique Superannuation Identifier (USI)', type: 'text', placeholder: 'ABC1234567890123', required: true }
          ]
        };
      
      case 'workRights':
        return {
          title: 'Work Rights Verification',
          icon: Shield,
          description: 'Upload proof of your right to work in Australia',
          fields: [
            { name: 'documentType', label: 'Document Type', type: 'select', required: true, options: ['Australian Passport', 'Birth Certificate', 'Citizenship Certificate', 'Visa/ImmiCard'] },
            { name: 'documentNumber', label: 'Document Number', type: 'text', required: true }
          ],
          fileUpload: true
        };
      
      case 'contract':
        return {
          title: 'Signed Contract',
          icon: Award,
          description: 'Upload your signed employment or contractor agreement',
          fileUpload: true
        };
      
      case 'fairWork':
        return {
          title: 'Fair Work Information Statement',
          icon: Briefcase,
          description: 'Acknowledge that you have received and read the Fair Work Information Statement',
          fields: [
            { name: 'acknowledgment', label: 'I acknowledge that I have received and read the Fair Work Information Statement', type: 'checkbox', required: true }
          ]
        };
      
      default:
        return null;
    }
  };

  const config = getItemConfig(itemId);
  if (!config) return null;

  const IconComponent = config.icon;
  const currentStatus = checklist ? (checklist as any)[`${itemId}Status`] : 'Incomplete';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Mock form submission - in real app would validate and upload files
    if (contractorId && roleId) {
      dispatch({
        type: 'UPDATE_COMPLIANCE',
        payload: {
          contractorId,
          roleId,
          updates: {
            [`${itemId}Status`]: 'Pending Review' as const,
            [`${itemId}Data`]: formData,
            [`${itemId}Files`]: files.map(f => f.name)
          }
        }
      });
    }

    onOpenChange(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg glass-modal">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <IconComponent className="w-5 h-5 text-primary" />
            </div>
            <div>
              <div>{config.title}</div>
              <Badge variant={currentStatus === 'Complete' ? 'default' : 'secondary'} className="mt-1">
                {currentStatus}
              </Badge>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <p className="text-sm text-muted-foreground">
            {config.description}
          </p>

          {currentStatus === 'Complete' ? (
            <div className="p-4 bg-success/10 border border-success/20 rounded-lg">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-success" />
                <div>
                  <p className="font-medium text-sm text-success">Item Complete</p>
                  <p className="text-xs text-muted-foreground">
                    This compliance item has been completed and verified.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {config.fields?.map(field => (
                <div key={field.name} className="space-y-2">
                  <Label htmlFor={field.name}>{field.label}</Label>
                  {field.type === 'checkbox' ? (
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id={field.name}
                        checked={formData[field.name] || false}
                        onCheckedChange={(checked) => 
                          setFormData(prev => ({ ...prev, [field.name]: checked }))
                        }
                        required={field.required}
                      />
                      <Label htmlFor={field.name} className="text-sm font-normal">
                        {field.label}
                      </Label>
                    </div>
                  ) : field.type === 'select' ? (
                    <select
                      id={field.name}
                      className="w-full p-2 border border-border rounded-md bg-background"
                      value={formData[field.name] || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, [field.name]: e.target.value }))}
                      required={field.required}
                    >
                      <option value="">Select...</option>
                      {field.options?.map(option => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  ) : field.type === 'textarea' ? (
                    <Textarea
                      id={field.name}
                      placeholder={field.placeholder}
                      value={formData[field.name] || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, [field.name]: e.target.value }))}
                      required={field.required}
                    />
                  ) : (
                    <Input
                      id={field.name}
                      type={field.type}
                      placeholder={field.placeholder}
                      value={formData[field.name] || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, [field.name]: e.target.value }))}
                      required={field.required}
                      pattern={field.pattern}
                    />
                  )}
                </div>
              ))}

              {config.fileUpload && (
                <div className="space-y-2">
                  <Label htmlFor="fileUpload">Upload Documents</Label>
                  <div className="border-2 border-dashed border-border rounded-lg p-4 text-center">
                    <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                    <input
                      id="fileUpload"
                      type="file"
                      multiple
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <Label htmlFor="fileUpload" className="cursor-pointer">
                      <p className="text-sm text-muted-foreground">
                        Click to upload or drag and drop
                      </p>
                      <p className="text-xs text-muted-foreground">
                        PDF, JPG, PNG up to 10MB
                      </p>
                    </Label>
                  </div>
                  {files.length > 0 && (
                    <div className="space-y-1">
                      {files.map((file, index) => (
                        <div key={index} className="text-xs text-muted-foreground">
                          {file.name} ({Math.round(file.size / 1024)}KB)
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              <div className="flex gap-2 pt-4">
                <Button type="submit" className="flex-1">
                  Submit for Review
                </Button>
                <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          )}

          {currentStatus === 'Pending Review' && (
            <div className="p-4 bg-warning/10 border border-warning/20 rounded-lg">
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 text-warning" />
                <div>
                  <p className="font-medium text-sm text-warning">Under Review</p>
                  <p className="text-xs text-muted-foreground">
                    Your submission is being reviewed. You'll be notified once approved.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}