import { useState } from 'react';
import { Upload, RefreshCw, Check, Clock, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

interface ProcessingStep {
  id: string;
  name: string;
  status: 'completed' | 'processing' | 'queued';
  timestamp?: string;
}

export function CaptureTab() {
  const [version, setVersion] = useState('v2');
  const [isReprocessing, setIsReprocessing] = useState(false);
  const [steps, setSteps] = useState<ProcessingStep[]>([
    { id: '1', name: 'Datei hochgeladen', status: 'completed', timestamp: '14:30' },
    { id: '2', name: 'Bilder werden extrahiert', status: 'completed', timestamp: '14:32' },
    { id: '3', name: 'Grundriss wird generiert', status: 'completed', timestamp: '14:35' },
    { id: '4', name: '3D-Modell wird verarbeitet', status: 'processing' },
    { id: '5', name: 'Virtuelle Tour wird erstellt', status: 'queued' },
  ]);

  const handleReprocess = () => {
    setIsReprocessing(true);
    setSteps(steps.map(s => ({ ...s, status: 'queued' as const, timestamp: undefined })));
    
    // Simulate reprocessing
    setTimeout(() => {
      setSteps(prev => prev.map((s, i) => i === 0 ? { ...s, status: 'processing' as const } : s));
    }, 500);
    
    setTimeout(() => {
      setSteps(prev => prev.map((s, i) => {
        if (i === 0) return { ...s, status: 'completed' as const, timestamp: 'Jetzt' };
        if (i === 1) return { ...s, status: 'processing' as const };
        return s;
      }));
      setIsReprocessing(false);
    }, 2000);
  };

  return (
    <div className="grid grid-cols-2 gap-6">
      {/* Upload Area */}
      <div className="workspace-card">
        <h3 className="font-semibold mb-4">Capture-Upload</h3>
        <div className="border-2 border-dashed rounded-lg p-8 text-center">
          <Upload className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
          <p className="font-medium mb-1">Capture-Dateien hier ablegen</p>
          <p className="text-sm text-muted-foreground mb-4">
            Unterstützt: Matterport, iGuide, ZIP-Archive
          </p>
          <Button variant="outline">Dateien durchsuchen</Button>
        </div>
        
        <div className="mt-4 p-3 rounded-lg bg-secondary/50">
          <p className="text-sm font-medium">Aktueller Capture:</p>
          <p className="text-sm text-muted-foreground">scan_muellerstr42_v2.zip (2,4 GB)</p>
        </div>
      </div>

      {/* Processing Status */}
      <div className="workspace-card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">Verarbeitungsstatus</h3>
          <Select value={version} onValueChange={setVersion}>
            <SelectTrigger className="w-24">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="v1">v1</SelectItem>
              <SelectItem value="v2">v2</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-3 mb-4">
          {steps.map((step) => (
            <div key={step.id} className="flex items-center gap-3">
              <div className={cn(
                'h-6 w-6 rounded-full flex items-center justify-center',
                step.status === 'completed' && 'bg-success/10 text-success',
                step.status === 'processing' && 'bg-info/10 text-info',
                step.status === 'queued' && 'bg-muted text-muted-foreground'
              )}>
                {step.status === 'completed' && <Check className="h-4 w-4" />}
                {step.status === 'processing' && <Loader2 className="h-4 w-4 animate-spin" />}
                {step.status === 'queued' && <Clock className="h-4 w-4" />}
              </div>
              <span className={cn(
                'flex-1 text-sm',
                step.status === 'queued' && 'text-muted-foreground'
              )}>
                {step.name}
              </span>
              {step.timestamp && (
                <span className="text-xs text-muted-foreground">{step.timestamp}</span>
              )}
            </div>
          ))}
        </div>

        <Button onClick={handleReprocess} disabled={isReprocessing} className="w-full gap-2">
          <RefreshCw className={cn("h-4 w-4", isReprocessing && "animate-spin")} />
          Capture erneut verarbeiten
        </Button>
      </div>
    </div>
  );
}
