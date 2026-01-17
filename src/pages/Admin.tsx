import { useState } from 'react';
import { Plus, Check, X, Users, FileText, Settings, Shield, Mail, Instagram, Facebook, Linkedin, Youtube, Globe, Unplug, CheckCircle2, AlertCircle, Database } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { checklistTemplates, exportPresets, roles } from '@/data/dummyData';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import onOfficeLogo from '@/assets/onoffice-logo.png';
import flowfactLogo from '@/assets/flowfact-logo.png';
import propstackLogo from '@/assets/propstack-logo.png';
import estateLogo from '@/assets/estate-logo.png';
import ebayKleinanzeigenLogo from '@/assets/ebay-kleinanzeigen-logo.png';

interface Integration {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  connected: boolean;
  connectedAccount?: string;
  category: 'email' | 'social' | 'portal' | 'crm';
}

export default function Admin() {
  const { toast } = useToast();
  const [templates, setTemplates] = useState(checklistTemplates);
  const [presets, setPresets] = useState(exportPresets);
  const [activeTab, setActiveTab] = useState('integrations');
  
  // Integration states
  const [integrations, setIntegrations] = useState<Integration[]>([
    {
      id: 'gmail',
      name: 'Gmail',
      description: 'E-Mails senden und empfangen, automatische Follow-ups',
      icon: <img src="https://www.gstatic.com/images/branding/product/2x/gmail_2020q4_48dp.png" alt="Gmail" className="h-8 w-8" />,
      connected: false,
      category: 'email',
    },
    {
      id: 'microsoft365',
      name: 'Microsoft 365',
      description: 'Outlook-Integration für E-Mail und Kalender',
      icon: <img src="https://img.icons8.com/color/48/microsoft-outlook-2019.png" alt="Outlook" className="h-8 w-8" />,
      connected: false,
      category: 'email',
    },
    {
      id: 'onoffice',
      name: 'onOffice',
      description: 'Makler-CRM für Objektverwaltung und Kundenkontakte',
      icon: <img src={onOfficeLogo} alt="onOffice" className="h-8 w-8 rounded" />,
      connected: true,
      connectedAccount: 'Rayfield GmbH',
      category: 'crm',
    },
    {
      id: 'flowfact',
      name: 'Flowfact',
      description: 'Cloud-basierte Immobiliensoftware für Makler',
      icon: <img src={flowfactLogo} alt="Flowfact" className="h-8 w-8 rounded" />,
      connected: false,
      category: 'crm',
    },
    {
      id: 'propstack',
      name: 'Propstack',
      description: 'Modernes CRM für die Immobilienbranche',
      icon: <img src={propstackLogo} alt="Propstack" className="h-8 w-8 rounded" />,
      connected: false,
      category: 'crm',
    },
    {
      id: 'estate',
      name: 'ESTATE',
      description: 'Professionelle Maklersoftware mit OpenImmo-Schnittstelle',
      icon: <img src={estateLogo} alt="ESTATE" className="h-8 w-8 rounded" />,
      connected: false,
      category: 'crm',
    },
    {
      id: 'instagram',
      name: 'Instagram',
      description: 'Immobilienfotos und Stories automatisch posten',
      icon: <Instagram className="h-8 w-8 text-pink-500" />,
      connected: true,
      connectedAccount: '@rayfield_immobilien',
      category: 'social',
    },
    {
      id: 'facebook',
      name: 'Facebook',
      description: 'Immobilienanzeigen auf Facebook Marketplace',
      icon: <Facebook className="h-8 w-8 text-blue-600" />,
      connected: false,
      category: 'social',
    },
    {
      id: 'linkedin',
      name: 'LinkedIn',
      description: 'Professionelle Immobilienpostings',
      icon: <Linkedin className="h-8 w-8 text-blue-700" />,
      connected: true,
      connectedAccount: 'Rayfield Immobilien GmbH',
      category: 'social',
    },
    {
      id: 'youtube',
      name: 'YouTube',
      description: 'Immobilienvideos und virtuelle Touren',
      icon: <Youtube className="h-8 w-8 text-red-600" />,
      connected: false,
      category: 'social',
    },
    {
      id: 'immoscout',
      name: 'ImmoScout24',
      description: 'Automatische Synchronisation mit ImmoScout24',
      icon: <Globe className="h-8 w-8 text-orange-500" />,
      connected: true,
      connectedAccount: 'rayfield_munich',
      category: 'portal',
    },
    {
      id: 'immowelt',
      name: 'Immowelt',
      description: 'Listings automatisch auf Immowelt veröffentlichen',
      icon: <Globe className="h-8 w-8 text-blue-500" />,
      connected: false,
      category: 'portal',
    },
    {
      id: 'ebay-kleinanzeigen',
      name: 'eBay Kleinanzeigen',
      description: 'Immobilienanzeigen auf eBay Kleinanzeigen schalten',
      icon: <img src={ebayKleinanzeigenLogo} alt="eBay Kleinanzeigen" className="h-8 w-8 rounded" />,
      connected: false,
      category: 'portal',
    },
  ]);

  // Mailbox settings dialog
  const [mailboxDialogOpen, setMailboxDialogOpen] = useState(false);
  const [selectedMailProvider, setSelectedMailProvider] = useState<string | null>(null);
  const [mailboxStep, setMailboxStep] = useState(1);
  const [mailboxSettings, setMailboxSettings] = useState({
    sendingIdentity: 'makler@rayfield-immobilien.de',
    trackRayfieldOnly: true,
    followUpCadence: '3d',
    autoSendMode: false,
  });

  const toggleTemplate = (id: string) => {
    setTemplates(prev => prev.map(t => t.id === id ? { ...t, active: !t.active } : t));
  };

  const togglePreset = (id: string) => {
    setPresets(prev => prev.map(p => p.id === id ? { ...p, active: !p.active } : p));
  };

  const handleConnect = (integrationId: string) => {
    if (integrationId === 'gmail' || integrationId === 'microsoft365') {
      setSelectedMailProvider(integrationId);
      setMailboxStep(1);
      setMailboxDialogOpen(true);
    } else {
      // Simulate connection for other integrations
      setIntegrations(prev => prev.map(i => 
        i.id === integrationId 
          ? { ...i, connected: true, connectedAccount: `connected_${integrationId}` }
          : i
      ));
      toast({
        title: 'Integration verbunden',
        description: `${integrations.find(i => i.id === integrationId)?.name} wurde erfolgreich verbunden.`,
      });
    }
  };

  const handleDisconnect = (integrationId: string) => {
    setIntegrations(prev => prev.map(i => 
      i.id === integrationId 
        ? { ...i, connected: false, connectedAccount: undefined }
        : i
    ));
    toast({
      title: 'Integration getrennt',
      description: `${integrations.find(i => i.id === integrationId)?.name} wurde getrennt.`,
    });
  };

  const handleMailboxSetupComplete = () => {
    setIntegrations(prev => prev.map(i => 
      i.id === selectedMailProvider 
        ? { ...i, connected: true, connectedAccount: mailboxSettings.sendingIdentity }
        : i
    ));
    setMailboxDialogOpen(false);
    setMailboxStep(1);
    toast({
      title: 'Mailbox verbunden',
      description: `${selectedMailProvider === 'gmail' ? 'Gmail' : 'Microsoft 365'} wurde erfolgreich konfiguriert.`,
    });
  };

  const emailIntegrations = integrations.filter(i => i.category === 'email');
  const socialIntegrations = integrations.filter(i => i.category === 'social');
  const portalIntegrations = integrations.filter(i => i.category === 'portal');
  const crmIntegrations = integrations.filter(i => i.category === 'crm');

  const connectedCount = integrations.filter(i => i.connected).length;

  return (
    <AppLayout>
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Einstellungen</h1>
          <p className="text-muted-foreground">Systemkonfiguration und Einstellungen</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="integrations" className="gap-2">
              <Unplug className="h-4 w-4" />
              Integrationen
              <Badge variant="secondary">{connectedCount}/{integrations.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="settings" className="gap-2">
              <Settings className="h-4 w-4" />
              Einstellungen
            </TabsTrigger>
          </TabsList>

          {/* Integrations Tab */}
          <TabsContent value="integrations">
            <div className="space-y-8">
              {/* Email Integrations */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Mail className="h-5 w-5 text-muted-foreground" />
                  <h2 className="text-lg font-semibold">E-Mail & Kommunikation</h2>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {emailIntegrations.map(integration => (
                    <div key={integration.id} className="workspace-card">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4">
                          <div className="p-2 rounded-lg bg-secondary/50">
                            {integration.icon}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold">{integration.name}</h3>
                              {integration.connected && (
                                <Badge variant="outline" className="text-green-600 border-green-600">
                                  <CheckCircle2 className="h-3 w-3 mr-1" />
                                  Verbunden
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">
                              {integration.description}
                            </p>
                            {integration.connected && integration.connectedAccount && (
                              <p className="text-sm text-accent mt-2">
                                {integration.connectedAccount}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="mt-4 flex justify-end">
                        {integration.connected ? (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleDisconnect(integration.id)}
                          >
                            Trennen
                          </Button>
                        ) : (
                          <Button 
                            size="sm"
                            onClick={() => handleConnect(integration.id)}
                          >
                            Verbinden
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* CRM Integrations */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Database className="h-5 w-5 text-muted-foreground" />
                  <h2 className="text-lg font-semibold">Makler-CRM Systeme</h2>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {crmIntegrations.map(integration => (
                    <div key={integration.id} className="workspace-card">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4">
                          <div className="p-2 rounded-lg bg-secondary/50">
                            {integration.icon}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold">{integration.name}</h3>
                              {integration.connected && (
                                <Badge variant="outline" className="text-green-600 border-green-600">
                                  <CheckCircle2 className="h-3 w-3 mr-1" />
                                  Verbunden
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">
                              {integration.description}
                            </p>
                            {integration.connected && integration.connectedAccount && (
                              <p className="text-sm text-accent mt-2">
                                {integration.connectedAccount}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="mt-4 flex justify-end">
                        {integration.connected ? (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleDisconnect(integration.id)}
                          >
                            Trennen
                          </Button>
                        ) : (
                          <Button 
                            size="sm"
                            onClick={() => handleConnect(integration.id)}
                          >
                            Verbinden
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Social Media Integrations */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Instagram className="h-5 w-5 text-muted-foreground" />
                  <h2 className="text-lg font-semibold">Social Media</h2>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {socialIntegrations.map(integration => (
                    <div key={integration.id} className="workspace-card">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4">
                          <div className="p-2 rounded-lg bg-secondary/50">
                            {integration.icon}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold">{integration.name}</h3>
                              {integration.connected && (
                                <Badge variant="outline" className="text-green-600 border-green-600">
                                  <CheckCircle2 className="h-3 w-3 mr-1" />
                                  Verbunden
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">
                              {integration.description}
                            </p>
                            {integration.connected && integration.connectedAccount && (
                              <p className="text-sm text-accent mt-2">
                                {integration.connectedAccount}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="mt-4 flex justify-end">
                        {integration.connected ? (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleDisconnect(integration.id)}
                          >
                            Trennen
                          </Button>
                        ) : (
                          <Button 
                            size="sm"
                            onClick={() => handleConnect(integration.id)}
                          >
                            Verbinden
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Portal Integrations */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Globe className="h-5 w-5 text-muted-foreground" />
                  <h2 className="text-lg font-semibold">Immobilienportale</h2>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {portalIntegrations.map(integration => (
                    <div key={integration.id} className="workspace-card">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4">
                          <div className="p-2 rounded-lg bg-secondary/50">
                            {integration.icon}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold">{integration.name}</h3>
                              {integration.connected && (
                                <Badge variant="outline" className="text-green-600 border-green-600">
                                  <CheckCircle2 className="h-3 w-3 mr-1" />
                                  Verbunden
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">
                              {integration.description}
                            </p>
                            {integration.connected && integration.connectedAccount && (
                              <p className="text-sm text-accent mt-2">
                                {integration.connectedAccount}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="mt-4 flex justify-end">
                        {integration.connected ? (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleDisconnect(integration.id)}
                          >
                            Trennen
                          </Button>
                        ) : (
                          <Button 
                            size="sm"
                            onClick={() => handleConnect(integration.id)}
                          >
                            Verbinden
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings">
            <div className="grid grid-cols-2 gap-6">
              {/* Naming Conventions */}
              <div className="workspace-card">
                <div className="flex items-center gap-2 mb-4">
                  <Settings className="h-5 w-5 text-muted-foreground" />
                  <h3 className="font-semibold">Benennungskonventionen</h3>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-muted-foreground">Dokumenten-Muster</label>
                    <Input
                      defaultValue="{DokTyp}_{Adresse}_{Jahr}.pdf"
                      className="mt-1 font-mono text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">Medien-Muster</label>
                    <Input
                      defaultValue="{ObjektID}_{Raum}_{Variante}_{Nr}.jpg"
                      className="mt-1 font-mono text-sm"
                    />
                  </div>
                  <div className="p-3 rounded-lg bg-secondary/50">
                    <p className="text-xs text-muted-foreground mb-1">Vorschau:</p>
                    <p className="text-sm font-mono">Grundbuchauszug_Muellerstr42_2024.pdf</p>
                  </div>
                </div>
              </div>

              {/* Roles & Permissions */}
              <div className="workspace-card">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-muted-foreground" />
                    <h3 className="font-semibold">Rollen & Berechtigungen</h3>
                  </div>
                  <Button size="sm" variant="outline">
                    <Plus className="h-4 w-4 mr-1" />
                    Rolle hinzufügen
                  </Button>
                </div>
                <div className="space-y-3">
                  {roles.map((role) => (
                    <div key={role.id} className="p-3 rounded-lg bg-secondary/50">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <p className="font-medium">{role.name}</p>
                        </div>
                        <span className="text-xs text-muted-foreground">{role.users} Benutzer</span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {role.permissions.map((perm) => (
                          <span key={perm} className="evidence-badge text-xs">{perm}</span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Mailbox Setup Dialog */}
        <Dialog open={mailboxDialogOpen} onOpenChange={setMailboxDialogOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>
                {selectedMailProvider === 'gmail' ? 'Gmail' : 'Microsoft 365'} verbinden
              </DialogTitle>
            </DialogHeader>

            {/* Stepper */}
            <div className="flex items-center justify-between mb-6">
              {[1, 2, 3, 4].map((step) => (
                <div key={step} className="flex items-center">
                  <div className={cn(
                    'w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium',
                    mailboxStep >= step 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-secondary text-muted-foreground'
                  )}>
                    {mailboxStep > step ? <Check className="h-4 w-4" /> : step}
                  </div>
                  {step < 4 && (
                    <div className={cn(
                      'w-12 h-0.5 mx-2',
                      mailboxStep > step ? 'bg-primary' : 'bg-secondary'
                    )} />
                  )}
                </div>
              ))}
            </div>

            {/* Step Content */}
            <div className="space-y-4">
              {mailboxStep === 1 && (
                <>
                  <h4 className="font-medium">Absender-Identität wählen</h4>
                  <Select 
                    value={mailboxSettings.sendingIdentity}
                    onValueChange={(v) => setMailboxSettings(prev => ({ ...prev, sendingIdentity: v }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="makler@rayfield-immobilien.de">makler@rayfield-immobilien.de</SelectItem>
                      <SelectItem value="info@rayfield-immobilien.de">info@rayfield-immobilien.de</SelectItem>
                      <SelectItem value="team@rayfield-immobilien.de">team@rayfield-immobilien.de</SelectItem>
                    </SelectContent>
                  </Select>
                </>
              )}

              {mailboxStep === 2 && (
                <>
                  <h4 className="font-medium">Tracking-Bereich</h4>
                  <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/50">
                    <div>
                      <p className="font-medium">Nur Rayfield-Threads verfolgen</p>
                      <p className="text-sm text-muted-foreground">Empfohlen für Datenschutz</p>
                    </div>
                    <Switch 
                      checked={mailboxSettings.trackRayfieldOnly}
                      onCheckedChange={(v) => setMailboxSettings(prev => ({ ...prev, trackRayfieldOnly: v }))}
                    />
                  </div>
                  {!mailboxSettings.trackRayfieldOnly && (
                    <div className="flex items-start gap-2 p-3 rounded-lg bg-amber-50 text-amber-800 text-sm">
                      <AlertCircle className="h-4 w-4 mt-0.5" />
                      <p>Alle E-Mails werden analysiert. Stellen Sie sicher, dass dies den Datenschutzrichtlinien entspricht.</p>
                    </div>
                  )}
                </>
              )}

              {mailboxStep === 3 && (
                <>
                  <h4 className="font-medium">Follow-up Rhythmus</h4>
                  <Select 
                    value={mailboxSettings.followUpCadence}
                    onValueChange={(v) => setMailboxSettings(prev => ({ ...prev, followUpCadence: v }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="3d">Alle 3 Werktage</SelectItem>
                      <SelectItem value="7d">Alle 7 Tage</SelectItem>
                      <SelectItem value="t-2">T-2 vor Deadline</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-muted-foreground">
                    Automatische Erinnerungen werden nach diesem Rhythmus gesendet, bis alle Dokumente eingegangen sind.
                  </p>
                </>
              )}

              {mailboxStep === 4 && (
                <>
                  <h4 className="font-medium">Auto-Sende-Modus</h4>
                  <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/50">
                    <div>
                      <p className="font-medium">Automatisch senden</p>
                      <p className="text-sm text-muted-foreground">Follow-ups ohne manuelle Freigabe</p>
                    </div>
                    <Switch 
                      checked={mailboxSettings.autoSendMode}
                      onCheckedChange={(v) => setMailboxSettings(prev => ({ ...prev, autoSendMode: v }))}
                    />
                  </div>
                  {mailboxSettings.autoSendMode && (
                    <div className="flex items-start gap-2 p-3 rounded-lg bg-amber-50 text-amber-800 text-sm">
                      <AlertCircle className="h-4 w-4 mt-0.5" />
                      <p>E-Mails werden automatisch ohne Ihre Überprüfung gesendet.</p>
                    </div>
                  )}
                  {!mailboxSettings.autoSendMode && (
                    <p className="text-sm text-muted-foreground">
                      Follow-ups werden als Entwurf erstellt und erfordern Ihre Freigabe.
                    </p>
                  )}
                </>
              )}
            </div>

            {/* Navigation */}
            <div className="flex justify-between mt-6">
              <Button 
                variant="outline" 
                onClick={() => mailboxStep > 1 ? setMailboxStep(prev => prev - 1) : setMailboxDialogOpen(false)}
              >
                {mailboxStep === 1 ? 'Abbrechen' : 'Zurück'}
              </Button>
              <Button 
                onClick={() => mailboxStep < 4 ? setMailboxStep(prev => prev + 1) : handleMailboxSetupComplete()}
              >
                {mailboxStep === 4 ? 'Verbinden' : 'Weiter'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );
}
