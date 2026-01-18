import { useState } from 'react';
import { Sparkles, Copy, RefreshCw, Check, Hash, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface CaptionGeneratorProps {
  platform: string;
  propertyData?: {
    title: string;
    location: string;
    price: string;
    rooms: number;
    size: string;
  };
  onCaptionChange: (caption: string) => void;
  initialCaption?: string;
}

const platformTones = {
  Instagram: { tone: 'locker & emotional', maxLength: 2200, hashtags: true },
  Facebook: { tone: 'informativ & einladend', maxLength: 63206, hashtags: false },
  LinkedIn: { tone: 'professionell & sachlich', maxLength: 3000, hashtags: true },
  YouTube: { tone: 'detailliert & SEO-optimiert', maxLength: 5000, hashtags: false },
};

const sampleCaptions = {
  Instagram: [
    '🏠 Traumwohnung in bester Lage!\n\nDiese lichtdurchflutete 3-Zimmer Altbauwohnung mit originalem Stuck verzaubert auf den ersten Blick.\n\n✨ 85 m² zum Verlieben\n🛏️ 3 helle Zimmer\n🌳 Balkon mit Blick ins Grüne\n📍 München-Schwabing\n\nJetzt Besichtigung vereinbaren!\nLink in Bio 👆\n\n#immobilien #münchen #wohnung #altbau #schwabing #traumwohnung #immobilienscout #newhome',
    '✨ NEU IM PORTFOLIO ✨\n\nWas für ein Schmuckstück! Diese Altbau-Perle in Schwabing sucht neue Besitzer.\n\n🔑 3 Zimmer | 85m² | Balkon\n💰 685.000 €\n📍 Top-Lage am Englischen Garten\n\nMehr Infos? DM oder Link in Bio!\n\n#münchen #immobilie #altbau #schwabing #wohnungskauf',
    '🏡 Home Sweet Home\n\nStellen Sie sich vor: Hohe Decken, warmes Licht durch große Fenster, originaler Stuck...\n\nDiese Wohnung hat alles, was das Herz begehrt.\n\n👉 Swipe für mehr Eindrücke\n\n#dreamhome #münchen #realestate #luxuryapartment',
  ],
  LinkedIn: [
    '🏢 Exklusives Investment-Objekt in München-Schwabing\n\nWir freuen uns, diese außergewöhnliche Altbauwohnung in einer der begehrtesten Lagen Münchens präsentieren zu dürfen.\n\n📊 Objektdaten:\n• 85 m² Wohnfläche\n• 3 Zimmer mit Südbalkon\n• Originalstuck, Dielenboden\n• Energieeffizienzklasse B\n\nDie Mikrolage am Englischen Garten und die hochwertige Bausubstanz machen diese Immobilie zu einer nachhaltigen Wertanlage.\n\nInteressiert? Kontaktieren Sie unser Team für weitere Informationen.\n\n#RealEstate #Investment #München #Immobilien',
    '📍 Premium-Lage München-Schwabing\n\nNeues Objekt im Portfolio unserer Agentur:\n\nEine charaktervolle 3-Zimmer Altbauwohnung, die historischen Charme mit modernem Wohnkomfort verbindet.\n\nHighlights:\n✓ Renovierter Altbau (Bj. 1905)\n✓ 85 m², 3 Zimmer\n✓ Südbalkon, Stuck, Parkett\n✓ 5 Min. zum Englischen Garten\n\nFür Kapitalanleger und Eigennutzer gleichermaßen interessant.\n\n#Immobilien #PropertyInvestment #München',
  ],
  YouTube: [
    '🏠 Exklusive Wohnungsbesichtigung: Traumhafte 3-Zimmer Altbauwohnung in München-Schwabing | Immobilien-Tour\n\nIn diesem Video nehmen wir Sie mit auf eine exklusive Besichtigung einer wunderschönen Altbauwohnung im begehrten Stadtteil Schwabing.\n\n⏱️ KAPITEL:\n0:00 Einführung & Lage\n0:45 Eingangsbereich\n1:30 Wohnzimmer mit Stuck\n2:45 Offene Küche\n3:30 Schlafzimmer\n4:15 Badezimmer\n4:45 Balkon & Ausblick\n5:30 Fazit & Kontakt\n\n📋 OBJEKTDATEN:\n• Wohnfläche: 85 m²\n• Zimmer: 3\n• Baujahr: 1905\n• Kaufpreis: 685.000 €\n• Lage: München-Schwabing\n\n📞 Interesse? Kontaktieren Sie uns:\nTel: +49 89 123 456 78\nE-Mail: info@immosmart.de\nWeb: www.immosmart.de\n\n👍 Gefällt Ihnen das Video? Dann lassen Sie einen Like da und abonnieren Sie unseren Kanal für mehr Immobilien-Content!',
  ],
  Facebook: [
    '🏠 NEUE IMMOBILIE: Traumhafte Altbauwohnung in München-Schwabing\n\nWir präsentieren Ihnen eine außergewöhnliche 3-Zimmer Wohnung in einer der beliebtesten Lagen Münchens.\n\n📍 Lage: München-Schwabing, 5 Minuten zum Englischen Garten\n📐 Größe: 85 m² Wohnfläche\n🛏️ Zimmer: 3 (inkl. Balkon)\n💰 Preis: 685.000 €\n\nDiese Wohnung besticht durch:\n✓ Originaler Stuck und hohe Decken\n✓ Dielenboden durchgehend\n✓ Sonniger Südbalkon\n✓ Modernisiertes Bad\n✓ Ruhige Hoflage\n\nMehr Infos und Besichtigungstermine unter:\n📞 +49 89 123 456 78\n📧 info@immosmart.de\n\nTeilen Sie diesen Beitrag gerne mit Freunden, die auf der Suche sind! 🏡',
  ],
};

export function CaptionGenerator({ platform, propertyData, onCaptionChange, initialCaption }: CaptionGeneratorProps) {
  const { toast } = useToast();
  const [caption, setCaption] = useState(initialCaption || '');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [language, setLanguage] = useState<'de' | 'en'>('de');
  
  const platformConfig = platformTones[platform as keyof typeof platformTones] || platformTones.Instagram;
  const platformCaptions = sampleCaptions[platform as keyof typeof sampleCaptions] || sampleCaptions.Instagram;

  const generateCaption = () => {
    setIsGenerating(true);
    
    // Simulate AI generation with random selection
    setTimeout(() => {
      const randomCaption = platformCaptions[Math.floor(Math.random() * platformCaptions.length)];
      setCaption(randomCaption);
      onCaptionChange(randomCaption);
      setIsGenerating(false);
      toast({
        title: 'Caption generiert',
        description: `Optimiert für ${platform} im ${platformConfig.tone} Stil.`,
      });
    }, 1500);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(caption);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({
      title: 'Kopiert!',
      description: 'Text wurde in die Zwischenablage kopiert.',
    });
  };

  const handleChange = (value: string) => {
    setCaption(value);
    onCaptionChange(value);
  };

  return (
    <div className="space-y-4">
      {/* Header with Generate Button */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="gap-1">
            <Globe className="h-3 w-3" />
            {platform}
          </Badge>
          <span className="text-xs text-muted-foreground">
            Ton: {platformConfig.tone}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setLanguage(language === 'de' ? 'en' : 'de')}
            className="gap-1 text-xs"
          >
            {language === 'de' ? '🇩🇪 DE' : '🇬🇧 EN'}
          </Button>
          <Button
            variant="default"
            size="sm"
            onClick={generateCaption}
            disabled={isGenerating}
            className="gap-2"
          >
            {isGenerating ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="h-4 w-4" />
            )}
            {isGenerating ? 'Generiere...' : 'KI-Text generieren'}
          </Button>
        </div>
      </div>

      {/* Caption Textarea */}
      <div className="relative">
        <Textarea
          value={caption}
          onChange={(e) => handleChange(e.target.value)}
          rows={10}
          className="resize-none pr-10 text-sm"
          placeholder={`Beschreiben Sie Ihre Immobilie für ${platform}...`}
        />
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 h-8 w-8"
          onClick={handleCopy}
          disabled={!caption}
        >
          {copied ? (
            <Check className="h-4 w-4 text-green-500" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Character Count & Hashtag Hint */}
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <span className={cn(
            caption.length > platformConfig.maxLength ? "text-destructive" : "text-muted-foreground"
          )}>
            {caption.length} / {platformConfig.maxLength.toLocaleString()} Zeichen
          </span>
          {platformConfig.hashtags && caption.includes('#') && (
            <Badge variant="secondary" className="gap-1 text-xs">
              <Hash className="h-3 w-3" />
              {(caption.match(/#\w+/g) || []).length} Hashtags
            </Badge>
          )}
        </div>
        {platformConfig.hashtags && (
          <span className="text-muted-foreground">
            Tipp: 5-15 Hashtags optimal für {platform}
          </span>
        )}
      </div>

      {/* Quick Suggestions */}
      <div className="space-y-2">
        <p className="text-xs font-medium text-muted-foreground">Schnelle Ergänzungen:</p>
        <div className="flex flex-wrap gap-1">
          {[
            '🏠 Neue Immobilie',
            '📍 Top-Lage',
            '✨ Frisch renoviert',
            '📞 Jetzt anfragen',
            '🔑 Sofort verfügbar',
            '#immobilien',
            '#münchen',
            '#traumhaus',
          ].map((tag) => (
            <Badge
              key={tag}
              variant="outline"
              className="cursor-pointer hover:bg-accent hover:text-accent-foreground transition-colors text-xs"
              onClick={() => handleChange(caption + (caption ? ' ' : '') + tag)}
            >
              {tag}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
}
