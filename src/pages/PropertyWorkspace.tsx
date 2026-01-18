import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Home, Euro, Ruler, BedDouble, Bath, Calendar, User, Phone, Mail, Building2, ExternalLink, TrendingUp, Users, Lock, ClipboardList } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PipelineVisualization } from '@/components/workspace/PipelineVisualization';
import { EvidenceSection } from '@/components/workspace/EvidenceSection';
import { CaptureTab } from '@/components/workspace/CaptureTab';
import { MediaTab } from '@/components/workspace/MediaTab';
import { DocumentsTab } from '@/components/workspace/DocumentsTab';
import { ActivityTab } from '@/components/workspace/ActivityTab';
import { PerformanceTab } from '@/components/workspace/PerformanceTab';
import { LeadsTab } from '@/components/workspace/LeadsTab';
import { AskImmosmart } from '@/components/workspace/AskRayfieldWidget';
import { properties, getWorkflowStateLabel, getWorkflowStateClass, tasks } from '@/data/dummyData';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import propertyLivingRoom from '@/assets/property-living-room.jpg';

export default function PropertyWorkspace() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  const property = properties.find(p => p.id === id) || properties[0];
  const pendingTasks = tasks.filter(t => t.status !== 'completed');

  // Check if property is published (has active inquiries or is under offer)
  const isPublished = property.workflowState === 'inquiries_active' || property.workflowState === 'under_offer';

  // Determine pipeline step based on workflow state
  const getPipelineStep = () => {
    switch (property.workflowState) {
      case 'draft': return 1;
      case 'capture_processing': return 2;
      case 'docs_missing': return 3;
      default: return 4;
    }
  };

  // Mock owner data
  const owner = {
    name: 'Dr. Thomas Müller',
    phone: '+49 89 123 456 78',
    email: 'thomas.mueller@email.de',
    company: 'Müller Immobilien GmbH',
    since: '15.03.2024',
    onofficeId: '12847', // CRM ID for onoffice link
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
            <Button 
              variant="outline" 
              onClick={() => navigate(`/property/${id}/expose`)}
              className="gap-2"
            >
              <ExternalLink className="h-4 w-4" />
              Exposé-Vorschau
            </Button>
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
            <TabsTrigger 
              value="performance" 
              className="gap-1.5"
              disabled={!isPublished}
            >
              {!isPublished && <Lock className="h-3 w-3" />}
              <TrendingUp className="h-4 w-4" />
              Performance
            </TabsTrigger>
            <TabsTrigger 
              value="leads" 
              className="gap-1.5"
              disabled={!isPublished}
            >
              {!isPublished && <Lock className="h-3 w-3" />}
              <Users className="h-4 w-4" />
              Leads
            </TabsTrigger>
            <TabsTrigger value="audit" className="gap-1.5">
              <ClipboardList className="h-4 w-4" />
              Audit-Log
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6 animate-fade-in">
            {/* Property Overview Card */}
            <div className="grid grid-cols-3 gap-6">
              {/* Property Image & Key Info */}
              <Card className="col-span-2">
                <CardContent className="p-0">
                  <div className="flex">
                    <div className="w-1/3">
                      <img 
                        src={propertyLivingRoom} 
                        alt={property.address}
                        className="w-full h-full object-cover rounded-l-lg"
                      />
                    </div>
                    <div className="flex-1 p-6">
                      <h3 className="text-lg font-semibold mb-4">Objektdetails</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                            <Home className="h-5 w-5 text-accent" />
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Objektart</p>
                            <p className="font-medium">{property.propertyType}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                            <Euro className="h-5 w-5 text-accent" />
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Kaufpreis</p>
                            <p className="font-medium">{property.price.toLocaleString('de-DE')} €</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                            <Ruler className="h-5 w-5 text-accent" />
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Wohnfläche</p>
                            <p className="font-medium">120 m²</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                            <BedDouble className="h-5 w-5 text-accent" />
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Zimmer</p>
                            <p className="font-medium">4 Zimmer</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                            <Bath className="h-5 w-5 text-accent" />
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Bäder</p>
                            <p className="font-medium">2 Bäder</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                            <Calendar className="h-5 w-5 text-accent" />
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Baujahr</p>
                            <p className="font-medium">1985</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Owner Info */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <User className="h-5 w-5 text-accent" />
                      Eigentümer
                    </div>
                    <a 
                      href={`https://app.onoffice.de/contact/${owner.onofficeId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-xs font-normal text-muted-foreground hover:text-accent transition-colors"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                      onoffice CRM
                    </a>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="font-semibold text-lg">{owner.name}</p>
                    <p className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                      <Building2 className="h-4 w-4" />
                      {owner.company}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 text-sm">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{owner.phone}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span>{owner.email}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>Kunde seit {owner.since}</span>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="w-full mt-2">
                    Kontaktieren
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Pipeline */}
            <PipelineVisualization currentStep={getPipelineStep()} />

            {/* Next Actions */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Nächste Aktionen</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  {pendingTasks.map((task) => (
                    <div key={task.id} className="flex items-center justify-between p-4 rounded-lg bg-secondary/50 border border-border">
                      <div>
                        <p className="font-medium">{task.title}</p>
                        <p className="text-sm text-muted-foreground">{task.owner} · Fällig: {task.dueDate}</p>
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
              </CardContent>
            </Card>

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
            <DocumentsTab propertyId={id} />
          </TabsContent>

          <TabsContent value="performance" className="animate-fade-in">
            {isPublished ? (
              <PerformanceTab />
            ) : (
              <div className="workspace-card text-center py-12">
                <Lock className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">Performance-Daten nicht verfügbar</h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                  Performance-Statistiken werden erst angezeigt, wenn das Objekt veröffentlicht wurde und aktive Anfragen vorliegen.
                </p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="leads" className="animate-fade-in">
            {isPublished ? (
              <LeadsTab />
            ) : (
              <div className="workspace-card text-center py-12">
                <Lock className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">Leads nicht verfügbar</h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                  Leads werden erst angezeigt, wenn das Objekt veröffentlicht wurde. Schließen Sie zunächst die Objektaufnahme ab.
                </p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="audit" className="animate-fade-in">
            <ActivityTab />
          </TabsContent>
        </Tabs>
      </div>

      {/* Ask Immosmart Widget */}
      <AskImmosmart />
    </AppLayout>
  );
}
