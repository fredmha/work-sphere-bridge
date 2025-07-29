import React from 'react';
import { CheckCircle, Circle } from 'lucide-react';

interface Step {
  number: number;
  title: string;
  component: React.ComponentType<any>;
}

interface Props {
  currentStep: number;
  totalSteps: number;
  steps: Step[];
}

export default function ProgressIndicator({ currentStep, totalSteps, steps }: Props) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step.number} className="flex items-center">
            <div className="flex flex-col items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors ${
                step.number < currentStep
                  ? 'bg-primary border-primary text-primary-foreground'
                  : step.number === currentStep
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-muted-foreground/25 bg-background text-muted-foreground'
              }`}>
                {step.number < currentStep ? (
                  <CheckCircle className="h-5 w-5" />
                ) : (
                  <span className="text-sm font-medium">{step.number}</span>
                )}
              </div>
              <span className={`text-xs mt-2 font-medium ${
                step.number <= currentStep ? 'text-foreground' : 'text-muted-foreground'
              }`}>
                {step.title}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div className={`flex-1 h-0.5 mx-4 transition-colors ${
                step.number < currentStep ? 'bg-primary' : 'bg-muted-foreground/25'
              }`} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}