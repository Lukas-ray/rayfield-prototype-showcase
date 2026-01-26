import { useState } from 'react';
import { AlertCircle, Check, Link2, Play, ExternalLink, CheckCircle2, Image, FileText, Zap, Eye, AlertTriangle, Video, ChevronLeft, ChevronRight } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { PlatformLogo } from '@/components/ui/PlatformLogo';

import propertyLivingRoom from '@/assets/property-living-room.jpg';
import propertyKitchen from '@/assets/property-kitchen.jpg';
import propertyBedroom from '@/assets/property-bedroom.jpg';
import propertyBathroom from '@/assets/property-bathroom.jpg';
import propertyBalcony from '@/assets/property-balcony.jpg';
import propertyExterior from '@/assets/property-exterior.jpg';

interface ChannelConfig {
  id: string;
  name: string;
  platform: string;
  status: 'ready' | 'incomplete' | 'connected' | 'disconnected';
  publishStatus: 'online' | 'draft' | 'not_connected';
  fieldsTotal: number;
  fieldsMapped: number;
  missingFields: string[];
  format: { width: number; height: number; label: string };
  lastPublished?: string;
  mediaCount: { photos: number; videos: number };
}

// Sample media for channels
const channelMedia = [
  propertyLivingRoom,
  propertyKitchen,
  propertyBedroom,
  propertyBathroom,
  propertyBalcony,
  propertyExterior,
];

const channels: ChannelConfig[] = [
  { 
    id: 'immoscout', 
    name: 'ImmoScout24', 
    platform: 'immoscout24',
    status: 'ready',
    publishStatus: 'online',
    fieldsTotal: 42,
    fieldsMapped: 42,
    missingFields: [],
    format: { width: 1200, height: 800, label: '3:2' },
    lastPublished: '12.01.2024',
    mediaCount: { photos: 12, videos: 1 },
  },
  { 
    id: 'immowelt', 
    name: 'Immowelt', 
    platform: 'immowelt',
    status: 'ready',
    publishStatus: 'draft',
    fieldsTotal: 38,
    fieldsMapped: 38,
    missingFields: [],
    format: { width: 1024, height: 768, label: '4:3' },
    mediaCount: { photos: 10, videos: 0 },
  },
  { 
    id: 'kleinanzeigen', 
    name: 'Kleinanzeigen', 
    platform: 'kleinanzeigen',
    status: 'incomplete',
    publishStatus: 'draft',
    fieldsTotal: 28,
    fieldsMapped: 25,
    missingFields: ['Energieausweis-Nr.', 'Garage-Stellplätze', 'Baujahr Heizung'],
    format: { width: 1200, height: 900, label: '4:3' },
    mediaCount: { photos: 8, videos: 0 },
  },
  { 
    id: 'website', 
    name: 'Eigene Website', 
    platform: 'website',
    status: 'ready',
    publishStatus: 'online',
    fieldsTotal: 50,
    fieldsMapped: 50,
    missingFields: [],
    format: { width: 1920, height: 1080, label: '16:9' },
    lastPublished: '15.01.2024',
    mediaCount: { photos: 15, videos: 2 },
  },
];

const validationErrors = [
  { type: 'error', field: 'Energieausweis-Nummer', message: 'Pflichtfeld für alle Portale', channels: ['kleinanzeigen'] },
  { type: 'warning', field: 'Wohnfläche', message: 'Abweichung: Dokument 87m² vs. Scan 85m²', channels: ['all'] },
  { type: 'warning', field: 'Baujahr Heizung', message: 'Empfohlen für Kleinanzeigen', channels: ['kleinanzeigen'] },
];

// Channel Card Component with Media Preview
interface ChannelCardProps {
  channel: ChannelConfig;
  isSelected: boolean;
  onSelect: () => void;
  onPublish: () => void;
  onPreview: () => void;
  media: string[];
}

