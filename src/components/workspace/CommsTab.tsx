import { useState } from 'react';
import { Mail, Send, Clock, Check, AlertCircle, Paperclip, Play, RefreshCw, FileText, ChevronRight, Inbox, MessageSquare, Plus, Pause, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
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
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { 
  EmailThread, 
  EmailMessage, 
  EmailAttachment, 
  MailException,
  holderConfig,
  replyTemplates,
  exceptionTypeConfig 
} from '@/data/mailboxData';

interface CommsTabProps {
  onAddAuditEntry?: (entry: { action: string; actor: string; actorType: 'user' | 'agent'; details?: string }) => void;
  onUpdateChecklist?: (docType: string, status: 'received' | 'verified') => void;
}

export function CommsTab({ onAddAuditEntry, onUpdateChecklist }: CommsTabProps) {
  const { toast } = useToast();
  
  // State
  const [threads, setThreads] = useState<EmailThread[]>([
    {
      id: '1',
      holder: 'Hans Schmidt',
      holderType: 'seller',
      subject: 'Dokumentenanfrage - Maximilianstraße 42',
      status: 'waiting',
      lastActivity: 'Vor 2 Tagen',
      messages: [
        {
          id: 'm1',
          direction: 'outgoing',
          from: 'makler@rayfield-immobilien.de',
          to: 'hans.schmidt@email.de',
          subject: 'Dokumentenanfrage - Maximilianstraße 42',
          body: 'Sehr geehrter Herr Schmidt,\n\nim Rahmen des Verkaufsprozesses benötigen wir folgende Unterlagen:\n\n• Grundbuchauszug (aktuell)\n• Energieausweis\n• Wohnflächenberechnung\n\nBitte laden Sie die Dokumente über den folgenden Link hoch:\nhttps://upload.rayfield.io/p/abc123\n\nFrist: 20. Januar 2024\n\nMit freundlichen Grüßen\nIhr Rayfield Team',
          timestamp: '15.01.2024, 10:30',
          attachments: [],
        },
      ],
    },
    {
      id: '2',
      holder: 'Hausverwaltung Müller GmbH',
      holderType: 'hausverwaltung',
      subject: 'Anfrage WEG-Unterlagen - Maximilianstraße 42',
      status: 'active',
      lastActivity: 'Vor 1 Tag',
      messages: [
        {
          id: 'm2',
          direction: 'outgoing',
          from: 'makler@rayfield-immobilien.de',
          to: 'info@hv-mueller.de',
          subject: 'Anfrage WEG-Unterlagen - Maximilianstraße 42',
          body: 'Sehr geehrte Damen und Herren,\n\nfür den Verkauf der Wohnung in der Maximilianstraße 42 benötigen wir:\n\n• Teilungserklärung\n• Wirtschaftsplan 2024\n• Protokolle der letzten 3 Eigentümerversammlungen\n• Hausgeldabrechnung\n\nUpload-Link: https://upload.rayfield.io/p/def456\n\nMit freundlichen Grüßen',
          timestamp: '14.01.2024, 09:15',
          attachments: [],
        },
      ],
    },
  ]);

  const [selectedThread, setSelectedThread] = useState<EmailThread | null>(threads[0]);
  const [exceptions, setExceptions] = useState<MailException[]>([]);
  const [replyDialogOpen, setReplyDialogOpen] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [simulateDialogOpen, setSimulateDialogOpen] = useState(false);
  const [selectedReplyType, setSelectedReplyType] = useState<string>('docs_attached');
  const [currentTime, setCurrentTime] = useState(0); // Days passed simulation

  const getStatusBadge = (status: string) => {
    const config: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
      active: { label: 'Aktiv', variant: 'default' },
      waiting: { label: 'Warte auf Antwort', variant: 'secondary' },
      complete: { label: 'Vollständig', variant: 'outline' },
      blocked: { label: 'Blockiert', variant: 'destructive' },
    };
    const c = config[status] || config.active;
    return <Badge variant={c.variant}>{c.label}</Badge>;
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

    // Add exception if needed
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
    } else if (selectedReplyType === 'redirect') {
      setExceptions(prev => [...prev, {
        id: `exc${Date.now()}`,
        type: 'reroute',
        threadId: selectedThread.id,
        holder: selectedThread.holder,
        description: 'Weiterleitung an andere Stelle empfohlen',
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

    onAddAuditEntry?.({
      action: 'E-Mail empfangen',
      actor: selectedThread.holder,
      actorType: 'user',
      details: `Antwort auf Dokumentenanfrage${template.attachments.length > 0 ? ` mit ${template.attachments.length} Anhängen` : ''}`,
    });
  };

  const handleIngestAttachments = (message: EmailMessage) => {
    const attachmentsToIngest = message.attachments.filter(a => !a.ingested);
    
    // Mark as ingested
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

    // Update selected thread
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

    // Update checklist
    attachmentsToIngest.forEach(att => {
      onUpdateChecklist?.(att.type, 'received');
    });

    toast({
      title: 'Anhänge importiert',
      description: `${attachmentsToIngest.length} Dokument(e) wurden in die Checkliste übernommen.`,
    });

    onAddAuditEntry?.({
      action: 'Dokumente importiert',
      actor: 'System',
      actorType: 'agent',
      details: attachmentsToIngest.map(a => a.name).join(', '),
    });
  };

  const handleRunDocumentQA = (message: EmailMessage) => {
    const attachments = message.attachments.filter(a => a.ingested);
    
    // Simulate QA - verify some, flag issues with others
    const results = attachments.map((att, i) => {
      if (i === 0) {
        onUpdateChecklist?.(att.type, 'verified');
        return { name: att.name, status: 'verified' };
      } else {
        // Create exception for issues
        setExceptions(prev => [...prev, {
          id: `exc${Date.now()}_${i}`,
          type: i % 2 === 0 ? 'wrong_doc' : 'missing_pages',
          threadId: selectedThread?.id || '',
          holder: selectedThread?.holder || '',
          description: i % 2 === 0 ? `${att.name}: Falsches Jahr (2023 statt 2024)` : `${att.name}: Seiten 3-5 fehlen`,
          timestamp: new Date().toLocaleString('de-DE'),
          resolved: false,
        }]);
        return { name: att.name, status: 'issue' };
      }
    });

    toast({
      title: 'Dokument-QA abgeschlossen',
      description: `${results.filter(r => r.status === 'verified').length} verifiziert, ${results.filter(r => r.status === 'issue').length} mit Problemen.`,
    });

    onAddAuditEntry?.({
      action: 'Dokument-QA durchgeführt',
      actor: 'Document QA Agent',
      actorType: 'agent',
      details: `${results.length} Dokumente geprüft`,
    });
  };

  const handleSendFollowUp = () => {
    if (!selectedThread) return;

    const followUpMessage: EmailMessage = {
      id: `m${Date.now()}`,
      direction: 'outgoing',
      from: 'makler@rayfield-immobilien.de',
      to: selectedThread.messages[0].to,
      subject: `Follow-up: ${selectedThread.subject}`,
      body: 'Sehr geehrte Damen und Herren,\n\nwir möchten Sie freundlich an unsere Dokumentenanfrage erinnern. Die folgenden Unterlagen stehen noch aus:\n\n• Energieausweis\n• Protokolle Eigentümerversammlung\n\nVielen Dank für Ihre Unterstützung.\n\nMit freundlichen Grüßen\nIhr Rayfield Team',
      timestamp: new Date().toLocaleString('de-DE'),
      attachments: [],
      isFollowUp: true,
    };

    setThreads(prev => prev.map(t => 
      t.id === selectedThread.id 
        ? { ...t, messages: [...t.messages, followUpMessage], lastActivity: 'Gerade eben' }
        : t
    ));

    setSelectedThread(prev => prev ? {
      ...prev,
      messages: [...prev.messages, followUpMessage],
    } : null);

    toast({
      title: 'Follow-up gesendet',
      description: `Erinnerung an ${selectedThread.holder} gesendet.`,
    });

    onAddAuditEntry?.({
      action: 'Follow-up gesendet',
      actor: 'makler@rayfield-immobilien.de',
      actorType: 'user',
      details: `An ${selectedThread.holder}`,
    });
  };

  const handleSimulateTime = (days: number) => {
    setCurrentTime(prev => prev + days);
    
    // Create follow-up drafts for waiting threads
    setThreads(prev => prev.map(t => {
      if (t.status === 'waiting' || t.status === 'active') {
        const draftMessage: EmailMessage = {
          id: `m${Date.now()}_${t.id}`,
          direction: 'outgoing',
          from: 'makler@rayfield-immobilien.de',
          to: t.messages[0].to,
          subject: `Follow-up: ${t.subject}`,
          body: 'Sehr geehrte Damen und Herren,\n\nwir möchten Sie freundlich an unsere Dokumentenanfrage erinnern...',
          timestamp: new Date().toLocaleString('de-DE'),
          attachments: [],
          isFollowUp: true,
          isDraft: true,
        };
        return { ...t, messages: [...t.messages, draftMessage] };
      }
      return t;
    }));

    toast({
      title: `+${days} Werktage simuliert`,
      description: 'Follow-up-Entwürfe wurden für offene Threads erstellt.',
    });
  };

  const handleResolveException = (excId: string, action: string) => {
    setExceptions(prev => prev.map(e => 
      e.id === excId ? { ...e, resolved: true, action } : e
    ));

    toast({
      title: 'Ausnahme bearbeitet',
      description: `Aktion "${action}" wurde protokolliert.`,
    });

    onAddAuditEntry?.({
      action: `Ausnahme bearbeitet: ${action}`,
      actor: 'Makler',
      actorType: 'user',
    });
  };

  const unreadExceptions = exceptions.filter(e => !e.resolved);

  return (
    <div className="space-y-6">
      {/* Tracking Mode Banner */}
      <div className="flex items-center justify-between p-3 rounded-lg bg-accent/5 border border-accent/20">
        <div className="flex items-center gap-2 text-sm">
          <Mail className="h-4 w-4 text-accent" />
          <span>Rayfield Tracking-Modus: <strong>Nur Rayfield-Threads</strong></span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Zeit simulieren:</span>
          <Button variant="outline" size="sm" onClick={() => handleSimulateTime(3)}>+3 Tage</Button>
          <Button variant="outline" size="sm" onClick={() => handleSimulateTime(7)}>+7 Tage</Button>
          <Button variant="outline" size="sm" onClick={() => handleSimulateTime(2)}>T-2</Button>
        </div>
      </div>

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
          <div className="divide-y">
            {threads.map(thread => (
              <div
                key={thread.id}
                onClick={() => setSelectedThread(thread)}
                className={cn(
                  'p-4 cursor-pointer transition-colors hover:bg-secondary/50',
                  selectedThread?.id === thread.id && 'bg-accent/5'
                )}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className={cn(
                      'text-xs px-2 py-0.5 rounded-full',
                      holderConfig[thread.holderType].bg,
                      holderConfig[thread.holderType].color
                    )}>
                      {holderConfig[thread.holderType].label}
                    </span>
                  </div>
                  {getStatusBadge(thread.status)}
                </div>
                <p className="font-medium text-sm truncate">{thread.holder}</p>
                <p className="text-xs text-muted-foreground truncate mt-1">{thread.subject}</p>
                <p className="text-xs text-muted-foreground mt-2">{thread.lastActivity}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Thread Viewer */}
        <div className="col-span-8 space-y-4">
          {selectedThread ? (
            <>
              {/* Thread Header */}
              <div className="workspace-card">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold">{selectedThread.holder}</h3>
                    <p className="text-sm text-muted-foreground">{selectedThread.subject}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={handleSendFollowUp}>
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Follow-up senden
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setReplyDialogOpen(true)}>
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Antwort erstellen
                    </Button>
                    <Button size="sm" onClick={() => setSimulateDialogOpen(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Antwort simulieren
                    </Button>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="space-y-4 max-h-[500px] overflow-y-auto">
                {selectedThread.messages.map(message => (
                  <div 
                    key={message.id} 
                    className={cn(
                      'workspace-card',
                      message.direction === 'incoming' && 'border-l-4 border-l-accent',
                      message.isDraft && 'border-dashed opacity-70'
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
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-sm">{message.from}</p>
                            {message.isFollowUp && (
                              <Badge variant="secondary" className="text-xs">Follow-up</Badge>
                            )}
                            {message.isDraft && (
                              <Badge variant="outline" className="text-xs">Entwurf</Badge>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground">{message.timestamp}</p>
                        </div>
                      </div>
                      {message.direction === 'outgoing' && (
                        <Check className="h-4 w-4 text-green-600" />
                      )}
                    </div>
                    
                    <div className="text-sm whitespace-pre-wrap bg-secondary/30 rounded-lg p-4 mb-3">
                      {message.body}
                    </div>

                    {/* Attachments */}
                    {message.attachments.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-sm font-medium flex items-center gap-2">
                          <Paperclip className="h-4 w-4" />
                          Anhänge ({message.attachments.length})
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {message.attachments.map(att => (
                            <div 
                              key={att.id} 
                              className={cn(
                                'flex items-center gap-2 px-3 py-2 rounded-lg border text-sm',
                                att.ingested ? 'bg-green-50 border-green-200' : 'bg-secondary/50'
                              )}
                            >
                              <FileText className="h-4 w-4" />
                              <span>{att.name}</span>
                              <span className="text-xs text-muted-foreground">({att.size})</span>
                              {att.classified && (
                                <Badge variant="secondary" className="text-xs">{att.classifiedAs}</Badge>
                              )}
                              {att.ingested && (
                                <Check className="h-3 w-3 text-green-600" />
                              )}
                            </div>
                          ))}
                        </div>
                        
                        {/* Attachment Actions */}
                        {message.direction === 'incoming' && message.attachments.some(a => !a.ingested) && (
                          <div className="flex gap-2 mt-3">
                            <Button size="sm" onClick={() => handleIngestAttachments(message)}>
                              <FileText className="h-4 w-4 mr-2" />
                              Anhänge importieren
                            </Button>
                            {message.attachments.some(a => a.ingested) && (
                              <Button size="sm" variant="outline" onClick={() => handleRunDocumentQA(message)}>
                                <Play className="h-4 w-4 mr-2" />
                                Dokument-QA starten
                              </Button>
                            )}
                          </div>
                        )}
                        
                        {message.direction === 'incoming' && message.attachments.every(a => a.ingested) && (
                          <Button size="sm" variant="outline" onClick={() => handleRunDocumentQA(message)}>
                            <Play className="h-4 w-4 mr-2" />
                            Dokument-QA starten
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="workspace-card h-64 flex items-center justify-center text-muted-foreground">
              Wählen Sie einen Thread aus
            </div>
          )}
        </div>
      </div>

      {/* Exceptions Panel */}
      {unreadExceptions.length > 0 && (
        <div className="workspace-card">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-600" />
            Ausnahmen ({unreadExceptions.length})
          </h3>
          <div className="space-y-3">
            {unreadExceptions.map(exc => {
              const config = exceptionTypeConfig[exc.type];
              return (
                <div key={exc.id} className="flex items-start justify-between p-4 rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800">
                  <div className="flex items-start gap-3">
                    <span className="text-xl">{config.icon}</span>
                    <div>
                      <p className="font-medium">{config.label}</p>
                      <p className="text-sm text-muted-foreground">{exc.description}</p>
                      <p className="text-xs text-muted-foreground mt-1">{exc.holder} · {exc.timestamp}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => handleResolveException(exc.id, 'Aufgabe für Makler erstellt')}>
                      Aufgabe erstellen
                    </Button>
                    {exc.type === 'reroute' && (
                      <Button size="sm" variant="outline" onClick={() => handleResolveException(exc.id, 'An neuen Kontakt weitergeleitet')}>
                        Weiterleiten
                      </Button>
                    )}
                    <Button size="sm" onClick={() => handleResolveException(exc.id, 'Klärende Antwort gesendet')}>
                      Antwort senden
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Simulate Reply Dialog */}
      <Dialog open={simulateDialogOpen} onOpenChange={setSimulateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Antwort simulieren</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Wählen Sie den Antworttyp, um verschiedene Szenarien zu testen:
            </p>
            <Select value={selectedReplyType} onValueChange={setSelectedReplyType}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="docs_attached">📎 Dokumente angehängt (1-3 Dateien)</SelectItem>
                <SelectItem value="redirect">↗️ "Wenden Sie sich an..."</SelectItem>
                <SelectItem value="vollmacht_needed">📝 Vollmacht benötigt</SelectItem>
                <SelectItem value="fee_required">💰 Gebühr erforderlich</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button onClick={handleSimulateReply} className="w-full mt-4">
            Antwort simulieren
          </Button>
        </DialogContent>
      </Dialog>

      {/* Reply Composer Dialog */}
      <Dialog open={replyDialogOpen} onOpenChange={setReplyDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Antwort erstellen</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">An:</p>
              <p className="font-medium">{selectedThread?.holder}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Betreff:</p>
              <p className="font-medium">Re: {selectedThread?.subject}</p>
            </div>
            <Textarea
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              rows={6}
              placeholder="Ihre Nachricht..."
            />
          </div>
          <div className="flex gap-2 mt-4">
            <Button variant="outline" className="flex-1" onClick={() => setReplyDialogOpen(false)}>
              Abbrechen
            </Button>
            <Button className="flex-1" onClick={() => {
              setReplyDialogOpen(false);
              toast({ title: 'Entwurf gespeichert', description: 'Die Antwort wurde als Entwurf gespeichert.' });
            }}>
              <Send className="h-4 w-4 mr-2" />
              Senden
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
