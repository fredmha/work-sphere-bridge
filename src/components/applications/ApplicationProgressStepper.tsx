import React from 'react';
import { Check, Circle, Loader, Award, Briefcase, X } from 'lucide-react';

const steps = [
  { status: 'pending', label: 'Application Submitted', icon: Check },
  { status: 'interview', label: 'Interview Stage', icon: Loader },
  { status: 'offer', label: 'Offer Received', icon: Award },
  { status: 'active', label: 'Project Active', icon: Briefcase },
  { status: 'completed', label: 'Project Completed', icon: Check }
];

const rejectedStep = { status: 'rejected', label: 'Application Rejected', icon: X };

export default function ApplicationProgressStepper({ currentStatus }) {
  const activeIndex = steps.findIndex(step => step.status === currentStatus);
  const isRejected = currentStatus === 'rejected';

  const displayedSteps = isRejected ? [steps[0], rejectedStep] : steps;

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-gray-800">Application Progress</h3>
      <div className="relative pl-4">
        {/* Vertical line */}
        <div className="absolute left-8 top-2 bottom-2 w-0.5 bg-gray-200" />

        {displayedSteps.map((step, index) => {
          const isActive = isRejected ? index <= 1 : index <= activeIndex;
          const isCurrent = isRejected ? index === 1 : index === activeIndex;

          const Icon = step.icon;
          const iconColor = isRejected && index === 1 ? 'text-red-500' : isActive ? 'text-green-600' : 'text-gray-400';
          const iconBgColor = isRejected && index === 1 ? 'bg-red-100' : isActive ? 'bg-green-100' : 'bg-gray-100';

          return (
            <div key={step.status} className="flex items-center gap-4 relative py-2">
              <div className={`z-10 w-8 h-8 rounded-full flex items-center justify-center ${iconBgColor}`}>
                <Icon className={`w-4 h-4 ${iconColor}`} />
              </div>
              <div className="flex-1">
                <p className={`font-medium ${isActive ? 'text-gray-800' : 'text-gray-500'}`}>
                  {step.label}
                </p>
                {isCurrent && <p className="text-sm text-green-600">Current Stage</p>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}