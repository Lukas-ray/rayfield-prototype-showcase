import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Filter, Search, TrendingUp, Users, FileCheck, Clock, ArrowRight, AlertTriangle, CheckCircle2, Sparkles } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { PropertyCard } from '@/components/properties/PropertyCard';
import { CreatePropertyDialog } from '@/components/properties/CreatePropertyDialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { properties as initialProperties, WorkflowState, getWorkflowStateLabel, getWorkflowStateClass } from '@/data/dummyData';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const Index = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [properties, setProperties] = useState(initialProperties);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [filter, setFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProperties = properties.filter((property) => {
    const matchesFilter = filter === 'all' || property.workflowState === filter;
    const matchesSearch = property.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      property.city.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // Dashboard statistics
  const stats = useMemo(() => ({
    totalProperties: properties.length,
    activeInquiries: properties.filter(p => p.workflowState === 'inquiries_active').length,
    readyToPublish: properties.filter(p => p.workflowState === 'ready_to_publish').length,
    avgCompletion: Math.round(properties.reduce((acc, p) => acc + p.completionPercent, 0) / properties.length),
  }), [properties]);

  // Next Actions Queue (max 3 items) - prioritized by urgency
  const nextActions = useMemo(() => {
    const actionItems = properties
      .filter(p => p.workflowState !== 'under_offer') // Exclude completed
      .map(p => ({
        property: p,
        urgency: p.workflowState === 'docs_missing' ? 3 : 
                 p.workflowState === 'inquiries_active' ? 2 : 
                 p.workflowState === 'ready_to_publish' ? 1 : 0,
        icon: p.workflowState === 'docs_missing' ? AlertTriangle :
              p.workflowState === 'inquiries_active' ? Users :
              p.workflowState === 'ready_to_publish' ? CheckCircle2 : Sparkles,
      }))
      .sort((a, b) => b.urgency - a.urgency)
      .slice(0, 3);
    return actionItems;
  }, [properties]);

  // Recent agent outputs ready for approval
  const recentAgentOutputs = useMemo(() => {
    return properties
      .filter(p => p.workflowState === 'ready_to_publish')
      .slice(0, 2);
  }, [properties]);

  const handleCreateProperty = (data: { address: string; propertyType: string; clientName: string }) => {
    const newProperty = {
      id: String(properties.length + 1),
      address: data.address,
      city: 'Berlin',
      propertyType: data.propertyType,
      workflowState: 'draft' as WorkflowState,
      lastActivity: 'Gerade eben',
      nextAction: 'Capture-Scan hochladen',
      clientName: data.clientName || undefined,
      price: 0,
      area: 0,
      rooms: 0,
      completionPercent: 5,
      thumbnail: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&h=300&fit=crop',
      createdAt: new Date().toISOString().split('T')[0],
    };
    
    setProperties([newProperty, ...properties]);
    setCreateDialogOpen(false);
    toast({
      title: 'Objekt erstellt',
      description: `${data.address} wurde zu Ihrem Arbeitsbereich hinzugefügt.`,
    });
    navigate(`/property/${newProperty.id}`);
  };

  return (
    <AppLayout>
      <div className="max-w-6xl mx-auto">
        {/* Header with always-visible Create CTA */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Was steht als nächstes an?</h1>
            <p className="text-muted-foreground mt-1">Ihre priorisierten Aktionen und aktiven Objekte</p>
          </div>
          <Button onClick={() => setCreateDialogOpen(true)} size="lg" className="gap-2 shadow-lg">
            <Plus className="h-5 w-5" />
            Objekt erstellen
          </Button>
        </div>

        {/* Next Actions Queue - Primary Focus */}
        <Card className="mb-6 border-accent/20 bg-gradient-to-r from-accent/5 to-transparent">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-accent" />
              Nächste Aktionen
              <span className="text-sm font-normal text-muted-foreground ml-2">
                ({nextActions.length} dringende Aufgaben)
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              {nextActions.map(({ property, icon: Icon }) => (
                <div 
                  key={property.id}
                  className="flex items-center justify-between p-4 rounded-lg bg-card border hover:border-accent/50 cursor-pointer transition-all group"
                  onClick={() => navigate(`/property/${property.id}`)}
                >
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      "p-2 rounded-lg",
                      property.workflowState === 'docs_missing' && "bg-warning/10",
                      property.workflowState === 'inquiries_active' && "bg-info/10",
                      property.workflowState === 'ready_to_publish' && "bg-success/10",
                      !['docs_missing', 'inquiries_active', 'ready_to_publish'].includes(property.workflowState) && "bg-accent/10"
                    )}>
                      <Icon className={cn(
                        "h-5 w-5",
                        property.workflowState === 'docs_missing' && "text-warning",
                        property.workflowState === 'inquiries_active' && "text-info",
                        property.workflowState === 'ready_to_publish' && "text-success",
                        !['docs_missing', 'inquiries_active', 'ready_to_publish'].includes(property.workflowState) && "text-accent"
                      )} />
                    </div>
                    <div>
                      <p className="font-semibold group-hover:text-accent transition-colors">
                        {property.nextAction}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {property.address} · {property.city}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={cn('status-badge', getWorkflowStateClass(property.workflowState))}>
                      {getWorkflowStateLabel(property.workflowState)}
                    </span>
                    <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-accent transition-colors" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Agent Outputs Ready for Approval */}
        {recentAgentOutputs.length > 0 && (
          <Card className="mb-6 border-success/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-success" />
                Bereit zur Genehmigung
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                {recentAgentOutputs.map((property) => (
                  <div 
                    key={property.id}
                    className="flex items-center gap-3 p-3 rounded-lg bg-success/5 border border-success/20 cursor-pointer hover:bg-success/10 transition-colors"
                    onClick={() => navigate(`/property/${property.id}`)}
                  >
                    <img 
                      src={property.thumbnail} 
                      alt={property.address}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{property.address}</p>
                      <p className="text-xs text-success">Exposé bereit zur Prüfung</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Compact Stats Row */}
        <div className="grid grid-cols-4 gap-3 mb-6">
          <div className="flex items-center gap-2 p-3 rounded-lg bg-card border">
            <TrendingUp className="h-4 w-4 text-accent" />
            <span className="text-lg font-bold">{stats.totalProperties}</span>
            <span className="text-xs text-muted-foreground">Objekte</span>
          </div>
          <div className="flex items-center gap-2 p-3 rounded-lg bg-card border">
            <Users className="h-4 w-4 text-info" />
            <span className="text-lg font-bold">{stats.activeInquiries}</span>
            <span className="text-xs text-muted-foreground">Anfragen</span>
          </div>
          <div className="flex items-center gap-2 p-3 rounded-lg bg-card border">
            <FileCheck className="h-4 w-4 text-success" />
            <span className="text-lg font-bold">{stats.readyToPublish}</span>
            <span className="text-xs text-muted-foreground">Bereit</span>
          </div>
          <div className="flex items-center gap-2 p-3 rounded-lg bg-card border">
            <Clock className="h-4 w-4 text-warning" />
            <span className="text-lg font-bold">{stats.avgCompletion}%</span>
            <span className="text-xs text-muted-foreground">Ø Fertig</span>
          </div>
        </div>

        {/* Active Listings Header with Search */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Aktive Objekte</h2>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Adresse, Verkäufer, Status..."
                className="pl-10 w-64"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-[200px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Alle Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Alle Status</SelectItem>
                <SelectItem value="draft">{getWorkflowStateLabel('draft')}</SelectItem>
                <SelectItem value="capture_processing">{getWorkflowStateLabel('capture_processing')}</SelectItem>
                <SelectItem value="docs_missing">{getWorkflowStateLabel('docs_missing')}</SelectItem>
                <SelectItem value="ready_to_publish">{getWorkflowStateLabel('ready_to_publish')}</SelectItem>
                <SelectItem value="inquiries_active">{getWorkflowStateLabel('inquiries_active')}</SelectItem>
                <SelectItem value="under_offer">{getWorkflowStateLabel('under_offer')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Properties Grid */}
        <div className="grid gap-4">
          {filteredProperties.map((property) => (
            <PropertyCard
              key={property.id}
              property={property}
              onClick={() => navigate(`/property/${property.id}`)}
            />
          ))}
        </div>

        {filteredProperties.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Keine Objekte gefunden, die Ihren Kriterien entsprechen.</p>
          </div>
        )}
      </div>

      <CreatePropertyDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onSubmit={handleCreateProperty}
      />
    </AppLayout>
  );
};

export default Index;
