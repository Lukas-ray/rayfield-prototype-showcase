import { useState } from 'react';
import { Download, Image, Video, Box, LayoutGrid, Share2, Send, Check, ExternalLink, Instagram, Youtube, Facebook, Linkedin, Eye, Edit3, ArrowRight, Clock, ImageIcon, Sparkles, Wand2, Crop, Film, ChevronLeft, ChevronRight, Link2, Play, CheckCircle2, RefreshCw, Settings, Unlink } from 'lucide-react';
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
import { PlatformLogo } from '@/components/ui/PlatformLogo';
import { Info } from 'lucide-react';
import { TemplateSelector, templates, Template } from '@/components/workspace/creator/TemplateSelector';
import { CaptionGenerator } from '@/components/workspace/creator/CaptionGenerator';
import { ImageEditor } from '@/components/workspace/creator/ImageEditor';
import { SlideshowCreator } from '@/components/workspace/creator/SlideshowCreator';

// Property images
import propertyLivingRoom from '@/assets/property-living-room.jpg';
import propertyKitchen from '@/assets/property-kitchen.jpg';
import propertyBedroom from '@/assets/property-bedroom.jpg';
import propertyBathroom from '@/assets/property-bathroom.jpg';
import propertyBalcony from '@/assets/property-balcony.jpg';
import propertyExterior from '@/assets/property-exterior.jpg';

const propertyImages = [
  propertyLivingRoom,
  propertyKitchen,
  propertyBedroom,
  propertyBathroom,
  propertyBalcony,
  propertyExterior,
];

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
  { id: '1', name: 'Instagram', platform: 'instagram', icon: Instagram, connected: true, handle: '@rayfield_immo' },
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

// Publishing account data with status
interface PublishingAccount {
  id: string;
  platform: string;
  name: string;
  accountHandle: string;
  connected: boolean;
  status: 'online' | 'scheduled' | 'draft' | 'not_connected';
  lastPublished?: string;
  scheduledFor?: string;
  format: { label: string };
  mediaReady: { photos: number; videos: number };
  totalMedia: { photos: number; videos: number };
}

const publishingAccounts: PublishingAccount[] = [
  {
    id: 'immoscout',
    platform: 'immoscout24',
    name: 'ImmoScout24',
    accountHandle: 'rayfield_munich',
    connected: true,
    status: 'online',
    lastPublished: '12.01.2024',
    format: { label: '3:2' },
    mediaReady: { photos: 12, videos: 1 },
    totalMedia: { photos: 12, videos: 1 },
  },
  {
    id: 'immowelt',
    platform: 'immowelt',
    name: 'Immowelt',
    accountHandle: 'rayfield-immo',
    connected: true,
    status: 'draft',
    format: { label: '4:3' },
    mediaReady: { photos: 10, videos: 0 },
    totalMedia: { photos: 10, videos: 0 },
  },
  {
    id: 'kleinanzeigen',
    platform: 'kleinanzeigen',
    name: 'Kleinanzeigen',
    accountHandle: 'Rayfield München',
    connected: true,
    status: 'scheduled',
    scheduledFor: '20.01.2024, 10:00',
    format: { label: '4:3' },
    mediaReady: { photos: 8, videos: 0 },
    totalMedia: { photos: 8, videos: 0 },
  },
  {
    id: 'instagram',
    platform: 'instagram',
    name: 'Instagram',
    accountHandle: '@rayfield_immo',
    connected: true,
    status: 'draft',
    format: { label: '1:1' },
    mediaReady: { photos: 6, videos: 1 },
    totalMedia: { photos: 8, videos: 2 },
  },
  {
    id: 'facebook',
    platform: 'facebook',
    name: 'Facebook',
    accountHandle: 'Rayfield Immobilien',
    connected: false,
    status: 'not_connected',
    format: { label: '1.91:1' },
    mediaReady: { photos: 0, videos: 0 },
    totalMedia: { photos: 8, videos: 1 },
  },
  {
    id: 'website',
    platform: 'website',
    name: 'Eigene Website',
    accountHandle: 'rayfield-immobilien.de',
    connected: true,
    status: 'online',
    lastPublished: '15.01.2024',
    format: { label: '16:9' },
    mediaReady: { photos: 15, videos: 2 },
    totalMedia: { photos: 15, videos: 2 },
  },
];

