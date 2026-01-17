import { useState } from 'react';
import { Download, Image, Video, Box, LayoutGrid, Share2, Send, Check, ExternalLink, Instagram, Youtube, Facebook, Linkedin, Eye, Edit3, ArrowRight, Clock, ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { mediaItems } from '@/data/dummyData';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

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
  url?: string;
}

const socialAccounts: SocialAccount[] = [
  { id: '1', name: 'Instagram', platform: 'instagram', icon: Instagram, connected: true, handle: '@rayfield_immobilien' },
  { id: '2', name: 'YouTube', platform: 'youtube', icon: Youtube, connected: true, handle: 'Rayfield Immobilien' },
  { id: '3', name: 'Facebook', platform: 'facebook', icon: Facebook, connected: false, handle: '' },
  { id: '4', name: 'LinkedIn', platform: 'linkedin', icon: Linkedin, connected: true, handle: 'Rayfield GmbH' },
];

const platformAccounts: PlatformAccount[] = [
  { id: '1', name: 'ImmoScout24', logo: '🏠', connected: true, lastSync: 'Vor 2 Stunden', url: 'https://www.immobilienscout24.de' },
  { id: '2', name: 'Immowelt', logo: '🌍', connected: true, lastSync: 'Vor 5 Stunden', url: 'https://www.immowelt.de' },
  { id: '3', name: 'Kleinanzeigen', logo: '📢', connected: false, url: 'https://www.kleinanzeigen.de' },
  { id: '4', name: 'Immonet', logo: '🏢', connected: false, url: 'https://www.immonet.de' },
];

const defaultPostTexts: Record<string, string> = {
  Instagram: '🏠 Neue Immobilie in München-Schwabing!\n\nLichtdurchflutete 3-Zimmer Altbauwohnung mit Balkon und Stuck.\n\n✨ 85 m² Wohnfläche\n🛏️ 3 Zimmer\n🌳 Ruhige Lage nahe Englischer Garten\n\nJetzt Besichtigung vereinbaren! Link in Bio.\n\n#immobilien #münchen #wohnung #altbau #schwabing',
  YouTube: '🏠 Exklusive Wohnungsbesichtigung: 3-Zimmer Altbau in München-Schwabing\n\nIn diesem Video zeigen wir Ihnen eine wunderschöne Altbauwohnung im Herzen von München. Mit 85 m², hohen Decken und originalem Stuck ist diese Wohnung ein echtes Schmuckstück.\n\n⏱️ Kapitel:\n0:00 Einführung\n0:30 Wohnzimmer\n1:45 Küche\n2:30 Schlafzimmer\n3:15 Bad\n4:00 Balkon\n\nKontaktieren Sie uns für eine Besichtigung!',
  LinkedIn: '🏠 Neues Objekt im Portfolio: Exklusive Altbauwohnung in München-Schwabing\n\nWir freuen uns, eine außergewöhnliche 3-Zimmer Wohnung in einer der begehrtesten Lagen Münchens präsentieren zu dürfen.\n\nHighlights:\n• 85 m² Wohnfläche\n• Originalstuck und Dielenboden\n• Balkon mit Südausrichtung\n• Nähe zum Englischen Garten\n\nFür weitere Informationen kontaktieren Sie unser Team.\n\n#Immobilien #München #RealEstate #Investment',
};

