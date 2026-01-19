import { useState } from 'react';
import { 
  CheckCircle2, Circle, Clock, AlertTriangle, FileText, Mail, 
  StickyNote, Upload, ShieldCheck, Phone, ChevronRight, Plus,
  Send, Flag, Copy, X, User, Building, Landmark, Wallet, Eye,
  AlertCircle, Info, ExternalLink
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { 
  Transaction, TransactionMilestone, TransactionTask, TransactionDocument,
  getStakeholderLabel, getMilestoneStatusLabel, getRiskLabel,
  MilestoneStatus, RiskLevel, StakeholderRole
} from '@/data/dummyData';
import { toast } from 'sonner';

interface TransactionTabProps {
  transaction: Transaction;
}

export function TransactionTab({ transaction: initialTransaction }: TransactionTabProps) {
  const [transaction, setTransaction] = useState(initialTransaction);
  const [selectedMilestone, setSelectedMilestone] = useState<TransactionMilestone | null>(null);
  const [taskFilter, setTaskFilter] = useState<'all' | 'today' | 'overdue'>('all');
  const [showRequestDocsModal, setShowRequestDocsModal] = useState(false);
  const [showStatusUpdateModal, setShowStatusUpdateModal] = useState(false);
  const [showRiskModal, setShowRiskModal] = useState(false);
  const [showDocumentPreviewModal, setShowDocumentPreviewModal] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<TransactionDocument | null>(null);
  const [newTask, setNewTask] = useState('');
  const [newNote, setNewNote] = useState('');

  // Sample AI issues for documents
  const getDocumentIssues = (docId: string): { type: 'error' | 'warning' | 'info'; message: string; details?: string }[] => {
    const issuesMap: Record<string, { type: 'error' | 'warning' | 'info'; message: string; details?: string }[]> = {
      'd1': [], // Kaufvertragsentwurf - verified, no issues
      'd2': [
        { type: 'warning', message: 'Finanzierungsbestätigung fehlt Bankstempel', details: 'Die eingereichte Finanzierungsbestätigung wurde ohne offiziellen Bankstempel eingereicht. Bitte fordern Sie eine gestempelte Version an.' }
      ],
      'd3': [
        { type: 'error', message: 'Grundbuchauszug veraltet', details: 'Der Grundbuchauszug ist älter als 3 Monate. Für den Notartermin wird ein aktueller Auszug benötigt (nicht älter als 4 Wochen).' },
        { type: 'warning', message: 'Wohnrecht eingetragen', details: 'Im Grundbuch ist ein lebenslanges Wohnrecht für Else Müller eingetragen. Klären Sie die Löschungsbewilligung.' }
      ],
      'd4': [],
      'd5': [
        { type: 'info', message: 'Energieausweis läuft in 6 Monaten ab', details: 'Der Energieausweis ist noch gültig, läuft aber am 15.07.2026 ab.' }
      ],
      'd6': [
        { type: 'warning', message: 'Unterschrift fehlt', details: 'Die Löschungsbewilligung wurde ohne Unterschrift des Gläubigers eingereicht.' }
      ]
    };
    return issuesMap[docId] || [];
  };

  const handleDocumentClick = (doc: TransactionDocument) => {
    setSelectedDocument(doc);
    setShowDocumentPreviewModal(true);
  };

  // Calculate progress
  const completedMilestones = transaction.milestones.filter(m => m.status === 'done').length;
  const progressPercent = Math.round((completedMilestones / transaction.milestones.length) * 100);

  // Filter tasks
  const filteredTasks = transaction.tasks.filter(task => {
    if (taskFilter === 'today') return task.dueDate.includes('20.01') || task.dueDate.includes('18.01');
    if (taskFilter === 'overdue') return task.dueDate < '18.01.2026' && !task.completed;
    return true;
  });

  const tasksByCategory = {
    buyer: filteredTasks.filter(t => t.category === 'buyer'),
    seller: filteredTasks.filter(t => t.category === 'seller'),
    agent: filteredTasks.filter(t => t.category === 'agent'),
    notary_bank: filteredTasks.filter(t => t.category === 'notary_bank'),
  };

  // Handlers
  const handleMilestoneComplete = (milestoneId: string) => {
    setTransaction(prev => ({
      ...prev,
      milestones: prev.milestones.map(m => 
        m.id === milestoneId ? { ...m, status: 'done' as MilestoneStatus, completedAt: new Date().toLocaleDateString('de-DE') } : m
      ),
      activityLog: [
        { id: `a${Date.now()}`, type: 'milestone', action: `${prev.milestones.find(m => m.id === milestoneId)?.name} abgeschlossen`, actor: 'Florian Hubrich', timestamp: new Date().toLocaleString('de-DE') },
        ...prev.activityLog
      ]
    }));
    toast.success('Meilenstein als erledigt markiert');
  };

  const handleTaskToggle = (taskId: string) => {
    setTransaction(prev => ({
      ...prev,
      tasks: prev.tasks.map(t => 
        t.id === taskId ? { ...t, completed: !t.completed } : t
      ),
      activityLog: [
        { id: `a${Date.now()}`, type: 'task', action: `Aufgabe ${prev.tasks.find(t => t.id === taskId)?.completed ? 'wieder geöffnet' : 'erledigt'}: ${prev.tasks.find(t => t.id === taskId)?.title}`, actor: 'Florian Hubrich', timestamp: new Date().toLocaleString('de-DE') },
        ...prev.activityLog
      ]
    }));
  };

  const handleDocUpload = (docId: string) => {
    setTransaction(prev => ({
      ...prev,
      documents: prev.documents.map(d => 
        d.id === docId ? { ...d, status: 'uploaded', evidenceSource: 'upload', uploadedAt: new Date().toLocaleDateString('de-DE') } : d
      ),
      activityLog: [
        { id: `a${Date.now()}`, type: 'document', action: `${prev.documents.find(d => d.id === docId)?.name} hochgeladen`, actor: 'Florian Hubrich', timestamp: new Date().toLocaleString('de-DE') },
        ...prev.activityLog
      ]
    }));
    toast.success('Dokument hochgeladen');
  };

  const handleDocVerify = (docId: string) => {
    setTransaction(prev => ({
      ...prev,
      documents: prev.documents.map(d => 
        d.id === docId ? { ...d, status: 'verified' } : d
      ),
      activityLog: [
        { id: `a${Date.now()}`, type: 'document', action: `${prev.documents.find(d => d.id === docId)?.name} verifiziert`, actor: 'Florian Hubrich', timestamp: new Date().toLocaleString('de-DE') },
        ...prev.activityLog
      ]
    }));
    toast.success('Dokument verifiziert');
  };

  const handleAddNote = () => {
    if (!newNote.trim()) return;
    setTransaction(prev => ({
      ...prev,
      activityLog: [
        { id: `a${Date.now()}`, type: 'note', action: 'Notiz hinzugefügt', actor: 'Florian Hubrich', timestamp: new Date().toLocaleString('de-DE'), details: newNote },
        ...prev.activityLog
      ]
    }));
    setNewNote('');
    toast.success('Notiz hinzugefügt');
  };

  const handleAddTask = () => {
    if (!newTask.trim()) return;
    setTransaction(prev => ({
      ...prev,
      tasks: [
        ...prev.tasks,
        { id: `t${Date.now()}`, title: newTask, owner: 'agent', dueDate: '25.01.2026', completed: false, category: 'agent' }
      ]
    }));
    setNewTask('');
    toast.success('Aufgabe hinzugefügt');
  };

  const getMilestoneStatusIcon = (status: MilestoneStatus) => {
    switch (status) {
      case 'done': return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case 'in_progress': return <Clock className="h-5 w-5 text-blue-500" />;
      case 'blocked': return <AlertTriangle className="h-5 w-5 text-red-500" />;
      default: return <Circle className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getOwnerIcon = (role: StakeholderRole) => {
    switch (role) {
      case 'buyer': return <User className="h-3.5 w-3.5" />;
      case 'seller': return <User className="h-3.5 w-3.5" />;
      case 'notary': return <Building className="h-3.5 w-3.5" />;
      case 'bank': return <Landmark className="h-3.5 w-3.5" />;
      default: return <Wallet className="h-3.5 w-3.5" />;
    }
  };

  const getEvidenceIcon = (type: 'file' | 'email' | 'note') => {
    switch (type) {
      case 'file': return <FileText className="h-3.5 w-3.5" />;
      case 'email': return <Mail className="h-3.5 w-3.5" />;
      case 'note': return <StickyNote className="h-3.5 w-3.5" />;
    }
  };

  const getRiskColor = (risk: RiskLevel) => {
    switch (risk) {
      case 'low': return 'bg-green-500/10 text-green-600 border-green-500/30';
      case 'medium': return 'bg-yellow-500/10 text-yellow-600 border-yellow-500/30';
      case 'high': return 'bg-red-500/10 text-red-600 border-red-500/30';
    }
  };

  const missingDocs = transaction.documents.filter(d => d.status === 'missing');
  const generatedStatusUpdate = `
**Status-Update: ${transaction.propertyAddress}**

✅ Erledigt:
${transaction.milestones.filter(m => m.status === 'done').map(m => `- ${m.name}`).join('\n')}

⏳ Aktuell:
- ${transaction.milestones.find(m => m.status === 'in_progress')?.name || 'Keine'}

🚧 Nächster Meilenstein:
- ${transaction.milestones.find(m => m.status === 'not_started')?.name} (${transaction.nextMilestoneDate})

${transaction.topBlocker ? `⚠️ Blocker: ${transaction.topBlocker}` : ''}

Verantwortlich: ${transaction.owner}
  `.trim();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-xl font-semibold">{transaction.propertyAddress}</h2>
          <p className="text-muted-foreground mt-1">
            Verkäufer: {transaction.sellerName} · Käufer: {transaction.buyerName}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Fortschritt</p>
            <div className="flex items-center gap-2">
              <Progress value={progressPercent} className="w-24 h-2" />
              <span className="font-semibold">{progressPercent}%</span>
            </div>
          </div>
          <Badge variant="outline" className={cn('text-sm', getRiskColor(transaction.risk))}>
            Risiko: {getRiskLabel(transaction.risk)}
          </Badge>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-3">
        <Button variant="outline" className="gap-2" onClick={() => setShowRequestDocsModal(true)}>
          <Send className="h-4 w-4" />
          Fehlende Dokumente anfordern
        </Button>
        <Button variant="outline" className="gap-2" onClick={() => setShowStatusUpdateModal(true)}>
          <FileText className="h-4 w-4" />
          Status-Update generieren
        </Button>
        <Button variant="outline" className="gap-2" onClick={() => setShowRiskModal(true)}>
          <Flag className="h-4 w-4" />
          Risiko markieren
        </Button>
      </div>

      {/* Next Milestone Highlight */}
      {transaction.topBlocker && (
        <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            <div>
              <p className="font-medium text-destructive">Blocker</p>
              <p className="text-sm text-muted-foreground">{transaction.topBlocker}</p>
            </div>
          </div>
          <Button size="sm" variant="destructive">Beheben</Button>
        </div>
      )}

      {/* 3-Column Layout */}
      <div className="grid grid-cols-3 gap-6">
        {/* Left: Timeline */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Meilensteine</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            <ScrollArea className="h-[500px] pr-3">
              <div className="relative">
                {/* Timeline line */}
                <div className="absolute left-[11px] top-3 bottom-3 w-0.5 bg-border" />
                
                {transaction.milestones.map((milestone, index) => (
                  <div 
                    key={milestone.id}
                    className={cn(
                      "relative flex items-start gap-3 py-3 cursor-pointer hover:bg-accent/50 rounded-lg px-2 -mx-2 transition-colors",
                      selectedMilestone?.id === milestone.id && "bg-accent/50"
                    )}
                    onClick={() => setSelectedMilestone(milestone)}
                  >
                    <div className="relative z-10 bg-background">
                      {getMilestoneStatusIcon(milestone.status)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={cn(
                        "font-medium text-sm",
                        milestone.status === 'done' && "text-muted-foreground line-through"
                      )}>
                        {milestone.name}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="secondary" className="text-xs gap-1">
                          {getOwnerIcon(milestone.owner)}
                          {getStakeholderLabel(milestone.owner)}
                        </Badge>
                        <span className="text-xs text-muted-foreground">{milestone.dueDate}</span>
                      </div>
                      {milestone.evidence && (
                        <div className="flex items-center gap-1 mt-1.5 text-xs text-muted-foreground">
                          {getEvidenceIcon(milestone.evidence.type)}
                          <span>{milestone.evidence.name}</span>
                        </div>
                      )}
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground mt-1" />
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Middle: Tasks */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Nächste Aktionen</CardTitle>
              <div className="flex items-center gap-1">
                <Button 
                  variant={taskFilter === 'all' ? 'secondary' : 'ghost'} 
                  size="sm" 
                  className="h-7 text-xs"
                  onClick={() => setTaskFilter('all')}
                >
                  Alle
                </Button>
                <Button 
                  variant={taskFilter === 'today' ? 'secondary' : 'ghost'} 
                  size="sm" 
                  className="h-7 text-xs"
                  onClick={() => setTaskFilter('today')}
                >
                  Heute
                </Button>
                <Button 
                  variant={taskFilter === 'overdue' ? 'secondary' : 'ghost'} 
                  size="sm" 
                  className="h-7 text-xs"
                  onClick={() => setTaskFilter('overdue')}
                >
                  Überfällig
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[440px] pr-3">
              <div className="space-y-4">
                {/* Quick Add */}
                <div className="flex items-center gap-2">
                  <Input 
                    placeholder="Neue Aufgabe hinzufügen..." 
                    value={newTask}
                    onChange={(e) => setNewTask(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddTask()}
                    className="h-8 text-sm"
                  />
                  <Button size="sm" className="h-8" onClick={handleAddTask}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                {/* Buyer Tasks */}
                {tasksByCategory.buyer.length > 0 && (
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide">Käufer</p>
                    <div className="space-y-2">
                      {tasksByCategory.buyer.map(task => (
                        <TaskItem key={task.id} task={task} onToggle={handleTaskToggle} />
                      ))}
                    </div>
                  </div>
                )}

                {/* Seller Tasks */}
                {tasksByCategory.seller.length > 0 && (
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide">Verkäufer</p>
                    <div className="space-y-2">
                      {tasksByCategory.seller.map(task => (
                        <TaskItem key={task.id} task={task} onToggle={handleTaskToggle} />
                      ))}
                    </div>
                  </div>
                )}

                {/* Agent Tasks */}
                {tasksByCategory.agent.length > 0 && (
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide">Makler / Intern</p>
                    <div className="space-y-2">
                      {tasksByCategory.agent.map(task => (
                        <TaskItem key={task.id} task={task} onToggle={handleTaskToggle} />
                      ))}
                    </div>
                  </div>
                )}

                {/* Notary/Bank Tasks */}
                {tasksByCategory.notary_bank.length > 0 && (
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide">Notar / Bank</p>
                    <div className="space-y-2">
                      {tasksByCategory.notary_bank.map(task => (
                        <TaskItem key={task.id} task={task} onToggle={handleTaskToggle} />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Right: Docs, Stakeholders, Log */}
        <div className="space-y-4">
          {/* Documents */}
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Dokumente</CardTitle>
                <span className="text-xs text-muted-foreground">
                  {transaction.documents.filter(d => d.status === 'verified').length}/{transaction.documents.length} verifiziert
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {transaction.documents.slice(0, 6).map(doc => {
                  const issues = getDocumentIssues(doc.id);
                  const hasIssues = issues.length > 0;
                  const hasErrors = issues.some(i => i.type === 'error');
                  const hasWarnings = issues.some(i => i.type === 'warning');
                  
                  return (
                    <div 
                      key={doc.id} 
                      className={cn(
                        "flex items-center justify-between py-1.5 px-2 -mx-2 border-b border-border/50 last:border-0 rounded cursor-pointer transition-colors hover:bg-accent/50",
                        hasErrors && doc.status !== 'missing' && "bg-red-500/5 hover:bg-red-500/10",
                        hasWarnings && !hasErrors && doc.status !== 'missing' && "bg-yellow-500/5 hover:bg-yellow-500/10"
                      )}
                      onClick={() => handleDocumentClick(doc)}
                    >
                      <div className="flex items-center gap-2">
                        <FileText className={cn(
                          "h-4 w-4",
                          doc.status === 'verified' && !hasIssues ? "text-green-500" : 
                          doc.status === 'uploaded' && hasErrors ? "text-red-500" :
                          doc.status === 'uploaded' && hasWarnings ? "text-yellow-500" :
                          doc.status === 'uploaded' ? "text-blue-500" : "text-muted-foreground"
                        )} />
                        <span className="text-sm">{doc.name}</span>
                        {hasIssues && doc.status !== 'missing' && (
                          <Badge variant="outline" className={cn(
                            "text-xs",
                            hasErrors ? "border-red-500/30 text-red-600 bg-red-500/10" : "border-yellow-500/30 text-yellow-600 bg-yellow-500/10"
                          )}>
                            {hasErrors ? <AlertCircle className="h-3 w-3 mr-1" /> : <AlertTriangle className="h-3 w-3 mr-1" />}
                            {issues.length} {issues.length === 1 ? 'Problem' : 'Probleme'}
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                        {doc.status === 'missing' && (
                          <Button size="sm" variant="ghost" className="h-6 text-xs" onClick={(e) => { e.stopPropagation(); handleDocUpload(doc.id); }}>
                            <Upload className="h-3 w-3 mr-1" />
                            Upload
                          </Button>
                        )}
                        {doc.status === 'uploaded' && !hasIssues && (
                          <Button size="sm" variant="ghost" className="h-6 text-xs text-green-600" onClick={(e) => { e.stopPropagation(); handleDocVerify(doc.id); }}>
                            <ShieldCheck className="h-3 w-3 mr-1" />
                            Verifizieren
                          </Button>
                        )}
                        {doc.status === 'uploaded' && hasIssues && (
                          <Button size="sm" variant="ghost" className="h-6 text-xs text-yellow-600" onClick={(e) => { e.stopPropagation(); handleDocumentClick(doc); }}>
                            <Eye className="h-3 w-3 mr-1" />
                            Prüfen
                          </Button>
                        )}
                        {doc.status === 'verified' && (
                          <Badge variant="secondary" className="text-xs bg-green-500/10 text-green-600">
                            <ShieldCheck className="h-3 w-3 mr-1" />
                            Verifiziert
                          </Badge>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Stakeholders */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Beteiligte</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {transaction.stakeholders.map(stakeholder => (
                  <div key={stakeholder.id} className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{stakeholder.name}</span>
                        <Badge variant="outline" className="text-xs">{getStakeholderLabel(stakeholder.role)}</Badge>
                      </div>
                      {stakeholder.waitingOn && (
                        <p className="text-xs text-yellow-600 mt-0.5">Wartet auf: {stakeholder.waitingOn}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      <Button size="icon" variant="ghost" className="h-6 w-6">
                        <Mail className="h-3.5 w-3.5" />
                      </Button>
                      {stakeholder.phone && (
                        <Button size="icon" variant="ghost" className="h-6 w-6">
                          <Phone className="h-3.5 w-3.5" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Activity Log */}
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Aktivitäten</CardTitle>
                <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => newNote ? handleAddNote() : null}>
                  <Plus className="h-3 w-3 mr-1" />
                  Notiz
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="mb-3">
                <Textarea 
                  placeholder="Notiz hinzufügen..." 
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  className="h-16 text-sm resize-none"
                />
                {newNote && (
                  <Button size="sm" className="mt-2 w-full" onClick={handleAddNote}>
                    Notiz speichern
                  </Button>
                )}
              </div>
              <ScrollArea className="h-[150px]">
                <div className="space-y-3">
                  {transaction.activityLog.map(entry => (
                    <div key={entry.id} className="flex items-start gap-2 text-sm">
                      <div className={cn(
                        "mt-1 w-1.5 h-1.5 rounded-full flex-shrink-0",
                        entry.type === 'milestone' ? "bg-green-500" :
                        entry.type === 'document' ? "bg-blue-500" :
                        entry.type === 'task' ? "bg-yellow-500" : "bg-muted-foreground"
                      )} />
                      <div>
                        <p className="text-muted-foreground">
                          <span className="font-medium text-foreground">{entry.actor}</span>
                          {' · '}{entry.action}
                        </p>
                        {entry.details && <p className="text-xs text-muted-foreground">{entry.details}</p>}
                        <p className="text-xs text-muted-foreground mt-0.5">{entry.timestamp}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Milestone Detail Panel */}
      {selectedMilestone && (
        <Dialog open={!!selectedMilestone} onOpenChange={() => setSelectedMilestone(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                {getMilestoneStatusIcon(selectedMilestone.status)}
                {selectedMilestone.name}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <p className="font-medium">{getMilestoneStatusLabel(selectedMilestone.status)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Fällig</p>
                  <p className="font-medium">{selectedMilestone.dueDate}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Verantwortlich</p>
                  <p className="font-medium">{getStakeholderLabel(selectedMilestone.owner)}</p>
                </div>
                {selectedMilestone.completedAt && (
                  <div>
                    <p className="text-sm text-muted-foreground">Abgeschlossen</p>
                    <p className="font-medium">{selectedMilestone.completedAt}</p>
                  </div>
                )}
              </div>
              {selectedMilestone.evidence && (
                <div className="p-3 rounded-lg bg-accent/50">
                  <p className="text-sm text-muted-foreground mb-1">Nachweis</p>
                  <div className="flex items-center gap-2">
                    {getEvidenceIcon(selectedMilestone.evidence.type)}
                    <span className="text-sm font-medium">{selectedMilestone.evidence.name}</span>
                  </div>
                </div>
              )}
            </div>
            <DialogFooter>
              {selectedMilestone.status !== 'done' && (
                <Button onClick={() => { handleMilestoneComplete(selectedMilestone.id); setSelectedMilestone(null); }}>
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Als erledigt markieren
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Request Docs Modal */}
      <Dialog open={showRequestDocsModal} onOpenChange={setShowRequestDocsModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Fehlende Dokumente anfordern</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Empfänger</label>
              <Select defaultValue="buyer">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="buyer">Käufer</SelectItem>
                  <SelectItem value="seller">Verkäufer</SelectItem>
                  <SelectItem value="notary">Notar</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">Fehlende Dokumente</label>
              <div className="mt-2 space-y-1">
                {missingDocs.map(doc => (
                  <div key={doc.id} className="flex items-center gap-2 text-sm">
                    <Checkbox defaultChecked />
                    <span>{doc.name}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Nachricht</label>
              <Textarea 
                defaultValue={`Sehr geehrte Damen und Herren,

für den Abschluss der Transaktion benötigen wir noch folgende Dokumente:

${missingDocs.map(d => `- ${d.name}`).join('\n')}

Bitte laden Sie diese unter folgendem Link hoch:
https://rayfield.app/upload/tx/${transaction.id}

Mit freundlichen Grüßen
${transaction.owner}`}
                className="h-40"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRequestDocsModal(false)}>Abbrechen</Button>
            <Button onClick={() => { toast.success('Anfrage gesendet'); setShowRequestDocsModal(false); }}>
              <Send className="h-4 w-4 mr-2" />
              Senden
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Status Update Modal */}
      <Dialog open={showStatusUpdateModal} onOpenChange={setShowStatusUpdateModal}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Status-Update generiert</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-accent/50 font-mono text-sm whitespace-pre-wrap">
              {generatedStatusUpdate}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowStatusUpdateModal(false)}>Schließen</Button>
            <Button onClick={() => { navigator.clipboard.writeText(generatedStatusUpdate); toast.success('In Zwischenablage kopiert'); }}>
              <Copy className="h-4 w-4 mr-2" />
              Kopieren
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Risk Modal */}
      <Dialog open={showRiskModal} onOpenChange={setShowRiskModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Risiko markieren</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Risikostufe</label>
              <Select defaultValue={transaction.risk}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Niedrig</SelectItem>
                  <SelectItem value="medium">Mittel</SelectItem>
                  <SelectItem value="high">Hoch</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">Grund</label>
              <Select defaultValue={transaction.riskReason || 'financing'}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="financing">Finanzierungsverzögerung</SelectItem>
                  <SelectItem value="documents">Fehlende Dokumente</SelectItem>
                  <SelectItem value="notary">Notar-Terminproblem</SelectItem>
                  <SelectItem value="seller">Verkäufer unsicher</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRiskModal(false)}>Abbrechen</Button>
            <Button onClick={() => { toast.success('Risiko aktualisiert'); setShowRiskModal(false); }}>
              Speichern
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Document Preview Modal */}
      <Dialog open={showDocumentPreviewModal} onOpenChange={setShowDocumentPreviewModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              {selectedDocument?.name || 'Dokument'}
            </DialogTitle>
          </DialogHeader>
          {selectedDocument && (
            <div className="space-y-4">
              {/* Document Preview Placeholder */}
              <div className="aspect-[4/3] bg-muted rounded-lg border-2 border-dashed border-border flex flex-col items-center justify-center">
                <FileText className="h-16 w-16 text-muted-foreground/50 mb-4" />
                <p className="text-muted-foreground font-medium">{selectedDocument.name}</p>
                <p className="text-sm text-muted-foreground/70 mt-1">
                  {selectedDocument.status === 'missing' ? 'Noch nicht hochgeladen' : 'Vorschau des Dokuments'}
                </p>
                {selectedDocument.status !== 'missing' && (
                  <Button variant="outline" size="sm" className="mt-4 gap-2">
                    <ExternalLink className="h-4 w-4" />
                    Im neuen Tab öffnen
                  </Button>
                )}
              </div>

              {/* Document Info */}
              <div className="grid grid-cols-2 gap-4 p-4 bg-accent/30 rounded-lg">
                <div>
                  <p className="text-xs text-muted-foreground">Status</p>
                  <p className="font-medium capitalize">
                    {selectedDocument.status === 'verified' ? 'Verifiziert' :
                     selectedDocument.status === 'uploaded' ? 'Hochgeladen' : 'Fehlt'}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Hochgeladen am</p>
                  <p className="font-medium">{selectedDocument.uploadedAt || '-'}</p>
                </div>
              </div>

              {/* AI Analysis Issues */}
              {selectedDocument.status !== 'missing' && (
                <div className="space-y-3">
                  <h4 className="font-medium text-sm flex items-center gap-2">
                    <AlertCircle className="h-4 w-4" />
                    KI-Dokumentenprüfung
                  </h4>
                  {getDocumentIssues(selectedDocument.id).length === 0 ? (
                    <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg flex items-center gap-3">
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                      <div>
                        <p className="font-medium text-green-700">Keine Probleme gefunden</p>
                        <p className="text-sm text-green-600/80">Das Dokument wurde erfolgreich geprüft und enthält keine Auffälligkeiten.</p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {getDocumentIssues(selectedDocument.id).map((issue, idx) => (
                        <div 
                          key={idx}
                          className={cn(
                            "p-3 rounded-lg border flex items-start gap-3",
                            issue.type === 'error' ? "bg-red-500/10 border-red-500/30" :
                            issue.type === 'warning' ? "bg-yellow-500/10 border-yellow-500/30" :
                            "bg-blue-500/10 border-blue-500/30"
                          )}
                        >
                          {issue.type === 'error' ? (
                            <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                          ) : issue.type === 'warning' ? (
                            <AlertTriangle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                          ) : (
                            <Info className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                          )}
                          <div>
                            <p className={cn(
                              "font-medium",
                              issue.type === 'error' ? "text-red-700" :
                              issue.type === 'warning' ? "text-yellow-700" : "text-blue-700"
                            )}>
                              {issue.message}
                            </p>
                            {issue.details && (
                              <p className="text-sm text-muted-foreground mt-1">{issue.details}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDocumentPreviewModal(false)}>Schließen</Button>
            {selectedDocument?.status === 'missing' && (
              <Button onClick={() => { handleDocUpload(selectedDocument.id); setShowDocumentPreviewModal(false); }}>
                <Upload className="h-4 w-4 mr-2" />
                Hochladen
              </Button>
            )}
            {selectedDocument?.status === 'uploaded' && getDocumentIssues(selectedDocument.id).length === 0 && (
              <Button className="bg-green-600 hover:bg-green-700" onClick={() => { handleDocVerify(selectedDocument.id); setShowDocumentPreviewModal(false); }}>
                <ShieldCheck className="h-4 w-4 mr-2" />
                Verifizieren
              </Button>
            )}
            {selectedDocument?.status === 'uploaded' && getDocumentIssues(selectedDocument.id).length > 0 && (
              <Button variant="outline" className="text-yellow-600 border-yellow-500/30" onClick={() => { toast.info('Dokument erneut anfordern...'); setShowDocumentPreviewModal(false); }}>
                <Send className="h-4 w-4 mr-2" />
                Korrektur anfordern
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function TaskItem({ task, onToggle }: { task: TransactionTask; onToggle: (id: string) => void }) {
  return (
    <div className={cn(
      "flex items-start gap-2 p-2 rounded-lg border transition-colors",
      task.completed ? "bg-muted/50 border-border/50" : "bg-background border-border"
    )}>
      <Checkbox 
        checked={task.completed} 
        onCheckedChange={() => onToggle(task.id)}
        className="mt-0.5"
      />
      <div className="flex-1 min-w-0">
        <p className={cn("text-sm", task.completed && "line-through text-muted-foreground")}>
          {task.title}
        </p>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-xs text-muted-foreground">{task.dueDate}</span>
          {task.dependency && (
            <Badge variant="outline" className="text-xs bg-yellow-500/10 text-yellow-600 border-yellow-500/30">
              Blockiert: {task.dependency}
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
}