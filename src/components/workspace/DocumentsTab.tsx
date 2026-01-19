import { useState } from 'react';
import { Upload, FileText, Check, Clock, AlertCircle, Send, Link, ExternalLink, Mail, User, Building2, Scale, Landmark, Eye, Pause, ChevronRight, Paperclip, Plus, MessageSquare, Inbox, X, Search, AlertTriangle, CheckCircle2 } from 'lucide-react';
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
import { propertyDocuments, Document, DocumentIssue } from '@/data/dummyData';
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
  review: { icon: Eye, label: 'Prüfung erforderlich', class: 'text-orange-600', bg: 'bg-orange-50' },
  verified: { icon: Check, label: 'Verifiziert', class: 'text-green-600', bg: 'bg-green-50' },
};

const holderLabels: Record<string, { label: string; icon: typeof User; color: string; bg: string }> = {
  seller: { label: 'Verkäufer', icon: User, color: 'text-blue-600', bg: 'bg-blue-100' },
  hausverwaltung: { label: 'Hausverwaltung', icon: Building2, color: 'text-purple-600', bg: 'bg-purple-100' },
  agent: { label: 'Makler', icon: User, color: 'text-slate-600', bg: 'bg-slate-100' },
  notary: { label: 'Notar', icon: Scale, color: 'text-amber-600', bg: 'bg-amber-100' },
  authority: { label: 'Behörde', icon: Landmark, color: 'text-slate-600', bg: 'bg-slate-100' },
};

interface DocumentsTabProps {
  propertyId?: string;
}

