import { useState } from 'react';
import { Download, Image, Video, Box, LayoutGrid, Share2, Send, Check, ExternalLink, Instagram, Youtube, Facebook, Linkedin } from 'lucide-react';
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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const typeIcons = {
  photo: Image,
  video: Video,
  '3d_tour': Box,
  floor_plan: LayoutGrid,
};

interface SocialAccount {
  id: string;
  name: string;
  platform: string;
  icon: React.ComponentType<{ className?: string }>;
  connected: boolean;
  handle: string;
}

interface PlatformAccount {
  id: string;
  name: string;
  logo: string;
  connected: boolean;
  lastSync?: string;
}

const socialAccounts: SocialAccount[] = [
  { id: '1', name: 'Instagram', platform: 'instagram', icon: Instagram, connected: true, handle: '@rayfield_immobilien' },
  { id: '2', name: 'YouTube', platform: 'youtube', icon: Youtube, connected: true, handle: 'Rayfield Immobilien' },
  { id: '3', name: 'Facebook', platform: 'facebook', icon: Facebook, connected: false, handle: '' },
  { id: '4', name: 'LinkedIn', platform: 'linkedin', icon: Linkedin, connected: true, handle: 'Rayfield GmbH' },
];

const platformAccounts: PlatformAccount[] = [
  { id: '1', name: 'ImmoScout24', logo: '🏠', connected: true, lastSync: 'Vor 2 Stunden' },
  { id: '2', name: 'Immowelt', logo: '🌍', connected: true, lastSync: 'Vor 5 Stunden' },
  { id: '3', name: 'Kleinanzeigen', logo: '📢', connected: false },
  { id: '4', name: 'Immonet', logo: '🏢', connected: false },
];

