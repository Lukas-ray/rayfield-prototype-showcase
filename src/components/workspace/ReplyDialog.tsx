import { useState, useEffect } from 'react';
import { Mail, Send, ExternalLink, Copy, Check, Sparkles, MessageSquare, Calendar, FileText, HelpCircle, Clock, User, MapPin, Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface Lead {
  name: string;
  email: string;
  message: string;
  source: string;
}

interface ReplyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lead: Lead | null;
  propertyAddress: string;
  exposeUrl: string;
}

// AI-powered response templates based on inquiry type
const aiTemplates = [
  { 
    id: 'viewing', 
    label: 'Besichtigung', 
    icon: Calendar,
    keywords: ['besichtigung', 'besichtigen', 'termin', 'anschauen', 'ansehen'],
    description: 'Terminvorschlag senden'
  },
  { 
    id: 'info', 
    label: 'Mehr Infos', 
    icon: FileText,
    keywords: ['informationen', 'details', 'unterlagen', 'energieausweis', 'grundriss'],
    description: 'Zusätzliche Dokumente'
  },
  { 
    id: 'availability', 
    label: 'Verfügbarkeit', 
    icon: HelpCircle,
    keywords: ['verfügbar', 'noch da', 'noch frei', 'vergeben'],
    description: 'Status bestätigen'
  },
  { 
    id: 'general', 
    label: 'Allgemein', 
    icon: MessageSquare,
    keywords: [],
    description: 'Freundliche Antwort'
  },
];

// Detect inquiry type from message
const detectInquiryType = (message: string): string => {
  const lowerMessage = message.toLowerCase();
  for (const template of aiTemplates) {
    if (template.keywords.some(keyword => lowerMessage.includes(keyword))) {
      return template.id;
    }
  }
  return 'general';
};

// Generate AI response based on inquiry type
const generateAIResponse = (type: string, lead: Lead, propertyAddress: string, exposeUrl: string): string => {
  const firstName = lead.name.split(' ')[0];
  
  switch (type) {
    case 'viewing':
      return `Sehr geehrte/r ${firstName},

vielen Dank für Ihr Interesse an unserer Immobilie "${propertyAddress}"!

Gerne biete ich Ihnen folgende Besichtigungstermine an:

📅 Montag, 22. Januar 2024 um 14:00 Uhr
📅 Mittwoch, 24. Januar 2024 um 16:30 Uhr
📅 Samstag, 27. Januar 2024 um 11:00 Uhr

Bitte teilen Sie mir mit, welcher Termin Ihnen am besten passt, oder schlagen Sie einen alternativen Termin vor.

Das vollständige Exposé mit allen Details finden Sie hier:
${exposeUrl}

Ich freue mich auf Ihre Rückmeldung!

Mit freundlichen Grüßen,
Ihr Immosmart Team`;

    case 'info':
      return `Sehr geehrte/r ${firstName},

vielen Dank für Ihre Anfrage zu "${propertyAddress}".

Gerne sende ich Ihnen weitere Informationen zu. Im ausführlichen Exposé finden Sie:

📋 Detaillierte Objektbeschreibung
📐 Grundrisse aller Etagen
⚡ Energieausweis
📸 Hochauflösende Bilder & 3D-Tour
📍 Lage- und Umgebungsinformationen

👉 Zum Exposé: ${exposeUrl}

Falls Sie spezifische Fragen haben oder einen Besichtigungstermin wünschen, stehe ich Ihnen gerne zur Verfügung.

Mit freundlichen Grüßen,
Ihr Immosmart Team`;

    case 'availability':
      return `Sehr geehrte/r ${firstName},

vielen Dank für Ihre Anfrage zu "${propertyAddress}".

Ja, die Immobilie ist aktuell noch verfügbar! ✅

Alle Details und aktuelle Informationen finden Sie in unserem Exposé:
${exposeUrl}

Haben Sie Interesse an einem Besichtigungstermin? Ich kann Ihnen gerne zeitnah einen Termin anbieten.

Mit freundlichen Grüßen,
Ihr Immosmart Team`;

    default:
      return `Sehr geehrte/r ${firstName},

vielen Dank für Ihr Interesse an unserer Immobilie "${propertyAddress}".

Gerne sende ich Ihnen unser ausführliches Exposé zu. Sie finden alle Details unter folgendem Link:

${exposeUrl}

Für Fragen oder einen Besichtigungstermin stehe ich Ihnen gerne zur Verfügung.

Mit freundlichen Grüßen,
Ihr Immosmart Team`;
  }
};

