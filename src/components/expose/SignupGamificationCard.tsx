import { useState } from 'react';
import { 
  User, Mail, Phone, Gift, Lock, Check, Crown, Sparkles,
  Heart, Home, Euro, Calendar, MapPin, Users, Key,
  ChevronRight, Star, Trophy, Zap, Eye, FileText, Box,
  ArrowRight, CheckCircle2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';

interface UserProfile {
  email: string;
  name: string;
  phone: string;
  // Preferences (Phase 2)
  budget?: string;
  timeline?: string;
  propertyTypes?: string[];
  // Deep interests (Phase 3)
  financing?: string;
  viewingPreference?: string;
  otherProperties?: boolean;
  newsletter?: boolean;
}

interface SignupGamificationCardProps {
  onProfileUpdate: (profile: UserProfile, level: number) => void;
  agentName?: string;
  agentTitle?: string;
}

const budgetOptions = [
  { value: 'under-300k', label: 'Bis 300.000 €' },
  { value: '300k-500k', label: '300.000 - 500.000 €' },
  { value: '500k-750k', label: '500.000 - 750.000 €' },
  { value: '750k-1m', label: '750.000 - 1.000.000 €' },
  { value: 'over-1m', label: 'Über 1.000.000 €' },
];

const timelineOptions = [
  { value: 'asap', label: 'So schnell wie möglich' },
  { value: '1-3-months', label: 'In 1-3 Monaten' },
  { value: '3-6-months', label: 'In 3-6 Monaten' },
  { value: '6-12-months', label: 'In 6-12 Monaten' },
  { value: 'just-looking', label: 'Erstmal nur schauen' },
];

const propertyTypeOptions = [
  { value: 'wohnung', label: 'Wohnung' },
  { value: 'haus', label: 'Haus' },
  { value: 'penthouse', label: 'Penthouse' },
  { value: 'villa', label: 'Villa' },
  { value: 'grundstueck', label: 'Grundstück' },
];

const financingOptions = [
  { value: 'approved', label: 'Finanzierung bereits genehmigt' },
  { value: 'in-progress', label: 'Finanzierung in Bearbeitung' },
  { value: 'cash', label: 'Barkauf / Eigenkapital' },
  { value: 'need-help', label: 'Brauche Beratung' },
];

const viewingOptions = [
  { value: 'in-person', label: 'Vor Ort besichtigen' },
  { value: 'virtual-first', label: 'Erst virtuell, dann vor Ort' },
  { value: 'video-call', label: 'Per Videocall' },
];

export function SignupGamificationCard({ 
  onProfileUpdate, 
  agentName = 'Maria Schmidt',
  agentTitle = 'Immobilienberaterin'
}: SignupGamificationCardProps) {
  const [phase, setPhase] = useState(0); // 0: not started, 1: basic, 2: preferences, 3: deep, 4: complete
  const [profile, setProfile] = useState<UserProfile>({
    email: '',
    name: '',
    phone: '',
  });
  const [message, setMessage] = useState('');

  const rewards = [
    { phase: 1, items: ['3D-Tour', 'Alle Bilder', 'Grundrisse'] },
    { phase: 2, items: ['Preishistorie', 'Vergleichsobjekte', 'Marktanalyse'] },
    { phase: 3, items: ['Priority-Status', 'Direkte Makler-Linie', 'Exklusive Angebote'] },
  ];

  const getPhaseProgress = () => {
    switch (phase) {
      case 0: return 0;
      case 1: return 33;
      case 2: return 66;
      case 3: 
      case 4: return 100;
      default: return 0;
    }
  };

  const handleBasicSubmit = () => {
    if (!profile.email) return;
    setPhase(1);
    onProfileUpdate(profile, 1);
  };

  const handlePreferencesSubmit = () => {
    setPhase(2);
    onProfileUpdate(profile, 2);
  };

  const handleDeepSubmit = () => {
    setPhase(3);
    onProfileUpdate(profile, 3);
  };

  const handleFinalSubmit = () => {
    setPhase(4);
    onProfileUpdate(profile, 4);
  };

  // Phase 0: Initial CTA
  if (phase === 0) {
    return (
      <div className="space-y-4">
        {/* Agent Card */}
        <div className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-br from-accent/10 to-primary/10 border border-accent/20">
          <Avatar className="h-14 w-14 border-2 border-accent/30">
            <AvatarFallback className="bg-accent/20 text-accent text-lg font-semibold">
              {agentName.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <p className="font-semibold">{agentName}</p>
            <p className="text-sm text-muted-foreground">{agentTitle}</p>
          </div>
          <Badge className="bg-green-500/20 text-green-600 border-green-500/30">
            Online
          </Badge>
        </div>

        {/* Value Proposition */}
        <div className="p-4 rounded-xl bg-secondary/50">
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <Gift className="h-4 w-4 text-accent" />
            Jetzt registrieren & freischalten
          </h3>
          <div className="space-y-2">
            {rewards.flat().slice(0, 3).map((item, idx) => (
              <div key={idx} className="flex items-center gap-2 text-sm">
                <Lock className="h-3 w-3 text-muted-foreground" />
                <span className="text-muted-foreground">{typeof item === 'string' ? item : item.items?.join(', ')}</span>
              </div>
            ))}
            <p className="text-xs text-accent mt-2">+ weitere Premium-Features</p>
          </div>
        </div>

        {/* Quick Signup */}
        <div className="space-y-3">
          <div>
            <Label htmlFor="signup-email">E-Mail-Adresse</Label>
            <Input
              id="signup-email"
              type="email"
              placeholder="ihre@email.de"
              value={profile.email}
              onChange={(e) => setProfile({ ...profile, email: e.target.value })}
            />
          </div>
          <Button 
            onClick={handleBasicSubmit} 
            className="w-full gap-2 bg-gradient-to-r from-accent to-primary hover:opacity-90"
            size="lg"
            disabled={!profile.email}
          >
            <Sparkles className="h-4 w-4" />
            Kostenlos freischalten
            <ArrowRight className="h-4 w-4" />
          </Button>
          <p className="text-xs text-center text-muted-foreground">
            Keine Kreditkarte erforderlich • Jederzeit abmelden
          </p>
        </div>
      </div>
    );
  }

  // Phase 1: Basic Info Complete - Show preferences
  if (phase === 1) {
    return (
      <div className="space-y-4">
        {/* Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium">Ihr Profil</span>
            <span className="text-accent">{getPhaseProgress()}% komplett</span>
          </div>
          <div className="h-2 bg-secondary rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-accent to-primary transition-all duration-500"
              style={{ width: `${getPhaseProgress()}%` }}
            />
          </div>
        </div>

        {/* Unlocked Reward */}
        <div className="p-3 rounded-lg bg-accent/10 border border-accent/20">
          <div className="flex items-center gap-2 text-accent text-sm font-medium mb-2">
            <CheckCircle2 className="h-4 w-4" />
            Freigeschaltet!
          </div>
          <div className="flex flex-wrap gap-2">
            {rewards[0].items.map((item, idx) => (
              <Badge key={idx} variant="secondary" className="gap-1">
                <Check className="h-3 w-3" /> {item}
              </Badge>
            ))}
          </div>
        </div>

        {/* Next Reward Preview */}
        <div className="p-3 rounded-lg bg-secondary/50">
          <div className="flex items-center gap-2 text-sm mb-2">
            <Gift className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Nächste Belohnung:</span>
          </div>
          <p className="text-sm font-medium">{rewards[1].items.join(', ')}</p>
        </div>

        {/* Preferences Form */}
        <div className="space-y-3">
          <h4 className="font-medium flex items-center gap-2">
            <Heart className="h-4 w-4 text-accent" />
            Erzählen Sie uns mehr
          </h4>
          
          <div>
            <Label>Ihr Name</Label>
            <Input
              placeholder="Max Mustermann"
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
            />
          </div>

          <div>
            <Label>Budget</Label>
            <Select
              value={profile.budget}
              onValueChange={(value) => setProfile({ ...profile, budget: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Budget auswählen" />
              </SelectTrigger>
              <SelectContent>
                {budgetOptions.map(opt => (
                  <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Wann möchten Sie umziehen?</Label>
            <Select
              value={profile.timeline}
              onValueChange={(value) => setProfile({ ...profile, timeline: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Zeitrahmen wählen" />
              </SelectTrigger>
              <SelectContent>
                {timelineOptions.map(opt => (
                  <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button onClick={handlePreferencesSubmit} className="w-full gap-2">
            Weiter
            <ChevronRight className="h-4 w-4" />
          </Button>
          
          <Button variant="ghost" size="sm" className="w-full text-muted-foreground" onClick={() => setPhase(4)}>
            Später vervollständigen
          </Button>
        </div>
      </div>
    );
  }

  // Phase 2: Preferences Complete - Deep interests
  if (phase === 2) {
    return (
      <div className="space-y-4">
        {/* Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium">Ihr Profil</span>
            <span className="text-accent">{getPhaseProgress()}% komplett</span>
          </div>
          <div className="h-2 bg-secondary rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-accent to-primary transition-all duration-500"
              style={{ width: `${getPhaseProgress()}%` }}
            />
          </div>
        </div>

        {/* Unlocked Rewards */}
        <div className="p-3 rounded-lg bg-accent/10 border border-accent/20">
          <div className="flex items-center gap-2 text-accent text-sm font-medium mb-2">
            <Trophy className="h-4 w-4" />
            Neue Inhalte freigeschaltet!
          </div>
          <div className="flex flex-wrap gap-2">
            {rewards[1].items.map((item, idx) => (
              <Badge key={idx} variant="secondary" className="gap-1">
                <Check className="h-3 w-3" /> {item}
              </Badge>
            ))}
          </div>
        </div>

        {/* Final Reward Preview */}
        <div className="p-3 rounded-lg bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20">
          <div className="flex items-center gap-2 text-sm mb-2">
            <Crown className="h-4 w-4 text-amber-500" />
            <span className="font-medium text-amber-600">Premium-Status freischalten</span>
          </div>
          <p className="text-sm text-muted-foreground">{rewards[2].items.join(', ')}</p>
        </div>

        {/* Deep Form */}
        <div className="space-y-3">
          <h4 className="font-medium flex items-center gap-2">
            <Zap className="h-4 w-4 text-accent" />
            Fast geschafft!
          </h4>

          <div>
            <Label>Telefon (für schnellere Rückmeldung)</Label>
            <Input
              type="tel"
              placeholder="+49 123 456789"
              value={profile.phone}
              onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
            />
          </div>

          <div>
            <Label>Finanzierungsstatus</Label>
            <Select
              value={profile.financing}
              onValueChange={(value) => setProfile({ ...profile, financing: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Status auswählen" />
              </SelectTrigger>
              <SelectContent>
                {financingOptions.map(opt => (
                  <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Bevorzugte Besichtigung</Label>
            <Select
              value={profile.viewingPreference}
              onValueChange={(value) => setProfile({ ...profile, viewingPreference: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Besichtigungsart wählen" />
              </SelectTrigger>
              <SelectContent>
                {viewingOptions.map(opt => (
                  <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="other-properties"
              checked={profile.otherProperties}
              onCheckedChange={(checked) => setProfile({ ...profile, otherProperties: !!checked })}
            />
            <label htmlFor="other-properties" className="text-sm">
              Zeigt mir ähnliche Objekte
            </label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="newsletter"
              checked={profile.newsletter}
              onCheckedChange={(checked) => setProfile({ ...profile, newsletter: !!checked })}
            />
            <label htmlFor="newsletter" className="text-sm">
              Über neue Angebote informieren
            </label>
          </div>

          <Button onClick={handleDeepSubmit} className="w-full gap-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:opacity-90">
            <Crown className="h-4 w-4" />
            Premium-Status aktivieren
          </Button>
        </div>
      </div>
    );
  }

  // Phase 3 & 4: Complete Profile
  return (
    <div className="space-y-4">
      {/* Success State */}
      <div className="text-center p-6 rounded-xl bg-gradient-to-br from-accent/10 to-primary/10 border border-accent/20">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center mx-auto mb-4">
          <Crown className="h-8 w-8 text-white" />
        </div>
        <h3 className="font-semibold text-lg mb-1">Premium-Mitglied</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Alle Inhalte freigeschaltet
        </p>
        <div className="flex flex-wrap gap-2 justify-center">
          {rewards.flatMap(r => r.items).map((item, idx) => (
            <Badge key={idx} className="bg-accent/20 text-accent border-accent/30 gap-1">
              <Check className="h-3 w-3" /> {item}
            </Badge>
          ))}
        </div>
      </div>

      {/* Agent Contact */}
      <div className="flex items-center gap-4 p-4 rounded-xl bg-secondary/50">
        <Avatar className="h-12 w-12 border-2 border-accent/30">
          <AvatarFallback className="bg-accent/20 text-accent font-semibold">
            {agentName.split(' ').map(n => n[0]).join('')}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <p className="font-medium">{agentName}</p>
          <p className="text-xs text-muted-foreground">Wird sich in Kürze melden</p>
        </div>
        <Badge className="bg-amber-500/20 text-amber-600 border-amber-500/30 gap-1">
          <Star className="h-3 w-3" /> Priority
        </Badge>
      </div>

      {/* Send Message */}
      <div className="space-y-3">
        <Label>Nachricht an {agentName.split(' ')[0]}</Label>
        <Textarea
          placeholder="Ich interessiere mich besonders für..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={3}
        />
        <Button onClick={handleFinalSubmit} className="w-full">
          Nachricht senden
        </Button>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-2">
        <Button variant="outline" size="sm" className="gap-1">
          <Phone className="h-3 w-3" />
          Anrufen
        </Button>
        <Button variant="outline" size="sm" className="gap-1">
          <Calendar className="h-3 w-3" />
          Termin buchen
        </Button>
      </div>
    </div>
  );
}
