import { Check, ArrowRight, Scan, Database, Camera, Workflow } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PipelineVisualizationProps {
  currentStep: number;
}

const steps = [
  { id: 1, name: 'Scan Once', description: 'Capture property data', icon: Scan },
  { id: 2, name: 'Property Record', description: 'Structured data store', icon: Database },
  { id: 3, name: 'Capture Agents', description: 'Generate marketing assets', icon: Camera },
  { id: 4, name: 'Workflow Agents', description: 'Execute operations', icon: Workflow },
];

export function PipelineVisualization({ currentStep }: PipelineVisualizationProps) {
  return (
    <div className="workspace-card">
      <h3 className="font-semibold mb-4">Value Pipeline</h3>
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center">
            <div
              className={cn(
                'pipeline-step',
                currentStep > step.id && 'pipeline-step-complete',
                currentStep === step.id && 'pipeline-step-active'
              )}
            >
              <div
                className={cn(
                  'h-12 w-12 rounded-full flex items-center justify-center',
                  currentStep > step.id && 'bg-success text-success-foreground',
                  currentStep === step.id && 'bg-accent text-accent-foreground',
                  currentStep < step.id && 'bg-muted text-muted-foreground'
                )}
              >
                {currentStep > step.id ? (
                  <Check className="h-6 w-6" />
                ) : (
                  <step.icon className="h-6 w-6" />
                )}
              </div>
              <span className="font-medium text-sm">{step.name}</span>
              <span className="text-xs text-muted-foreground text-center">{step.description}</span>
            </div>
            {index < steps.length - 1 && (
              <ArrowRight className="h-5 w-5 mx-2 text-muted-foreground" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