export function MediaTab() {
  const { toast } = useToast();
  const [activeSection, setActiveSection] = useState<'overview' | 'social' | 'platforms'>('overview');
  const [exportDialogOpen, setExportDialogOpen] = useState(false);
  const [postDialogOpen, setPostDialogOpen] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);
  const [selectedSocial, setSelectedSocial] = useState<string | null>(null);
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);

  const photos = mediaItems.filter(m => m.type === 'photo');
  const videos = mediaItems.filter(m => m.type === 'video');
  const tours = mediaItems.filter(m => m.type === '3d_tour');
  const floorPlans = mediaItems.filter(m => m.type === 'floor_plan');

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

  const handleSocialPost = (platform: string) => {
    setSelectedSocial(platform);
    setPostDialogOpen(true);
  };

  const handlePlatformPublish = (platform: string) => {
    setSelectedPlatform(platform);
    toast({
      title: 'Veröffentlichung gestartet',
      description: `Inserat wird auf ${platform} veröffentlicht...`,
    });
    setTimeout(() => {
      toast({
        title: 'Erfolgreich veröffentlicht',
        description: `Inserat ist jetzt auf ${platform} live.`,
      });
    }, 2000);
  };

  const confirmSocialPost = () => {
    setPostDialogOpen(false);
    toast({
      title: 'Beitrag geplant',
      description: `Beitrag wird auf ${selectedSocial} veröffentlicht.`,
    });
    setSelectedSocial(null);
  };

  return (
    <div className="space-y-6">
      {/* Section Tabs */}
      <Tabs value={activeSection} onValueChange={(v) => setActiveSection(v as typeof activeSection)}>
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="overview" className="gap-2">
              <Image className="h-4 w-4" />
              Medienübersicht
            </TabsTrigger>
            <TabsTrigger value="social" className="gap-2">
              <Share2 className="h-4 w-4" />
              Social Media
            </TabsTrigger>
            <TabsTrigger value="platforms" className="gap-2">
              <ExternalLink className="h-4 w-4" />
              Plattform-Konten
            </TabsTrigger>
          </TabsList>
          <Button variant="outline" onClick={() => setExportDialogOpen(true)} className="gap-2">
            <Download className="h-4 w-4" />
            Bundle exportieren
          </Button>
        </div>

        {/* Overview Tab - Media derived from 3D Scan */}
        <TabsContent value="overview" className="mt-6 space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Box className="h-5 w-5 text-accent" />
                  Aus 3D-Scan abgeleitet
                </CardTitle>
                <Badge variant="secondary">Automatisch generiert</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Photos Section */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium flex items-center gap-2">
                    <Image className="h-4 w-4" />
                    Fotos ({photos.length})
                  </h4>
                </div>
                <div className="grid grid-cols-4 gap-3">
                  {photos.map((item) => (
                    <div key={item.id} className="workspace-card p-2 group">
                      <div className="aspect-video rounded-md overflow-hidden bg-muted relative">
                        <img src={item.url} alt={item.name} className="w-full h-full object-cover" />
                        {item.status === 'processing' && (
                          <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
                            <span className="text-xs font-medium text-muted-foreground">Wird verarbeitet...</span>
                          </div>
                        )}
                      </div>
                      <p className="mt-2 text-sm font-medium truncate">{item.name}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Videos Section */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium flex items-center gap-2">
                    <Video className="h-4 w-4" />
                    Videos ({videos.length})
                  </h4>
                </div>
                <div className="grid grid-cols-4 gap-3">
                  {videos.map((item) => (
                    <div key={item.id} className="workspace-card p-2 group">
                      <div className="aspect-video rounded-md overflow-hidden bg-muted relative flex items-center justify-center">
                        <Video className="h-8 w-8 text-muted-foreground" />
                      </div>
                      <p className="mt-2 text-sm font-medium truncate">{item.name}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* 3D Tours & Floor Plans */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium flex items-center gap-2">
                      <Box className="h-4 w-4" />
                      3D-Touren ({tours.length})
                    </h4>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {tours.map((item) => (
                      <div key={item.id} className="workspace-card p-2 group">
                        <div className="aspect-video rounded-md overflow-hidden bg-muted relative flex items-center justify-center">
                          <Box className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <p className="mt-2 text-sm font-medium truncate">{item.name}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium flex items-center gap-2">
                      <LayoutGrid className="h-4 w-4" />
                      Grundrisse ({floorPlans.length})
                    </h4>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {floorPlans.map((item) => (
                      <div key={item.id} className="workspace-card p-2 group">
                        <div className="aspect-video rounded-md overflow-hidden bg-muted relative flex items-center justify-center">
                          <LayoutGrid className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <p className="mt-2 text-sm font-medium truncate">{item.name}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Social Media Tab */}
        <TabsContent value="social" className="mt-6 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Social Media Konten</CardTitle>
              <p className="text-sm text-muted-foreground">Veröffentlichen Sie Inhalte direkt auf Ihren Social-Media-Kanälen</p>
            </CardHeader>
            <CardContent className="space-y-3">
              {socialAccounts.map((account) => {
                const Icon = account.icon;
                return (
                  <div
                    key={account.id}
                    className={cn(
                      'flex items-center justify-between p-4 rounded-lg border transition-colors',
                      account.connected ? 'bg-secondary/30 border-border' : 'bg-muted/30 border-dashed'
                    )}
                  >
                    <div className="flex items-center gap-4">
                      <div className={cn(
                        'w-10 h-10 rounded-full flex items-center justify-center',
                        account.connected ? 'bg-accent/10 text-accent' : 'bg-muted text-muted-foreground'
                      )}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium">{account.name}</p>
                        {account.connected ? (
                          <p className="text-sm text-muted-foreground">{account.handle}</p>
                        ) : (
                          <p className="text-sm text-muted-foreground">Nicht verbunden</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {account.connected ? (
                        <>
                          <Badge variant="outline" className="text-green-600 border-green-600">
                            <Check className="h-3 w-3 mr-1" />
                            Verbunden
                          </Badge>
                          <Button size="sm" onClick={() => handleSocialPost(account.name)} className="gap-2">
                            <Send className="h-4 w-4" />
                            Jetzt posten
                          </Button>
                        </>
                      ) : (
                        <Button variant="outline" size="sm">
                          Verbinden
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Platform Accounts Tab */}
        <TabsContent value="platforms" className="mt-6 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Immobilien-Plattformen</CardTitle>
              <p className="text-sm text-muted-foreground">Veröffentlichen Sie Inserate direkt auf Immobilienportalen</p>
            </CardHeader>
            <CardContent className="space-y-3">
              {platformAccounts.map((platform) => (
                <div
                  key={platform.id}
                  className={cn(
                    'flex items-center justify-between p-4 rounded-lg border transition-colors',
                    platform.connected ? 'bg-secondary/30 border-border' : 'bg-muted/30 border-dashed'
                  )}
                >
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      'w-10 h-10 rounded-lg flex items-center justify-center text-xl',
                      platform.connected ? 'bg-accent/10' : 'bg-muted'
                    )}>
                      {platform.logo}
                    </div>
                    <div>
                      <p className="font-medium">{platform.name}</p>
                      {platform.connected && platform.lastSync ? (
                        <p className="text-sm text-muted-foreground">Letzte Sync: {platform.lastSync}</p>
                      ) : (
                        <p className="text-sm text-muted-foreground">Nicht verbunden</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {platform.connected ? (
                      <>
                        <Badge variant="outline" className="text-green-600 border-green-600">
                          <Check className="h-3 w-3 mr-1" />
                          Verbunden
                        </Badge>
                        <Button size="sm" onClick={() => handlePlatformPublish(platform.name)} className="gap-2">
                          <ExternalLink className="h-4 w-4" />
                          Veröffentlichen
                        </Button>
                      </>
                    ) : (
                      <Button variant="outline" size="sm">
                        Verbinden
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Social Post Dialog */}
      <Dialog open={postDialogOpen} onOpenChange={setPostDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Auf {selectedSocial} posten</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-secondary/50">
              <p className="text-sm font-medium mb-2">Vorschau</p>
              <div className="aspect-video rounded-md bg-muted flex items-center justify-center mb-3">
                <Image className="h-8 w-8 text-muted-foreground" />
              </div>
              <p className="text-sm">🏠 Neue Immobilie in Berlin-Mitte! Lichtdurchflutete 3-Zimmer Altbauwohnung mit Balkon. Jetzt Besichtigung vereinbaren! #immobilien #berlin #wohnung</p>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Check className="h-4 w-4 text-green-600" />
              <span>Inhalte werden automatisch für {selectedSocial} optimiert</span>
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <Button variant="outline" className="flex-1" onClick={() => setPostDialogOpen(false)}>
              Abbrechen
            </Button>
            <Button className="flex-1 gap-2" onClick={confirmSocialPost}>
              <Send className="h-4 w-4" />
              Jetzt veröffentlichen
            </Button>
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
