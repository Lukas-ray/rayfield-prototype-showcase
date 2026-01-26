import { useState } from 'react';
import { AlertCircle, Check, Link2, Play, ExternalLink, CheckCircle2, Image, FileText, Zap, Eye, AlertTriangle, Video, ChevronLeft, ChevronRight, Settings, Unlink, RefreshCw, Clock, Send } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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

interface PlatformAccount {
  id: string;
  platform: string;
  name: string;
  accountName: string;
  accountHandle?: string;
  connected: boolean;
  status: 'online' | 'scheduled' | 'draft' | 'not_connected';
  lastPublished?: string;
  scheduledFor?: string;
  format: { width: number; height: number; label: string };
  mediaReady: { photos: number; videos: number };
  totalMedia: { photos: number; videos: number };
}

const platformAccounts: PlatformAccount[] = [
  {
    id: 'immoscout',
    platform: 'immoscout24',
    name: 'ImmoScout24',
    accountName: 'Rayfield Immobilien',
    accountHandle: 'rayfield_munich',
    connected: true,
    status: 'online',
    lastPublished: '12.01.2024',
    format: { width: 1200, height: 800, label: '3:2' },
    mediaReady: { photos: 12, videos: 1 },
    totalMedia: { photos: 12, videos: 1 },
  },
  {
    id: 'immowelt',
    platform: 'immowelt',
    name: 'Immowelt',
    accountName: 'Rayfield Immobilien',
    accountHandle: 'rayfield-immo',
    connected: true,
    status: 'draft',
    format: { width: 1024, height: 768, label: '4:3' },
    mediaReady: { photos: 10, videos: 0 },
    totalMedia: { photos: 10, videos: 0 },
  },
  {
    id: 'kleinanzeigen',
    platform: 'kleinanzeigen',
    name: 'Kleinanzeigen',
    accountName: 'Rayfield München',
    connected: true,
    status: 'scheduled',
    scheduledFor: '20.01.2024, 10:00',
    format: { width: 1200, height: 900, label: '4:3' },
    mediaReady: { photos: 8, videos: 0 },
    totalMedia: { photos: 8, videos: 0 },
  },
  {
    id: 'instagram',
    platform: 'instagram',
    name: 'Instagram',
    accountName: 'Rayfield Immobilien',
    accountHandle: '@rayfield_immo',
    connected: true,
    status: 'draft',
    format: { width: 1080, height: 1080, label: '1:1' },
    mediaReady: { photos: 6, videos: 1 },
    totalMedia: { photos: 8, videos: 2 },
  },
  {
    id: 'facebook',
    platform: 'facebook',
    name: 'Facebook',
    accountName: 'Rayfield Immobilien München',
    connected: false,
    status: 'not_connected',
    format: { width: 1200, height: 630, label: '1.91:1' },
    mediaReady: { photos: 0, videos: 0 },
    totalMedia: { photos: 8, videos: 1 },
  },
  {
    id: 'website',
    platform: 'website',
    name: 'Eigene Website',
    accountName: 'rayfield-immobilien.de',
    connected: true,
    status: 'online',
    lastPublished: '15.01.2024',
    format: { width: 1920, height: 1080, label: '16:9' },
    mediaReady: { photos: 15, videos: 2 },
    totalMedia: { photos: 15, videos: 2 },
  },
];

const channelMedia = [
  propertyLivingRoom,
  propertyKitchen,
  propertyBedroom,
  propertyBathroom,
  propertyBalcony,
  propertyExterior,
];

interface AccountCardProps {
  account: PlatformAccount;
  media: string[];
  onConnect: () => void;
  onPublish: () => void;
}

