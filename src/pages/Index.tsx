import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Filter, Search, TrendingUp, Users, FileCheck, Clock } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { PropertyCard } from '@/components/properties/PropertyCard';
import { CreatePropertyDialog } from '@/components/properties/CreatePropertyDialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { properties as initialProperties, WorkflowState, getWorkflowStateLabel } from '@/data/dummyData';
import { useToast } from '@/hooks/use-toast';

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
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Objekte</h1>
            <p className="text-muted-foreground mt-1">Übersicht aller Immobilien in Ihrem Portfolio</p>
          </div>
          <Button onClick={() => setCreateDialogOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Objekt erstellen
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card className="border-l-4 border-l-accent">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-accent/10">
                  <TrendingUp className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.totalProperties}</p>
                  <p className="text-xs text-muted-foreground">Objekte gesamt</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-info">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-info/10">
                  <Users className="h-5 w-5 text-info" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.activeInquiries}</p>
                  <p className="text-xs text-muted-foreground">Aktive Anfragen</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-success">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-success/10">
                  <FileCheck className="h-5 w-5 text-success" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.readyToPublish}</p>
                  <p className="text-xs text-muted-foreground">Bereit zur Veröffentlichung</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-warning">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-warning/10">
                  <Clock className="h-5 w-5 text-warning" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.avgCompletion}%</p>
                  <p className="text-xs text-muted-foreground">Ø Fertigstellung</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Objekte suchen..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-[220px]">
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
