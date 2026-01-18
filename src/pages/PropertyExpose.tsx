import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Ruler, BedDouble, Bath, Calendar, Home, ChevronLeft, ChevronRight, X, Box, Lock, FileText, TrendingUp, Crown, Gift, UtensilsCrossed, Fence, Flame, Sun, Building, Car, Package, Droplets, Wifi, Snowflake, ShieldCheck, TreePine, LucideIcon, Share2, Heart, Copy, Mail, MessageCircle, Euro } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { properties } from '@/data/dummyData';
import { useState, useMemo } from 'react';
import { useToast } from '@/hooks/use-toast';
import { GatedContentCard } from '@/components/expose/GatedContentCard';
import { UnlockRewardToast } from '@/components/expose/UnlockRewardToast';
import { LocationMapSection } from '@/components/expose/LocationMapSection';
import { SignupGamificationCard } from '@/components/expose/SignupGamificationCard';
import { GaussianSplatViewer } from '@/components/expose/GaussianSplatViewer';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import immosmartLogo from '@/assets/immosmart-logo.svg';

// Property images
import propertyLivingRoom from '@/assets/property-living-room.jpg';
import propertyKitchen from '@/assets/property-kitchen.jpg';
import propertyBedroom from '@/assets/property-bedroom.jpg';
import propertyBathroom from '@/assets/property-bathroom.jpg';
import propertyBalcony from '@/assets/property-balcony.jpg';
import propertyExterior from '@/assets/property-exterior.jpg';
import floorPlanImage from '@/assets/floor-plan.jpg';
import energyCertificateImage from '@/assets/energy-certificate.jpg';

// Dynamic property images based on property type
const getPropertyImages = (property: typeof properties[0]) => {
  const mainImage = property.thumbnail || propertyExterior;
  
  return [
    { src: mainImage, label: 'Hauptbild' },
    { src: propertyLivingRoom, label: 'Wohnbereich' },
    { src: propertyKitchen, label: 'Küche' },
    { src: propertyBedroom, label: 'Schlafzimmer' },
    { src: propertyBathroom, label: 'Bad' },
    { src: propertyExterior, label: 'Außenansicht' },
  ];
};

interface Feature {
  name: string;
  icon: LucideIcon;
}

const features: Feature[] = [
  { name: 'Einbauküche', icon: UtensilsCrossed },
  { name: 'Parkett', icon: Fence },
  { name: 'Fußbodenheizung', icon: Flame },
  { name: 'Balkon/Terrasse', icon: Sun },
  { name: 'Aufzug', icon: Building },
  { name: 'Tiefgarage', icon: Car },
  { name: 'Keller', icon: Package },
  { name: 'Gäste-WC', icon: Droplets },
  { name: 'Smart Home', icon: Wifi },
  { name: 'Klimaanlage', icon: Snowflake },
  { name: 'Alarmanlage', icon: ShieldCheck },
  { name: 'Garten', icon: TreePine },
];

