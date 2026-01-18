import { useState } from 'react';
import { Upload, RefreshCw, Check, Clock, Loader2, History, Bot, FileText, Play, CheckCircle2, ArrowRight, Layers } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface ProcessingStep {
  id: string;
  name: string;
  status: 'completed' | 'processing' | 'queued';
  timestamp?: string;
}

interface AgentRun {
  id: string;
  agentName: string;
  version: string;
  status: 'completed' | 'running' | 'failed';
  startedAt: string;
  duration?: string;
  inputs: string[];
  outputs: { name: string; status: 'ready' | 'pending' }[];
}

const agentRunHistory: AgentRun[] = [
  {
    id: '1',
    agentName: 'Image Extraction Agent',
    version: 'v2.1',
    status: 'completed',
    startedAt: '15.01.2024, 14:32',
    duration: '3 Min 42 Sek',
    inputs: ['scan_muellerstr42_v2.zip (2.4 GB)'],
    outputs: [
      { name: '24 Fotos extrahiert', status: 'ready' },
      { name: 'HDR-Bilder optimiert', status: 'ready' },
    ],
  },
  {
    id: '2',
    agentName: 'Floor Plan Generator',
    version: 'v1.8',
    status: 'completed',
    startedAt: '15.01.2024, 14:35',
    duration: '2 Min 15 Sek',
    inputs: ['3D Point Cloud', 'Room Boundaries'],
    outputs: [
      { name: 'Grundriss 2D (SVG)', status: 'ready' },
      { name: 'Grundriss 3D (Interactive)', status: 'ready' },
    ],
  },
  {
    id: '3',
    agentName: '3D Model Processor',
    version: 'v3.0',
    status: 'running',
    startedAt: '15.01.2024, 14:38',
    inputs: ['Gaussian Splat Data', 'Camera Positions'],
    outputs: [
      { name: '3D Modell', status: 'pending' },
      { name: 'Virtuelle Tour', status: 'pending' },
    ],
  },
];

export function CaptureTab() {
  const [version, setVersion] = useState('v2');
  const [isReprocessing, setIsReprocessing] = useState(false);
  const [selectedRun, setSelectedRun] = useState<AgentRun | null>(agentRunHistory[0]);
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

  const completedRuns = agentRunHistory.filter(r => r.status === 'completed').length;
  const pendingOutputs = agentRunHistory.flatMap(r => r.outputs.filter(o => o.status === 'pending')).length;

  return (
    <div className="space-y-6">
      {/* Agent Summary Bar */}
      <div className="flex items-center justify-between p-4 rounded-lg bg-accent/5 border border-accent/20">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-accent" />
            <span className="font-medium">Capture Agents</span>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <span className="flex items-center gap-1">
              <CheckCircle2 className="h-4 w-4 text-success" />
              {completedRuns} abgeschlossen
            </span>
            <span className="flex items-center gap-1">
              <Loader2 className="h-4 w-4 text-info animate-spin" />
              1 läuft
            </span>
            {pendingOutputs > 0 && (
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4 text-warning" />
                {pendingOutputs} Outputs ausstehend
              </span>
            )}
          </div>
        </div>
        <Badge variant="secondary" className="gap-1">
          <Layers className="h-3 w-3" />
          Version {version}
        </Badge>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Upload Area */}
        <div className="workspace-card">
          <h3 className="font-semibold mb-4">Capture-Upload</h3>
          <div className="border-2 border-dashed rounded-lg p-6 text-center">
            <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
            <p className="font-medium mb-1 text-sm">Dateien hier ablegen</p>
            <p className="text-xs text-muted-foreground mb-3">
              Matterport, iGuide, ZIP
            </p>
            <Button variant="outline" size="sm">Durchsuchen</Button>
          </div>
          
          <div className="mt-4 p-3 rounded-lg bg-secondary/50">
            <p className="text-sm font-medium">Aktueller Capture:</p>
            <p className="text-xs text-muted-foreground">scan_muellerstr42_v2.zip</p>
            <p className="text-xs text-muted-foreground">2,4 GB</p>
          </div>
        </div>

        {/* Agent Run History - KEY NEW FEATURE */}
        <div className="workspace-card col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold flex items-center gap-2">
              <History className="h-5 w-5 text-accent" />
              Agent-Durchläufe
            </h3>
            <Button onClick={handleReprocess} disabled={isReprocessing} size="sm" className="gap-2">
              <RefreshCw className={cn("h-4 w-4", isReprocessing && "animate-spin")} />
              Neu verarbeiten
            </Button>
          </div>

          <div className="space-y-3">
            {agentRunHistory.map((run) => (
              <div 
                key={run.id}
                className={cn(
                  "p-4 rounded-lg border cursor-pointer transition-all",
                  selectedRun?.id === run.id ? "border-accent bg-accent/5" : "hover:border-muted-foreground/30"
                )}
                onClick={() => setSelectedRun(run)}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "p-2 rounded-lg",
                      run.status === 'completed' && "bg-success/10",
                      run.status === 'running' && "bg-info/10",
                      run.status === 'failed' && "bg-destructive/10"
                    )}>
                      {run.status === 'completed' && <Check className="h-4 w-4 text-success" />}
                      {run.status === 'running' && <Loader2 className="h-4 w-4 text-info animate-spin" />}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{run.agentName}</p>
                      <p className="text-xs text-muted-foreground">
                        {run.startedAt} {run.duration && `• ${run.duration}`}
                      </p>
                    </div>
                  </div>
                  <Badge variant="secondary" className="text-xs">{run.version}</Badge>
                </div>

                {/* Inputs & Outputs */}
                <div className="grid grid-cols-2 gap-4 mt-3 pt-3 border-t">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Inputs</p>
                    <div className="space-y-1">
                      {run.inputs.map((input, i) => (
                        <p key={i} className="text-xs flex items-center gap-1">
                          <FileText className="h-3 w-3" />
                          {input}
                        </p>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Outputs</p>
                    <div className="space-y-1">
                      {run.outputs.map((output, i) => (
                        <p key={i} className={cn(
                          "text-xs flex items-center gap-1",
                          output.status === 'pending' && "text-muted-foreground"
                        )}>
                          {output.status === 'ready' ? (
                            <CheckCircle2 className="h-3 w-3 text-success" />
                          ) : (
                            <Clock className="h-3 w-3" />
                          )}
                          {output.name}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Approve Button for completed runs */}
                {run.status === 'completed' && (
                  <div className="mt-3 pt-3 border-t flex justify-end">
                    <Button size="sm" variant="outline" className="gap-1">
                      <CheckCircle2 className="h-3 w-3" />
                      Outputs genehmigen
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