function AccountCard({ account, media, onConnect, onPublish }: AccountCardProps) {
  const [mediaIndex, setMediaIndex] = useState(0);

  const getStatusInfo = () => {
    switch (account.status) {
      case 'online':
        return {
          badge: <Badge className="bg-success text-success-foreground border-0 gap-1"><CheckCircle2 className="h-3 w-3" /> Online</Badge>,
          action: 'Aktualisieren',
          actionIcon: RefreshCw,
          actionVariant: 'secondary' as const,
        };
      case 'scheduled':
        return {
          badge: <Badge className="bg-info text-info-foreground border-0 gap-1"><Clock className="h-3 w-3" /> Geplant</Badge>,
          action: 'Bearbeiten',
          actionIcon: Settings,
          actionVariant: 'secondary' as const,
        };
      case 'draft':
        return {
          badge: <Badge className="bg-accent text-accent-foreground border-0 gap-1"><Send className="h-3 w-3" /> Bereit</Badge>,
          action: 'Jetzt posten',
          actionIcon: Play,
          actionVariant: 'default' as const,
        };
      case 'not_connected':
        return {
          badge: <Badge variant="outline" className="gap-1 text-muted-foreground"><Unlink className="h-3 w-3" /> Nicht verbunden</Badge>,
          action: 'Verbinden',
          actionIcon: Link2,
          actionVariant: 'outline' as const,
        };
    }
  };

  const statusInfo = getStatusInfo();
  const isReady = account.connected && account.mediaReady.photos > 0;
  const allMediaReady = account.mediaReady.photos === account.totalMedia.photos && account.mediaReady.videos === account.totalMedia.videos;

  return (
    <Card className={cn(
      "overflow-hidden transition-all hover:shadow-md",
      !account.connected && "opacity-70",
      account.status === 'draft' && "ring-1 ring-accent/50",
      account.status === 'online' && "ring-1 ring-success/30"
    )}>
      <CardContent className="p-0">
        {/* Media Preview Area */}
        <div className="relative aspect-[16/10] bg-slate-900 overflow-hidden">
          {account.connected && account.mediaReady.photos > 0 ? (
            <>
              <img 
                src={media[mediaIndex % media.length]} 
                alt="Preview"
                className="w-full h-full object-cover"
              />
              
              {/* Navigation */}
              <div className="absolute inset-0 flex items-center justify-between px-2 opacity-0 hover:opacity-100 transition-opacity">
                <Button
                  size="icon"
                  variant="secondary"
                  className="h-8 w-8 rounded-full bg-black/60 hover:bg-black/80 text-white border-0"
                  onClick={() => setMediaIndex((prev) => (prev - 1 + media.length) % media.length)}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  size="icon"
                  variant="secondary"
                  className="h-8 w-8 rounded-full bg-black/60 hover:bg-black/80 text-white border-0"
                  onClick={() => setMediaIndex((prev) => (prev + 1) % media.length)}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>

              {/* Media Counter */}
              <div className="absolute bottom-3 left-3 flex gap-1.5">
                <Badge className="bg-black/70 text-white border-0 text-xs gap-1">
                  <Image className="h-3 w-3" />
                  {account.mediaReady.photos}/{account.totalMedia.photos}
                </Badge>
                {account.totalMedia.videos > 0 && (
                  <Badge className="bg-black/70 text-white border-0 text-xs gap-1">
                    <Video className="h-3 w-3" />
                    {account.mediaReady.videos}/{account.totalMedia.videos}
                  </Badge>
                )}
              </div>

              {/* Format indicator - subtle */}
              <div className="absolute bottom-3 right-3">
                <Badge className="bg-black/50 text-white/80 border-0 text-[10px]">
                  {account.format.label}
                </Badge>
              </div>

              {/* Status Badge */}
              <div className="absolute top-3 right-3">
                {statusInfo.badge}
              </div>

              {/* Scheduled time */}
              {account.scheduledFor && (
                <div className="absolute top-3 left-3">
                  <Badge className="bg-black/70 text-white border-0 text-xs">
                    {account.scheduledFor}
                  </Badge>
                </div>
              )}
            </>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-white/60 gap-2">
              <Image className="h-10 w-10" />
              <p className="text-sm">{account.connected ? 'Keine Medien zugewiesen' : 'Account nicht verbunden'}</p>
            </div>
          )}
        </div>

        {/* Account Info */}
        <div className="p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <PlatformLogo platform={account.platform} size="md" />
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-semibold truncate">{account.name}</p>
                  {account.connected && (
                    <CheckCircle2 className="h-4 w-4 text-success flex-shrink-0" />
                  )}
                </div>
                <p className="text-sm text-muted-foreground truncate">
                  {account.accountHandle || account.accountName}
                </p>
              </div>
            </div>
          </div>

          {/* Action Row */}
          <div className="mt-4 flex items-center justify-between gap-2">
            {account.connected ? (
              <>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  {account.lastPublished && (
                    <span>Zuletzt: {account.lastPublished}</span>
                  )}
                  {!allMediaReady && account.status !== 'online' && (
                    <Badge variant="outline" className="text-[10px] text-warning border-warning/30">
                      Medien prüfen
                    </Badge>
                  )}
                </div>
                <Button 
                  size="sm" 
                  variant={statusInfo.actionVariant}
                  onClick={onPublish}
                  className="gap-1.5"
                >
                  <statusInfo.actionIcon className="h-4 w-4" />
                  {statusInfo.action}
                </Button>
              </>
            ) : (
              <>
                <p className="text-xs text-muted-foreground">
                  Verbinden Sie Ihren Account
                </p>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={onConnect}
                  className="gap-1.5"
                >
                  <Link2 className="h-4 w-4" />
                  Verbinden
                </Button>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function Publishing() {
  const { toast } = useToast();
  const [connectDialogOpen, setConnectDialogOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<PlatformAccount | null>(null);

  const connectedAccounts = platformAccounts.filter(a => a.connected);
  const readyToPost = platformAccounts.filter(a => a.status === 'draft').length;
  const alreadyOnline = platformAccounts.filter(a => a.status === 'online').length;

  const handleConnect = (account: PlatformAccount) => {
    setSelectedAccount(account);
    setConnectDialogOpen(true);
  };

  const handlePublish = (account: PlatformAccount) => {
    if (account.status === 'online') {
      toast({
        title: 'Aktualisierung gestartet',
        description: `${account.name} wird synchronisiert...`,
      });
    } else if (account.status === 'draft') {
      toast({
        title: 'Veröffentlichung gestartet',
        description: `Post wird an ${account.name} gesendet...`,
      });
    } else if (account.status === 'scheduled') {
      toast({
        title: 'Zeitplan bearbeiten',
        description: `Geplante Veröffentlichung: ${account.scheduledFor}`,
      });
    }
  };

  const handlePublishAll = () => {
    if (readyToPost === 0) {
      toast({
        title: 'Keine Posts bereit',
        description: 'Es gibt keine Posts zum Veröffentlichen.',
        variant: 'destructive',
      });
      return;
    }
    toast({
      title: 'Multi-Channel Veröffentlichung',
      description: `${readyToPost} Posts werden veröffentlicht...`,
    });
  };

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold">Publishing</h1>
            <p className="text-muted-foreground">Ihre Accounts & Posts auf einen Blick</p>
          </div>
          <div className="flex items-center gap-4">
            {/* Stats */}
            <div className="flex items-center gap-6 px-4 py-2 rounded-lg bg-muted/50">
              <div className="text-center">
                <p className="text-2xl font-bold text-success">{alreadyOnline}</p>
                <p className="text-xs text-muted-foreground">Online</p>
              </div>
              <div className="h-8 w-px bg-border" />
              <div className="text-center">
                <p className="text-2xl font-bold text-accent">{readyToPost}</p>
                <p className="text-xs text-muted-foreground">Bereit</p>
              </div>
              <div className="h-8 w-px bg-border" />
              <div className="text-center">
                <p className="text-2xl font-bold">{connectedAccounts.length}</p>
                <p className="text-xs text-muted-foreground">Verbunden</p>
              </div>
            </div>

            {readyToPost > 0 && (
              <Button 
                onClick={handlePublishAll} 
                size="lg"
                className="gap-2"
              >
                <Play className="h-5 w-5" />
                {readyToPost} Posts veröffentlichen
              </Button>
            )}
          </div>
        </div>

        {/* Account Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {platformAccounts.map((account) => (
            <AccountCard
              key={account.id}
              account={account}
              media={channelMedia}
              onConnect={() => handleConnect(account)}
              onPublish={() => handlePublish(account)}
            />
          ))}
        </div>

        {/* Hint for disconnected accounts */}
        {platformAccounts.filter(a => !a.connected).length > 0 && (
          <div className="mt-8 p-4 rounded-lg bg-muted/50 border border-dashed flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                <Link2 className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <p className="font-medium">Mehr Reichweite?</p>
                <p className="text-sm text-muted-foreground">
                  Verbinden Sie weitere Accounts für maximale Sichtbarkeit
                </p>
              </div>
            </div>
            <Button variant="outline" className="gap-2">
              <Settings className="h-4 w-4" />
              Accounts verwalten
            </Button>
          </div>
        )}
      </div>

      {/* Connect Dialog */}
      <Dialog open={connectDialogOpen} onOpenChange={setConnectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <PlatformLogo platform={selectedAccount?.platform || ''} size="md" />
              Mit {selectedAccount?.name} verbinden
            </DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <p className="text-sm text-muted-foreground">
              Verbinden Sie Ihren {selectedAccount?.name} Account, um Inhalte direkt zu veröffentlichen.
            </p>
            <div className="p-4 rounded-lg bg-muted/50 space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle2 className="h-4 w-4 text-success" />
                Automatische Formatierung für {selectedAccount?.format.label}
              </div>
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle2 className="h-4 w-4 text-success" />
                Geplante Veröffentlichungen
              </div>
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle2 className="h-4 w-4 text-success" />
                Performance-Tracking
              </div>
            </div>
          </div>
          <Button onClick={() => {
            setConnectDialogOpen(false);
            toast({
              title: 'Verbindung hergestellt',
              description: `${selectedAccount?.name} wurde erfolgreich verbunden.`,
            });
          }} className="w-full gap-2">
            <ExternalLink className="h-4 w-4" />
            Mit {selectedAccount?.name} verbinden
          </Button>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}
