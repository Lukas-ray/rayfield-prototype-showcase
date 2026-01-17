import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Ruler, BedDouble, Bath, Calendar, Home, ChevronLeft, ChevronRight, X, Box, Lock, FileText, TrendingUp, Crown, Gift } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { properties } from '@/data/dummyData';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { GatedContentCard } from '@/components/expose/GatedContentCard';
import { UnlockRewardToast } from '@/components/expose/UnlockRewardToast';
import { LocationMapSection } from '@/components/expose/LocationMapSection';
import { SignupGamificationCard } from '@/components/expose/SignupGamificationCard';

// Property images
import propertyLivingRoom from '@/assets/property-living-room.jpg';
import propertyKitchen from '@/assets/property-kitchen.jpg';
import propertyBedroom from '@/assets/property-bedroom.jpg';
import propertyBathroom from '@/assets/property-bathroom.jpg';
import propertyBalcony from '@/assets/property-balcony.jpg';
import propertyExterior from '@/assets/property-exterior.jpg';

const propertyImages = [
  { src: propertyLivingRoom, label: 'Wohnzimmer' },
  { src: propertyKitchen, label: 'Küche' },
  { src: propertyBedroom, label: 'Schlafzimmer' },
  { src: propertyBathroom, label: 'Badezimmer' },
  { src: propertyBalcony, label: 'Balkon' },
  { src: propertyExterior, label: 'Außenansicht' },
];

const features = [
  'Einbauküche',
  'Parkett',
  'Fußbodenheizung',
  'Balkon/Terrasse',
  'Aufzug',
  'Tiefgarage',
  'Keller',
  'Gäste-WC',
];

