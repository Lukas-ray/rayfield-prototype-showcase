import { useState } from 'react';
import { Play, Download, Image, Video, Box, LayoutGrid, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { mediaItems } from '@/data/dummyData';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

const typeIcons = {
  photo: Image,
  video: Video,
  '3d_tour': Box,
  floor_plan: LayoutGrid,
};

interface ListingOutput {
  title: string;
  shortDescription: string;
  longDescription: string;
  fields: { name: string; value: string; source: string }[];
}

export function MediaTab() {
  const { toast } = useToast();
  const [variant, setVariant] = useState<'hero' | 'portal' | 'social'>('hero');
  const [listingDialogOpen, setListingDialogOpen] = useState(false);
  const [exportDialogOpen, setExportDialogOpen] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);

  const filteredMedia = mediaItems.filter(m => m.variant === variant || variant === 'hero');

  const listingOutput: ListingOutput = {
    title: 'Lichtdurchflutete 3-Zimmer Altbauwohnung in Mitte',
    shortDescription: 'Traumhafte Altbauwohnung mit Stuck, Dielen und Balkon in bester Lage.',
    longDescription: 'Diese wunderschöne 3-Zimmer Wohnung besticht durch ihren klassischen Altbaucharme mit hohen Decken, originalen Stuckelementen und gepflegten Dielenböden. Die großzügige Wohnfläche von 85 m² verteilt sich optimal auf Wohnzimmer, Schlafzimmer, Arbeitszimmer sowie eine moderne Einbauküche. Der sonnige Südbalkon lädt zum Verweilen ein.',
    fields: [
      { name: 'Wohnfläche', value: '85 m²', source: 'scan' },
      { name: 'Zimmer', value: '3', source: 'scan' },
      { name: 'Etage', value: '3 von 5', source: 'scan' },
      { name: 'Baujahr', value: '1998', source: 'dokument' },
      { name: 'Heizung', value: 'Fernwärme', source: 'scan' },
      { name: 'Parken', value: 'Straßenparken', source: 'manuell' },
    ],
  };

  const handleExport = () => {
    if (selectedPreset) {
      setExportDialogOpen(false);
      setSelectedPreset(null);
      toast({
        title: 'Export generiert',
        description: `${selectedPreset}-Paket wurde erstellt und zu den Exporten hinzugefügt.`,
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Variant Selector */}
      <div className="flex items-center justify-between">
        <Tabs value={variant} onValueChange={(v) => setVariant(v as typeof variant)}>
          <TabsList>
            <TabsTrigger value="hero">Hero-Set</TabsTrigger>
            <TabsTrigger value="portal">Portal-Set</TabsTrigger>
            <TabsTrigger value="social">Social Reels</TabsTrigger>
          </TabsList>
        </Tabs>
        <div className="flex gap-2">
          <Button onClick={() => setListingDialogOpen(true)} className="gap-2">
            <Play className="h-4 w-4" />
            Listing Factory Agent starten
          </Button>
          <Button variant="outline" onClick={() => setExportDialogOpen(true)} className="gap-2">
            <Download className="h-4 w-4" />
            Bundle exportieren
          </Button>
        </div>
      </div>

      {/* Media Grid */}
      <div className="grid grid-cols-4 gap-4">
        {filteredMedia.map((item) => {
          const Icon = typeIcons[item.type];
          return (
            <div key={item.id} className="workspace-card p-2 group">
              <div className="aspect-video rounded-md overflow-hidden bg-muted relative">
                {item.type === 'photo' ? (
                  <img src={item.url} alt={item.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Icon className="h-8 w-8 text-muted-foreground" />
                  </div>
                )}
                {item.status === 'processing' && (
                  <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
                    <span className="text-xs font-medium text-muted-foreground">Wird verarbeitet...</span>
                  </div>
                )}
              </div>
              <p className="mt-2 text-sm font-medium truncate">{item.name}</p>
              <p className="text-xs text-muted-foreground capitalize">{item.type.replace('_', ' ')}</p>
            </div>
          );
        })}
      </div>

      {/* Listing Factory Dialog */}
      <Dialog open={listingDialogOpen} onOpenChange={setListingDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Listing Factory Agent - Ergebnis</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-secondary/50">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Vorgeschlagener Titel</span>
                <span className="evidence-badge">KI-generiert</span>
              </div>
              <p className="font-semibold">{listingOutput.title}</p>
            </div>
            
            <div className="p-4 rounded-lg bg-secondary/50">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Kurzbeschreibung</span>
                <span className="evidence-badge">KI-generiert</span>
              </div>
              <p className="text-sm">{listingOutput.shortDescription}</p>
            </div>

            <div className="p-4 rounded-lg bg-secondary/50">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Langbeschreibung</span>
                <span className="evidence-badge">KI-generiert</span>
              </div>
              <p className="text-sm">{listingOutput.longDescription}</p>
            </div>

            <div className="p-4 rounded-lg bg-secondary/50">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Strukturierte Felder</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {listingOutput.fields.map((field, i) => (
                  <div key={i} className="flex items-center justify-between p-2 rounded bg-background">
                    <div>
                      <p className="text-xs text-muted-foreground">{field.name}</p>
                      <p className="text-sm font-medium">{field.value}</p>
                    </div>
                    <span className="evidence-badge text-xs">{field.source}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Export Dialog */}
      <Dialog open={exportDialogOpen} onOpenChange={setExportDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Bundle exportieren</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">Portal-Vorlage auswählen:</p>
            {['Generisch', 'ImmoScout24', 'Kleinanzeigen'].map((preset) => (
              <div
                key={preset}
                onClick={() => setSelectedPreset(preset)}
                className={cn(
                  'p-4 rounded-lg border-2 cursor-pointer transition-colors',
                  selectedPreset === preset
                    ? 'border-accent bg-accent/5'
                    : 'border-border hover:border-muted-foreground'
                )}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">{preset}</span>
                  {selectedPreset === preset && <Check className="h-5 w-5 text-accent" />}
                </div>
              </div>
            ))}
          </div>
          <Button onClick={handleExport} disabled={!selectedPreset} className="w-full mt-4">
            Export generieren
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