// Platform Preview Dialog Component
function PlatformPreviewDialog({ 
  account, 
  images, 
  open, 
  onOpenChange 
}: { 
  account: PublishingAccount; 
  images: string[]; 
  open: boolean; 
  onOpenChange: (open: boolean) => void;
}) {
  const { toast } = useToast();
  const [currentImageIdx, setCurrentImageIdx] = useState(0);
  
  const previewText = {
    immoscout24: 'Traumhafte 3-Zimmer Altbauwohnung mit Balkon in München-Schwabing. Hochwertig saniert mit originalem Stuck und Dielenboden. Ideal für Familien oder als Kapitalanlage.',
    immowelt: 'Exklusive Altbauwohnung in begehrter Lage. 85 m² Wohnfläche, 3 Zimmer, Balkon mit Südausrichtung. Bezugsfrei ab sofort.',
    kleinanzeigen: '🏠 Wunderschöne Altbauwohnung in Schwabing! 85m², 3 Zimmer, Balkon. Hohe Decken, Stuck, Dielenboden. VB 685.000€. Besichtigung nach Vereinbarung.',
    instagram: '🏠 Neue Immobilie in München-Schwabing!\n\nLichtdurchflutete 3-Zimmer Altbauwohnung mit Balkon und Stuck.\n\n✨ 85 m² Wohnfläche\n🛏️ 3 Zimmer\n🌳 Ruhige Lage nahe Englischer Garten\n\n#immobilien #münchen #altbau',
    facebook: '🏠 Exklusive Wohnung in München-Schwabing!\n\nDiese wunderschöne 3-Zimmer Altbauwohnung besticht durch ihren einzigartigen Charme. Mit 85 m², originalem Stuck und einem sonnigen Balkon ist sie perfekt für anspruchsvolle Käufer.',
    website: 'Entdecken Sie diese außergewöhnliche Altbauwohnung im Herzen von München-Schwabing. Die 3-Zimmer Wohnung überzeugt mit 85 m² Wohnfläche, hohen Decken und einem charmanten Balkon.',
  };

  const renderPlatformPreview = () => {
    switch (account.platform) {
      case 'immoscout24':
        return (
          <div className="border rounded-xl overflow-hidden bg-white text-slate-900">
            {/* ImmoScout Header */}
            <div className="bg-[#ff7500] text-white px-4 py-2 flex items-center gap-2">
              <span className="font-bold text-lg">ImmoScout24</span>
            </div>
            {/* Listing */}
            <div className="p-4">
              <div className="flex gap-4">
                <div className="w-64 h-48 rounded-lg overflow-hidden flex-shrink-0">
                  <img src={images[currentImageIdx]} alt="Immobilie" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1">
                  <Badge className="bg-green-100 text-green-800 border-0 mb-2">Kaufen</Badge>
                  <h3 className="text-xl font-bold mb-1">3-Zimmer Altbauwohnung mit Balkon</h3>
                  <p className="text-slate-600 text-sm mb-3">80802 München, Schwabing</p>
                  <div className="grid grid-cols-3 gap-4 mb-3">
                    <div>
                      <p className="text-2xl font-bold text-[#ff7500]">685.000 €</p>
                      <p className="text-xs text-slate-500">Kaufpreis</p>
                    </div>
                    <div>
                      <p className="text-lg font-semibold">85 m²</p>
                      <p className="text-xs text-slate-500">Wohnfläche</p>
                    </div>
                    <div>
                      <p className="text-lg font-semibold">3</p>
                      <p className="text-xs text-slate-500">Zimmer</p>
                    </div>
                  </div>
                  <p className="text-sm text-slate-700 line-clamp-2">{previewText.immoscout24}</p>
                </div>
              </div>
              {/* Thumbnail Gallery */}
              <div className="flex gap-2 mt-4">
                {images.slice(0, 6).map((img, idx) => (
                  <div 
                    key={idx} 
                    className={cn(
                      "w-16 h-12 rounded overflow-hidden cursor-pointer border-2",
                      currentImageIdx === idx ? "border-[#ff7500]" : "border-transparent"
                    )}
                    onClick={() => setCurrentImageIdx(idx)}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'immowelt':
        return (
          <div className="border rounded-xl overflow-hidden bg-white text-slate-900">
            {/* Immowelt Header */}
            <div className="bg-[#003580] text-white px-4 py-2 flex items-center gap-2">
              <span className="font-bold text-lg">immowelt</span>
            </div>
            {/* Listing */}
            <div className="p-4">
              <div className="aspect-video rounded-lg overflow-hidden mb-4">
                <img src={images[currentImageIdx]} alt="Immobilie" className="w-full h-full object-cover" />
              </div>
              <h3 className="text-xl font-bold mb-1">Hochwertige 3-Zimmer Altbauwohnung</h3>
              <p className="text-slate-600 text-sm mb-3">Leopoldstraße, 80802 München</p>
              <div className="flex gap-6 mb-3 text-sm">
                <span className="font-semibold">€ 685.000</span>
                <span>85 m²</span>
                <span>3 Zi.</span>
              </div>
              <p className="text-sm text-slate-700">{previewText.immowelt}</p>
            </div>
          </div>
        );

      case 'kleinanzeigen':
        return (
          <div className="border rounded-xl overflow-hidden bg-white text-slate-900">
            {/* Kleinanzeigen Header */}
            <div className="bg-[#86b817] text-white px-4 py-2 flex items-center gap-2">
              <span className="font-bold text-lg">Kleinanzeigen</span>
            </div>
            {/* Listing */}
            <div className="p-4">
              <div className="flex gap-4">
                <div className="w-48 h-36 rounded-lg overflow-hidden flex-shrink-0">
                  <img src={images[currentImageIdx]} alt="Immobilie" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold mb-1">3-Zimmer Altbauwohnung München Schwabing</h3>
                  <p className="text-2xl font-bold text-[#86b817] mb-2">685.000 € VB</p>
                  <p className="text-sm text-slate-600 mb-2">80802 München · Gestern, 14:32</p>
                  <p className="text-sm text-slate-700 line-clamp-3">{previewText.kleinanzeigen}</p>
                </div>
              </div>
            </div>
          </div>
        );

      case 'instagram':
        return (
          <div className="border rounded-xl overflow-hidden bg-white text-slate-900 max-w-sm mx-auto">
            {/* Instagram Header */}
            <div className="flex items-center gap-3 p-3 border-b">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 flex items-center justify-center">
                <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center">
                  <span className="text-xs font-bold">R</span>
                </div>
              </div>
              <div>
                <p className="text-sm font-semibold">rayfield_immo</p>
                <p className="text-xs text-slate-500">München, Germany</p>
              </div>
            </div>
            {/* Image */}
            <div className="aspect-square relative">
              <img src={images[currentImageIdx]} alt="Preview" className="w-full h-full object-cover" />
              {images.length > 1 && (
                <div className="absolute top-3 right-3 bg-black/60 text-white px-2 py-1 rounded-full text-xs">
                  {currentImageIdx + 1}/{images.length}
                </div>
              )}
            </div>
            {/* Actions */}
            <div className="p-3 flex gap-4">
              <span className="text-xl">♡</span>
              <span className="text-xl">💬</span>
              <span className="text-xl">↗</span>
            </div>
            {/* Caption */}
            <div className="px-3 pb-3">
              <p className="text-sm whitespace-pre-line">
                <span className="font-semibold">rayfield_immo</span>{' '}
                {previewText.instagram}
              </p>
            </div>
          </div>
        );

      case 'facebook':
        return (
          <div className="border rounded-xl overflow-hidden bg-white text-slate-900 max-w-md mx-auto">
            {/* Facebook Header */}
            <div className="flex items-center gap-3 p-3">
              <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center">
                <span className="text-white font-bold">R</span>
              </div>
              <div>
                <p className="text-sm font-semibold">Rayfield Immobilien</p>
                <p className="text-xs text-slate-500">Gerade eben · 🌐</p>
              </div>
            </div>
            {/* Content */}
            <div className="px-3 pb-3">
              <p className="text-sm whitespace-pre-line">{previewText.facebook}</p>
            </div>
            {/* Image */}
            <div className="aspect-[1.91/1]">
              <img src={images[currentImageIdx]} alt="Preview" className="w-full h-full object-cover" />
            </div>
            {/* Reactions */}
            <div className="p-3 border-t flex items-center justify-between text-xs text-slate-500">
              <span>👍 ❤️ 12</span>
              <span>3 Kommentare · 2 Mal geteilt</span>
            </div>
          </div>
        );

      case 'website':
        return (
          <div className="border rounded-xl overflow-hidden bg-white text-slate-900">
            {/* Website Header */}
            <div className="bg-slate-900 text-white px-4 py-3 flex items-center justify-between">
              <span className="font-bold">rayfield-immobilien.de</span>
              <div className="flex gap-4 text-sm">
                <span>Kaufen</span>
                <span>Mieten</span>
                <span>Kontakt</span>
              </div>
            </div>
            {/* Hero */}
            <div className="aspect-[21/9] relative">
              <img src={images[currentImageIdx]} alt="Immobilie" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-4 left-4 text-white">
                <Badge className="bg-white/20 text-white border-0 mb-2">Premium</Badge>
                <h2 className="text-2xl font-bold">3-Zimmer Altbauwohnung</h2>
                <p className="text-white/80">München-Schwabing</p>
              </div>
            </div>
            {/* Details */}
            <div className="p-4">
              <div className="flex gap-6 mb-4">
                <div className="text-center">
                  <p className="text-2xl font-bold">685.000 €</p>
                  <p className="text-xs text-slate-500">Kaufpreis</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold">85</p>
                  <p className="text-xs text-slate-500">m²</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold">3</p>
                  <p className="text-xs text-slate-500">Zimmer</p>
                </div>
              </div>
              <p className="text-sm text-slate-700">{previewText.website}</p>
            </div>
          </div>
        );

      default:
        return (
          <div className="p-8 text-center text-muted-foreground">
            <p>Vorschau nicht verfügbar</p>
          </div>
        );
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <PlatformLogo platform={account.platform} size="sm" />
            Vorschau: {account.name}
          </DialogTitle>
          <DialogDescription>
            So wird Ihr Inserat auf {account.name} aussehen
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4">
          {renderPlatformPreview()}
        </div>

        {/* Image Thumbnails */}
        <div className="flex gap-2 mt-4 justify-center">
          {images.slice(0, 8).map((img, idx) => (
            <div 
              key={idx} 
              className={cn(
                "w-14 h-10 rounded overflow-hidden cursor-pointer border-2 transition-all",
                currentImageIdx === idx ? "border-accent ring-2 ring-accent/30" : "border-border opacity-60 hover:opacity-100"
              )}
              onClick={() => setCurrentImageIdx(idx)}
            >
              <img src={img} alt="" className="w-full h-full object-cover" />
            </div>
          ))}
        </div>

        <div className="flex gap-2 mt-4">
          <Button variant="outline" className="flex-1" onClick={() => onOpenChange(false)}>
            Schließen
          </Button>
          <Button variant="outline" className="flex-1 gap-2">
            <Edit3 className="h-4 w-4" />
            Bearbeiten
          </Button>
          {account.status === 'draft' && (
            <Button className="flex-1 gap-2" onClick={() => {
              toast({ title: 'Veröffentlicht', description: `Ihr Inserat wurde auf ${account.name} veröffentlicht.` });
              onOpenChange(false);
            }}>
              <Send className="h-4 w-4" />
              Jetzt posten
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Publishing Account Card Component
function PublishingAccountCard({ account, images }: { account: PublishingAccount; images: string[] }) {
  const [mediaIdx, setMediaIdx] = useState(0);
  const [previewOpen, setPreviewOpen] = useState(false);
  
  const getStatusBadge = () => {
    switch (account.status) {
      case 'online':
        return <Badge className="bg-success text-success-foreground border-0 gap-1 text-xs"><CheckCircle2 className="h-3 w-3" /> Online</Badge>;
      case 'scheduled':
        return <Badge className="bg-info text-info-foreground border-0 gap-1 text-xs"><Clock className="h-3 w-3" /> Geplant</Badge>;
      case 'draft':
        return <Badge className="bg-accent text-accent-foreground border-0 gap-1 text-xs"><Send className="h-3 w-3" /> Bereit</Badge>;
      case 'not_connected':
        return <Badge variant="outline" className="gap-1 text-xs text-muted-foreground"><Unlink className="h-3 w-3" /> Nicht verbunden</Badge>;
    }
  };

  const getActionButton = () => {
    switch (account.status) {
      case 'online':
        return (
          <Button size="sm" variant="secondary" className="gap-1.5" onClick={(e) => e.stopPropagation()}>
            <RefreshCw className="h-3.5 w-3.5" /> Aktualisieren
          </Button>
        );
      case 'scheduled':
        return (
          <Button size="sm" variant="secondary" className="gap-1.5" onClick={(e) => e.stopPropagation()}>
            <Settings className="h-3.5 w-3.5" /> Bearbeiten
          </Button>
        );
      case 'draft':
        return (
          <Button size="sm" className="gap-1.5" onClick={(e) => e.stopPropagation()}>
            <Play className="h-3.5 w-3.5" /> Jetzt posten
          </Button>
        );
      case 'not_connected':
        return (
          <Button size="sm" variant="outline" className="gap-1.5" onClick={(e) => e.stopPropagation()}>
            <Link2 className="h-3.5 w-3.5" /> Verbinden
          </Button>
        );
    }
  };

  return (
    <>
      <div 
        className={cn(
          "border rounded-xl overflow-hidden transition-all hover:shadow-md cursor-pointer",
          !account.connected && "opacity-60",
          account.status === 'draft' && "ring-1 ring-accent/40",
          account.status === 'online' && "ring-1 ring-success/30"
        )}
        onClick={() => account.connected && setPreviewOpen(true)}
      >
        {/* Media Preview */}
        <div className="relative aspect-[16/10] bg-slate-900">
          {account.connected && account.mediaReady.photos > 0 ? (
            <>
              <img 
                src={images[mediaIdx % images.length]} 
                alt="Preview"
                className="w-full h-full object-cover"
              />
              
              {/* Preview Hint */}
              <div className="absolute inset-0 bg-black/0 hover:bg-black/30 transition-colors flex items-center justify-center opacity-0 hover:opacity-100">
                <Badge className="bg-white/90 text-slate-900 border-0 gap-1.5">
                  <Eye className="h-3.5 w-3.5" />
                  Vorschau
                </Badge>
              </div>
              
              {/* Navigation */}
              <div className="absolute inset-0 flex items-center justify-between px-2 pointer-events-none">
                <Button
                  size="icon"
                  variant="secondary"
                  className="h-7 w-7 rounded-full bg-black/60 hover:bg-black/80 text-white border-0 pointer-events-auto opacity-0 hover:opacity-100 transition-opacity"
                  onClick={(e) => {
                    e.stopPropagation();
                    setMediaIdx((prev) => (prev - 1 + images.length) % images.length);
                  }}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  size="icon"
                  variant="secondary"
                  className="h-7 w-7 rounded-full bg-black/60 hover:bg-black/80 text-white border-0 pointer-events-auto opacity-0 hover:opacity-100 transition-opacity"
                  onClick={(e) => {
                    e.stopPropagation();
                    setMediaIdx((prev) => (prev + 1) % images.length);
                  }}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>

              {/* Media Count */}
              <div className="absolute bottom-2 left-2 flex gap-1">
                <Badge className="bg-black/70 text-white border-0 text-[10px] gap-1">
                  <Image className="h-3 w-3" />
                  {account.mediaReady.photos}/{account.totalMedia.photos}
                </Badge>
                {account.totalMedia.videos > 0 && (
                  <Badge className="bg-black/70 text-white border-0 text-[10px] gap-1">
                    <Video className="h-3 w-3" />
                    {account.mediaReady.videos}/{account.totalMedia.videos}
                  </Badge>
                )}
              </div>

              {/* Format */}
              <div className="absolute bottom-2 right-2">
                <Badge className="bg-black/50 text-white/80 border-0 text-[10px]">
                  {account.format.label}
                </Badge>
              </div>

              {/* Status */}
              <div className="absolute top-2 right-2">
                {getStatusBadge()}
              </div>

              {/* Scheduled time */}
              {account.scheduledFor && (
                <div className="absolute top-2 left-2">
                  <Badge className="bg-black/70 text-white border-0 text-[10px]">
                    {account.scheduledFor}
                  </Badge>
                </div>
              )}
            </>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-white/50 gap-2">
              <Image className="h-8 w-8" />
              <p className="text-xs">{account.connected ? 'Keine Medien' : 'Nicht verbunden'}</p>
            </div>
          )}
        </div>

        {/* Account Info */}
        <div className="p-3 bg-card">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <PlatformLogo platform={account.platform} size="sm" />
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <p className="font-medium text-sm truncate">{account.name}</p>
                  {account.connected && <CheckCircle2 className="h-3.5 w-3.5 text-success flex-shrink-0" />}
                </div>
                <p className="text-xs text-muted-foreground truncate">{account.accountHandle}</p>
              </div>
            </div>
            {getActionButton()}
          </div>
          {account.lastPublished && (
            <p className="text-[10px] text-muted-foreground mt-2">Zuletzt: {account.lastPublished}</p>
          )}
        </div>
      </div>

      {/* Preview Dialog */}
      <PlatformPreviewDialog 
        account={account} 
        images={images} 
        open={previewOpen} 
        onOpenChange={setPreviewOpen} 
      />
    </>
  );
}

// Platform image format requirements
const platformImageFormats = [
  {
    platform: 'ImmoScout24',
    formats: [
      { name: 'Hauptbild', ratio: '4:3', pixels: '1024 × 768 px', minPixels: '400 × 300 px' },
      { name: 'Galerie', ratio: '4:3', pixels: '1024 × 768 px', minPixels: '400 × 300 px' },
      { name: 'Grundriss', ratio: 'Beliebig', pixels: 'Max 5 MB', minPixels: '600 × 400 px' },
    ]
  },
  {
    platform: 'Immowelt',
    formats: [
      { name: 'Hauptbild', ratio: '16:9', pixels: '1920 × 1080 px', minPixels: '800 × 450 px' },
      { name: 'Galerie', ratio: '16:9', pixels: '1920 × 1080 px', minPixels: '600 × 338 px' },
      { name: 'Grundriss', ratio: 'Beliebig', pixels: 'Max 10 MB', minPixels: '800 × 600 px' },
    ]
  },
  {
    platform: 'Kleinanzeigen',
    formats: [
      { name: 'Alle Bilder', ratio: '4:3', pixels: '1200 × 900 px', minPixels: '400 × 300 px' },
      { name: 'Titelbild', ratio: '4:3', pixels: '1200 × 900 px', minPixels: '640 × 480 px' },
    ]
  },
  {
    platform: 'Instagram',
    formats: [
      { name: 'Feed Post (Quadrat)', ratio: '1:1', pixels: '1080 × 1080 px', minPixels: '600 × 600 px' },
      { name: 'Feed Post (Portrait)', ratio: '4:5', pixels: '1080 × 1350 px', minPixels: '600 × 750 px' },
      { name: 'Story / Reel', ratio: '9:16', pixels: '1080 × 1920 px', minPixels: '600 × 1067 px' },
      { name: 'Karussell', ratio: '1:1', pixels: '1080 × 1080 px', minPixels: '600 × 600 px' },
    ]
  },
  {
    platform: 'Facebook',
    formats: [
      { name: 'Feed Post', ratio: '1.91:1', pixels: '1200 × 630 px', minPixels: '600 × 315 px' },
      { name: 'Story', ratio: '9:16', pixels: '1080 × 1920 px', minPixels: '500 × 889 px' },
      { name: 'Titelbild', ratio: '16:9', pixels: '1640 × 924 px', minPixels: '820 × 462 px' },
    ]
  },
  {
    platform: 'LinkedIn',
    formats: [
      { name: 'Feed Post', ratio: '1.91:1', pixels: '1200 × 627 px', minPixels: '552 × 289 px' },
      { name: 'Artikel-Titelbild', ratio: '1.91:1', pixels: '1200 × 644 px', minPixels: '744 × 400 px' },
    ]
  },
  {
    platform: 'YouTube',
    formats: [
      { name: 'Thumbnail', ratio: '16:9', pixels: '1280 × 720 px', minPixels: '640 × 360 px' },
      { name: 'Video', ratio: '16:9', pixels: '1920 × 1080 px (Full HD)', minPixels: '1280 × 720 px' },
    ]
  },
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
  
  // Creator Area State
  const [creatorDialogOpen, setCreatorDialogOpen] = useState(false);
  const [creatorTab, setCreatorTab] = useState<'templates' | 'caption' | 'editor' | 'slideshow'>('templates');
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [creatorCaption, setCreatorCaption] = useState('');
  const [creatorPlatform, setCreatorPlatform] = useState('Instagram');
  
  // Track published accounts
  const [publishedSocialAccounts, setPublishedSocialAccounts] = useState<string[]>([]);
  const [publishedPlatforms, setPublishedPlatforms] = useState<string[]>([]);

  const photos = mediaItems.filter(m => m.type === 'photo');
  const videos = mediaItems.filter(m => m.type === 'video');
  const tours = mediaItems.filter(m => m.type === '3d_tour');
  const floorPlans = mediaItems.filter(m => m.type === 'floor_plan');

  // Get the first selected media image for preview
  const getPreviewImage = () => {
    if (selectedMedia.length > 0) {
      const selectedPhotoIndex = photos.findIndex(p => p.id === selectedMedia[0]);
      if (selectedPhotoIndex >= 0) {
        return propertyImages[selectedPhotoIndex % propertyImages.length];
      }
    }
    return propertyImages[0];
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
    
    if (selectedSocial) {
      setPublishedSocialAccounts(prev => [...prev, selectedSocial.id]);
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
    if (selectedPlatform) {
      setPublishedPlatforms(prev => [...prev, selectedPlatform.id]);
    }
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
            <TabsTrigger value="creator" className="gap-2">
              <Sparkles className="h-4 w-4" />
              Creator Area
            </TabsTrigger>
            <TabsTrigger value="publishing" className="gap-2">
              <Send className="h-4 w-4" />
              Bereit zum Posten
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
                          src={propertyImages[idx % propertyImages.length]}
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
                          src={propertyImages[(idx + 2) % propertyImages.length]}
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

          {/* Ready to Post - Account Cards */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Send className="h-5 w-5 text-accent" />
                    Bereit zum Posten
                  </CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">Ihre verbundenen Accounts mit Medien-Status</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-4 px-3 py-1.5 rounded-lg bg-muted/50 text-sm">
                    <span className="flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-success" />
                      <span className="text-muted-foreground">{publishingAccounts.filter(a => a.status === 'online').length} Online</span>
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-accent" />
                      <span className="text-muted-foreground">{publishingAccounts.filter(a => a.status === 'draft').length} Bereit</span>
                    </span>
                  </div>
                  <Button size="sm" className="gap-1.5">
                    <Play className="h-4 w-4" />
                    Alle posten
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {publishingAccounts.map((account) => (
                  <PublishingAccountCard key={account.id} account={account} images={propertyImages} />
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Creator Area Tab */}
        <TabsContent value="creator" className="mt-6 space-y-6">
          {/* Quick Actions */}
          <div className="grid grid-cols-4 gap-4">
            <Card 
              className="cursor-pointer hover:ring-2 hover:ring-accent/50 transition-all"
              onClick={() => { setCreatorDialogOpen(true); setCreatorTab('templates'); }}
            >
              <CardContent className="pt-6 text-center">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mx-auto mb-3">
                  <Wand2 className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold">Templates</h3>
                <p className="text-xs text-muted-foreground mt-1">Vorgefertigte Designs</p>
              </CardContent>
            </Card>
            
            <Card 
              className="cursor-pointer hover:ring-2 hover:ring-accent/50 transition-all"
              onClick={() => { setCreatorDialogOpen(true); setCreatorTab('caption'); }}
            >
              <CardContent className="pt-6 text-center">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center mx-auto mb-3">
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold">KI-Texte</h3>
                <p className="text-xs text-muted-foreground mt-1">Captions generieren</p>
              </CardContent>
            </Card>
            
            <Card 
              className="cursor-pointer hover:ring-2 hover:ring-accent/50 transition-all"
              onClick={() => { setCreatorDialogOpen(true); setCreatorTab('editor'); }}
            >
              <CardContent className="pt-6 text-center">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center mx-auto mb-3">
                  <Crop className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold">Bildbearbeitung</h3>
                <p className="text-xs text-muted-foreground mt-1">Zuschneiden & Filter</p>
              </CardContent>
            </Card>
            
            <Card 
              className="cursor-pointer hover:ring-2 hover:ring-accent/50 transition-all"
              onClick={() => { setCreatorDialogOpen(true); setCreatorTab('slideshow'); }}
            >
              <CardContent className="pt-6 text-center">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-rose-500 flex items-center justify-center mx-auto mb-3">
                  <Film className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold">Slideshow</h3>
                <p className="text-xs text-muted-foreground mt-1">Videos erstellen</p>
              </CardContent>
            </Card>
          </div>

          {/* Recent Creations Preview */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-accent" />
                  Schnell erstellen
                </CardTitle>
                <Badge variant="secondary">Für diese Immobilie</Badge>
              </div>
              <p className="text-sm text-muted-foreground">Wählen Sie ein Bild und erstellen Sie in Sekunden Social Media Content</p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-6 gap-3">
                {photos.slice(0, 6).map((photo, idx) => (
                  <div 
                    key={photo.id}
                    className="group relative aspect-square rounded-xl overflow-hidden cursor-pointer ring-2 ring-transparent hover:ring-accent transition-all"
                    onClick={() => { setCreatorDialogOpen(true); setCreatorTab('editor'); }}
                  >
                    <img 
                      src={propertyImages[idx % propertyImages.length]}
                      alt={photo.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-2">
                      <span className="text-white text-xs font-medium">Bearbeiten</span>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Platform Quick Select */}
              <div className="mt-4 pt-4 border-t">
                <p className="text-sm font-medium mb-3">Zielplattform wählen:</p>
                <div className="flex gap-2">
                  {['Instagram', 'Facebook', 'LinkedIn', 'YouTube'].map((platform) => (
                    <Button
                      key={platform}
                      variant={creatorPlatform === platform ? "default" : "outline"}
                      size="sm"
                      onClick={() => {
                        setCreatorPlatform(platform);
                        setCreatorDialogOpen(true);
                        setCreatorTab('templates');
                      }}
                      className="gap-2"
                    >
                      <PlatformLogo platform={platform} size="sm" />
                      {platform}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Bereit zum Posten Tab */}
        <TabsContent value="publishing" className="mt-6 space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Send className="h-5 w-5 text-accent" />
                    Bereit zum Posten
                  </CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">Alle verbundenen Accounts mit Medien-Status für diese Immobilie</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-4 px-3 py-1.5 rounded-lg bg-muted/50 text-sm">
                    <span className="flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-success" />
                      <span className="text-muted-foreground">{publishingAccounts.filter(a => a.status === 'online').length} Online</span>
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-accent" />
                      <span className="text-muted-foreground">{publishingAccounts.filter(a => a.status === 'draft').length} Bereit</span>
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-info" />
                      <span className="text-muted-foreground">{publishingAccounts.filter(a => a.status === 'scheduled').length} Geplant</span>
                    </span>
                  </div>
                  <Button size="sm" className="gap-1.5">
                    <Play className="h-4 w-4" />
                    Alle posten
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {publishingAccounts.map((account) => (
                  <PublishingAccountCard key={account.id} account={account} images={propertyImages} />
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Format Reference - Collapsible */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium flex items-center gap-2 text-muted-foreground">
                  <Info className="h-4 w-4" />
                  Bildformat-Referenz
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {platformImageFormats.slice(0, 4).map((platform) => (
                  <div key={platform.platform} className="p-3 rounded-lg bg-muted/30 border border-border/50">
                    <p className="font-medium text-sm mb-2">{platform.platform}</p>
                    <div className="space-y-1">
                      {platform.formats.slice(0, 2).map((format, idx) => (
                        <div key={idx} className="text-xs text-muted-foreground flex justify-between">
                          <span>{format.name}</span>
                          <span className="font-mono">{format.ratio}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
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
                            src={propertyImages[idx % propertyImages.length]}
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
                          <span className="text-xs font-bold">I</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-semibold">immosmart_immo</p>
                        <p className="text-xs text-muted-foreground">München, Germany</p>
                      </div>
                    </div>
                    {/* Image */}
                    <div className="aspect-square bg-muted relative">
                      <img 
                        src={getPreviewImage()}
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
                        <span className="font-semibold">immosmart_immo</span>{' '}
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
                        <span className="text-lg font-bold text-accent">I</span>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold">Immosmart GmbH</p>
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
                        src={getPreviewImage()}
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
                        src={getPreviewImage()}
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
                        Immosmart Immobilien • 0 Aufrufe • Jetzt
                      </p>
                    </div>
                  </div>
                )}

                {selectedSocial?.name === 'Facebook' && (
                  <div className="border border-border rounded-xl overflow-hidden bg-background">
                    {/* Facebook Header */}
                    <div className="flex items-center gap-3 p-3">
                      <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center">
                        <span className="text-sm font-bold text-white">I</span>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold">Immosmart Immobilien</p>
                        <p className="text-xs text-muted-foreground">Jetzt • 🌐</p>
                      </div>
                    </div>
                    {/* Content */}
                    <div className="px-3 pb-3">
                      <p className="text-sm line-clamp-4">{postText.slice(0, 150)}...</p>
                    </div>
                    {/* Image */}
                    <div className="aspect-[1.91/1] bg-muted">
                      <img 
                        src={getPreviewImage()}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    {/* Reactions */}
                    <div className="p-3 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
                      <span>👍 ❤️ 😮 0</span>
                      <span>0 Kommentare • 0 Mal geteilt</span>
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
                    {selectedSocial?.name === 'Facebook' && (
                      <>
                        <li>• Optimiertes 1.91:1 Bildformat</li>
                        <li>• Engagement-optimierter Text</li>
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
                  src={getPreviewImage()}
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
                    src={getPreviewImage()}
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

      {/* Creator Area Dialog */}
      <Dialog open={creatorDialogOpen} onOpenChange={setCreatorDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-accent" />
              Creator Area
            </DialogTitle>
            <DialogDescription>
              Erstellen Sie professionelle Social Media Inhalte in wenigen Klicks
            </DialogDescription>
          </DialogHeader>
          
          <Tabs value={creatorTab} onValueChange={(v) => setCreatorTab(v as typeof creatorTab)}>
            <TabsList className="grid grid-cols-4 w-full">
              <TabsTrigger value="templates" className="gap-2">
                <Wand2 className="h-4 w-4" />
                Templates
              </TabsTrigger>
              <TabsTrigger value="caption" className="gap-2">
                <Sparkles className="h-4 w-4" />
                KI-Texte
              </TabsTrigger>
              <TabsTrigger value="editor" className="gap-2">
                <Crop className="h-4 w-4" />
                Bildbearbeitung
              </TabsTrigger>
              <TabsTrigger value="slideshow" className="gap-2">
                <Film className="h-4 w-4" />
                Slideshow
              </TabsTrigger>
            </TabsList>

            <TabsContent value="templates" className="mt-4">
              <TemplateSelector
                selectedTemplate={selectedTemplate}
                onSelect={setSelectedTemplate}
                platformFilter={creatorPlatform}
              />
            </TabsContent>

            <TabsContent value="caption" className="mt-4">
              <CaptionGenerator
                platform={creatorPlatform}
                onCaptionChange={setCreatorCaption}
                initialCaption={creatorCaption}
              />
            </TabsContent>

            <TabsContent value="editor" className="mt-4">
              <ImageEditor
                imageSrc={propertyImages[0]}
                onSave={() => {
                  toast({ title: 'Bild gespeichert' });
                  setCreatorDialogOpen(false);
                }}
              />
            </TabsContent>

            <TabsContent value="slideshow" className="mt-4">
              <SlideshowCreator
                images={propertyImages}
                onExport={() => {
                  toast({ title: 'Video wird erstellt...' });
                }}
              />
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </div>
  );
}