export function MediaTab() {
  const { toast } = useToast();
  const [activeSection, setActiveSection] = useState<'overview' | 'social' | 'platforms'>('overview');
  const [exportDialogOpen, setExportDialogOpen] = useState(false);
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);
  const [selectedSocial, setSelectedSocial] = useState<SocialAccount | null>(null);
  const [selectedPlatform, setSelectedPlatform] = useState<PlatformAccount | null>(null);
  const [platformPreviewOpen, setPlatformPreviewOpen] = useState(false);
  const [postText, setPostText] = useState('');
  const [selectedMedia, setSelectedMedia] = useState<string[]>(['hero_1', 'hero_2']);
  const [postStep, setPostStep] = useState<'preview' | 'ready'>('preview');

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

  const handleSocialPost = (account: SocialAccount) => {
    setSelectedSocial(account);
    setPostText(defaultPostTexts[account.name] || '');
    setPostStep('preview');
    setPreviewDialogOpen(true);
  };

  const handlePlatformPublish = (platform: PlatformAccount) => {
    setSelectedPlatform(platform);
    setPlatformPreviewOpen(true);
  };

  const confirmSocialPost = () => {
    if (postStep === 'preview') {
      setPostStep('ready');
      return;
    }
    
    setPreviewDialogOpen(false);
    toast({
      title: 'Beitrag veröffentlicht',
      description: `Beitrag wurde erfolgreich auf ${selectedSocial?.name} veröffentlicht.`,
    });
    setSelectedSocial(null);
    setPostStep('preview');
  };

  const openPlatformDirect = () => {
    if (selectedSocial) {
      toast({
        title: 'Weiterleitung',
        description: `Sie werden zu ${selectedSocial.name} weitergeleitet. Alle Inhalte wurden in die Zwischenablage kopiert.`,
      });
      setPreviewDialogOpen(false);
      setSelectedSocial(null);
      setPostStep('preview');
    }
  };

  const confirmPlatformPublish = () => {
    setPlatformPreviewOpen(false);
    toast({
      title: 'Veröffentlichung gestartet',
      description: `Inserat wird auf ${selectedPlatform?.name} veröffentlicht...`,
    });
    setTimeout(() => {
      toast({
        title: 'Erfolgreich veröffentlicht',
        description: `Inserat ist jetzt auf ${selectedPlatform?.name} live.`,
      });
    }, 2000);
    setSelectedPlatform(null);
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
                  {photos.map((item, idx) => (
                    <div key={item.id} className="workspace-card p-2 group">
                      <div className="aspect-video rounded-md overflow-hidden bg-muted relative">
                        <img 
                          src="/placeholder.svg"
                          alt={item.name} 
                          className="w-full h-full object-cover" 
                        />
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
                  {videos.map((item, idx) => (
                    <div key={item.id} className="workspace-card p-2 group">
                      <div className="aspect-video rounded-md overflow-hidden bg-muted relative">
                        <img 
                          src="/placeholder.svg"
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                          <div className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center">
                            <div className="w-0 h-0 border-l-[12px] border-l-foreground border-y-[7px] border-y-transparent ml-1"></div>
                          </div>
                        </div>
                        <div className="absolute bottom-1 right-1 bg-black/70 text-white text-xs px-1 rounded">
                          2:34
                        </div>
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
                    {tours.map((item, idx) => (
                      <div key={item.id} className="workspace-card p-2 group">
                        <div className="aspect-video rounded-md overflow-hidden bg-gradient-to-br from-accent/20 to-primary/20 relative flex items-center justify-center">
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="text-center">
                              <Box className="h-8 w-8 text-accent mx-auto mb-1" />
                              <span className="text-xs font-medium text-muted-foreground">360° Tour</span>
                            </div>
                          </div>
                          <div className="absolute top-2 right-2">
                            <Badge variant="secondary" className="text-xs">Interaktiv</Badge>
                          </div>
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
                    {floorPlans.map((item, idx) => (
                      <div key={item.id} className="workspace-card p-2 group">
                        <div className="aspect-video rounded-md overflow-hidden bg-muted relative p-3">
                          {/* Simplified floor plan placeholder */}
                          <svg viewBox="0 0 100 60" className="w-full h-full text-muted-foreground/50">
                            <rect x="5" y="5" width="40" height="25" fill="none" stroke="currentColor" strokeWidth="1"/>
                            <rect x="50" y="5" width="45" height="50" fill="none" stroke="currentColor" strokeWidth="1"/>
                            <rect x="5" y="35" width="40" height="20" fill="none" stroke="currentColor" strokeWidth="1"/>
                            <line x1="25" y1="5" x2="25" y2="0" stroke="currentColor" strokeWidth="1"/>
                            <line x1="72" y1="55" x2="72" y2="60" stroke="currentColor" strokeWidth="1"/>
                            <text x="25" y="18" fontSize="6" fill="currentColor" textAnchor="middle">Wohnen</text>
                            <text x="72" y="30" fontSize="6" fill="currentColor" textAnchor="middle">Schlafzimmer</text>
                            <text x="25" y="47" fontSize="5" fill="currentColor" textAnchor="middle">Küche</text>
                          </svg>
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
                          <Button size="sm" onClick={() => handleSocialPost(account)} className="gap-2">
                            <Eye className="h-4 w-4" />
                            Vorschau & Posten
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
                        <Button size="sm" onClick={() => handlePlatformPublish(platform)} className="gap-2">
                          <Eye className="h-4 w-4" />
                          Vorschau & Veröffentlichen
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

      {/* Social Post Preview Dialog */}
      <Dialog open={previewDialogOpen} onOpenChange={setPreviewDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedSocial && <selectedSocial.icon className="h-5 w-5" />}
              Beitrag für {selectedSocial?.name}
            </DialogTitle>
            <DialogDescription>
              Überprüfen und bearbeiten Sie Ihren Beitrag vor der Veröffentlichung
            </DialogDescription>
          </DialogHeader>
          
          {postStep === 'preview' ? (
            <div className="grid grid-cols-2 gap-6">
              {/* Left: Edit Area */}
              <div className="space-y-4">
                {/* Media Selection */}
                <div>
                  <Label className="text-sm font-medium mb-2 block">Medien auswählen</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {photos.slice(0, 6).map((photo, idx) => (
                      <div 
                        key={photo.id}
                        className={cn(
                          "aspect-square rounded-lg overflow-hidden border-2 cursor-pointer transition-all",
                          selectedMedia.includes(photo.id) 
                            ? "border-accent ring-2 ring-accent/30" 
                            : "border-border opacity-60 hover:opacity-100"
                        )}
                        onClick={() => {
                          setSelectedMedia(prev => 
                            prev.includes(photo.id) 
                              ? prev.filter(id => id !== photo.id)
                              : [...prev, photo.id]
                          );
                        }}
                      >
                        <div className="w-full h-full relative">
                          <img 
                            src={`https://images.unsplash.com/photo-${1560448204 + idx * 1000}-e02fe7ec5bb9?w=200&h=200&fit=crop`}
                            alt={photo.name}
                            className="w-full h-full object-cover"
                          />
                          {selectedMedia.includes(photo.id) && (
                            <div className="absolute inset-0 bg-accent/20 flex items-center justify-center">
                              <div className="w-6 h-6 rounded-full bg-accent flex items-center justify-center">
                                <Check className="h-4 w-4 text-accent-foreground" />
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{selectedMedia.length} Medien ausgewählt</p>
                </div>

                {/* Post Text */}
                <div>
                  <Label className="text-sm font-medium mb-2 block">Beitragstext</Label>
                  <Textarea
                    value={postText}
                    onChange={(e) => setPostText(e.target.value)}
                    rows={8}
                    className="resize-none text-sm"
                    placeholder="Schreiben Sie Ihren Beitrag hier..."
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>{postText.length} Zeichen</span>
                    {selectedSocial?.name === 'Instagram' && postText.length > 2200 && (
                      <span className="text-destructive">Max. 2200 Zeichen</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Right: Live Preview */}
              <div className="space-y-3">
                <Label className="text-sm font-medium block">Live-Vorschau</Label>
                
                {/* Platform-specific Preview */}
                {selectedSocial?.name === 'Instagram' && (
                  <div className="border border-border rounded-xl overflow-hidden bg-background">
                    {/* Instagram Header */}
                    <div className="flex items-center gap-3 p-3 border-b border-border">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 flex items-center justify-center">
                        <div className="w-7 h-7 rounded-full bg-background flex items-center justify-center">
                          <span className="text-xs font-bold">R</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-semibold">rayfield_immobilien</p>
                        <p className="text-xs text-muted-foreground">Berlin, Germany</p>
                      </div>
                    </div>
                    {/* Image */}
                    <div className="aspect-square bg-muted relative">
                      <img 
                        src="https://images.unsplash.com/photo-1560448204-e02fe7ec5bb9?w=400&h=400&fit=crop"
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                      {selectedMedia.length > 1 && (
                        <div className="absolute top-3 right-3 bg-background/80 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-medium">
                          1/{selectedMedia.length}
                        </div>
                      )}
                    </div>
                    {/* Caption Preview */}
                    <div className="p-3">
                      <p className="text-sm line-clamp-3">
                        <span className="font-semibold">rayfield_immobilien</span>{' '}
                        {postText.slice(0, 100)}...
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">Vor 0 Minuten</p>
                    </div>
                  </div>
                )}

                {selectedSocial?.name === 'LinkedIn' && (
                  <div className="border border-border rounded-xl overflow-hidden bg-background">
                    {/* LinkedIn Header */}
                    <div className="flex items-center gap-3 p-3">
                      <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center">
                        <span className="text-lg font-bold text-accent">R</span>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold">Rayfield GmbH</p>
                        <p className="text-xs text-muted-foreground">1.234 Follower</p>
                        <p className="text-xs text-muted-foreground">Jetzt • 🌐</p>
                      </div>
                    </div>
                    {/* Content */}
                    <div className="px-3 pb-3">
                      <p className="text-sm line-clamp-4">{postText.slice(0, 150)}...</p>
                    </div>
                    {/* Image */}
                    <div className="aspect-video bg-muted">
                      <img 
                        src="https://images.unsplash.com/photo-1560448204-e02fe7ec5bb9?w=600&h=400&fit=crop"
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    {/* Reactions */}
                    <div className="p-3 border-t border-border flex items-center gap-2 text-xs text-muted-foreground">
                      <span>👍 ❤️ 💡</span>
                      <span>0 Reaktionen</span>
                    </div>
                  </div>
                )}

                {selectedSocial?.name === 'YouTube' && (
                  <div className="border border-border rounded-xl overflow-hidden bg-background">
                    {/* Video Thumbnail */}
                    <div className="aspect-video bg-muted relative">
                      <img 
                        src="https://images.unsplash.com/photo-1560448204-e02fe7ec5bb9?w=600&h=400&fit=crop"
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-16 h-16 rounded-full bg-red-600 flex items-center justify-center">
                          <div className="w-0 h-0 border-l-[20px] border-l-white border-y-[12px] border-y-transparent ml-1"></div>
                        </div>
                      </div>
                      <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-1 rounded">
                        4:32
                      </div>
                    </div>
                    {/* Video Info */}
                    <div className="p-3">
                      <p className="font-semibold text-sm line-clamp-2">
                        {postText.split('\n')[0] || 'Videotitel hier...'}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Rayfield Immobilien • 0 Aufrufe • Jetzt
                      </p>
                    </div>
                  </div>
                )}

                {/* Platform Tips */}
                <div className="p-3 rounded-lg bg-accent/5 border border-accent/20">
                  <p className="text-xs font-medium text-accent flex items-center gap-2">
                    <Check className="h-3 w-3" />
                    Optimiert für {selectedSocial?.name}
                  </p>
                  <ul className="text-xs text-muted-foreground mt-2 space-y-0.5">
                    {selectedSocial?.name === 'Instagram' && (
                      <>
                        <li>• Hashtags am Ende platziert</li>
                        <li>• Quadratisches Format verwendet</li>
                      </>
                    )}
                    {selectedSocial?.name === 'YouTube' && (
                      <>
                        <li>• Kapitelmarken eingefügt</li>
                        <li>• SEO-optimierter Titel</li>
                      </>
                    )}
                    {selectedSocial?.name === 'LinkedIn' && (
                      <>
                        <li>• Professioneller Tonfall</li>
                        <li>• Business-Hashtags integriert</li>
                      </>
                    )}
                  </ul>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Ready to post confirmation */}
              <div className="text-center py-6">
                <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-4">
                  <Check className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Beitrag ist bereit!</h3>
                <p className="text-muted-foreground">Ihr Beitrag wurde vorbereitet und kann jetzt veröffentlicht werden.</p>
              </div>

              {/* Summary */}
              <div className="p-4 rounded-lg bg-secondary/50 border border-border space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Plattform:</span>
                  <span className="font-medium flex items-center gap-2">
                    {selectedSocial && <selectedSocial.icon className="h-4 w-4" />}
                    {selectedSocial?.name}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Konto:</span>
                  <span className="font-medium">{selectedSocial?.handle}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Medien:</span>
                  <span className="font-medium">{selectedMedia.length} Dateien</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Textlänge:</span>
                  <span className="font-medium">{postText.length} Zeichen</span>
                </div>
              </div>

              {/* Preview Thumbnail */}
              <div className="flex items-center gap-4 p-4 rounded-lg border border-border">
                <img 
                  src="https://images.unsplash.com/photo-1560448204-e02fe7ec5bb9?w=100&h=100&fit=crop"
                  alt="Preview"
                  className="w-16 h-16 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <p className="text-sm font-medium line-clamp-1">{postText.split('\n')[0]}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {selectedMedia.length} Medien • {postText.length} Zeichen
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="flex gap-2 mt-4">
            {postStep === 'preview' ? (
              <>
                <Button variant="outline" className="flex-1" onClick={() => setPreviewDialogOpen(false)}>
                  Abbrechen
                </Button>
                <Button variant="outline" className="flex-1 gap-2" onClick={openPlatformDirect}>
                  <ExternalLink className="h-4 w-4" />
                  Direkt öffnen
                </Button>
                <Button className="flex-1 gap-2" onClick={confirmSocialPost}>
                  <ArrowRight className="h-4 w-4" />
                  Weiter zur Bestätigung
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" className="flex-1" onClick={() => setPostStep('preview')}>
                  <Edit3 className="h-4 w-4 mr-2" />
                  Zurück bearbeiten
                </Button>
                <Button className="flex-1 gap-2" onClick={confirmSocialPost}>
                  <Send className="h-4 w-4" />
                  Jetzt veröffentlichen
                </Button>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Platform Publish Preview Dialog */}
      <Dialog open={platformPreviewOpen} onOpenChange={setPlatformPreviewOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <span className="text-xl">{selectedPlatform?.logo}</span>
              Inserat auf {selectedPlatform?.name} veröffentlichen
            </DialogTitle>
            <DialogDescription>
              Überprüfen Sie die Daten vor der Veröffentlichung
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* Listing Preview */}
            <div className="p-4 rounded-lg border border-border">
              <div className="flex gap-4">
                <div className="w-32 h-24 rounded-lg overflow-hidden flex-shrink-0">
                  <img 
                    src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=200&h=150&fit=crop"
                    alt="Immobilie"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold">3-Zimmer Altbauwohnung mit Balkon</h4>
                  <p className="text-sm text-muted-foreground">Leopoldstraße 156, 80802 München-Schwabing</p>
                  <div className="flex gap-4 mt-2 text-sm">
                    <span>85 m²</span>
                    <span>3 Zimmer</span>
                    <span>€ 685.000</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Data Checklist */}
            <div className="space-y-2">
              <p className="text-sm font-medium">Daten-Check:</p>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: 'Grunddaten', status: 'ok' },
                  { label: 'Fotos (12)', status: 'ok' },
                  { label: 'Grundriss', status: 'ok' },
                  { label: 'Energieausweis', status: 'ok' },
                  { label: 'Beschreibung', status: 'ok' },
                  { label: 'Kontaktdaten', status: 'ok' },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-green-600" />
                    <span>{item.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Sync info */}
            <div className="p-3 rounded-lg bg-secondary/50 border border-border">
              <p className="text-sm flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span>Das Inserat wird sofort nach Bestätigung live geschaltet.</span>
              </p>
            </div>
          </div>

          <div className="flex gap-2 mt-4">
            <Button variant="outline" className="flex-1" onClick={() => setPlatformPreviewOpen(false)}>
              Abbrechen
            </Button>
            <Button variant="outline" className="flex-1 gap-2" onClick={() => {
              toast({
                title: 'Weiterleitung',
                description: `Sie werden zu ${selectedPlatform?.name} weitergeleitet.`,
              });
              setPlatformPreviewOpen(false);
            }}>
              <ExternalLink className="h-4 w-4" />
              Auf {selectedPlatform?.name} öffnen
            </Button>
            <Button className="flex-1 gap-2" onClick={confirmPlatformPublish}>
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
