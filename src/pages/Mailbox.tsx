import { useState } from 'react';
import { Mail, Check, AlertCircle, Settings, Link2, Shield, Clock, Send, ChevronRight } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { MailboxSettings, defaultMailboxSettings } from '@/data/mailboxData';

export default function Mailbox() {
  const { toast } = useToast();
  const [settings, setSettings] = useState<MailboxSettings>(defaultMailboxSettings);
  const [connectDialogOpen, setConnectDialogOpen] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<'gmail' | 'microsoft365' | null>(null);
  const [setupStep, setSetupStep] = useState(1);

  const handleConnect = (provider: 'gmail' | 'microsoft365') => {
    setSelectedProvider(provider);
    setSetupStep(1);
    setConnectDialogOpen(true);
  };

  const handleCompleteSetup = () => {
    setSettings({
      ...settings,
      connected: true,
      provider: selectedProvider,
      sendingIdentity: 'makler@rayfield-immobilien.de',
    });
    setConnectDialogOpen(false);
    toast({
      title: 'Postfach verbunden',
      description: `${selectedProvider === 'gmail' ? 'Gmail' : 'Microsoft 365'} wurde erfolgreich verbunden.`,
    });
  };

  const handleDisconnect = () => {
    setSettings(defaultMailboxSettings);
    toast({
      title: 'Postfach getrennt',
      description: 'Die Mailbox-Integration wurde deaktiviert.',
    });
  };

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold flex items-center gap-3">
            <Mail className="h-6 w-6" />
            Mailbox-Integration
          </h1>
          <p className="text-muted-foreground">Verbinden Sie Ihr Postfach für automatisierte Dokumentenanfragen</p>
        </div>

        {!settings.connected ? (
          /* Not Connected State */
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Postfach verbinden</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Verbinden Sie Ihr E-Mail-Postfach, um Dokumentenanfragen automatisch zu versenden, 
                  Antworten zu tracken und Follow-ups zu automatisieren.
                </p>
                
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => handleConnect('gmail')}
                    className="p-6 rounded-xl border-2 border-border hover:border-accent transition-colors text-left"
                  >
                    <div className="flex items-center gap-4 mb-3">
                      <div className="w-12 h-12 rounded-lg bg-red-100 flex items-center justify-center">
                        <span className="text-2xl">📧</span>
                      </div>
                      <div>
                        <p className="font-semibold">Gmail</p>
                        <p className="text-sm text-muted-foreground">Google Workspace</p>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Verbinden Sie Ihr Gmail- oder Google Workspace-Konto
                    </p>
                  </button>

                  <button
                    onClick={() => handleConnect('microsoft365')}
                    className="p-6 rounded-xl border-2 border-border hover:border-accent transition-colors text-left"
                  >
                    <div className="flex items-center gap-4 mb-3">
                      <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                        <span className="text-2xl">📨</span>
                      </div>
                      <div>
                        <p className="font-semibold">Microsoft 365</p>
                        <p className="text-sm text-muted-foreground">Outlook / Exchange</p>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Verbinden Sie Ihr Microsoft 365- oder Outlook-Konto
                    </p>
                  </button>
                </div>

                <div className="p-4 rounded-lg bg-accent/5 border border-accent/20 flex items-start gap-3">
                  <Shield className="h-5 w-5 text-accent mt-0.5" />
                  <div>
                    <p className="font-medium text-sm">Datenschutz-Hinweis</p>
                    <p className="text-sm text-muted-foreground">
                      Standardmäßig werden nur von Rayfield erstellte E-Mail-Threads getrackt. 
                      Ihre anderen E-Mails bleiben privat.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          /* Connected State */
          <div className="space-y-6">
            {/* Connection Status */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      'w-12 h-12 rounded-lg flex items-center justify-center',
                      settings.provider === 'gmail' ? 'bg-red-100' : 'bg-blue-100'
                    )}>
                      <span className="text-2xl">{settings.provider === 'gmail' ? '📧' : '📨'}</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-semibold">
                          {settings.provider === 'gmail' ? 'Gmail' : 'Microsoft 365'}
                        </p>
                        <Badge variant="outline" className="text-green-600 border-green-600">
                          <Check className="h-3 w-3 mr-1" />
                          Verbunden
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{settings.sendingIdentity}</p>
                    </div>
                  </div>
                  <Button variant="outline" onClick={handleDisconnect}>
                    Trennen
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Einstellungen
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Sending Identity */}
                <div className="space-y-2">
                  <Label>Absender-Identität</Label>
                  <Select 
                    value={settings.sendingIdentity} 
                    onValueChange={(v) => setSettings({ ...settings, sendingIdentity: v })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="makler@rayfield-immobilien.de">makler@rayfield-immobilien.de</SelectItem>
                      <SelectItem value="team@rayfield-immobilien.de">team@rayfield-immobilien.de</SelectItem>
                      <SelectItem value="dokumente@rayfield-immobilien.de">dokumente@rayfield-immobilien.de</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Tracking Scope */}
                <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/50">
                  <div className="flex items-center gap-3">
                    <Shield className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Nur Rayfield-Threads tracken</p>
                      <p className="text-sm text-muted-foreground">Empfohlen für Datenschutz</p>
                    </div>
                  </div>
                  <Switch 
                    checked={settings.trackRayfieldOnly}
                    onCheckedChange={(v) => setSettings({ ...settings, trackRayfieldOnly: v })}
                  />
                </div>

                {/* Follow-up Cadence */}
                <div className="space-y-2">
                  <Label>Follow-up Intervall</Label>
                  <Select 
                    value={settings.followUpCadence} 
                    onValueChange={(v: '3d' | '7d' | 't-2') => setSettings({ ...settings, followUpCadence: v })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="3d">Alle 3 Werktage</SelectItem>
                      <SelectItem value="7d">Alle 7 Werktage</SelectItem>
                      <SelectItem value="t-2">T-2 vor Veröffentlichung</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    Automatische Follow-up-E-Mails wenn Dokumente noch fehlen
                  </p>
                </div>

                {/* Auto-Send Mode */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/50">
                    <div className="flex items-center gap-3">
                      <Send className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Auto-Versand</p>
                        <p className="text-sm text-muted-foreground">Follow-ups automatisch senden</p>
                      </div>
                    </div>
                    <Switch 
                      checked={settings.autoSendMode}
                      onCheckedChange={(v) => setSettings({ ...settings, autoSendMode: v })}
                    />
                  </div>
                  {settings.autoSendMode && (
                    <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 dark:bg-amber-950/20 dark:border-amber-800">
                      <div className="flex items-start gap-2">
                        <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5" />
                        <p className="text-sm text-amber-800 dark:text-amber-200">
                          Bei aktivem Auto-Versand werden Follow-up-E-Mails automatisch gesendet. 
                          Deaktiviert werden nur Entwürfe erstellt.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Tracking Info */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                    <Mail className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <p className="font-medium">Was wird getrackt?</p>
                    <ul className="text-sm text-muted-foreground mt-2 space-y-1">
                      <li>• Von Rayfield gesendete Dokumentenanfragen</li>
                      <li>• Antworten auf diese Anfragen</li>
                      <li>• Anhänge in Antwort-E-Mails</li>
                      <li>• Follow-up-Status und Zeitpunkte</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Connect Dialog with Stepper */}
      <Dialog open={connectDialogOpen} onOpenChange={setConnectDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {selectedProvider === 'gmail' ? 'Gmail' : 'Microsoft 365'} verbinden
            </DialogTitle>
            <DialogDescription>
              Konfigurieren Sie die Mailbox-Integration
            </DialogDescription>
          </DialogHeader>

          {/* Stepper */}
          <div className="flex items-center gap-2 mb-6">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="flex items-center gap-2">
                <div className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium',
                  setupStep >= step 
                    ? 'bg-accent text-accent-foreground' 
                    : 'bg-muted text-muted-foreground'
                )}>
                  {setupStep > step ? <Check className="h-4 w-4" /> : step}
                </div>
                {step < 4 && (
                  <div className={cn(
                    'w-8 h-0.5',
                    setupStep > step ? 'bg-accent' : 'bg-muted'
                  )} />
                )}
              </div>
            ))}
          </div>

          {/* Step Content */}
          <div className="space-y-4">
            {setupStep === 1 && (
              <div className="space-y-4">
                <h4 className="font-medium">1. Absender-Identität wählen</h4>
                <Select defaultValue="makler@rayfield-immobilien.de">
                  <SelectTrigger>
                    <SelectValue placeholder="E-Mail-Adresse wählen" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="makler@rayfield-immobilien.de">makler@rayfield-immobilien.de</SelectItem>
                    <SelectItem value="team@rayfield-immobilien.de">team@rayfield-immobilien.de</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {setupStep === 2 && (
              <div className="space-y-4">
                <h4 className="font-medium">2. Tracking-Bereich festlegen</h4>
                <div className="flex items-center justify-between p-4 rounded-lg border">
                  <div>
                    <p className="font-medium">Nur Rayfield-Threads tracken</p>
                    <p className="text-sm text-muted-foreground">Empfohlen</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
            )}

            {setupStep === 3 && (
              <div className="space-y-4">
                <h4 className="font-medium">3. Follow-up Intervall</h4>
                <Select defaultValue="3d">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="3d">Alle 3 Werktage</SelectItem>
                    <SelectItem value="7d">Alle 7 Werktage</SelectItem>
                    <SelectItem value="t-2">T-2 vor Veröffentlichung</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {setupStep === 4 && (
              <div className="space-y-4">
                <h4 className="font-medium">4. Auto-Versand Modus</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 rounded-lg border">
                    <div>
                      <p className="font-medium">Nur Entwürfe erstellen</p>
                      <p className="text-sm text-muted-foreground">Standard - Sie prüfen vor dem Senden</p>
                    </div>
                    <input type="radio" name="autoSend" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-lg border">
                    <div>
                      <p className="font-medium">Auto-Versand aktivieren</p>
                      <p className="text-sm text-muted-foreground">Follow-ups werden automatisch gesendet</p>
                    </div>
                    <input type="radio" name="autoSend" />
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-2 mt-6">
            {setupStep > 1 && (
              <Button variant="outline" onClick={() => setSetupStep(s => s - 1)}>
                Zurück
              </Button>
            )}
            <Button 
              className="flex-1" 
              onClick={() => {
                if (setupStep < 4) {
                  setSetupStep(s => s + 1);
                } else {
                  handleCompleteSetup();
                }
              }}
            >
              {setupStep < 4 ? 'Weiter' : 'Verbindung abschließen'}
              {setupStep < 4 && <ChevronRight className="h-4 w-4 ml-1" />}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}