function ChannelCard({ channel, isSelected, onSelect, onPublish, onPreview, media }: ChannelCardProps) {
  const [mediaIndex, setMediaIndex] = useState(0);
  
  const getPublishStatusBadge = () => {
    switch (channel.publishStatus) {
      case 'online':
        return (
          <Badge className="bg-success/10 text-success border-success/20 gap-1">
            <CheckCircle2 className="h-3 w-3" />
            Bereits online
          </Badge>
        );
      case 'draft':
        return (
          <Badge className="bg-muted text-muted-foreground border gap-1">
            <Play className="h-3 w-3" />
            Posten
          </Badge>
        );
      case 'not_connected':
        return (
          <Badge className="bg-warning/10 text-warning border-warning/20 gap-1">
            <Link2 className="h-3 w-3" />
            Connect Platform
          </Badge>
        );
    }
  };

  const getAspectRatioClass = () => {
    switch (channel.format.label) {
      case '16:9': return 'aspect-video';
      case '4:3': return 'aspect-[4/3]';
      case '3:2': return 'aspect-[3/2]';
      default: return 'aspect-video';
    }
  };

  return (
    <Card 
      className={cn(
        "transition-all cursor-pointer overflow-hidden",
        isSelected && "ring-2 ring-accent",
        channel.status === 'ready' && "border-success/30 hover:border-success/50",
        channel.status === 'incomplete' && "border-warning/30 hover:border-warning/50"
      )}
      onClick={onSelect}
    >
      <CardContent className="p-4">
        <div className="flex gap-4">
          {/* Media Preview Section */}
          <div className="flex-shrink-0 w-48">
            <div className={cn("relative rounded-lg overflow-hidden bg-muted", getAspectRatioClass())}>
              <img 
                src={media[mediaIndex % media.length]} 
                alt={`Bild ${mediaIndex + 1}`}
                className="w-full h-full object-cover"
              />
              
              {/* Navigation Arrows */}
              <div className="absolute inset-0 flex items-center justify-between px-1">
                <Button
                  size="icon"
                  variant="secondary"
                  className="h-6 w-6 rounded-full bg-black/50 hover:bg-black/70 text-white"
                  onClick={(e) => {
                    e.stopPropagation();
                    setMediaIndex((prev) => (prev - 1 + media.length) % media.length);
                  }}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  size="icon"
                  variant="secondary"
                  className="h-6 w-6 rounded-full bg-black/50 hover:bg-black/70 text-white"
                  onClick={(e) => {
                    e.stopPropagation();
                    setMediaIndex((prev) => (prev + 1) % media.length);
                  }}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>

              {/* Format Badge */}
              <div className="absolute top-2 left-2">
                <Badge className="bg-black/60 text-white border-0 text-[10px] px-1.5 py-0.5">
                  {channel.format.label}
                </Badge>
              </div>

              {/* Media Count */}
              <div className="absolute bottom-2 right-2 flex gap-1">
                <Badge className="bg-black/60 text-white border-0 text-[10px] px-1.5 py-0.5 gap-1">
                  <Image className="h-3 w-3" />
                  {channel.mediaCount.photos}
                </Badge>
                {channel.mediaCount.videos > 0 && (
                  <Badge className="bg-black/60 text-white border-0 text-[10px] px-1.5 py-0.5 gap-1">
                    <Video className="h-3 w-3" />
                    {channel.mediaCount.videos}
                  </Badge>
                )}
              </div>

              {/* Publish Status Overlay */}
              <div className="absolute top-2 right-2">
                {getPublishStatusBadge()}
              </div>
            </div>

            {/* Thumbnail Strip */}
            <div className="flex gap-1 mt-2">
              {media.slice(0, 4).map((img, idx) => (
                <button
                  key={idx}
                  onClick={(e) => {
                    e.stopPropagation();
                    setMediaIndex(idx);
                  }}
                  className={cn(
                    "w-10 h-7 rounded overflow-hidden border-2 transition-all",
                    idx === mediaIndex ? "border-accent" : "border-transparent opacity-60 hover:opacity-100"
                  )}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
              {media.length > 4 && (
                <div className="w-10 h-7 rounded bg-muted flex items-center justify-center text-[10px] text-muted-foreground">
                  +{media.length - 4}
                </div>
              )}
            </div>
          </div>

          {/* Channel Info Section */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <PlatformLogo platform={channel.platform} size="md" />
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-medium">{channel.name}</p>
                    {channel.status === 'ready' && (
                      <Badge className="bg-success/10 text-success border-success/20">
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        Bereit
                      </Badge>
                    )}
                    {channel.status === 'incomplete' && (
                      <Badge className="bg-warning/10 text-warning border-warning/20">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        {channel.missingFields.length} fehlen
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-3 mt-1">
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <FileText className="h-3 w-3" />
                      {channel.fieldsMapped}/{channel.fieldsTotal} Felder
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      {channel.format.width} x {channel.format.height}
                    </div>
                    {channel.lastPublished && (
                      <span className="text-xs text-muted-foreground">
                        Zuletzt: {channel.lastPublished}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={(e) => { e.stopPropagation(); onPreview(); }}
                >
                  <Eye className="h-4 w-4 mr-1" />
                  Vorschau
                </Button>
                {channel.publishStatus === 'online' ? (
                  <Button 
                    size="sm"
                    variant="secondary"
                    onClick={(e) => { e.stopPropagation(); }}
                  >
                    <ExternalLink className="h-4 w-4 mr-1" />
                    Ansehen
                  </Button>
                ) : channel.publishStatus === 'not_connected' ? (
                  <Button 
                    size="sm"
                    variant="outline"
                    onClick={(e) => { e.stopPropagation(); }}
                  >
                    <Link2 className="h-4 w-4 mr-1" />
                    Verbinden
                  </Button>
                ) : (
                  <Button 
                    size="sm"
                    disabled={channel.status === 'incomplete'}
                    onClick={(e) => { e.stopPropagation(); onPublish(); }}
                  >
                    <Play className="h-4 w-4 mr-1" />
                    Veröffentlichen
                  </Button>
                )}
              </div>
            </div>

            {/* Missing fields for incomplete channels */}
            {channel.missingFields.length > 0 && (
              <div className="mt-3 pt-3 border-t">
                <p className="text-xs text-warning mb-2">Fehlende Pflichtfelder:</p>
                <div className="flex flex-wrap gap-2">
                  {channel.missingFields.map((field, i) => (
                    <Badge key={i} variant="secondary" className="text-xs">
                      {field}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function Publishing() {
  const { toast } = useToast();
  const [integrationDialogOpen, setIntegrationDialogOpen] = useState(false);
  const [selectedChannel, setSelectedChannel] = useState<ChannelConfig | null>(null);
  const [previewChannel, setPreviewChannel] = useState<string>('immoscout');

  const totalFields = channels.reduce((sum, c) => sum + c.fieldsTotal, 0);
  const mappedFields = channels.reduce((sum, c) => sum + c.fieldsMapped, 0);
  const mappingPercent = Math.round((mappedFields / totalFields) * 100);

  const readyChannels = channels.filter(c => c.status === 'ready').length;
  const errorCount = validationErrors.filter(e => e.type === 'error').length;

  const handleConnect = (channel: ChannelConfig) => {
    setSelectedChannel(channel);
    setIntegrationDialogOpen(true);
  };

  const handlePublish = (channelId: string) => {
    const channel = channels.find(c => c.id === channelId);
    if (channel?.missingFields.length) {
      toast({
        title: 'Fehlende Pflichtfelder',
        description: `Bitte ${channel.missingFields.join(', ')} ergänzen.`,
        variant: 'destructive',
      });
      return;
    }
    toast({
      title: 'Veröffentlichung gestartet',
      description: `Inserat an ${channel?.name} gesendet.`,
    });
  };

  const handlePublishAll = () => {
    const readyToPublish = channels.filter(c => c.status === 'ready');
    if (errorCount > 0) {
      toast({
        title: 'Validierungsfehler',
        description: 'Bitte beheben Sie zuerst die Pflichtfehler.',
        variant: 'destructive',
      });
      return;
    }
    toast({
      title: 'Multi-Channel Veröffentlichung',
      description: `Inserat an ${readyToPublish.length} Kanäle gesendet.`,
    });
  };

  return (
    <AppLayout>
      <div className="max-w-6xl mx-auto">
        {/* Header with Auto-Mapping Indicator */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Publishing</h1>
            <p className="text-muted-foreground">Einmal erstellen, überall veröffentlichen</p>
          </div>
          <div className="flex items-center gap-4">
            {/* Auto-mapping success indicator */}
            <div className="flex items-center gap-3 px-4 py-2 rounded-lg bg-success/10 border border-success/20">
              <Zap className="h-5 w-5 text-success" />
              <div>
                <p className="text-sm font-medium text-success">{mappingPercent}% automatisch gemappt</p>
                <p className="text-xs text-muted-foreground">{channels.reduce((s, c) => s + c.missingFields.length, 0)} Felder fehlen</p>
              </div>
            </div>
            <Button 
              onClick={handlePublishAll} 
              disabled={errorCount > 0}
              size="lg"
              className="gap-2"
            >
              <Play className="h-5 w-5" />
              An {readyChannels} Kanäle veröffentlichen
            </Button>
          </div>
        </div>

        {/* Validation Errors - Before Publish */}
        {validationErrors.length > 0 && (
          <Card className="mb-6 border-warning/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-warning" />
                Validierung vor Veröffentlichung
                <Badge variant="secondary">{validationErrors.length} Hinweise</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {validationErrors.map((error, i) => (
                  <div 
                    key={i} 
                    className={cn(
                      "flex items-center justify-between p-3 rounded-lg",
                      error.type === 'error' ? "bg-destructive/10 border border-destructive/20" : "bg-warning/10 border border-warning/20"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      {error.type === 'error' ? (
                        <AlertCircle className="h-4 w-4 text-destructive" />
                      ) : (
                        <AlertTriangle className="h-4 w-4 text-warning" />
                      )}
                      <div>
                        <p className="text-sm font-medium">{error.field}</p>
                        <p className="text-xs text-muted-foreground">{error.message}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {error.channels[0] !== 'all' && (
                        <Badge variant="secondary" className="text-xs">
                          {error.channels.join(', ')}
                        </Badge>
                      )}
                      <Button size="sm" variant="outline">Beheben</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-3 gap-6">
          {/* Channel Checklist with Media Preview */}
          <div className="col-span-2 space-y-4">
            <h2 className="font-semibold">Kanal-Checkliste</h2>
            {channels.map((channel) => (
              <ChannelCard 
                key={channel.id}
                channel={channel}
                isSelected={previewChannel === channel.id}
                onSelect={() => setPreviewChannel(channel.id)}
                onPublish={() => handlePublish(channel.id)}
                onPreview={() => setPreviewChannel(channel.id)}
                media={channelMedia}
              />
            ))}
          </div>

          {/* Preview per Channel */}
          <div className="space-y-4">
            <h2 className="font-semibold">Kanal-Vorschau</h2>
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <PlatformLogo platform={channels.find(c => c.id === previewChannel)?.platform || 'immoscout24'} size="sm" />
                    {channels.find(c => c.id === previewChannel)?.name}
                  </CardTitle>
                  <Badge variant="secondary" className="text-xs">
                    {channels.find(c => c.id === previewChannel)?.format.label}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                {/* Preview mockup */}
                <div className="aspect-[4/3] rounded-lg bg-muted mb-4 flex items-center justify-center border">
                  <div className="text-center p-4">
                    <Image className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">Inserat-Vorschau</p>
                    <p className="text-xs text-muted-foreground">
                      {channels.find(c => c.id === previewChannel)?.format.width} x {channels.find(c => c.id === previewChannel)?.format.height}
                    </p>
                  </div>
                </div>
                
                {/* Quick field preview */}
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Titel</span>
                    <span className="font-medium truncate ml-2">3-Zi Altbau Schwabing</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Preis</span>
                    <span className="font-medium">685.000 €</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Fläche</span>
                    <span className="font-medium">85 m²</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Listing Form */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Inserats-Daten</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <Label htmlFor="title" className="text-xs">Titel</Label>
                  <Input
                    id="title"
                    defaultValue="Lichtdurchflutete 3-Zimmer Altbauwohnung"
                    className="mt-1 h-8 text-sm"
                  />
                </div>
                <div>
                  <Label htmlFor="price" className="text-xs">Preis</Label>
                  <Input id="price" defaultValue="685.000 €" className="mt-1 h-8 text-sm" />
                </div>
                <Button size="sm" variant="outline" className="w-full">
                  Alle Felder bearbeiten
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Integration Dialog */}
      <Dialog open={integrationDialogOpen} onOpenChange={setIntegrationDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Mit {selectedChannel?.name} verbinden</DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <p className="text-sm text-muted-foreground">
              Stub-Integration für Demo-Zwecke.
            </p>
          </div>
          <Button onClick={() => {
            setIntegrationDialogOpen(false);
            toast({
              title: 'Verbindung simuliert',
              description: 'Audit-Eintrag protokolliert.',
            });
          }} className="w-full">
            Verbindung simulieren
          </Button>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}
