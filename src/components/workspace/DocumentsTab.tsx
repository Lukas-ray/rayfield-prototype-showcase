import { useState } from 'react';
import { Upload, FileText, Check, Clock, AlertCircle, Send, Link, ExternalLink, Mail, User, Building2, Scale, Landmark, Eye, Pause, ChevronRight, Paperclip, Plus, MessageSquare, Inbox, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
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
import { documents as initialDocs, Document } from '@/data/dummyData';
import { 
  RequestPacket, 
  EmailThread, 
  EmailMessage,
  MailException,
  holderConfig, 
  statusConfig as mailStatusConfig,
  replyTemplates,
  exceptionTypeConfig,
  defaultMailboxSettings,
  MailboxSettings
} from '@/data/mailboxData';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

const docStatusConfig = {
  missing: { icon: AlertCircle, label: 'Fehlt', class: 'text-destructive', bg: 'bg-destructive/10' },
  requested: { icon: Clock, label: 'Angefordert', class: 'text-amber-600', bg: 'bg-amber-50' },
  received: { icon: FileText, label: 'Erhalten', class: 'text-blue-600', bg: 'bg-blue-50' },
  verified: { icon: Check, label: 'Verifiziert', class: 'text-green-600', bg: 'bg-green-50' },
};

const holderLabels: Record<string, { label: string; icon: typeof User; color: string; bg: string }> = {
  seller: { label: 'Verkäufer', icon: User, color: 'text-blue-600', bg: 'bg-blue-100' },
  hausverwaltung: { label: 'Hausverwaltung', icon: Building2, color: 'text-purple-600', bg: 'bg-purple-100' },
  agent: { label: 'Makler', icon: User, color: 'text-slate-600', bg: 'bg-slate-100' },
  notary: { label: 'Notar', icon: Scale, color: 'text-amber-600', bg: 'bg-amber-100' },
  authority: { label: 'Behörde', icon: Landmark, color: 'text-slate-600', bg: 'bg-slate-100' },
};

// Extended document type with holder info
interface ExtendedDocument extends Document {
  holder: 'seller' | 'hausverwaltung' | 'agent' | 'notary' | 'authority';
  holderName?: string;
  holderEmail?: string;
}

export function DocumentsTab() {
  const { toast } = useToast();
  
  // Extended documents with holder info
  const [docs, setDocs] = useState<ExtendedDocument[]>([
    { id: '1', name: 'Grundbuchauszug', type: 'Grundbuch', status: 'verified', uploadedAt: '2024-01-10', source: 'agent', holder: 'agent' },
    { id: '2', name: 'Energieausweis', type: 'Energieausweis', status: 'missing', holder: 'seller', holderName: 'Hans Schmidt', holderEmail: 'hans.schmidt@email.de' },
    { id: '3', name: 'Teilungserklärung', type: 'Teilungserklärung', status: 'requested', source: 'hausverwaltung', holder: 'hausverwaltung', holderName: 'HV Müller GmbH', holderEmail: 'info@hv-mueller.de' },
    { id: '4', name: 'Wirtschaftsplan 2024', type: 'Wirtschaftsplan', status: 'received', uploadedAt: '2024-01-12', source: 'hausverwaltung', holder: 'hausverwaltung', holderName: 'HV Müller GmbH', holderEmail: 'info@hv-mueller.de' },
    { id: '5', name: 'Protokolle Eigentümerversammlung', type: 'Protokolle', status: 'missing', holder: 'hausverwaltung', holderName: 'HV Müller GmbH', holderEmail: 'info@hv-mueller.de' },
    { id: '6', name: 'Hausgeldabrechnung', type: 'Hausgeldabrechnung', status: 'verified', uploadedAt: '2024-01-08', source: 'seller', holder: 'seller', holderName: 'Hans Schmidt', holderEmail: 'hans.schmidt@email.de' },
    { id: '7', name: 'Wohnflächenberechnung', type: 'Flächenberechnung', status: 'received', uploadedAt: '2024-01-11', source: 'seller', holder: 'seller', holderName: 'Hans Schmidt', holderEmail: 'hans.schmidt@email.de' },
    { id: '8', name: 'Mietvertrag', type: 'Mietvertrag', status: 'missing', holder: 'seller', holderName: 'Hans Schmidt', holderEmail: 'hans.schmidt@email.de' },
  ]);
  
  const [showUploadPreview, setShowUploadPreview] = useState(false);
  const [previewFile, setPreviewFile] = useState({ original: '', suggested: '', type: '' });
  const [activeTab, setActiveTab] = useState('checklist');
  
  // Mailbox integration state
  const [mailboxSettings, setMailboxSettings] = useState<MailboxSettings>(defaultMailboxSettings);
  const [connectDialogOpen, setConnectDialogOpen] = useState(false);
  
  // Document request state
  const [selectedDoc, setSelectedDoc] = useState<ExtendedDocument | null>(null);
  const [requestDialogOpen, setRequestDialogOpen] = useState(false);
  const [emailBody, setEmailBody] = useState('');
  const [showBcc, setShowBcc] = useState(false);
  
  // Email threads state
  const [threads, setThreads] = useState<EmailThread[]>([]);
  const [selectedThread, setSelectedThread] = useState<EmailThread | null>(null);
  const [exceptions, setExceptions] = useState<MailException[]>([]);
  const [simulateDialogOpen, setSimulateDialogOpen] = useState(false);
  const [selectedReplyType, setSelectedReplyType] = useState<string>('docs_attached');

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setPreviewFile({
      original: 'hausgeld_jan2024.pdf',
      suggested: 'Hausgeldabrechnung_Muellerstr42_2024.pdf',
      type: 'Hausgeldabrechnung',
    });
    setShowUploadPreview(true);
  };

  const handleConfirmUpload = () => {
    setShowUploadPreview(false);
    toast({
      title: 'Dokument hochgeladen',
      description: 'Datei wurde klassifiziert und umbenannt.',
    });
  };

  const copyUploadLink = () => {
    navigator.clipboard.writeText('https://upload.rayfield.io/p/abc123');
    toast({
      title: 'Link kopiert',
      description: 'Verkäufer-Upload-Link in die Zwischenablage kopiert.',
    });
  };

  const handleDocumentClick = (doc: ExtendedDocument) => {
    if (doc.status === 'missing' || doc.status === 'requested') {
      setSelectedDoc(doc);
      setEmailBody(`Sehr geehrte${doc.holder === 'seller' ? 'r Herr Schmidt' : ' Damen und Herren'},

im Rahmen des Verkaufsprozesses für die Immobilie Maximilianstraße 42, München benötigen wir folgendes Dokument:

• ${doc.name}

Bitte laden Sie das Dokument über den folgenden Link hoch:
https://upload.rayfield.io/p/${doc.id}

Frist: 25. Januar 2024

Mit freundlichen Grüßen
Ihr Rayfield Team`);
      setRequestDialogOpen(true);
    } else {
      toast({
        title: doc.name,
        description: `Status: ${docStatusConfig[doc.status].label}${doc.uploadedAt ? ` • Hochgeladen: ${doc.uploadedAt}` : ''}`,
      });
    }
  };

  const handleSendRequest = () => {
    if (!selectedDoc) return;

    // Update document status
    setDocs(prev => prev.map(d => 
      d.id === selectedDoc.id 
        ? { ...d, status: 'requested' as const }
        : d
    ));

    // Check if thread exists for this holder
    const existingThread = threads.find(t => t.holder === selectedDoc.holderName);
    
    // Map holder type for thread (agent doesn't need email threads)
    const threadHolderType = selectedDoc.holder === 'agent' ? 'seller' : selectedDoc.holder;
    
    if (existingThread) {
      // Add message to existing thread
      const newMessage: EmailMessage = {
        id: `msg_${Date.now()}`,
        direction: 'outgoing',
        from: 'makler@rayfield-immobilien.de',
        to: selectedDoc.holderEmail || '',
        subject: `Dokumentenanfrage: ${selectedDoc.name}`,
        body: emailBody,
        timestamp: new Date().toLocaleString('de-DE'),
        attachments: [],
      };
      
      setThreads(prev => prev.map(t => 
        t.id === existingThread.id
          ? { ...t, messages: [...t.messages, newMessage], lastActivity: 'Gerade eben' }
          : t
      ));
    } else {
      // Create new thread
      const newThread: EmailThread = {
        id: `thread_${Date.now()}`,
        holder: selectedDoc.holderName || selectedDoc.holder,
        holderType: threadHolderType,
        subject: `Dokumentenanfrage - Maximilianstraße 42`,
        status: 'waiting',
        lastActivity: 'Gerade eben',
        messages: [{
          id: `msg_${Date.now()}`,
          direction: 'outgoing',
          from: 'makler@rayfield-immobilien.de',
          to: selectedDoc.holderEmail || '',
          subject: `Dokumentenanfrage: ${selectedDoc.name}`,
          body: emailBody,
          timestamp: new Date().toLocaleString('de-DE'),
          attachments: [],
        }],
      };
      setThreads(prev => [...prev, newThread]);
    }

    setRequestDialogOpen(false);
    toast({
      title: 'Anfrage gesendet',
      description: `E-Mail für "${selectedDoc.name}" an ${selectedDoc.holderName} gesendet.`,
    });
  };

  const handleSimulateReply = () => {
    if (!selectedThread) return;

    const template = replyTemplates[selectedReplyType as keyof typeof replyTemplates];
    const newMessage: EmailMessage = {
      id: `m${Date.now()}`,
      direction: 'incoming',
      from: selectedThread.holder,
      to: 'makler@rayfield-immobilien.de',
      subject: `Re: ${selectedThread.subject}`,
      body: template.body,
      timestamp: new Date().toLocaleString('de-DE'),
      attachments: template.attachments.map((a, i) => ({
        id: `att${Date.now()}_${i}`,
        name: a.name,
        type: a.type,
        size: a.size,
        classified: false,
        ingested: false,
      })),
    };

    if (selectedReplyType === 'vollmacht_needed') {
      setExceptions(prev => [...prev, {
        id: `exc${Date.now()}`,
        type: 'vollmacht',
        threadId: selectedThread.id,
        holder: selectedThread.holder,
        description: 'Empfänger fordert unterschriebene Vollmacht',
        timestamp: new Date().toLocaleString('de-DE'),
        resolved: false,
      }]);
    } else if (selectedReplyType === 'fee_required') {
      setExceptions(prev => [...prev, {
        id: `exc${Date.now()}`,
        type: 'fee',
        threadId: selectedThread.id,
        holder: selectedThread.holder,
        description: 'Gebühr für Dokumentenausstellung erforderlich',
        timestamp: new Date().toLocaleString('de-DE'),
        resolved: false,
      }]);
    }

    setThreads(prev => prev.map(t => 
      t.id === selectedThread.id 
        ? { 
            ...t, 
            messages: [...t.messages, newMessage],
            lastActivity: 'Gerade eben',
            status: template.attachments.length > 0 ? 'active' : 'blocked'
          }
        : t
    ));

    setSelectedThread(prev => prev ? {
      ...prev,
      messages: [...prev.messages, newMessage],
      lastActivity: 'Gerade eben',
    } : null);

    setSimulateDialogOpen(false);
    
    toast({
      title: 'Antwort simuliert',
      description: `Neue Nachricht von ${selectedThread.holder} erhalten.`,
    });
  };

  const handleIngestAttachments = (message: EmailMessage) => {
    const attachmentsToIngest = message.attachments.filter(a => !a.ingested);
    
    setThreads(prev => prev.map(t => ({
      ...t,
      messages: t.messages.map(m => 
        m.id === message.id 
          ? {
              ...m,
              attachments: m.attachments.map(a => ({
                ...a,
                classified: true,
                ingested: true,
                classifiedAs: a.type,
              }))
            }
          : m
      )
    })));

    setSelectedThread(prev => prev ? {
      ...prev,
      messages: prev.messages.map(m => 
        m.id === message.id 
          ? {
              ...m,
              attachments: m.attachments.map(a => ({
                ...a,
                classified: true,
                ingested: true,
                classifiedAs: a.type,
              }))
            }
          : m
      )
    } : null);

    // Update document checklist
    setDocs(prev => prev.map(doc => {
      const matchingAtt = attachmentsToIngest.find(a => a.type === doc.type);
      if (matchingAtt) {
        return { ...doc, status: 'received' as const };
      }
      return doc;
    }));

    toast({
      title: 'Anhänge importiert',
      description: `${attachmentsToIngest.length} Dokument(e) wurden in die Checkliste übernommen.`,
    });
  };

  const handleConnectMailbox = (provider: 'gmail' | 'microsoft365') => {
    setMailboxSettings(prev => ({
      ...prev,
      connected: true,
      provider,
      sendingIdentity: 'makler@rayfield-immobilien.de',
    }));
    setConnectDialogOpen(false);
    toast({
      title: 'Mailbox verbunden',
      description: `${provider === 'gmail' ? 'Gmail' : 'Microsoft 365'} wurde erfolgreich verbunden.`,
    });
  };

  // Group documents by holder
  const docsByHolder = docs.reduce((acc, doc) => {
    const holder = doc.holder;
    if (!acc[holder]) acc[holder] = [];
    acc[holder].push(doc);
    return acc;
  }, {} as Record<string, ExtendedDocument[]>);

  const missingDocsCount = docs.filter(d => d.status === 'missing').length;
  const verifiedDocsCount = docs.filter(d => d.status === 'verified').length;
  const unreadExceptions = exceptions.filter(e => !e.resolved);

  return (
    <div className="space-y-6">
      {/* Mailbox Connection Banner */}
      {!mailboxSettings.connected && missingDocsCount > 0 && (
        <div className="flex items-center justify-between p-4 rounded-lg bg-accent/10 border border-accent/20">
          <div className="flex items-center gap-3">
            <Mail className="h-5 w-5 text-accent" />
            <div>
              <p className="font-medium">Mailbox verbinden für automatische Dokumentenanfragen</p>
              <p className="text-sm text-muted-foreground">
                {missingDocsCount} Dokumente fehlen noch. Verbinden Sie Ihre Mailbox für automatische Anfragen.
              </p>
            </div>
          </div>
          <Button onClick={() => setConnectDialogOpen(true)}>
            <Mail className="h-4 w-4 mr-2" />
            Mailbox verbinden
          </Button>
        </div>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="checklist" className="gap-2">
            <FileText className="h-4 w-4" />
            Checkliste
            <Badge variant="secondary" className="ml-1">
              {verifiedDocsCount}/{docs.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="threads" className="gap-2">
            <Inbox className="h-4 w-4" />
            E-Mail-Threads
            {threads.length > 0 && (
              <Badge variant="secondary" className="ml-1">{threads.length}</Badge>
            )}
          </TabsTrigger>
          {unreadExceptions.length > 0 && (
            <TabsTrigger value="exceptions" className="gap-2">
              <AlertCircle className="h-4 w-4" />
              Ausnahmen
              <Badge variant="destructive" className="ml-1">{unreadExceptions.length}</Badge>
            </TabsTrigger>
          )}
        </TabsList>

        {/* Checklist Tab */}
        <TabsContent value="checklist" className="mt-6">
          <div className="grid grid-cols-3 gap-6">
            {/* Document Checklist by Holder */}
            <div className="col-span-2 space-y-6">
              {Object.entries(docsByHolder).map(([holder, holderDocs]) => {
                const holderInfo = holderLabels[holder];
                const HolderIcon = holderInfo.icon;
                const holderMissingCount = holderDocs.filter(d => d.status === 'missing').length;
                const holderVerifiedCount = holderDocs.filter(d => d.status === 'verified').length;
                const firstDoc = holderDocs[0];
                
                return (
                  <div key={holder} className="workspace-card">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={cn('p-2 rounded-lg', holderInfo.bg)}>
                          <HolderIcon className={cn('h-5 w-5', holderInfo.color)} />
                        </div>
                        <div>
                          <h3 className="font-semibold">{holderInfo.label}</h3>
                          {firstDoc.holderName && (
                            <p className="text-sm text-muted-foreground">{firstDoc.holderName}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right text-sm">
                          <span className="text-green-600 font-medium">{holderVerifiedCount}</span>
                          <span className="text-muted-foreground"> / {holderDocs.length}</span>
                          {holderMissingCount > 0 && (
                            <span className="text-destructive ml-2">({holderMissingCount} fehlen)</span>
                          )}
                        </div>
                        {firstDoc.holderEmail && holderMissingCount > 0 && (
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => {
                              const missingDocs = holderDocs.filter(d => d.status === 'missing');
                              if (missingDocs.length > 0) {
                                handleDocumentClick(missingDocs[0]);
                              }
                            }}
                          >
                            <Send className="h-4 w-4 mr-2" />
                            Alle anfordern
                          </Button>
                        )}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      {holderDocs.map((doc) => {
                        const status = docStatusConfig[doc.status];
                        const StatusIcon = status.icon;
                        const isClickable = doc.status === 'missing' || doc.status === 'requested';
                        
                        return (
                          <div 
                            key={doc.id} 
                            onClick={() => handleDocumentClick(doc)}
                            className={cn(
                              'flex items-center justify-between p-3 rounded-lg transition-all',
                              status.bg,
                              isClickable && 'cursor-pointer hover:ring-2 hover:ring-accent/50',
                              !isClickable && 'opacity-80'
                            )}
                          >
                            <div className="flex items-center gap-3">
                              <StatusIcon className={cn('h-5 w-5', status.class)} />
                              <div>
                                <p className="font-medium">{doc.name}</p>
                                <p className="text-xs text-muted-foreground">{doc.type}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className={cn('text-xs', status.class)}>
                                {status.label}
                              </Badge>
                              {isClickable && mailboxSettings.connected && (
                                <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                                  <Send className="h-4 w-4" />
                                </Button>
                              )}
                              {doc.uploadedAt && (
                                <span className="text-xs text-muted-foreground">{doc.uploadedAt}</span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Upload & Portal */}
            <div className="space-y-6">
              <div className="workspace-card">
                <h3 className="font-semibold mb-4">Dokumente hochladen</h3>
                <div
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleDrop}
                  className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:border-accent transition-colors"
                >
                  <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">
                    Dateien hier ablegen
                  </p>
                </div>
              </div>

              <div className="workspace-card">
                <h3 className="font-semibold mb-4">Verkäufer-Portal</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Upload-Link für Verkäufer oder Hausverwaltung.
                </p>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={copyUploadLink} className="flex-1 gap-2">
                    <Link className="h-4 w-4" />
                    Link kopieren
                  </Button>
                  <Button variant="outline" asChild>
                    <a href="/external-upload" target="_blank">
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="workspace-card">
                <h3 className="font-semibold mb-4">Übersicht</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-2 rounded bg-green-50">
                    <span className="text-sm text-green-700">Verifiziert</span>
                    <span className="font-semibold text-green-700">{verifiedDocsCount}</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded bg-blue-50">
                    <span className="text-sm text-blue-700">Erhalten</span>
                    <span className="font-semibold text-blue-700">{docs.filter(d => d.status === 'received').length}</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded bg-amber-50">
                    <span className="text-sm text-amber-700">Angefordert</span>
                    <span className="font-semibold text-amber-700">{docs.filter(d => d.status === 'requested').length}</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded bg-red-50">
                    <span className="text-sm text-red-700">Fehlt</span>
                    <span className="font-semibold text-red-700">{missingDocsCount}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Email Threads Tab */}
        <TabsContent value="threads" className="mt-6">
          {threads.length === 0 ? (
            <div className="workspace-card text-center py-12">
              <Inbox className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="font-semibold mb-2">Keine E-Mail-Threads</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Klicken Sie auf ein fehlendes Dokument, um eine Anfrage zu senden.
              </p>
              <Button onClick={() => setActiveTab('checklist')}>
                Zur Checkliste
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-12 gap-6">
              {/* Thread List */}
              <div className="col-span-4 workspace-card p-0 overflow-hidden">
                <div className="p-4 border-b flex items-center justify-between">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Inbox className="h-4 w-4" />
                    E-Mail-Threads
                  </h3>
                  <Badge variant="secondary">{threads.length}</Badge>
                </div>
                <div className="divide-y max-h-[400px] overflow-y-auto">
                  {threads.map(thread => {
                    const holderInfo = holderConfig[thread.holderType];
                    return (
                      <div
                        key={thread.id}
                        onClick={() => setSelectedThread(thread)}
                        className={cn(
                          'p-4 cursor-pointer transition-colors hover:bg-secondary/50',
                          selectedThread?.id === thread.id && 'bg-accent/5'
                        )}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <span className={cn(
                            'text-xs px-2 py-0.5 rounded-full',
                            holderInfo.bg,
                            holderInfo.color
                          )}>
                            {holderInfo.label}
                          </span>
                          <Badge variant={thread.status === 'complete' ? 'outline' : 'secondary'}>
                            {thread.status === 'waiting' ? 'Wartend' : thread.status === 'complete' ? 'Fertig' : 'Aktiv'}
                          </Badge>
                        </div>
                        <p className="font-medium text-sm truncate">{thread.holder}</p>
                        <p className="text-xs text-muted-foreground mt-2">{thread.lastActivity}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Thread Viewer */}
              <div className="col-span-8 space-y-4">
                {selectedThread ? (
                  <>
                    <div className="workspace-card">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold">{selectedThread.holder}</h3>
                          <p className="text-sm text-muted-foreground">{selectedThread.subject}</p>
                        </div>
                        <Button size="sm" onClick={() => setSimulateDialogOpen(true)}>
                          <Plus className="h-4 w-4 mr-2" />
                          Antwort simulieren
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-4 max-h-[400px] overflow-y-auto">
                      {selectedThread.messages.map(message => (
                        <div 
                          key={message.id} 
                          className={cn(
                            'workspace-card',
                            message.direction === 'incoming' && 'border-l-4 border-l-accent'
                          )}
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <div className={cn(
                                'w-8 h-8 rounded-full flex items-center justify-center text-sm',
                                message.direction === 'outgoing' 
                                  ? 'bg-primary text-primary-foreground' 
                                  : 'bg-accent/20 text-accent'
                              )}>
                                {message.direction === 'outgoing' ? 'R' : message.from[0].toUpperCase()}
                              </div>
                              <div>
                                <p className="font-medium text-sm">{message.from}</p>
                                <p className="text-xs text-muted-foreground">{message.timestamp}</p>
                              </div>
                            </div>
                          </div>
                          
                          <p className="text-sm whitespace-pre-line mb-4">{message.body}</p>
                          
                          {message.attachments.length > 0 && (
                            <div className="border-t pt-3">
                              <p className="text-xs text-muted-foreground mb-2">
                                <Paperclip className="h-3 w-3 inline mr-1" />
                                {message.attachments.length} Anhänge
                              </p>
                              <div className="flex flex-wrap gap-2">
                                {message.attachments.map(att => (
                                  <div 
                                    key={att.id}
                                    className={cn(
                                      'flex items-center gap-2 px-3 py-2 rounded-lg text-sm',
                                      att.ingested ? 'bg-green-100 text-green-800' : 'bg-secondary'
                                    )}
                                  >
                                    <FileText className="h-4 w-4" />
                                    <span>{att.name}</span>
                                    <span className="text-xs text-muted-foreground">({att.size})</span>
                                    {att.ingested && <Check className="h-4 w-4" />}
                                  </div>
                                ))}
                              </div>
                              {message.attachments.some(a => !a.ingested) && (
                                <Button 
                                  size="sm" 
                                  className="mt-3"
                                  onClick={() => handleIngestAttachments(message)}
                                >
                                  Anhänge importieren
                                </Button>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="workspace-card text-center py-12">
                    <MessageSquare className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                    <p className="text-muted-foreground">Thread auswählen</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </TabsContent>

        {/* Exceptions Tab */}
        <TabsContent value="exceptions" className="mt-6">
          <div className="workspace-card">
            <h3 className="font-semibold mb-4">Ausnahmen & Aktionen erforderlich</h3>
            <div className="space-y-3">
              {unreadExceptions.map(exc => {
                const excInfo = exceptionTypeConfig[exc.type];
                return (
                  <div key={exc.id} className="flex items-start justify-between p-4 rounded-lg bg-destructive/5 border border-destructive/20">
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">{excInfo.icon}</span>
                      <div>
                        <p className="font-medium">{excInfo.label}</p>
                        <p className="text-sm text-muted-foreground">{exc.description}</p>
                        <p className="text-xs text-muted-foreground mt-1">{exc.holder} • {exc.timestamp}</p>
                      </div>
                    </div>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => setExceptions(prev => prev.map(e => 
                        e.id === exc.id ? { ...e, resolved: true } : e
                      ))}
                    >
                      Erledigt
                    </Button>
                  </div>
                );
              })}
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Connect Mailbox Dialog */}
      <Dialog open={connectDialogOpen} onOpenChange={setConnectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Mailbox verbinden</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Verbinden Sie Ihre Mailbox, um automatische Dokumentenanfragen und Follow-ups zu aktivieren.
            </p>
            <div className="grid grid-cols-2 gap-4">
              <Button 
                variant="outline" 
                className="h-24 flex-col gap-2"
                onClick={() => handleConnectMailbox('gmail')}
              >
                <img src="https://www.gstatic.com/images/branding/product/2x/gmail_2020q4_48dp.png" alt="Gmail" className="h-8 w-8" />
                Gmail verbinden
              </Button>
              <Button 
                variant="outline" 
                className="h-24 flex-col gap-2"
                onClick={() => handleConnectMailbox('microsoft365')}
              >
                <img src="https://img.icons8.com/color/48/microsoft-outlook-2019.png" alt="Outlook" className="h-8 w-8" />
                Microsoft 365
              </Button>
            </div>
            <div className="p-3 rounded-lg bg-secondary/50 text-sm">
              <p className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-600" />
                Nur Rayfield-Threads werden verfolgt (empfohlen)
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Document Request Dialog */}
      <Dialog open={requestDialogOpen} onOpenChange={setRequestDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Dokument anfordern: {selectedDoc?.name}</DialogTitle>
          </DialogHeader>
          {selectedDoc && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50">
                <div className={cn('p-2 rounded-lg', holderLabels[selectedDoc.holder].bg)}>
                  {(() => {
                    const Icon = holderLabels[selectedDoc.holder].icon;
                    return <Icon className={cn('h-4 w-4', holderLabels[selectedDoc.holder].color)} />;
                  })()}
                </div>
                <div>
                  <p className="font-medium">{selectedDoc.holderName || holderLabels[selectedDoc.holder].label}</p>
                  <p className="text-sm text-muted-foreground">{selectedDoc.holderEmail}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-muted-foreground">An:</label>
                  <Input value={selectedDoc.holderEmail || ''} readOnly className="mt-1" />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">CC:</label>
                  <Input placeholder="Optional" className="mt-1" />
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Switch checked={showBcc} onCheckedChange={setShowBcc} />
                <label className="text-sm">BCC anzeigen</label>
              </div>
              
              {showBcc && (
                <div>
                  <label className="text-sm text-muted-foreground">BCC:</label>
                  <Input placeholder="Optional" className="mt-1" />
                </div>
              )}

              <div>
                <label className="text-sm text-muted-foreground">Betreff:</label>
                <Input 
                  value={`Dokumentenanfrage: ${selectedDoc.name}`} 
                  readOnly 
                  className="mt-1" 
                />
              </div>

              <div>
                <label className="text-sm text-muted-foreground">Nachricht:</label>
                <Textarea 
                  value={emailBody}
                  onChange={(e) => setEmailBody(e.target.value)}
                  className="mt-1 min-h-[200px] font-mono text-sm"
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setRequestDialogOpen(false)}>
                  Abbrechen
                </Button>
                <Button onClick={handleSendRequest} disabled={!mailboxSettings.connected}>
                  <Send className="h-4 w-4 mr-2" />
                  Senden
                </Button>
              </div>
              
              {!mailboxSettings.connected && (
                <p className="text-sm text-amber-600 text-center">
                  Bitte verbinden Sie zuerst Ihre Mailbox, um E-Mails zu senden.
                </p>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Simulate Reply Dialog */}
      <Dialog open={simulateDialogOpen} onOpenChange={setSimulateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Antwort simulieren</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Select value={selectedReplyType} onValueChange={setSelectedReplyType}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="docs_attached">Dokumente angehängt</SelectItem>
                <SelectItem value="redirect">Wenden Sie sich an...</SelectItem>
                <SelectItem value="vollmacht_needed">Vollmacht benötigt</SelectItem>
                <SelectItem value="fee_required">Gebühr erforderlich</SelectItem>
              </SelectContent>
            </Select>

            <div className="p-4 rounded-lg bg-secondary/50">
              <p className="text-sm font-medium mb-2">Vorschau:</p>
              <p className="text-sm text-muted-foreground whitespace-pre-line">
                {replyTemplates[selectedReplyType as keyof typeof replyTemplates]?.body}
              </p>
              {replyTemplates[selectedReplyType as keyof typeof replyTemplates]?.attachments.length > 0 && (
                <div className="mt-3 flex gap-2">
                  {replyTemplates[selectedReplyType as keyof typeof replyTemplates].attachments.map((a, i) => (
                    <Badge key={i} variant="secondary">
                      <Paperclip className="h-3 w-3 mr-1" />
                      {a.name}
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            <Button onClick={handleSimulateReply} className="w-full">
              Antwort simulieren
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Upload Preview Dialog */}
      <Dialog open={showUploadPreview} onOpenChange={setShowUploadPreview}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Dokumentenklassifizierung</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-secondary/50">
              <p className="text-sm text-muted-foreground">Original</p>
              <p className="font-medium">{previewFile.original}</p>
            </div>
            <div className="flex items-center justify-center">
              <span className="text-muted-foreground">↓</span>
            </div>
            <div className="p-4 rounded-lg bg-accent/10 border border-accent">
              <p className="text-sm text-muted-foreground">Vorgeschlagen</p>
              <p className="font-medium">{previewFile.suggested}</p>
              <p className="text-sm text-accent mt-1">Typ: {previewFile.type}</p>
            </div>
          </div>
          <Button onClick={handleConfirmUpload} className="w-full mt-4">
            Bestätigen
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
