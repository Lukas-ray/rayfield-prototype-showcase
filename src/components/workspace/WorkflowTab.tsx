import { useState } from 'react';
import { Check, X, ArrowRight, ShieldAlert, Calendar, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { tasks } from '@/data/dummyData';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

const workflowStates = [
  { id: 'mandate', name: 'Mandate', gates: [] },
  { id: 'capture', name: 'Capture', gates: ['Scan uploaded'] },
  { id: 'assets', name: 'Assets', gates: ['Hero photos', 'Floor plan'] },
  { id: 'docs', name: 'Docs', gates: ['Grundbuchauszug', 'Energieausweis'] },
  { id: 'published', name: 'Published', gates: ['Hero photos', 'Floor plan', 'Minimum doc pack'] },
  { id: 'inquiries', name: 'Inquiries', gates: ['At least one inquiry'] },
  { id: 'viewings', name: 'Viewings', gates: ['Viewing scheduled'] },
  { id: 'offer', name: 'Offer', gates: ['Offer received'] },
  { id: 'closing', name: 'Closing', gates: ['Notary appointment'] },
];

interface Gate {
  name: string;
  met: boolean;
}

export function WorkflowTab() {
  const { toast } = useToast();
  const [currentState, setCurrentState] = useState(3); // 'docs' state
  const [overrideDialogOpen, setOverrideDialogOpen] = useState(false);
  const [selectedGate, setSelectedGate] = useState<string | null>(null);

  const gates: Gate[] = [
    { name: 'Hero photos', met: true },
    { name: 'Floor plan', met: true },
    { name: 'Minimum doc pack', met: false },
  ];

  const canAdvance = gates.every(g => g.met);

  const handleMoveNext = () => {
    if (currentState < workflowStates.length - 1) {
      setCurrentState(currentState + 1);
      toast({
        title: 'Workflow advanced',
        description: `Property moved to ${workflowStates[currentState + 1].name} state.`,
      });
    }
  };

  const handleOverride = () => {
    setOverrideDialogOpen(false);
    toast({
      title: 'Gate overridden',
      description: `${selectedGate} requirement bypassed. Logged to audit.`,
    });
  };

  return (
    <div className="grid grid-cols-3 gap-6">
      {/* State Machine */}
      <div className="col-span-2 workspace-card">
        <h3 className="font-semibold mb-4">Workflow Pipeline</h3>
        <div className="flex items-center gap-2 overflow-x-auto pb-4">
          {workflowStates.map((state, index) => (
            <div key={state.id} className="flex items-center">
              <div
                className={cn(
                  'flex flex-col items-center gap-2 p-3 rounded-lg border-2 min-w-[100px]',
                  index < currentState && 'border-success bg-success/5',
                  index === currentState && 'border-accent bg-accent/5',
                  index > currentState && 'border-border bg-muted/50'
                )}
              >
                <div
                  className={cn(
                    'h-8 w-8 rounded-full flex items-center justify-center text-sm font-medium',
                    index < currentState && 'bg-success text-success-foreground',
                    index === currentState && 'bg-accent text-accent-foreground',
                    index > currentState && 'bg-muted text-muted-foreground'
                  )}
                >
                  {index < currentState ? <Check className="h-4 w-4" /> : index + 1}
                </div>
                <span className={cn(
                  'text-sm font-medium',
                  index > currentState && 'text-muted-foreground'
                )}>
                  {state.name}
                </span>
              </div>
              {index < workflowStates.length - 1 && (
                <ArrowRight className={cn(
                  'h-4 w-4 mx-1',
                  index < currentState ? 'text-success' : 'text-muted-foreground'
                )} />
              )}
            </div>
          ))}
        </div>

        {/* Gates */}
        <div className="mt-6">
          <h4 className="font-medium mb-3">Gates for {workflowStates[currentState + 1]?.name || 'Next'} State</h4>
          <div className="space-y-2">
            {gates.map((gate) => (
              <div key={gate.name} className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                <div className="flex items-center gap-2">
                  {gate.met ? (
                    <Check className="h-5 w-5 text-success" />
                  ) : (
                    <X className="h-5 w-5 text-destructive" />
                  )}
                  <span className={gate.met ? '' : 'text-destructive'}>{gate.name}</span>
                </div>
                {!gate.met && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSelectedGate(gate.name);
                      setOverrideDialogOpen(true);
                    }}
                  >
                    <ShieldAlert className="h-4 w-4 mr-1" />
                    Override
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-2 mt-6">
          <Button onClick={handleMoveNext} disabled={!canAdvance} className="flex-1 gap-2">
            <ArrowRight className="h-4 w-4" />
            Move to Next State
          </Button>
        </div>
      </div>

      {/* Tasks */}
      <div className="workspace-card">
        <h3 className="font-semibold mb-4">Tasks</h3>
        <div className="space-y-3">
          {tasks.map((task) => (
            <div key={task.id} className={cn(
              'p-3 rounded-lg',
              task.status === 'completed' ? 'bg-success/10' : 'bg-secondary/50'
            )}>
              <div className="flex items-start gap-2">
                <div className={cn(
                  'h-5 w-5 rounded-full border-2 flex items-center justify-center mt-0.5',
                  task.status === 'completed' ? 'border-success bg-success' : 'border-muted-foreground'
                )}>
                  {task.status === 'completed' && <Check className="h-3 w-3 text-success-foreground" />}
                </div>
                <div className="flex-1">
                  <p className={cn(
                    'font-medium text-sm',
                    task.status === 'completed' && 'line-through text-muted-foreground'
                  )}>
                    {task.title}
                  </p>
                  <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      {task.owner}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {task.dueDate}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Override Dialog */}
      <Dialog open={overrideDialogOpen} onOpenChange={setOverrideDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Override Gate</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-muted-foreground">
              Are you sure you want to override the <strong>{selectedGate}</strong> requirement?
              This action will be logged to the audit trail.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOverrideDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleOverride}>Override Gate</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
