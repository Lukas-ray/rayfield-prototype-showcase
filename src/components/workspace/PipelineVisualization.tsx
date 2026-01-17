import { Check, Scan, Database, Camera, FileCheck, Send, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';

interface PipelineVisualizationProps {
  currentStep: number;
}

const steps = [
  { id: 1, name: 'Erfassung', description: '3D-Scan & Daten', icon: Scan, color: 'from-blue-500 to-blue-600' },
  { id: 2, name: 'Verarbeitung', description: 'KI-Analyse', icon: Database, color: 'from-purple-500 to-purple-600' },
  { id: 3, name: 'Medien', description: 'Fotos & Videos', icon: Camera, color: 'from-pink-500 to-pink-600' },
  { id: 4, name: 'Dokumente', description: 'Unterlagen prüfen', icon: FileCheck, color: 'from-orange-500 to-orange-600' },
  { id: 5, name: 'Veröffentlichung', description: 'Portale & Marketing', icon: Send, color: 'from-green-500 to-green-600' },
];

export function PipelineVisualization({ currentStep }: PipelineVisualizationProps) {
  const progress = ((currentStep - 1) / (steps.length - 1)) * 100;
  
  return (
    <div className="workspace-card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold">Pipeline-Status</h3>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Fortschritt:</span>
          <span className="font-semibold text-accent">{Math.round(progress)}%</span>
        </div>
      </div>
      
      {/* Progress Bar */}
      <div className="relative mb-8">
        <Progress value={progress} className="h-2" />
        <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 flex justify-between">
          {steps.map((step) => (
            <div
              key={step.id}
              className={cn(
                'w-4 h-4 rounded-full border-2 transition-all duration-300',
                currentStep >= step.id 
                  ? 'bg-accent border-accent' 
                  : 'bg-background border-muted-foreground/30'
              )}
            />
          ))}
        </div>
      </div>
      
      {/* Step Cards */}
      <div className="grid grid-cols-5 gap-3">
        {steps.map((step) => {
          const Icon = step.icon;
          const isComplete = currentStep > step.id;
          const isActive = currentStep === step.id;
          
          return (
            <div
              key={step.id}
              className={cn(
                'relative p-4 rounded-xl border transition-all duration-300',
                isComplete && 'bg-success/10 border-success/30',
                isActive && 'bg-accent/10 border-accent ring-2 ring-accent/20',
                !isComplete && !isActive && 'bg-muted/30 border-border opacity-60'
              )}
            >
              {isComplete && (
                <div className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-success flex items-center justify-center">
                  <Check className="h-3 w-3 text-success-foreground" />
                </div>
              )}
              <div
                className={cn(
                  'w-10 h-10 rounded-lg flex items-center justify-center mb-3',
                  isComplete && 'bg-success/20 text-success',
                  isActive && 'bg-gradient-to-br text-white ' + step.color,
                  !isComplete && !isActive && 'bg-muted text-muted-foreground'
                )}
              >
                <Icon className="h-5 w-5" />
              </div>
              <p className={cn(
                'font-medium text-sm',
                isActive && 'text-accent'
              )}>{step.name}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{step.description}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