export function ReplyDialog({ open, onOpenChange, lead, propertyAddress, exposeUrl }: ReplyDialogProps) {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('general');
  const [message, setMessage] = useState('');
  const [subject, setSubject] = useState('');

  // Detect inquiry type and generate response when lead changes
  useEffect(() => {
    if (lead && open) {
      const detectedType = detectInquiryType(lead.message);
      setSelectedTemplate(detectedType);
      setSubject(`Exposé: ${propertyAddress}`);
      
      // Simulate AI generation delay
      setIsGenerating(true);
      const timer = setTimeout(() => {
        setMessage(generateAIResponse(detectedType, lead, propertyAddress, exposeUrl));
        setIsGenerating(false);
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [lead, open, propertyAddress, exposeUrl]);

  const handleTemplateChange = (templateId: string) => {
    if (!lead) return;
    setSelectedTemplate(templateId);
    setIsGenerating(true);
    setTimeout(() => {
      setMessage(generateAIResponse(templateId, lead, propertyAddress, exposeUrl));
      setIsGenerating(false);
    }, 300);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(exposeUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({
      title: 'Link kopiert',
      description: 'Der Exposé-Link wurde in die Zwischenablage kopiert.',
    });
  };

  const handleSend = () => {
    toast({
      title: 'Nachricht gesendet',
      description: `E-Mail wurde an ${lead?.email} gesendet.`,
    });
    onOpenChange(false);
  };

  const handleOpenInMailClient = () => {
    const mailtoUrl = `mailto:${lead?.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;
    window.open(mailtoUrl, '_blank');
  };

  if (!lead) return null;

  const detectedType = detectInquiryType(lead.message);
  const detectedTemplate = aiTemplates.find(t => t.id === detectedType);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-gradient-to-br from-accent/20 to-primary/20">
              <Sparkles className="h-5 w-5 text-accent" />
            </div>
            <div>
              <span>Antwort mit KI-Support</span>
              <p className="text-sm font-normal text-muted-foreground mt-0.5">
                Intelligente Antwort basierend auf der Anfrage
              </p>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5">
          {/* Original Inquiry Card */}
          <Card className="border-accent/30 bg-gradient-to-br from-accent/5 to-transparent">
            <CardContent className="p-4">
              <div className="flex items-start gap-4">
                <div className="p-2 rounded-full bg-accent/10 shrink-0">
                  <User className="h-5 w-5 text-accent" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h4 className="font-semibold text-sm">{lead.name}</h4>
                      <p className="text-xs text-muted-foreground">{lead.email}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {lead.source}
                      </Badge>
                      {detectedTemplate && (
                        <Badge className="text-xs bg-accent/20 text-accent border-accent/30">
                          <detectedTemplate.icon className="h-3 w-3 mr-1" />
                          {detectedTemplate.label}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <Separator className="my-2" />
                  <div className="mt-2">
                    <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                      <MessageSquare className="h-3 w-3" />
                      Ursprüngliche Anfrage:
                    </p>
                    <blockquote className="text-sm italic border-l-2 border-accent/50 pl-3 py-1 bg-background/50 rounded-r">
                      "{lead.message}"
                    </blockquote>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* AI Template Selection */}
          <div>
            <Label className="text-sm text-muted-foreground mb-2 flex items-center gap-1">
              <Sparkles className="h-3 w-3" />
              KI-Antwortvorlage wählen
            </Label>
            <div className="flex gap-2 flex-wrap">
              {aiTemplates.map((template) => {
                const Icon = template.icon;
                const isDetected = template.id === detectedType;
                return (
                  <Button
                    key={template.id}
                    variant={selectedTemplate === template.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleTemplateChange(template.id)}
                    className={cn(
                      "gap-2",
                      isDetected && selectedTemplate !== template.id && "border-accent/50"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {template.label}
                    {isDetected && (
                      <Badge variant="secondary" className="text-[10px] px-1 py-0 ml-1">
                        erkannt
                      </Badge>
                    )}
                  </Button>
                );
              })}
            </div>
          </div>

          <Separator />

          {/* Recipient & Subject */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm text-muted-foreground">An</Label>
              <Input value={lead.email} disabled className="bg-muted/30" />
            </div>
            <div>
              <Label className="text-sm text-muted-foreground">Betreff</Label>
              <Input 
                value={subject} 
                onChange={(e) => setSubject(e.target.value)}
              />
            </div>
          </div>

          {/* Exposé Link */}
          <div>
            <Label className="text-sm text-muted-foreground flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              Exposé-Link (automatisch eingefügt)
            </Label>
            <div className="flex gap-2">
              <Input value={exposeUrl} disabled className="bg-muted/30 flex-1 text-xs" />
              <Button variant="outline" size="icon" onClick={handleCopyLink}>
                {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
              </Button>
              <Button variant="outline" size="icon" onClick={() => window.open(exposeUrl, '_blank')}>
                <ExternalLink className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Message with AI indicator */}
          <div>
            <Label className="text-sm text-muted-foreground flex items-center justify-between">
              <span className="flex items-center gap-1">
                <Mail className="h-3 w-3" />
                Nachricht
              </span>
              {isGenerating && (
                <span className="flex items-center gap-1 text-accent text-xs">
                  <Loader2 className="h-3 w-3 animate-spin" />
                  KI generiert Antwort...
                </span>
              )}
            </Label>
            <Textarea 
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={12}
              className={cn(
                "font-mono text-sm transition-opacity",
                isGenerating && "opacity-50"
              )}
              disabled={isGenerating}
            />
          </div>
        </div>

        <DialogFooter className="gap-2 mt-4">
          <Button variant="outline" onClick={handleOpenInMailClient}>
            <Mail className="h-4 w-4 mr-2" />
            Im E-Mail-Programm öffnen
          </Button>
          <Button onClick={handleSend} disabled={isGenerating}>
            <Send className="h-4 w-4 mr-2" />
            Senden
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