export default function PropertyExpose() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isImageTransitioning, setIsImageTransitioning] = useState(false);
  
  // Gamification state
  const [unlockLevel, setUnlockLevel] = useState(0);
  const [userData, setUserData] = useState({ email: '', phone: '', name: '' });
  const [showRewardToast, setShowRewardToast] = useState(false);
  const [lastReward, setLastReward] = useState('');
  const [nextReward, setNextReward] = useState('');
  const [engagementScore, setEngagementScore] = useState(0);
  
  const scrollToUnlock = () => {
    document.getElementById('unlock-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  const property = properties.find(p => p.id === id) || properties[0];
  const propertyImages = getPropertyImages(property);
  
  // Preis pro m² berechnen
  const pricePerSqm = useMemo(() => {
    return Math.round(property.price / property.area);
  }, [property.price, property.area]);
  
  // Baujahr stabil berechnen (basierend auf property id)
  const buildYear = useMemo(() => {
    const hash = property.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return 1960 + (hash % 60);
  }, [property.id]);

  const changeImage = (newIndex: number) => {
    setIsImageTransitioning(true);
    setTimeout(() => {
      setCurrentImageIndex(newIndex);
      setIsImageTransitioning(false);
    }, 150);
  };

  const nextImage = () => {
    changeImage((currentImageIndex + 1) % propertyImages.length);
  };

  const prevImage = () => {
    changeImage((currentImageIndex - 1 + propertyImages.length) % propertyImages.length);
  };

  const handleShare = (method: 'copy' | 'whatsapp' | 'email') => {
    const url = window.location.href;
    const text = `${property.address}, ${property.city} - ${property.price.toLocaleString('de-DE')} €`;
    
    switch (method) {
      case 'copy':
        navigator.clipboard.writeText(url);
        toast({ title: 'Link kopiert!', description: 'Der Link wurde in die Zwischenablage kopiert.' });
        break;
      case 'whatsapp':
        window.open(`https://wa.me/?text=${encodeURIComponent(text + '\n' + url)}`, '_blank');
        break;
      case 'email':
        window.open(`mailto:?subject=${encodeURIComponent('Immobilie: ' + property.address)}&body=${encodeURIComponent(text + '\n\n' + url)}`, '_blank');
        break;
    }
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    toast({
      title: isFavorite ? 'Aus Favoriten entfernt' : 'Zu Favoriten hinzugefügt',
      description: isFavorite ? 'Die Immobilie wurde aus Ihren Favoriten entfernt.' : 'Die Immobilie wurde zu Ihren Favoriten hinzugefügt.',
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={immosmartLogo} alt="Immosmart" className="h-8 w-auto" />
            <span className="text-base font-semibold text-foreground hidden sm:block">Immosmart</span>
          </div>
          <div className="flex items-center gap-2">
            {/* Share Button */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="hover:bg-secondary">
                  <Share2 className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleShare('copy')} className="gap-2">
                  <Copy className="h-4 w-4" /> Link kopieren
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleShare('whatsapp')} className="gap-2">
                  <MessageCircle className="h-4 w-4" /> WhatsApp
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleShare('email')} className="gap-2">
                  <Mail className="h-4 w-4" /> Per E-Mail teilen
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            {/* Favorite Button */}
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleFavorite}
              className={`hover:bg-secondary transition-all ${isFavorite ? 'text-red-500' : ''}`}
            >
              <Heart className={`h-5 w-5 transition-all ${isFavorite ? 'fill-current scale-110' : ''}`} />
            </Button>
            
            <Badge variant="secondary" className="text-sm hidden sm:flex">
              Exposé
            </Badge>
            <Button variant="ghost" onClick={() => navigate(`/property/${id}`)} className="gap-2" size="sm">
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Zur Verwaltung</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative">
        <div className="relative h-[50vh] sm:h-[60vh] overflow-hidden">
          <img
            src={propertyImages[currentImageIndex].src}
            alt={propertyImages[currentImageIndex].label}
            className={`w-full h-full object-cover cursor-pointer transition-opacity duration-300 ${isImageTransitioning ? 'opacity-0' : 'opacity-100'}`}
            onClick={() => setLightboxOpen(true)}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
          
          {/* Navigation Arrows */}
          <button
            onClick={prevImage}
            className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-background/80 backdrop-blur flex items-center justify-center hover:bg-background hover:scale-105 transition-all shadow-lg"
          >
            <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
          </button>
          <button
            onClick={nextImage}
            className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-background/80 backdrop-blur flex items-center justify-center hover:bg-background hover:scale-105 transition-all shadow-lg"
          >
            <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
          </button>

          {/* Image Counter */}
          <div className="absolute bottom-20 sm:bottom-24 left-1/2 -translate-x-1/2 bg-background/90 backdrop-blur-md px-4 py-2 rounded-full text-sm font-medium shadow-lg">
            {currentImageIndex + 1} / {propertyImages.length} — {propertyImages[currentImageIndex].label}
          </div>

          {/* Quick Info Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-8">
            <div className="max-w-7xl mx-auto">
              <Badge className="mb-3 bg-accent text-accent-foreground animate-fade-in">Exklusives Angebot</Badge>
              <h1 className="text-2xl sm:text-4xl font-bold text-foreground mb-2">{property.address}</h1>
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="text-base sm:text-lg">{property.city}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Thumbnail Strip */}
        <div className="max-w-7xl mx-auto px-4 -mt-8 sm:-mt-10 relative z-10">
          <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide">
            {propertyImages.map((img, idx) => (
              <button
                key={idx}
                onClick={() => changeImage(idx)}
                className={`flex-shrink-0 w-16 h-12 sm:w-24 sm:h-16 rounded-lg overflow-hidden border-2 transition-all hover:scale-105 ${
                  idx === currentImageIndex ? 'border-accent ring-2 ring-accent/30 scale-105' : 'border-transparent opacity-70 hover:opacity-100'
                }`}
              >
                <img src={img.src} alt={img.label} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Left Column - Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Price & Key Stats */}
            <Card className="animate-fade-in overflow-hidden">
              <CardContent className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Kaufpreis</p>
                    <p className="text-3xl sm:text-4xl font-bold text-accent">{property.price.toLocaleString('de-DE')} €</p>
                    <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1">
                      <Euro className="h-3 w-3" />
                      {pricePerSqm.toLocaleString('de-DE')} €/m²
                    </p>
                  </div>
                  <Badge variant="outline" className="text-base sm:text-lg px-3 sm:px-4 py-1.5 sm:py-2 self-start">
                    {property.propertyType}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                  <div className="text-center p-3 sm:p-4 rounded-xl bg-secondary/50 hover:bg-secondary/70 transition-colors group">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform">
                      <Ruler className="h-5 w-5 sm:h-6 sm:w-6 text-accent" />
                    </div>
                    <p className="text-xl sm:text-2xl font-bold">{property.area}</p>
                    <p className="text-xs sm:text-sm text-muted-foreground">m² Wohnfläche</p>
                  </div>
                  <div className="text-center p-3 sm:p-4 rounded-xl bg-secondary/50 hover:bg-secondary/70 transition-colors group">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform">
                      <BedDouble className="h-5 w-5 sm:h-6 sm:w-6 text-accent" />
                    </div>
                    <p className="text-xl sm:text-2xl font-bold">{property.rooms}</p>
                    <p className="text-xs sm:text-sm text-muted-foreground">Zimmer</p>
                  </div>
                  <div className="text-center p-3 sm:p-4 rounded-xl bg-secondary/50 hover:bg-secondary/70 transition-colors group">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform">
                      <Bath className="h-5 w-5 sm:h-6 sm:w-6 text-accent" />
                    </div>
                    <p className="text-xl sm:text-2xl font-bold">{Math.max(1, Math.floor(property.rooms / 2))}</p>
                    <p className="text-xs sm:text-sm text-muted-foreground">Bäder</p>
                  </div>
                  <div className="text-center p-3 sm:p-4 rounded-xl bg-secondary/50 hover:bg-secondary/70 transition-colors group">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform">
                      <Calendar className="h-5 w-5 sm:h-6 sm:w-6 text-accent" />
                    </div>
                    <p className="text-xl sm:text-2xl font-bold">{buildYear}</p>
                    <p className="text-xs sm:text-sm text-muted-foreground">Baujahr</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Description */}
            <Card className="animate-fade-in" style={{ animationDelay: '100ms' }}>
              <CardContent className="p-4 sm:p-6">
                <h2 className="text-lg sm:text-xl font-semibold mb-4">Objektbeschreibung</h2>
                <div className="prose prose-neutral dark:prose-invert max-w-none">
                  <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
                    {property.propertyType === 'Wohn- & Geschäftshaus' || property.propertyType === 'Mehrparteienhaus'
                      ? `Dieses beeindruckende ${property.propertyType} in ${property.city} bietet mit ${property.area} m² Nutzfläche und ${property.rooms} Einheiten eine erstklassige Investitionsmöglichkeit in einer der gefragtesten Lagen.`
                      : `Diese ${property.propertyType === 'Wohnung' || property.propertyType === 'Dachgeschosswohnung' || property.propertyType === 'Apartment' || property.propertyType === 'Penthouse' ? 'attraktive' : 'exklusive'} ${property.propertyType} in ${property.city} bietet Ihnen höchsten Wohnkomfort. Mit ${property.area} m² Wohnfläche und ${property.rooms} Zimmern ist dieses Objekt ${property.rooms <= 2 ? 'ideal für Singles oder Paare' : property.rooms <= 4 ? 'perfekt für Familien' : 'bestens für größere Familien geeignet'}.`
                    }
                  </p>
                  <p className="text-muted-foreground leading-relaxed mt-4 text-sm sm:text-base">
                    {property.propertyType === 'Penthouse' 
                      ? 'Das Penthouse besticht durch seine exklusive Lage mit Dachterrasse und Panoramablick. Hochwertige Materialien und moderne Architektur schaffen ein einzigartiges Wohnerlebnis.'
                      : property.propertyType === 'Reihenmittelhaus'
                      ? 'Das Haus bietet ein familienfreundliches Umfeld mit eigenem Garten und praktischer Raumaufteilung. Die ruhige Lage in einer gepflegten Nachbarschaft macht es zum idealen Zuhause.'
                      : 'Die Räume sind hell und lichtdurchflutet mit hochwertiger Ausstattung. Moderne Einbauküche, edle Böden und durchdachte Grundrisse sorgen für höchsten Wohnkomfort.'
                    }
                  </p>
                  <p className="text-muted-foreground leading-relaxed mt-4 text-sm sm:text-base">
                    Die Lage bietet eine optimale Anbindung an öffentliche Verkehrsmittel, Einkaufsmöglichkeiten und Naherholungsgebiete. 
                    {property.price > 1000000 ? ' Ein exklusives Objekt für anspruchsvolle Käufer.' : ' Überzeugen Sie sich selbst bei einer persönlichen Besichtigung!'}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Features */}
            <Card className="animate-fade-in" style={{ animationDelay: '200ms' }}>
              <CardContent className="p-4 sm:p-6">
                <h2 className="text-lg sm:text-xl font-semibold mb-4">Ausstattung</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3">
                  {features.map((feature, idx) => {
                    const FeatureIcon = feature.icon;
                    return (
                      <div 
                        key={idx} 
                        className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-all hover:scale-[1.02] cursor-default"
                        style={{ animationDelay: `${idx * 50}ms` }}
                      >
                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                          <FeatureIcon className="h-4 w-4 sm:h-5 sm:w-5 text-accent" />
                        </div>
                        <span className="font-medium text-xs sm:text-sm">{feature.name}</span>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Virtual Tour - Gated behind Level 1 */}
            <Card className="animate-fade-in" style={{ animationDelay: '300ms' }}>
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg sm:text-xl font-semibold">Virtuelle Besichtigung</h2>
                  {unlockLevel >= 1 ? (
                    <Badge className="bg-accent/20 text-accent">
                      <Gift className="h-3 w-3 mr-1" /> Freigeschaltet
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="gap-1">
                      <Lock className="h-3 w-3" /> Premium
                    </Badge>
                  )}
                </div>
                <GatedContentCard
                  title="3D-Tour freischalten"
                  description="Erkunden Sie jedes Zimmer in einer interaktiven 3D-Umgebung. Geben Sie Ihre E-Mail an, um sofort Zugang zu erhalten."
                  icon={<Box className="h-5 w-5 text-accent" />}
                  unlocked={unlockLevel >= 1}
                  unlockAction="Mit E-Mail freischalten"
                  onUnlock={scrollToUnlock}
                  previewImage={propertyLivingRoom}
                >
                  <GaussianSplatViewer />
                </GatedContentCard>
              </CardContent>
            </Card>

            {/* Floor Plans - Gated behind Level 2 */}
            <Card className="animate-fade-in" style={{ animationDelay: '400ms' }}>
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg sm:text-xl font-semibold">Grundrisse & Dokumente</h2>
                  {unlockLevel >= 2 ? (
                    <Badge className="bg-accent/20 text-accent">
                      <Gift className="h-3 w-3 mr-1" /> Freigeschaltet
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="gap-1">
                      <Lock className="h-3 w-3" /> Level 2
                    </Badge>
                  )}
                </div>
                <GatedContentCard
                  title="Grundrisse ansehen"
                  description="Detaillierte Grundrisse und der Energieausweis. Telefonnummer angeben für sofortigen Zugang."
                  icon={<FileText className="h-5 w-5 text-accent" />}
                  unlocked={unlockLevel >= 2}
                  unlockAction="Mit Telefon freischalten"
                  onUnlock={scrollToUnlock}
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <div className="space-y-3">
                      <p className="font-medium text-center text-sm sm:text-base">Grundriss</p>
                      <div className="rounded-xl overflow-hidden border bg-white hover:shadow-lg transition-shadow">
                        <img 
                          src={floorPlanImage} 
                          alt="Grundriss" 
                          className="w-full h-auto object-contain cursor-zoom-in hover:scale-105 transition-transform"
                          onClick={() => window.open(floorPlanImage, '_blank')}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground text-center">Klicken zum Vergrößern</p>
                    </div>
                    <div className="space-y-3">
                      <p className="font-medium text-center text-sm sm:text-base">Energieausweis</p>
                      <div className="rounded-xl overflow-hidden border bg-white hover:shadow-lg transition-shadow">
                        <img 
                          src={energyCertificateImage} 
                          alt="Energieausweis" 
                          className="w-full h-auto object-contain cursor-zoom-in hover:scale-105 transition-transform"
                          onClick={() => window.open(energyCertificateImage, '_blank')}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground text-center">Energieeffizienzklasse B</p>
                    </div>
                  </div>
                </GatedContentCard>
              </CardContent>
            </Card>

            {/* Price History - Gated behind Level 3 */}
            <Card className="animate-fade-in" style={{ animationDelay: '500ms' }}>
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg sm:text-xl font-semibold">Preishistorie & Marktdaten</h2>
                  {unlockLevel >= 3 ? (
                    <Badge className="bg-gradient-to-r from-accent to-primary text-accent-foreground">
                      <Crown className="h-3 w-3 mr-1" /> Priority
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="gap-1">
                      <Lock className="h-3 w-3" /> Level 3
                    </Badge>
                  )}
                </div>
                <GatedContentCard
                  title="Exklusive Marktdaten"
                  description="Preishistorie, Vergleichsobjekte und Marktanalyse. Nur für verifizierte Interessenten."
                  icon={<TrendingUp className="h-5 w-5 text-accent" />}
                  unlocked={unlockLevel >= 3}
                  unlockAction="Jetzt freischalten"
                  onUnlock={scrollToUnlock}
                >
                  <div className="space-y-4">
                    <div className="p-4 rounded-xl bg-secondary/50">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-muted-foreground text-sm">Aktueller Preis</span>
                        <span className="font-bold text-accent">{property.price.toLocaleString('de-DE')} €</span>
                      </div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-muted-foreground text-sm">Preis bei Einstellung</span>
                        <span className="font-medium">{(property.price * 1.05).toLocaleString('de-DE')} €</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground text-sm">Preisänderung</span>
                        <span className="text-green-500 font-medium">-5%</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 p-3 rounded-lg bg-accent/10 text-sm">
                      <Crown className="h-4 w-4 text-accent" />
                      <span>Sie haben Priority-Status für dieses Objekt</span>
                    </div>
                  </div>
                </GatedContentCard>
              </CardContent>
            </Card>

            {/* Location */}
            <Card className="animate-fade-in" style={{ animationDelay: '600ms' }}>
              <CardContent className="p-4 sm:p-6">
                <h2 className="text-lg sm:text-xl font-semibold mb-4">Lage & Umgebung</h2>
                <LocationMapSection 
                  address={property.address} 
                  city={property.city}
                  editable={false}
                />
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Combined Signup & Gamification */}
          <div className="space-y-6">
            {/* Mobile: Show contact card first */}
            <Card id="unlock-section" className="lg:sticky lg:top-20">
              <CardContent className="p-4 sm:p-6">
                <SignupGamificationCard
                  onProfileUpdate={(profile, level) => {
                    setUnlockLevel(level);
                    setUserData({ 
                      email: profile.email, 
                      phone: profile.phone, 
                      name: profile.name 
                    });
                    
                    const rewards = [
                      '3D-Tour, alle Bilder & Grundrisse',
                      'Preishistorie & Marktanalyse',
                      'Priority-Status & Direkte Makler-Linie'
                    ];
                    
                    if (level > 0 && level <= 3) {
                      setLastReward(rewards[level - 1]);
                      setNextReward(level < 3 ? rewards[level] : '');
                      setShowRewardToast(true);
                      setEngagementScore(prev => prev + 50);
                    }
                  }}
                  agentName={property.agent?.name || 'Florian Hubrich'}
                  agentTitle={property.agent?.title || 'Immobilienmakler'}
                />
              </CardContent>
            </Card>

            {/* Download Exposé */}
            <Card>
              <CardContent className="p-4 sm:p-6 text-center">
                <h3 className="font-semibold mb-2 text-sm sm:text-base">Exposé herunterladen</h3>
                <p className="text-xs sm:text-sm text-muted-foreground mb-4">Alle Informationen als PDF</p>
                <Button variant="outline" className="w-full">
                  PDF herunterladen
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Sticky Mobile CTA */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/95 backdrop-blur border-t lg:hidden z-40">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs text-muted-foreground">Kaufpreis</p>
            <p className="text-lg font-bold text-accent">{property.price.toLocaleString('de-DE')} €</p>
          </div>
          <Button onClick={scrollToUnlock} className="px-6">
            Kontakt aufnehmen
          </Button>
        </div>
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur flex items-center justify-center animate-fade-in">
          <button
            onClick={() => setLightboxOpen(false)}
            className="absolute top-4 right-4 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-secondary flex items-center justify-center hover:bg-secondary/80 transition-colors"
          >
            <X className="h-5 w-5 sm:h-6 sm:w-6" />
          </button>
          <button
            onClick={prevImage}
            className="absolute left-2 sm:left-4 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-secondary flex items-center justify-center hover:bg-secondary/80 transition-colors"
          >
            <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
          </button>
          <button
            onClick={nextImage}
            className="absolute right-2 sm:right-4 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-secondary flex items-center justify-center hover:bg-secondary/80 transition-colors"
          >
            <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
          </button>
          <img
            src={propertyImages[currentImageIndex].src}
            alt={propertyImages[currentImageIndex].label}
            className={`max-h-[80vh] max-w-[90vw] object-contain rounded-lg transition-opacity duration-300 ${isImageTransitioning ? 'opacity-0' : 'opacity-100'}`}
          />
          <div className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 bg-secondary px-4 sm:px-6 py-2 sm:py-3 rounded-full">
            <p className="font-medium text-sm sm:text-base">{propertyImages[currentImageIndex].label}</p>
          </div>
        </div>
      )}
      
      {/* Reward Toast */}
      <UnlockRewardToast
        show={showRewardToast}
        reward={lastReward}
        nextReward={nextReward}
        onClose={() => setShowRewardToast(false)}
      />
    </div>
  );
}