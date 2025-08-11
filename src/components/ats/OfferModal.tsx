import { useEffect, useMemo, useState } from 'react';
import { Briefcase, Calendar as CalendarIcon, CheckCircle2, ClipboardList, DollarSign, FileText, ShieldAlert, ShieldCheck } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { format, addDays } from 'date-fns';
import { cn } from '@/lib/utils';
import { mockProjects, mockRoles } from '@/lib/mock-data';
import { toast } from '@/hooks/use-toast';

interface OfferModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  applicantName: string;
  applicationId: string;
  roleTitle: string;
  projectTitle: string;
}

type RoleType = 'Milestone' | 'Timesheet';

type MilestoneItem = { id: string; name: string; deliverables?: string; description?: string; price: number };

export function OfferModal({
  open,
  onOpenChange,
  applicantName,
  applicationId,
  roleTitle,
  projectTitle
}: OfferModalProps) {
  // Stepper
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Context: Project & Role
  const [selectedProjectId, setSelectedProjectId] = useState<string | undefined>();
  const [selectedRoleId, setSelectedRoleId] = useState<string | undefined>();
  const selectedProject = useMemo(() => mockProjects.find(p => p.id === selectedProjectId), [selectedProjectId]);
  const filteredRoles = useMemo(() => mockRoles.filter(r => r.projectId === selectedProjectId), [selectedProjectId]);
  const selectedRole = useMemo(() => mockRoles.find(r => r.id === selectedRoleId), [selectedRoleId]);
  const roleType: RoleType | undefined = selectedRole?.roleType as RoleType | undefined;

  // Prefill by titles when provided (best-effort)
  useEffect(() => {
    if (!open) return;
    if (projectTitle) {
      const p = mockProjects.find(p => p.title === projectTitle);
      if (p) setSelectedProjectId(p.id);
    }
    if (roleTitle) {
      const r = mockRoles.find(r => r.name === roleTitle || r.roleName === roleTitle);
      if (r) {
        setSelectedRoleId(r.id);
        if (!selectedProjectId) setSelectedProjectId(r.projectId);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, projectTitle, roleTitle]);

  // Defaults & calculations
  const defaultStart = useMemo(() => addBusinessDays(new Date(), 3), []);
  const [startDate, setStartDate] = useState<Date | undefined>(defaultStart);
  const [expiryDate, setExpiryDate] = useState<Date>(addDays(new Date(), 7));

  // Terms & Pay (Milestone)
  const [milestones, setMilestones] = useState<MilestoneItem[]>([
    { id: 'm1', name: 'Design Handoff', deliverables: 'Figma + Assets', price: 3000 },
    { id: 'm2', name: 'MVP Delivery', deliverables: 'Deployed MVP', price: 7000 },
  ]);
  const [milestonePaymentTerms, setMilestonePaymentTerms] = useState<'on_completion' | 'weekly' | 'fortnightly'>('weekly');
  const [currency] = useState<'AUD'>('AUD'); // locked to AUD by default
  const [applyGst, setApplyGst] = useState<boolean>(false);

  const milestoneSubtotal = useMemo(() => milestones.reduce((sum, m) => sum + (Number(m.price) || 0), 0), [milestones]);
  const gstAmount = useMemo(() => (applyGst ? round2(milestoneSubtotal * 0.1) : 0), [applyGst, milestoneSubtotal]);
  const totalAmount = useMemo(() => round2(milestoneSubtotal + gstAmount), [milestoneSubtotal, gstAmount]);

  // Terms & Pay (Timesheet)
  const [hourlyRate, setHourlyRate] = useState<number>(120);
  const [weeklyHours, setWeeklyHours] = useState<number | undefined>(30);
  const [timesheetFrequency, setTimesheetFrequency] = useState<'weekly' | 'fortnightly' | 'monthly'>('weekly');
  const [applyGstTs, setApplyGstTs] = useState<boolean>(false);

  // Message template
  const [messageBody, setMessageBody] = useState<string>(`Hi ${applicantName},\nWe’d like to invite you to join ${projectTitle || '{{project.name}}'} as a ${roleTitle || '{{role.name}}'}.\nPlease review the details and confirm.`);

  // Draft auto-save (FS-8)
  const draftKey = useMemo(() => `offer_draft:${applicationId}:${selectedProjectId || 'any'}:${selectedRoleId || 'any'}`, [applicationId, selectedProjectId, selectedRoleId]);
  useEffect(() => {
    const saved = localStorage.getItem(draftKey);
    if (saved) {
      try {
        const d = JSON.parse(saved);
        setStartDate(d.startDate ? new Date(d.startDate) : defaultStart);
        setExpiryDate(d.expiryDate ? new Date(d.expiryDate) : addDays(new Date(), 7));
        setMilestones(d.milestones || []);
        setMilestonePaymentTerms(d.milestonePaymentTerms || 'weekly');
        setApplyGst(!!d.applyGst);
        setHourlyRate(d.hourlyRate ?? 120);
        setWeeklyHours(d.weeklyHours);
        setTimesheetFrequency(d.timesheetFrequency || 'weekly');
        setApplyGstTs(!!d.applyGstTs);
        setMessageBody(d.messageBody || messageBody);
      } catch {}
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draftKey]);

  useEffect(() => {
    const handle = setTimeout(() => {
      const d = {
        startDate,
        expiryDate,
        milestones,
        milestonePaymentTerms,
        applyGst,
        hourlyRate,
        weeklyHours,
        timesheetFrequency,
        applyGstTs,
        messageBody,
      };
      localStorage.setItem(draftKey, JSON.stringify(d));
    }, 500);
    return () => clearTimeout(handle);
  }, [draftKey, startDate, expiryDate, milestones, milestonePaymentTerms, applyGst, hourlyRate, weeklyHours, timesheetFrequency, applyGstTs, messageBody]);

  // Actions
  function resetAll() {
    setStep(1);
    setStartDate(defaultStart);
    setExpiryDate(addDays(new Date(), 7));
    setMilestones([
      { id: 'm1', name: 'Design Handoff', deliverables: 'Figma + Assets', price: 3000 },
      { id: 'm2', name: 'MVP Delivery', deliverables: 'Deployed MVP', price: 7000 },
    ]);
    setMilestonePaymentTerms('weekly');
    setApplyGst(false);
    setHourlyRate(120);
    setWeeklyHours(30);
    setTimesheetFrequency('weekly');
    setApplyGstTs(false);
    setMessageBody(`Hi ${applicantName},\nWe’d like to invite you to join ${projectTitle || '{{project.name}}'} as a ${roleTitle || '{{role.name}}'}.\nPlease review the details and confirm.`);
  }

  function handleSendOffer() {
    if (!selectedProjectId || !selectedRoleId || !startDate) return;
    const payload = {
      applicationId,
      projectId: selectedProjectId,
      roleId: selectedRoleId,
      roleType,
      startDate,
      expiryDate,
      terms: roleType === 'Milestone'
        ? { variant: 'milestone', items: milestones, subtotal: milestoneSubtotal, gst: gstAmount, total: totalAmount, paymentTerms: milestonePaymentTerms, currency }
        : { variant: 'timesheet', hourlyRate, weeklyHours, paymentFrequency: timesheetFrequency, applyGst: applyGstTs, currency },
      messageBody,
    };
    // In real app: API call + audit log
    // eslint-disable-next-line no-console
    console.log('Send Offer →', payload);
    toast({ title: 'Offer sent', description: 'The offer was created and a message was posted to the thread.' });
    localStorage.removeItem(draftKey);
    onOpenChange(false);
    resetAll();
  }

  // UI helpers
  const canContinueStep1 = !!selectedProjectId && !!selectedRoleId;
  const canContinueStep2 = roleType === 'Milestone'
    ? milestones.length > 0 && milestones.every(m => m.name?.trim()) && milestones.some(m => (Number(m.price) || 0) > 0)
    : (hourlyRate || 0) > 0;

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) resetAll(); onOpenChange(v); }}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Briefcase className="h-5 w-5 text-primary" />
            Offer / Invite — {applicantName}
          </DialogTitle>
          <div className="text-sm text-muted-foreground">{selectedProject?.title || projectTitle || 'Select Project'} • {selectedRole?.name || roleTitle || 'Select Role'}</div>
        </DialogHeader>

        {/* Stepper */}
        <div className="mb-4 flex items-center justify-between text-sm">
          <StepperItem label="Project & Role" active={step===1} done={step>1} onClick={() => setStep(1)} />
          <div className="h-px flex-1 mx-2 bg-border" />
          <StepperItem label="Terms & Pay" active={step===2} done={step>2} onClick={() => canContinueStep1 && setStep(2)} />
          <div className="h-px flex-1 mx-2 bg-border" />
          <StepperItem label="Compliance" active={step===3} done={step>3} onClick={() => canContinueStep1 && setStep(3)} />
          <div className="h-px flex-1 mx-2 bg-border" />
          <StepperItem label="Review" active={step===4} done={false} onClick={() => canContinueStep1 && setStep(4)} />
        </div>

        {/* Content */}
        <div className="space-y-6">
          {step === 1 && (
            <section>
              <h3 className="text-lg font-medium mb-4">Step 1 — Project & Role</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Project</Label>
                  <Select value={selectedProjectId} onValueChange={(v) => { setSelectedProjectId(v); setSelectedRoleId(undefined); }}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a project" />
                    </SelectTrigger>
                    <SelectContent className="z-50">
                      {mockProjects.map(p => (
                        <SelectItem key={p.id} value={p.id}>{p.title} — <span className="text-muted-foreground">{p.state}</span></SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {selectedProject?.description && (
                    <p className="text-xs text-muted-foreground">{selectedProject.description}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Role</Label>
                  <Select value={selectedRoleId} onValueChange={setSelectedRoleId} disabled={!selectedProjectId}>
                    <SelectTrigger>
                      <SelectValue placeholder={selectedProjectId ? 'Select a role' : 'Select a project first'} />
                    </SelectTrigger>
                    <SelectContent className="z-50">
                      {filteredRoles.length === 0 && <div className="px-3 py-2 text-sm text-muted-foreground">No roles in project</div>}
                      {filteredRoles.map(r => (
                        <SelectItem key={r.id} value={r.id}>
                          <div className="flex items-center gap-2">
                            <span>{r.name}</span>
                            <Badge variant="secondary">{r.roleType}</Badge>
                            <Badge variant="outline">{r.status}</Badge>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {selectedRole?.description && (
                    <p className="text-xs text-muted-foreground">{selectedRole.description}</p>
                  )}
                </div>
              </div>
            </section>
          )}

          {step === 2 && (
            <section className="space-y-4">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-medium">Step 2 — Terms & Pay</h3>
                {roleType && <Badge variant="secondary">{roleType}</Badge>}
              </div>

              {roleType === 'Milestone' && (
                <div className="space-y-4">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="text-muted-foreground">
                        <tr className="text-left">
                          <th className="py-2 pr-2 w-10">#</th>
                          <th className="py-2 pr-2">Name</th>
                          <th className="py-2 pr-2">Deliverables</th>
                          <th className="py-2 pr-2">Description</th>
                          <th className="py-2 pr-2 text-right">Price (AUD)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {milestones.map((m, idx) => (
                          <tr key={m.id} className="border-t">
                            <td className="py-2 pr-2">{idx + 1}</td>
                            <td className="py-2 pr-2"><Input value={m.name} onChange={e => updateMilestone(m.id, { name: e.target.value })} placeholder="Milestone name" /></td>
                            <td className="py-2 pr-2"><Input value={m.deliverables || ''} onChange={e => updateMilestone(m.id, { deliverables: e.target.value })} placeholder="Deliverables" /></td>
                            <td className="py-2 pr-2"><Input value={m.description || ''} onChange={e => updateMilestone(m.id, { description: e.target.value })} placeholder="Description" /></td>
                            <td className="py-2 pl-2"><Input className="text-right" type="number" value={String(m.price)} onChange={e => updateMilestone(m.id, { price: Number(e.target.value) })} /></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="flex items-center justify-between">
                    <Button variant="outline" onClick={() => addMilestone()}>+ Add Milestone</Button>
                    <div className="text-sm">
                      <div>Subtotal: ${milestoneSubtotal.toLocaleString()}</div>
                      <div className="flex items-center gap-2">GST 10%: ${gstAmount.toLocaleString()} <div className="flex items-center gap-2"><Checkbox checked={applyGst} onCheckedChange={v => setApplyGst(Boolean(v))} id="gst" /><Label htmlFor="gst">Apply</Label></div></div>
                      <div className="font-medium">Total: ${totalAmount.toLocaleString()}</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>Payment terms</Label>
                      <RadioGroup value={milestonePaymentTerms} onValueChange={(v: any) => setMilestonePaymentTerms(v)}>
                        <div className="flex items-center space-x-2"><RadioGroupItem value="on_completion" id="on_completion" /><Label htmlFor="on_completion">On completion</Label></div>
                        <div className="flex items-center space-x-2"><RadioGroupItem value="weekly" id="weekly" /><Label htmlFor="weekly">Weekly</Label></div>
                        <div className="flex items-center space-x-2"><RadioGroupItem value="fortnightly" id="fortnightly" /><Label htmlFor="fortnightly">Fortnightly</Label></div>
                      </RadioGroup>
                    </div>
                    <div className="space-y-2">
                      <Label>Currency</Label>
                      <Input value={currency} disabled />
                    </div>
                    <div className="space-y-2">
                      <Label>Start Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className={cn('w-full justify-start text-left font-normal', !startDate && 'text-muted-foreground')}>
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {startDate ? format(startDate, 'PPP') : <span>Select start date</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <CalendarComponent mode="single" selected={startDate} onSelect={setStartDate} disabled={(date) => date < new Date()} initialFocus className={cn('p-3 pointer-events-auto')} />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                </div>
              )}

              {roleType === 'Timesheet' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>Hourly rate (AUD)</Label>
                      <Input type="number" value={String(hourlyRate)} onChange={(e) => setHourlyRate(Number(e.target.value))} />
                    </div>
                    <div className="space-y-2">
                      <Label>Expected weekly hours</Label>
                      <Input type="number" value={weeklyHours ?? ''} onChange={(e) => setWeeklyHours(e.target.value ? Number(e.target.value) : undefined)} />
                    </div>
                    <div className="space-y-2">
                      <Label>Payment frequency</Label>
                      <Select value={timesheetFrequency} onValueChange={(v: any) => setTimesheetFrequency(v)}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="weekly">Weekly</SelectItem>
                          <SelectItem value="fortnightly">Fortnightly</SelectItem>
                          <SelectItem value="monthly">Monthly</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox id="gst-ts" checked={applyGstTs} onCheckedChange={(v) => setApplyGstTs(Boolean(v))} />
                    <Label htmlFor="gst-ts">Apply 10% GST</Label>
                  </div>
                  <div className="space-y-2">
                    <Label>Start Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className={cn('w-full justify-start text-left font-normal', !startDate && 'text-muted-foreground')}>
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {startDate ? format(startDate, 'PPP') : <span>Select start date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <CalendarComponent mode="single" selected={startDate} onSelect={setStartDate} disabled={(date) => date < new Date()} initialFocus className={cn('p-3 pointer-events-auto')} />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              )}
            </section>
          )}

          {step === 3 && (
            <section className="space-y-4">
              <h3 className="text-lg font-medium">Step 3 — Compliance Snapshot (AU)</h3>
              <div className="flex flex-wrap gap-2">
                <Pill ok label="Right to work / ID (KYC)" />
                <Pill ok label="Tax File Number (TFN)" />
                <Pill warn label="Superannuation details" />
                <Pill bad label="ABN verification" />
              </div>
              <div className="text-sm text-muted-foreground">Any ❌ shows a Request Docs action.</div>
              <Button variant="outline" className="w-fit" onClick={() => toast({ title: 'Request sent', description: 'Requested missing docs from contractor.' })}>Request Docs</Button>
            </section>
          )}

          {step === 4 && (
            <section className="space-y-4">
              <h3 className="text-lg font-medium">Step 4 — Review & Send</h3>
              <article className="rounded-md border p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">{applicantName}</div>
                    <div className="text-sm text-muted-foreground">{selectedRole?.name || roleTitle} — {selectedProject?.title || projectTitle}</div>
                  </div>
                  {roleType && <Badge variant="secondary">{roleType}</Badge>}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                  <div>Start: {startDate ? format(startDate, 'EEE d MMM') : '—'}</div>
                  <div>Expiry: {format(expiryDate, 'EEE d MMM')}</div>
                  {roleType === 'Milestone' ? (
                    <div className="sm:col-span-2">Pay: Subtotal ${milestoneSubtotal.toLocaleString()}  GST ${gstAmount.toLocaleString()}  Total ${totalAmount.toLocaleString()}</div>
                  ) : (
                    <div className="sm:col-span-2">Pay: ${hourlyRate.toLocaleString()} per hour{weeklyHours ? ` • ~${weeklyHours}h/wk` : ''} • {timesheetFrequency}</div>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  <Pill ok label="KYC" />
                  <Pill ok label="TFN" />
                  <Pill warn label="Super" />
                  <Pill bad label="ABN" />
                </div>
              </article>

              <div className="space-y-2">
                <Label>Message to contractor</Label>
                <Textarea value={messageBody} onChange={(e) => setMessageBody(e.target.value)} rows={4} />
              </div>
            </section>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between pt-2">
            <Button variant="outline" disabled={step===1} onClick={() => setStep((s) => (Math.max(1, (s-1)) as any))}>{'<' } Back</Button>
            <div className="flex items-center gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline"><CalendarIcon className="h-4 w-4 mr-2" /> Offer Expires: {format(expiryDate, 'PPP')}</Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="end">
                  <CalendarComponent mode="single" selected={expiryDate} onSelect={(d) => d && setExpiryDate(d)} disabled={(date) => date < new Date()} initialFocus className={cn('p-3 pointer-events-auto')} />
                </PopoverContent>
              </Popover>
              {step < 4 ? (
                <Button onClick={() => setStep((s) => (s===1 && !canContinueStep1) ? s : (s===2 && !canContinueStep2) ? s : ((s+1) as any))} disabled={(step===1 && !canContinueStep1) || (step===2 && !canContinueStep2)}>Next {'>'}</Button>
              ) : (
                <>
                  <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                  <Button onClick={handleSendOffer} disabled={!canContinueStep1 || !startDate}>Send Offer</Button>
                </>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );

  // Milestone helpers
  function addMilestone() {
    const nextIndex = milestones.length + 1;
    setMilestones([...milestones, { id: `m${nextIndex}`, name: '', deliverables: '', description: '', price: 0 }]);
  }
  function updateMilestone(id: string, patch: Partial<MilestoneItem>) {
    setMilestones(ms => ms.map(m => m.id === id ? { ...m, ...patch } : m));
  }
}

function StepperItem({ label, active, done, onClick }: { label: string; active?: boolean; done?: boolean; onClick?: () => void }) {
  return (
    <button type="button" onClick={onClick} className={cn('flex items-center gap-2', active ? 'text-foreground' : 'text-muted-foreground')}> 
      <div className={cn('h-6 w-6 rounded-full flex items-center justify-center border', done ? 'bg-primary text-primary-foreground border-primary' : active ? 'bg-secondary border-secondary' : 'bg-background')}>
        {done ? <CheckCircle2 className="h-4 w-4" /> : <span className="text-xs">{label.slice(0,1)}</span>}
      </div>
      <span className="hidden sm:block">{label}</span>
    </button>
  );
}

function Pill({ label, ok, warn, bad }: { label: string; ok?: boolean; warn?: boolean; bad?: boolean }) {
  const Icon = ok ? ShieldCheck : warn ? ShieldAlert : bad ? ShieldAlert : ShieldCheck;
  const variant = ok ? 'secondary' : warn ? 'outline' : 'destructive';
  return (
    <span className={cn('inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs border',
      ok && 'bg-secondary text-foreground',
      warn && 'border-border',
      bad && 'border-destructive text-destructive')}
    >
      <Icon className="h-3.5 w-3.5" /> {label}
    </span>
  );
}

// Utils
function addBusinessDays(date: Date, days: number) {
  const result = new Date(date);
  let added = 0;
  while (added < days) {
    result.setDate(result.getDate() + 1);
    const day = result.getDay();
    if (day !== 0 && day !== 6) added++;
  }
  return result;
}
function round2(n: number) { return Math.round(n * 100) / 100; }