export default function PropertyExpose() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  
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

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % propertyImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + propertyImages.length) % propertyImages.length);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Button variant="ghost" onClick={() => navigate(`/property/${id}`)} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Zurück zur Verwaltung
          </Button>
          <div className="flex items-center gap-4">
            <Badge variant="secondary" className="text-sm">
              Exposé-Vorschau
            </Badge>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative">
        <div className="relative h-[60vh] overflow-hidden">
          <img
            src={propertyImages[currentImageIndex].src}
            alt={propertyImages[currentImageIndex].label}
            className="w-full h-full object-cover cursor-pointer"
            onClick={() => setLightboxOpen(true)}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
          
          {/* Navigation Arrows */}
          <button
            onClick={prevImage}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-background/80 backdrop-blur flex items-center justify-center hover:bg-background transition-colors"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            onClick={nextImage}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-background/80 backdrop-blur flex items-center justify-center hover:bg-background transition-colors"
          >
            <ChevronRight className="h-6 w-6" />
          </button>

          {/* Image Counter */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-background/80 backdrop-blur px-4 py-2 rounded-full text-sm font-medium">
            {currentImageIndex + 1} / {propertyImages.length} — {propertyImages[currentImageIndex].label}
          </div>

          {/* Quick Info Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-8">
            <div className="max-w-7xl mx-auto">
              <Badge className="mb-4 bg-accent text-accent-foreground">Exklusives Angebot</Badge>
              <h1 className="text-4xl font-bold text-foreground mb-2">{property.address}</h1>
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-5 w-5" />
                <span className="text-lg">{property.city}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Thumbnail Strip */}
        <div className="max-w-7xl mx-auto px-4 -mt-12 relative z-10">
          <div className="flex gap-2 overflow-x-auto pb-4">
            {propertyImages.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentImageIndex(idx)}
                className={`flex-shrink-0 w-24 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                  idx === currentImageIndex ? 'border-accent ring-2 ring-accent/30' : 'border-transparent opacity-70 hover:opacity-100'
                }`}
              >
                <img src={img.src} alt={img.label} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-3 gap-8">
          {/* Left Column - Details */}
          <div className="col-span-2 space-y-8">
            {/* Price & Key Stats */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Kaufpreis</p>
                    <p className="text-4xl font-bold text-accent">{property.price.toLocaleString('de-DE')} €</p>
                  </div>
                  <Badge variant="outline" className="text-lg px-4 py-2">
                    {property.propertyType}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-4 gap-4">
                  <div className="text-center p-4 rounded-xl bg-secondary/50">
                    <Ruler className="h-6 w-6 mx-auto mb-2 text-accent" />
                    <p className="text-2xl font-bold">120</p>
                    <p className="text-sm text-muted-foreground">m² Wohnfläche</p>
                  </div>
                  <div className="text-center p-4 rounded-xl bg-secondary/50">
                    <BedDouble className="h-6 w-6 mx-auto mb-2 text-accent" />
                    <p className="text-2xl font-bold">4</p>
                    <p className="text-sm text-muted-foreground">Zimmer</p>
                  </div>
                  <div className="text-center p-4 rounded-xl bg-secondary/50">
                    <Bath className="h-6 w-6 mx-auto mb-2 text-accent" />
                    <p className="text-2xl font-bold">2</p>
                    <p className="text-sm text-muted-foreground">Bäder</p>
                  </div>
                  <div className="text-center p-4 rounded-xl bg-secondary/50">
                    <Calendar className="h-6 w-6 mx-auto mb-2 text-accent" />
                    <p className="text-2xl font-bold">1985</p>
                    <p className="text-sm text-muted-foreground">Baujahr</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Description */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">Objektbeschreibung</h2>
                <div className="prose prose-neutral dark:prose-invert max-w-none">
                  <p className="text-muted-foreground leading-relaxed">
                    Diese exklusive {property.propertyType} in {property.city} bietet Ihnen höchsten Wohnkomfort in 
                    einer der begehrtesten Lagen der Stadt. Mit einer großzügigen Wohnfläche von 120 m² und 4 Zimmern 
                    ist dieses Objekt ideal für Familien oder als repräsentatives Zuhause.
                  </p>
                  <p className="text-muted-foreground leading-relaxed mt-4">
                    Die Wohnung besticht durch ihre hellen, lichtdurchfluteten Räume, hochwertige Ausstattung und 
                    einen herrlichen Balkon mit Blick ins Grüne. Die moderne Einbauküche, edle Parkettböden und 
                    Fußbodenheizung sorgen für ein angenehmes Wohngefühl.
                  </p>
                  <p className="text-muted-foreground leading-relaxed mt-4">
                    Die zentrale Lage ermöglicht eine optimale Anbindung an öffentliche Verkehrsmittel, 
                    Einkaufsmöglichkeiten und Naherholungsgebiete. Überzeugen Sie sich selbst bei einer 
                    persönlichen Besichtigung!
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Features */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">Ausstattung</h2>
                <div className="grid grid-cols-2 gap-3">
                  {features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30">
                      <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center">
                        <Home className="h-4 w-4 text-accent" />
                      </div>
                      <span className="font-medium">{feature}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Virtual Tour - Gated behind Level 1 */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold">Virtuelle Besichtigung</h2>
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
                  description="Erkunden Sie jedes Zimmer in einer interaktiven 360°-Tour. Geben Sie Ihre E-Mail an, um sofort Zugang zu erhalten."
                  icon={<Box className="h-5 w-5 text-accent" />}
                  unlocked={unlockLevel >= 1}
                  unlockAction="Mit E-Mail freischalten"
                  onUnlock={scrollToUnlock}
                  previewImage={propertyLivingRoom}
                >
                  <div className="aspect-video rounded-xl bg-gradient-to-br from-accent/20 to-primary/20 flex items-center justify-center relative overflow-hidden">
                    <img src={propertyLivingRoom} alt="360° Tour" className="absolute inset-0 w-full h-full object-cover opacity-30" />
                    <div className="relative text-center">
                      <div className="w-20 h-20 rounded-full bg-accent/90 flex items-center justify-center mx-auto mb-4 cursor-pointer hover:scale-110 transition-transform">
                        <Box className="h-10 w-10 text-accent-foreground" />
                      </div>
                      <p className="font-semibold text-lg">360° Tour starten</p>
                      <p className="text-sm text-muted-foreground">Erkunden Sie die Wohnung virtuell</p>
                    </div>
                  </div>
                </GatedContentCard>
              </CardContent>
            </Card>

            {/* Floor Plans - Gated behind Level 2 */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold">Grundrisse & Dokumente</h2>
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
                  <div className="grid grid-cols-2 gap-4">
                    <div className="aspect-square rounded-xl bg-secondary/50 flex items-center justify-center">
                      <div className="text-center">
                        <FileText className="h-12 w-12 mx-auto mb-2 text-accent" />
                        <p className="font-medium">Grundriss EG</p>
                        <Button variant="link" size="sm">PDF öffnen</Button>
                      </div>
                    </div>
                    <div className="aspect-square rounded-xl bg-secondary/50 flex items-center justify-center">
                      <div className="text-center">
                        <FileText className="h-12 w-12 mx-auto mb-2 text-accent" />
                        <p className="font-medium">Energieausweis</p>
                        <Button variant="link" size="sm">PDF öffnen</Button>
                      </div>
                    </div>
                  </div>
                </GatedContentCard>
              </CardContent>
            </Card>

            {/* Price History - Gated behind Level 3 */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold">Preishistorie & Marktdaten</h2>
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
                        <span className="text-muted-foreground">Aktueller Preis</span>
                        <span className="font-bold text-accent">{property.price.toLocaleString('de-DE')} €</span>
                      </div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-muted-foreground">Preis bei Einstellung</span>
                        <span className="font-medium">{(property.price * 1.05).toLocaleString('de-DE')} €</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Preisänderung</span>
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
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">Lage & Umgebung</h2>
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
            <Card id="unlock-section" className="sticky top-24">
              <CardContent className="p-6">
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
                  agentName="Maria Schmidt"
                  agentTitle="Immobilienberaterin"
                />
              </CardContent>
            </Card>

            {/* Download Exposé */}
            <Card>
              <CardContent className="p-6 text-center">
                <h3 className="font-semibold mb-2">Exposé herunterladen</h3>
                <p className="text-sm text-muted-foreground mb-4">Alle Informationen als PDF</p>
                <Button variant="outline" className="w-full">
                  PDF herunterladen
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Lightbox */}
      {lightboxOpen && (
        <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur flex items-center justify-center">
          <button
            onClick={() => setLightboxOpen(false)}
            className="absolute top-4 right-4 w-12 h-12 rounded-full bg-secondary flex items-center justify-center hover:bg-secondary/80"
          >
            <X className="h-6 w-6" />
          </button>
          <button
            onClick={prevImage}
            className="absolute left-4 w-12 h-12 rounded-full bg-secondary flex items-center justify-center hover:bg-secondary/80"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            onClick={nextImage}
            className="absolute right-4 w-12 h-12 rounded-full bg-secondary flex items-center justify-center hover:bg-secondary/80"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
          <img
            src={propertyImages[currentImageIndex].src}
            alt={propertyImages[currentImageIndex].label}
            className="max-h-[80vh] max-w-[90vw] object-contain rounded-lg"
          />
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-secondary px-6 py-3 rounded-full">
            <p className="font-medium">{propertyImages[currentImageIndex].label}</p>
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
