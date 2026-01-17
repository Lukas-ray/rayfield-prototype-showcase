import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PipelineVisualization } from '@/components/workspace/PipelineVisualization';
import { EvidenceSection } from '@/components/workspace/EvidenceSection';
import { CaptureTab } from '@/components/workspace/CaptureTab';
import { MediaTab } from '@/components/workspace/MediaTab';
import { DocumentsTab } from '@/components/workspace/DocumentsTab';
import { WorkflowTab } from '@/components/workspace/WorkflowTab';
import { ActivityTab } from '@/components/workspace/ActivityTab';
import { CommsTab } from '@/components/workspace/CommsTab';
import { AskRayfieldWidget } from '@/components/workspace/AskRayfieldWidget';
import { properties, getWorkflowStateLabel, getWorkflowStateClass, tasks, agentRuns } from '@/data/dummyData';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

export default function PropertyWorkspace() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  const property = properties.find(p => p.id === id) || properties[0];
  const latestAgentRun = agentRuns[0];
  const pendingTasks = tasks.filter(t => t.status !== 'completed');

  // Determine pipeline step based on workflow state
  const getPipelineStep = () => {
    switch (property.workflowState) {
      case 'draft': return 1;
      case 'capture_processing': return 2;
      case 'docs_missing': return 3;
      default: return 4;
    }
  };

  return (
    <AppLayout currentProperty={id} onPropertyChange={(newId) => navigate(`/property/${newId}`)}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-start gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold">{property.address}</h1>
                <span className={cn('status-badge', getWorkflowStateClass(property.workflowState))}>
                  {getWorkflowStateLabel(property.workflowState)}
                </span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground mt-1">
                <MapPin className="h-4 w-4" />
                <span>{property.city}</span>
                <span>•</span>
                <span>{property.propertyType}</span>
                <span>•</span>
                <span>{property.price.toLocaleString('de-DE')} €</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Fortschritt</p>
              <div className="flex items-center gap-2">
                <Progress value={property.completionPercent} className="w-24 h-2" />
                <span className="font-semibold">{property.completionPercent}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-card border">
            <TabsTrigger value="overview">Übersicht</TabsTrigger>
            <TabsTrigger value="capture">Capture</TabsTrigger>
            <TabsTrigger value="media">Medien</TabsTrigger>
            <TabsTrigger value="documents">Dokumente</TabsTrigger>
            <TabsTrigger value="comms">Komms</TabsTrigger>
            <TabsTrigger value="workflow">Workflow</TabsTrigger>
            <TabsTrigger value="activity">Aktivität</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6 animate-fade-in">
            {/* Pipeline */}
            <PipelineVisualization currentStep={getPipelineStep()} />

            <div className="grid grid-cols-2 gap-6">
              {/* Next Actions */}
              <div className="workspace-card">
                <h3 className="font-semibold mb-4">Nächste Aktionen</h3>
                <div className="space-y-2">
                  {pendingTasks.map((task) => (
                    <div key={task.id} className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                      <div>
                        <p className="font-medium text-sm">{task.title}</p>
                        <p className="text-xs text-muted-foreground">{task.owner} · Fällig: {task.dueDate}</p>
                      </div>
                      <span className={cn(
                        'status-badge',
                        task.status === 'in_progress' ? 'status-processing' : 'status-draft'
                      )}>
                        {task.status === 'in_progress' ? 'In Bearbeitung' : 'Ausstehend'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Latest Agent Output */}
              <div className="workspace-card">
                <h3 className="font-semibold mb-4">Letzte Agent-Ausgabe</h3>
                <div className="p-4 rounded-lg bg-accent/5 border border-accent/20">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-medium">{latestAgentRun.agentName}</span>
                    <span className="text-xs text-muted-foreground">{latestAgentRun.timestamp}</span>
                  </div>
                  <ul className="space-y-1">
                    {latestAgentRun.outputs.map((output, i) => (
                      <li key={i} className="text-sm text-muted-foreground flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                        {output}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Evidence Section */}
            <EvidenceSection />
          </TabsContent>

          <TabsContent value="capture" className="animate-fade-in">
            <CaptureTab />
          </TabsContent>

          <TabsContent value="media" className="animate-fade-in">
            <MediaTab />
          </TabsContent>

          <TabsContent value="documents" className="animate-fade-in">
            <DocumentsTab />
          </TabsContent>

          <TabsContent value="comms" className="animate-fade-in">
            <CommsTab />
          </TabsContent>

          <TabsContent value="workflow" className="animate-fade-in">
            <WorkflowTab />
          </TabsContent>

          <TabsContent value="activity" className="animate-fade-in">
            <ActivityTab />
          </TabsContent>
        </Tabs>
      </div>

      {/* Ask Rayfield Widget */}
      <AskRayfieldWidget />
    </AppLayout>
  );
}
