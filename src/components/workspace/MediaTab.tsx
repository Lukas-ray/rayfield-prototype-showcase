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
      { name: 'Living Area', value: '85 m²', source: 'scan' },
      { name: 'Rooms', value: '3', source: 'scan' },
      { name: 'Floor', value: '3rd of 5', source: 'scan' },
      { name: 'Year Built', value: '1998', source: 'document' },
      { name: 'Heating', value: 'District heating', source: 'scan' },
      { name: 'Parking', value: 'Street parking', source: 'manual' },
    ],
  };

  const handleExport = () => {
    if (selectedPreset) {
      setExportDialogOpen(false);
      setSelectedPreset(null);
      toast({
        title: 'Export generated',
        description: `${selectedPreset} package has been created and added to exports.`,
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Variant Selector */}
      <div className="flex items-center justify-between">
        <Tabs value={variant} onValueChange={(v) => setVariant(v as typeof variant)}>
          <TabsList>
            <TabsTrigger value="hero">Hero Set</TabsTrigger>
            <TabsTrigger value="portal">Portal Set</TabsTrigger>
            <TabsTrigger value="social">Social Reels</TabsTrigger>
          </TabsList>
        </Tabs>
        <div className="flex gap-2">
          <Button onClick={() => setListingDialogOpen(true)} className="gap-2">
            <Play className="h-4 w-4" />
            Run Listing Factory Agent
          </Button>
          <Button variant="outline" onClick={() => setExportDialogOpen(true)} className="gap-2">
            <Download className="h-4 w-4" />
            Export Bundle
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
                    <span className="text-xs font-medium text-muted-foreground">Processing...</span>
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
            <DialogTitle>Listing Factory Agent Output</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-secondary/50">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Suggested Title</span>
                <span className="evidence-badge">AI Generated</span>
              </div>
              <p className="font-semibold">{listingOutput.title}</p>
            </div>
            
            <div className="p-4 rounded-lg bg-secondary/50">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Short Description</span>
                <span className="evidence-badge">AI Generated</span>
              </div>
              <p className="text-sm">{listingOutput.shortDescription}</p>
            </div>

            <div className="p-4 rounded-lg bg-secondary/50">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Long Description</span>
                <span className="evidence-badge">AI Generated</span>
              </div>
              <p className="text-sm">{listingOutput.longDescription}</p>
            </div>

            <div className="p-4 rounded-lg bg-secondary/50">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Structured Fields</span>
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
            <DialogTitle>Export Bundle</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">Choose a portal preset:</p>
            {['Generic', 'ImmoScout24', 'Kleinanzeigen'].map((preset) => (
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
            Generate Export
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