export function DocumentsTab({ propertyId = '3' }: DocumentsTabProps) {
  const { toast } = useToast();
  
  // Get documents for this property or fallback to default
  const initialDocs = propertyDocuments[propertyId] || propertyDocuments['3'] || [];
  
  const [docs, setDocs] = useState<Document[]>(initialDocs);
  
  const [showUploadPreview, setShowUploadPreview] = useState(false);
  const [previewFile, setPreviewFile] = useState({ original: '', suggested: '', type: '' });
  const [activeTab, setActiveTab] = useState('checklist');
  
  // Mailbox integration state
  const [mailboxSettings, setMailboxSettings] = useState<MailboxSettings>(defaultMailboxSettings);
  const [connectDialogOpen, setConnectDialogOpen] = useState(false);
  
  // Document request state
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);
  const [requestDialogOpen, setRequestDialogOpen] = useState(false);
  const [emailBody, setEmailBody] = useState('');
  const [showBcc, setShowBcc] = useState(false);
  
  // Email threads state
  const [threads, setThreads] = useState<EmailThread[]>([]);
  const [selectedThread, setSelectedThread] = useState<EmailThread | null>(null);
  const [exceptions, setExceptions] = useState<MailException[]>([]);
  const [simulateDialogOpen, setSimulateDialogOpen] = useState(false);
  const [selectedReplyType, setSelectedReplyType] = useState<string>('docs_attached');
  
  // Review dialog state
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [reviewDoc, setReviewDoc] = useState<Document | null>(null);
  const [followUpEmailOpen, setFollowUpEmailOpen] = useState(false);
  const [followUpEmailBody, setFollowUpEmailBody] = useState('');

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
    navigator.clipboard.writeText('https://upload.immosmart.io/p/abc123');
    toast({
      title: 'Link kopiert',
      description: 'Verkäufer-Upload-Link in die Zwischenablage kopiert.',
    });
  };

  const handleDocumentClick = (doc: Document) => {
    if (doc.status === 'missing' || doc.status === 'requested') {
      setSelectedDoc(doc);
      
      // Generate personalized, professional email based on holder type
      const generateEmailBody = () => {
        const greeting = doc.holder === 'seller' 
          ? 'Sehr geehrter Herr Schmidt'
          : doc.holder === 'hausverwaltung'
          ? 'Sehr geehrte Damen und Herren'
          : doc.holder === 'notary'
          ? 'Sehr geehrter Herr Notar'
          : 'Sehr geehrte Damen und Herren';
        
        const introduction = doc.holder === 'seller'
          ? `ich hoffe, diese Nachricht erreicht Sie wohlauf. Wie besprochen begleite ich Sie beim Verkauf Ihrer Immobilie in der Maximilianstraße 42, München.`
          : doc.holder === 'hausverwaltung'
          ? `im Auftrag meines Mandanten, Herrn Hans Schmidt, wende ich mich an Sie bezüglich der Immobilie Maximilianstraße 42 in München. Herr Schmidt hat mich mit dem Verkauf der Eigentumswohnung beauftragt.`
          : doc.holder === 'notary'
          ? `im Auftrag meines Mandanten, Herrn Hans Schmidt, bereiten wir derzeit den Verkauf der Immobilie Maximilianstraße 42 in München vor.`
          : `im Rahmen eines Immobilienverkaufs benötige ich im Auftrag meines Mandanten folgende Unterlagen für die Liegenschaft Maximilianstraße 42, München.`;
        
        const requestText = doc.holder === 'seller'
          ? `Für die Erstellung eines professionellen Exposés und die Vorbereitung des Verkaufsprozesses benötige ich noch folgende Unterlagen von Ihnen:`
          : doc.holder === 'hausverwaltung'
          ? `Für den reibungslosen Ablauf des Verkaufsprozesses würde ich Sie freundlich bitten, mir folgende Unterlagen zur Verfügung zu stellen:`
          : `Für die weitere Bearbeitung benötigen wir folgendes Dokument:`;
        
        const uploadHint = doc.holder === 'seller'
          ? `Über den nachfolgenden sicheren Link können Sie das Dokument bequem hochladen – ganz ohne Registrierung:`
          : `Über den folgenden sicheren Upload-Link können Sie uns die Unterlagen unkompliziert zukommen lassen:`;
        
        const closing = doc.holder === 'seller'
          ? `Sollten Sie Fragen haben oder Unterstützung benötigen, stehe ich Ihnen selbstverständlich gerne zur Verfügung.

Herzliche Grüße`
          : doc.holder === 'hausverwaltung'
          ? `Für Rückfragen stehe ich Ihnen gerne zur Verfügung. Vielen Dank im Voraus für Ihre Unterstützung.

Mit freundlichen Grüßen`
          : `Vielen Dank für Ihre Unterstützung.

Mit freundlichen Grüßen`;
        
        return `${greeting},

${introduction}

${requestText}

• ${doc.name}

${uploadHint}
https://upload.immosmart.io/p/${doc.id}

Frist: 25. Januar 2024

${closing}
Max Mustermann
Immosmart Immobilien
Tel: +49 89 123 456 78`;
      };
      
      setEmailBody(generateEmailBody());
      setRequestDialogOpen(true);
    } else if (doc.status === 'review') {
      // Open review dialog for documents that need review
      setReviewDoc(doc);
      setReviewDialogOpen(true);
    } else if (doc.status === 'verified' || doc.status === 'requested') {
      // Open review dialog to show PDF preview for verified/uploaded documents
      setReviewDoc(doc);
      setReviewDialogOpen(true);
    }
  };

  const handleOpenFollowUpEmail = (doc: Document, issue: DocumentIssue) => {
    const greeting = doc.holder === 'seller' 
      ? 'Sehr geehrte Frau Fischer'
      : doc.holder === 'hausverwaltung'
      ? 'Sehr geehrte Damen und Herren'
      : 'Sehr geehrte Damen und Herren';

    const issueDescription = issue.description;
    const suggestedAction = issue.suggestedAction || 'Bitte um Korrektur oder Ergänzung des Dokuments.';

    const emailBody = `${greeting},

vielen Dank für die Zusendung des Dokuments "${doc.name}".

Bei der Prüfung der Unterlagen ist uns folgendes aufgefallen:

${issueDescription}

${suggestedAction}

Über den folgenden sicheren Upload-Link können Sie das korrigierte Dokument hochladen:
https://upload.immosmart.io/p/${doc.id}

Für Rückfragen stehe ich Ihnen selbstverständlich gerne zur Verfügung.

Mit freundlichen Grüßen
Max Mustermann
Immosmart Immobilien
Tel: +49 89 123 456 78`;

    setFollowUpEmailBody(emailBody);
    setFollowUpEmailOpen(true);
  };

  const handleSendFollowUpEmail = () => {
    if (!reviewDoc) return;

    toast({
      title: 'Nachfrage gesendet',
      description: `E-Mail an ${reviewDoc.holderName} gesendet.`,
    });
    setFollowUpEmailOpen(false);
  };

  const handleVerifyDocument = (doc: Document) => {
    setDocs(prev => prev.map(d => 
      d.id === doc.id 
        ? { ...d, status: 'verified' as const, aiAnalysis: undefined }
        : d
    ));
    setReviewDialogOpen(false);
    toast({
      title: 'Dokument verifiziert',
      description: `"${doc.name}" wurde als korrekt markiert.`,
    });
  };

  const getIssueSeverityConfig = (severity: 'low' | 'medium' | 'high') => {
    switch (severity) {
      case 'high':
        return { icon: AlertTriangle, class: 'text-destructive', bg: 'bg-destructive/10', label: 'Kritisch' };
      case 'medium':
        return { icon: AlertCircle, class: 'text-orange-600', bg: 'bg-orange-50', label: 'Mittel' };
      case 'low':
        return { icon: AlertCircle, class: 'text-amber-600', bg: 'bg-amber-50', label: 'Gering' };
    }
  };

  const getIssueTypeLabel = (type: DocumentIssue['type']) => {
    const labels: Record<DocumentIssue['type'], string> = {
      incomplete: 'Unvollständig',
      outdated: 'Veraltet',
      wrong_property: 'Falsche Immobilie',
      illegible: 'Unleserlich',
      missing_signature: 'Signatur fehlt',
      wrong_format: 'Falsches Format',
    };
    return labels[type];
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
        from: 'makler@immosmart.de',
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

    // Update document checklist - documents go to review status first (AI will analyze)
    setDocs(prev => prev.map(doc => {
      const matchingAtt = attachmentsToIngest.find(a => a.type === doc.type);
      if (matchingAtt) {
        return { ...doc, status: 'review' as const };
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
  }, {} as Record<string, Document[]>);

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
                        const isClickable = true; // All documents are now clickable
                        const hasIssues = doc.status === 'review' && doc.aiAnalysis && doc.aiAnalysis.issues.length > 0;
                        
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
                                <div className="flex items-center gap-2">
                                  <p className="text-xs text-muted-foreground">{doc.type}</p>
                                  {hasIssues && (
                                    <Badge variant="outline" className="text-xs text-orange-600 border-orange-300">
                                      {doc.aiAnalysis!.issues.length} {doc.aiAnalysis!.issues.length === 1 ? 'Problem' : 'Probleme'}
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className={cn('text-xs', status.class)}>
                                {status.label}
                              </Badge>
                              {doc.status === 'review' && (
                                <Button 
                                  size="sm" 
                                  variant="outline" 
                                  className="h-8 gap-1 text-orange-600 border-orange-300 hover:bg-orange-50"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setReviewDoc(doc);
                                    setReviewDialogOpen(true);
                                  }}
                                >
                                  <Search className="h-3 w-3" />
                                  Untersuchen
                                </Button>
                              )}
                              {(doc.status === 'missing' || doc.status === 'requested') && mailboxSettings.connected && (
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
                  <div className="flex items-center justify-between p-2 rounded bg-orange-50">
                    <span className="text-sm text-orange-700">Prüfung</span>
                    <span className="font-semibold text-orange-700">{docs.filter(d => d.status === 'review').length}</span>
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
                Nur Immosmart-Threads werden verfolgt (empfohlen)
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

      {/* Review Document Dialog */}
      <Dialog open={reviewDialogOpen} onOpenChange={setReviewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {reviewDoc?.status === 'verified' ? (
                <Check className="h-5 w-5 text-green-600" />
              ) : reviewDoc?.status === 'review' ? (
                <Eye className="h-5 w-5 text-orange-600" />
              ) : (
                <FileText className="h-5 w-5 text-blue-600" />
              )}
              {reviewDoc?.status === 'verified' ? 'Dokument: ' : reviewDoc?.status === 'review' ? 'Dokumentenprüfung: ' : 'Dokument: '}{reviewDoc?.name}
            </DialogTitle>
          </DialogHeader>
          {reviewDoc && (
            <div className="space-y-6">
              {/* PDF Preview */}
              <div className="grid grid-cols-2 gap-4">
                <div className="aspect-[3/4] bg-muted rounded-lg border border-border flex flex-col items-center justify-center relative overflow-hidden">
                  {/* Real Document Preview Image */}
                  {(() => {
                    const getDocumentPreviewUrl = (docType: string) => {
                      const typeMap: Record<string, string> = {
                        'Energieausweis': '/documents/energieausweis-preview.jpg',
                        'Grundbuch': '/documents/grundbuchauszug-preview.jpg',
                        'Teilungserklärung': '/documents/teilungserklaerung-preview.jpg',
                        'Wirtschaftsplan': '/documents/teilungserklaerung-preview.jpg',
                        'Hausgeldabrechnung': '/documents/grundbuchauszug-preview.jpg',
                        'Flächenberechnung': '/documents/teilungserklaerung-preview.jpg',
                        'Baulastenverzeichnis': '/documents/grundbuchauszug-preview.jpg',
                        'Protokolle': '/documents/teilungserklaerung-preview.jpg',
                        'Flurkarte': '/documents/grundbuchauszug-preview.jpg',
                      };
                      return typeMap[docType] || '/documents/grundbuchauszug-preview.jpg';
                    };
                    
                    return (
                      <img 
                        src={getDocumentPreviewUrl(reviewDoc.type)} 
                        alt={reviewDoc.name}
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                    );
                  })()}
                  
                  {/* Issue overlay for documents with problems */}
                  {reviewDoc.aiAnalysis && reviewDoc.aiAnalysis.issues.some(i => i.severity === 'high') && (
                    <div className="absolute top-4 left-4 right-4 p-2 border-2 border-red-500 rounded bg-red-500/90 flex items-center justify-center">
                      <span className="text-xs text-white font-medium">⚠ Problem erkannt</span>
                    </div>
                  )}
                  {reviewDoc.aiAnalysis && reviewDoc.aiAnalysis.issues.some(i => i.severity === 'medium') && !reviewDoc.aiAnalysis.issues.some(i => i.severity === 'high') && (
                    <div className="absolute top-4 left-4 right-4 p-2 border-2 border-orange-500 rounded bg-orange-500/90 flex items-center justify-center">
                      <span className="text-xs text-white font-medium">⚠ Hinweis</span>
                    </div>
                  )}
                  
                  {/* Verified badge */}
                  {reviewDoc.status === 'verified' && (
                    <div className="absolute top-4 right-4 p-2 rounded-full bg-green-500">
                      <Check className="h-4 w-4 text-white" />
                    </div>
                  )}
                  
                  <Button 
                    variant="secondary" 
                    size="sm" 
                    className="absolute bottom-3 gap-2 bg-white/90 hover:bg-white"
                    onClick={() => window.open('#', '_blank')}
                  >
                    <ExternalLink className="h-4 w-4" />
                    Vollansicht
                  </Button>
                </div>

                {/* Document Info */}
                <div className="space-y-4">
                  <div className="p-4 rounded-lg bg-secondary/50">
                    <h4 className="font-medium mb-3">{reviewDoc.name}</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Typ:</span>
                        <span>{reviewDoc.type}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Hochgeladen:</span>
                        <span>{reviewDoc.uploadedAt || '-'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Status:</span>
                        <Badge variant="outline" className={docStatusConfig[reviewDoc.status].class}>
                          {docStatusConfig[reviewDoc.status].label}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30">
                    <div className={cn('p-2 rounded-lg', holderLabels[reviewDoc.holder].bg)}>
                      {(() => {
                        const Icon = holderLabels[reviewDoc.holder].icon;
                        return <Icon className={cn('h-4 w-4', holderLabels[reviewDoc.holder].color)} />;
                      })()}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{reviewDoc.holderName || holderLabels[reviewDoc.holder].label}</p>
                      <p className="text-xs text-muted-foreground">{reviewDoc.holderEmail}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* AI Analysis */}
              {reviewDoc.aiAnalysis && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-orange-600" />
                      KI-Analyse
                    </h4>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>Analysiert: {reviewDoc.aiAnalysis.analyzedAt}</span>
                      <Badge variant="outline">
                        {Math.round(reviewDoc.aiAnalysis.confidence * 100)}% Konfidenz
                      </Badge>
                    </div>
                  </div>

                  {reviewDoc.aiAnalysis.issues.length > 0 ? (
                    <div className="space-y-3">
                      {reviewDoc.aiAnalysis.issues.map((issue, idx) => {
                        const severityConfig = getIssueSeverityConfig(issue.severity);
                        const SeverityIcon = severityConfig.icon;
                        return (
                          <div key={idx} className={cn('p-4 rounded-lg border', severityConfig.bg)}>
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex items-start gap-3">
                                <SeverityIcon className={cn('h-5 w-5 mt-0.5', severityConfig.class)} />
                                <div className="space-y-2">
                                  <div className="flex items-center gap-2">
                                    <Badge variant="outline" className={severityConfig.class}>
                                      {getIssueTypeLabel(issue.type)}
                                    </Badge>
                                    <Badge variant="secondary" className="text-xs">
                                      {severityConfig.label}
                                    </Badge>
                                  </div>
                                  <p className="text-sm">{issue.description}</p>
                                  {issue.suggestedAction && (
                                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                                      <ChevronRight className="h-3 w-3" />
                                      <strong>Empfehlung:</strong> {issue.suggestedAction}
                                    </p>
                                  )}
                                </div>
                              </div>
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => handleOpenFollowUpEmail(reviewDoc, issue)}
                              >
                                <Mail className="h-4 w-4 mr-1" />
                                Nachfragen
                              </Button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="p-4 rounded-lg bg-green-50 border border-green-200 flex items-center gap-3">
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                      <p className="text-sm text-green-700">Keine Probleme erkannt</p>
                    </div>
                  )}
                </div>
              )}

              {/* Actions */}
              <div className="flex justify-end gap-2 pt-4 border-t">
                <Button variant="outline" onClick={() => setReviewDialogOpen(false)}>
                  Schließen
                </Button>
                {reviewDoc.status === 'review' && (
                  <Button 
                    variant="default"
                    className="bg-green-600 hover:bg-green-700"
                    onClick={() => handleVerifyDocument(reviewDoc)}
                  >
                    <Check className="h-4 w-4 mr-2" />
                    Trotzdem verifizieren
                  </Button>
                )}
                {reviewDoc.status === 'verified' && (
                  <Button variant="secondary" onClick={() => window.open('#', '_blank')}>
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Herunterladen
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Follow-Up Email Dialog */}
      <Dialog open={followUpEmailOpen} onOpenChange={setFollowUpEmailOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Nachfrage senden: {reviewDoc?.name}</DialogTitle>
          </DialogHeader>
          {reviewDoc && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50">
                <div className={cn('p-2 rounded-lg', holderLabels[reviewDoc.holder].bg)}>
                  {(() => {
                    const Icon = holderLabels[reviewDoc.holder].icon;
                    return <Icon className={cn('h-4 w-4', holderLabels[reviewDoc.holder].color)} />;
                  })()}
                </div>
                <div>
                  <p className="font-medium">{reviewDoc.holderName || holderLabels[reviewDoc.holder].label}</p>
                  <p className="text-sm text-muted-foreground">{reviewDoc.holderEmail}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-muted-foreground">An:</label>
                  <Input value={reviewDoc.holderEmail || ''} readOnly className="mt-1" />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Betreff:</label>
                  <Input 
                    value={`Rückfrage zu: ${reviewDoc.name}`} 
                    readOnly 
                    className="mt-1" 
                  />
                </div>
              </div>

              <div>
                <label className="text-sm text-muted-foreground">Nachricht:</label>
                <Textarea 
                  value={followUpEmailBody}
                  onChange={(e) => setFollowUpEmailBody(e.target.value)}
                  className="mt-1 min-h-[250px] font-mono text-sm"
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setFollowUpEmailOpen(false)}>
                  Abbrechen
                </Button>
                <Button onClick={handleSendFollowUpEmail} disabled={!mailboxSettings.connected}>
                  <Send className="h-4 w-4 mr-2" />
                  Nachfrage senden
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
    </div>
  );
}
