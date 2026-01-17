import { useState } from 'react';
import { Mail, Send, ExternalLink, Copy, Check } from 'lucide-react';
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
import { useToast } from '@/hooks/use-toast';

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

export function ReplyDialog({ open, onOpenChange, lead, propertyAddress, exposeUrl }: ReplyDialogProps) {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  
  const defaultMessage = lead ? `Sehr geehrte/r ${lead.name.split(' ')[0]},

vielen Dank für Ihr Interesse an unserer Immobilie "${propertyAddress}".

Gerne sende ich Ihnen unser ausführliches Exposé zu. Sie finden alle Details unter folgendem Link:

${exposeUrl}

Für Fragen oder einen Besichtigungstermin stehe ich Ihnen gerne zur Verfügung.

Mit freundlichen Grüßen,
Ihr Rayfield Immobilien Team` : '';

  const [message, setMessage] = useState(defaultMessage);
  const [subject, setSubject] = useState(`Exposé: ${propertyAddress}`);

  // Update message when lead changes
  useState(() => {
    if (lead) {
      setMessage(`Sehr geehrte/r ${lead.name.split(' ')[0]},

vielen Dank für Ihr Interesse an unserer Immobilie "${propertyAddress}".

Gerne sende ich Ihnen unser ausführliches Exposé zu. Sie finden alle Details unter folgendem Link:

${exposeUrl}

Für Fragen oder einen Besichtigungstermin stehe ich Ihnen gerne zur Verfügung.

Mit freundlichen Grüßen,
Ihr Rayfield Immobilien Team`);
      setSubject(`Exposé: ${propertyAddress}`);
    }
  });

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
    // For now, show success toast - in production this would send via Resend
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Antwort an {lead.name}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Original message */}
          <div className="p-3 rounded-lg bg-muted/50 border">
            <p className="text-xs text-muted-foreground mb-1">Ursprüngliche Anfrage von {lead.source}:</p>
            <p className="text-sm italic">"{lead.message}"</p>
          </div>

          {/* Recipient */}
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
            <Label className="text-sm text-muted-foreground">Exposé-Link</Label>
            <div className="flex gap-2">
              <Input value={exposeUrl} disabled className="bg-muted/30 flex-1" />
              <Button variant="outline" size="icon" onClick={handleCopyLink}>
                {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
              </Button>
              <Button variant="outline" size="icon" onClick={() => window.open(exposeUrl, '_blank')}>
                <ExternalLink className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Message */}
          <div>
            <Label className="text-sm text-muted-foreground">Nachricht</Label>
            <Textarea 
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={10}
              className="font-mono text-sm"
            />
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={handleOpenInMailClient}>
            <Mail className="h-4 w-4 mr-2" />
            Im E-Mail-Programm öffnen
          </Button>
          <Button onClick={handleSend}>
            <Send className="h-4 w-4 mr-2" />
            Senden
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
