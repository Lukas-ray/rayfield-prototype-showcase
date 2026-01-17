import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { 
  User, Mail, Phone, Calendar, Globe, Instagram, MessageSquare, Star, StarOff, 
  Clock, CheckCircle2, Send, ExternalLink, Eye, MousePointer, FileText, 
  Box, TrendingUp, MailOpen, Reply, ChevronRight, Activity, MapPin
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { ReplyDialog } from './ReplyDialog';
import { properties } from '@/data/dummyData';
import ebayLogo from '@/assets/ebay-kleinanzeigen-logo.png';

interface ExposeActivity {
  type: 'view' | 'section' | 'document' | 'contact';
  label: string;
  timestamp: string;
  duration?: string;
}

interface EmailEvent {
  type: 'sent' | 'opened' | 'clicked' | 'replied';
  subject?: string;
  timestamp: string;
  details?: string;
}

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  source: string;
  sourceIcon: React.ReactNode;
  date: string;
  status: 'new' | 'contacted' | 'qualified' | 'lost';
  starred: boolean;
  onofficeId?: string;
  // Enhanced tracking data
  profileCompleted?: number;
  budget?: string;
  timeline?: string;
  financing?: string;
  exposeViews?: number;
  lastVisit?: string;
  totalTimeOnExpose?: string;
  exposeActivities?: ExposeActivity[];
  emailEvents?: EmailEvent[];
  unlockLevel?: number;
}

const initialLeads: Lead[] = [
  {
    id: '1',
    name: 'Anna Schneider',
    email: 'anna.schneider@email.de',
    phone: '+49 171 234 5678',
    message: 'Sehr geehrte Damen und Herren, ich interessiere mich für die Immobilie und würde gerne einen Besichtigungstermin vereinbaren.',
    source: 'ImmoScout24',
    sourceIcon: <Globe className="h-4 w-4 text-orange-500" />,
    date: '2024-01-15',
    status: 'qualified',
    starred: true,
    onofficeId: '29481',
    profileCompleted: 100,
    budget: '500.000 € - 600.000 €',
    timeline: '1-2 Monate',
    financing: 'Finanzierungszusage vorhanden',
    exposeViews: 12,
    lastVisit: '2024-01-15 14:32',
    totalTimeOnExpose: '18 Min',
    unlockLevel: 3,
    exposeActivities: [
      { type: 'view', label: 'Exposé geöffnet', timestamp: '2024-01-15 14:32' },
      { type: 'section', label: '3D-Tour angesehen', timestamp: '2024-01-15 14:35', duration: '4:23' },
      { type: 'document', label: 'Grundriss heruntergeladen', timestamp: '2024-01-15 14:40' },
      { type: 'section', label: 'Preishistorie angesehen', timestamp: '2024-01-15 14:42', duration: '2:15' },
      { type: 'section', label: 'Lage & Umgebung', timestamp: '2024-01-15 14:45', duration: '3:10' },
      { type: 'contact', label: 'Nachricht gesendet', timestamp: '2024-01-15 14:50' },
    ],
    emailEvents: [
      { type: 'sent', subject: 'Exposé: Pelkovenstraße 45', timestamp: '2024-01-13 09:15' },
      { type: 'opened', timestamp: '2024-01-13 10:22', details: '3x geöffnet' },
      { type: 'clicked', timestamp: '2024-01-13 10:24', details: 'Link zu Exposé' },
      { type: 'replied', subject: 'Re: Exposé: Pelkovenstraße 45', timestamp: '2024-01-13 11:45' },
      { type: 'sent', subject: 'Besichtigungstermin', timestamp: '2024-01-14 15:00' },
      { type: 'opened', timestamp: '2024-01-14 15:12', details: '2x geöffnet' },
    ],
  },
  {
    id: '2',
    name: 'Michael Weber',
    email: 'm.weber@business.de',
    phone: '+49 160 987 6543',
    message: 'Guten Tag, ist die Immobilie noch verfügbar? Ich suche dringend für meine Familie.',
    source: 'eBay Kleinanzeigen',
    sourceIcon: <img src={ebayLogo} alt="eBay" className="h-4 w-4 rounded" />,
    date: '2024-01-14',
    status: 'contacted',
    starred: false,
    onofficeId: '29485',
    profileCompleted: 66,
    budget: '600.000 € - 800.000 €',
    timeline: 'Sofort',
    exposeViews: 5,
    lastVisit: '2024-01-14 16:20',
    totalTimeOnExpose: '8 Min',
    unlockLevel: 2,
    exposeActivities: [
      { type: 'view', label: 'Exposé geöffnet', timestamp: '2024-01-14 16:10' },
      { type: 'section', label: 'Bildergalerie', timestamp: '2024-01-14 16:12', duration: '2:30' },
      { type: 'section', label: '3D-Tour angesehen', timestamp: '2024-01-14 16:15', duration: '3:45' },
      { type: 'section', label: 'Ausstattung', timestamp: '2024-01-14 16:19', duration: '1:20' },
    ],
    emailEvents: [
      { type: 'sent', subject: 'Exposé: Pelkovenstraße 45', timestamp: '2024-01-14 09:00' },
      { type: 'opened', timestamp: '2024-01-14 16:08', details: '1x geöffnet' },
      { type: 'clicked', timestamp: '2024-01-14 16:10', details: 'Link zu Exposé' },
    ],
  },
  {
    id: '3',
    name: 'Sarah Klein',
    email: 'sarah.klein@gmail.com',
    phone: '+49 152 333 4444',
    message: 'Wunderschöne Wohnung! Wann wäre eine Besichtigung möglich?',
    source: 'Instagram',
    sourceIcon: <Instagram className="h-4 w-4 text-pink-500" />,
    date: '2024-01-13',
    status: 'qualified',
    starred: true,
    onofficeId: '29490',
    profileCompleted: 100,
    budget: '400.000 € - 500.000 €',
    timeline: '3-6 Monate',
    financing: 'In Klärung',
    exposeViews: 8,
    lastVisit: '2024-01-13 19:45',
    totalTimeOnExpose: '22 Min',
    unlockLevel: 3,
    exposeActivities: [
      { type: 'view', label: 'Exposé geöffnet', timestamp: '2024-01-13 19:00' },
      { type: 'section', label: 'Alle Bilder angesehen', timestamp: '2024-01-13 19:05', duration: '5:00' },
      { type: 'section', label: '3D-Tour angesehen', timestamp: '2024-01-13 19:12', duration: '6:30' },
      { type: 'document', label: 'Energieausweis angesehen', timestamp: '2024-01-13 19:20' },
      { type: 'section', label: 'Preishistorie angesehen', timestamp: '2024-01-13 19:25', duration: '4:00' },
      { type: 'contact', label: 'Besichtigungsanfrage', timestamp: '2024-01-13 19:35' },
    ],
    emailEvents: [
      { type: 'sent', subject: 'Ihre Anfrage', timestamp: '2024-01-12 14:00' },
      { type: 'opened', timestamp: '2024-01-12 18:30', details: '5x geöffnet' },
      { type: 'replied', subject: 'Re: Ihre Anfrage', timestamp: '2024-01-12 19:00' },
    ],
  },
  {
    id: '4',
    name: 'Thomas Hoffmann',
    email: 't.hoffmann@web.de',
    phone: '+49 176 555 6666',
    message: 'Können Sie mir mehr Informationen zum Energieausweis zusenden?',
    source: 'Immowelt',
    sourceIcon: <Globe className="h-4 w-4 text-blue-500" />,
    date: '2024-01-12',
    status: 'new',
    starred: false,
    profileCompleted: 33,
    exposeViews: 2,
    lastVisit: '2024-01-12 11:00',
    totalTimeOnExpose: '3 Min',
    unlockLevel: 1,
    exposeActivities: [
      { type: 'view', label: 'Exposé geöffnet', timestamp: '2024-01-12 10:55' },
      { type: 'section', label: 'Objektbeschreibung', timestamp: '2024-01-12 10:57', duration: '1:30' },
      { type: 'contact', label: 'Anfrage gesendet', timestamp: '2024-01-12 11:00' },
    ],
    emailEvents: [],
  },
];

const getStatusLabel = (status: Lead['status']) => {
  switch (status) {
    case 'new': return 'Neu';
    case 'contacted': return 'Kontaktiert';
    case 'qualified': return 'Qualifiziert';
    case 'lost': return 'Verloren';
  }
};

const getStatusClass = (status: Lead['status']) => {
  switch (status) {
    case 'new': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
    case 'contacted': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
    case 'qualified': return 'bg-green-500/10 text-green-500 border-green-500/20';
    case 'lost': return 'bg-red-500/10 text-red-500 border-red-500/20';
  }
};

const getActivityIcon = (type: ExposeActivity['type']) => {
  switch (type) {
    case 'view': return <Eye className="h-3.5 w-3.5" />;
    case 'section': return <MousePointer className="h-3.5 w-3.5" />;
    case 'document': return <FileText className="h-3.5 w-3.5" />;
    case 'contact': return <MessageSquare className="h-3.5 w-3.5" />;
  }
};

const getEmailIcon = (type: EmailEvent['type']) => {
  switch (type) {
    case 'sent': return <Send className="h-3.5 w-3.5 text-muted-foreground" />;
    case 'opened': return <MailOpen className="h-3.5 w-3.5 text-green-500" />;
    case 'clicked': return <MousePointer className="h-3.5 w-3.5 text-blue-500" />;
    case 'replied': return <Reply className="h-3.5 w-3.5 text-accent" />;
  }
};

export function LeadsTab() {
  const { id } = useParams();
  const [leads, setLeads] = useState(initialLeads);
  const [filter, setFilter] = useState<'all' | Lead['status']>('all');
  const [replyDialogOpen, setReplyDialogOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [expandedLead, setExpandedLead] = useState<string | null>(null);

  const property = properties.find(p => p.id === id) || properties[0];
  const exposeUrl = `${window.location.origin}/property/${id}/expose`;

  const handleReply = (lead: Lead) => {
    setSelectedLead(lead);
    setReplyDialogOpen(true);
  };

  const toggleStar = (id: string) => {
    setLeads(prev => prev.map(lead => 
      lead.id === id ? { ...lead, starred: !lead.starred } : lead
    ));
  };

  const toggleExpand = (id: string) => {
    setExpandedLead(prev => prev === id ? null : id);
  };

  const filteredLeads = filter === 'all' 
    ? leads 
    : leads.filter(lead => lead.status === filter);

  const newCount = leads.filter(l => l.status === 'new').length;
  const contactedCount = leads.filter(l => l.status === 'contacted').length;
  const qualifiedCount = leads.filter(l => l.status === 'qualified').length;

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="cursor-pointer hover:border-primary/50 transition-colors" onClick={() => setFilter('all')}>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center">
                <MessageSquare className="h-6 w-6 text-accent" />
              </div>
              <div>
                <p className="text-2xl font-bold">{leads.length}</p>
                <p className="text-sm text-muted-foreground">Gesamt</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:border-blue-500/50 transition-colors" onClick={() => setFilter('new')}>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <Clock className="h-6 w-6 text-blue-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{newCount}</p>
                <p className="text-sm text-muted-foreground">Neue Anfragen</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:border-yellow-500/50 transition-colors" onClick={() => setFilter('contacted')}>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-yellow-500/10 flex items-center justify-center">
                <Mail className="h-6 w-6 text-yellow-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{contactedCount}</p>
                <p className="text-sm text-muted-foreground">Kontaktiert</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:border-green-500/50 transition-colors" onClick={() => setFilter('qualified')}>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-green-500/10 flex items-center justify-center">
                <CheckCircle2 className="h-6 w-6 text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{qualifiedCount}</p>
                <p className="text-sm text-muted-foreground">Qualifiziert</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter indicator */}
      {filter !== 'all' && (
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Filter aktiv:</span>
          <Badge variant="secondary" className="gap-1">
            {getStatusLabel(filter)}
            <button onClick={() => setFilter('all')} className="ml-1 hover:text-foreground">×</button>
          </Badge>
        </div>
      )}

      {/* Leads List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Eingehende Anfragen
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredLeads.map((lead) => (
              <div 
                key={lead.id} 
                className={cn(
                  "rounded-lg border bg-card transition-all",
                  expandedLead === lead.id ? "border-accent/50 shadow-lg" : "hover:border-primary/30"
                )}
              >
                {/* Lead Header */}
                <div 
                  className="p-4 cursor-pointer"
                  onClick={() => toggleExpand(lead.id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <button 
                        onClick={(e) => { e.stopPropagation(); toggleStar(lead.id); }}
                        className="mt-1 text-muted-foreground hover:text-yellow-500 transition-colors"
                      >
                        {lead.starred ? (
                          <Star className="h-5 w-5 fill-yellow-500 text-yellow-500" />
                        ) : (
                          <StarOff className="h-5 w-5" />
                        )}
                      </button>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <h4 className="font-semibold">{lead.name}</h4>
                          <Badge variant="outline" className={cn('text-xs', getStatusClass(lead.status))}>
                            {getStatusLabel(lead.status)}
                          </Badge>
                          {lead.unlockLevel && (
                            <Badge variant="secondary" className="text-xs gap-1">
                              <Activity className="h-3 w-3" />
                              Level {lead.unlockLevel}
                            </Badge>
                          )}
                          {lead.onofficeId && (
                            <a 
                              href={`https://app.onoffice.de/contact/${lead.onofficeId}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="flex items-center gap-1 text-xs text-muted-foreground hover:text-accent transition-colors"
                            >
                              <ExternalLink className="h-3 w-3" />
                              onoffice
                            </a>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                          "{lead.message}"
                        </p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            {lead.email}
                          </span>
                          <span className="flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            {lead.phone}
                          </span>
                          {lead.exposeViews && (
                            <span className="flex items-center gap-1 text-accent">
                              <Eye className="h-3 w-3" />
                              {lead.exposeViews}x Exposé
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        {lead.sourceIcon}
                        <span>{lead.source}</span>
                      </div>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(lead.date).toLocaleDateString('de-DE')}
                      </span>
                      <ChevronRight className={cn(
                        "h-4 w-4 text-muted-foreground transition-transform",
                        expandedLead === lead.id && "rotate-90"
                      )} />
                    </div>
                  </div>
                </div>

                {/* Expanded Lead Details */}
                {expandedLead === lead.id && (
                  <div className="border-t bg-muted/30 p-4">
                    <Tabs defaultValue="profile" className="w-full">
                      <TabsList className="mb-4">
                        <TabsTrigger value="profile">Profil</TabsTrigger>
                        <TabsTrigger value="activity">Exposé-Aktivität</TabsTrigger>
                        <TabsTrigger value="communication">Kommunikation</TabsTrigger>
                      </TabsList>

                      {/* Profile Tab */}
                      <TabsContent value="profile" className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          {/* Profile Completion */}
                          <div className="p-4 rounded-lg bg-background border">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-medium">Profil-Vollständigkeit</span>
                              <span className="text-sm text-accent font-semibold">{lead.profileCompleted || 0}%</span>
                            </div>
                            <Progress value={lead.profileCompleted || 0} className="h-2" />
                          </div>

                          {/* Engagement Score */}
                          <div className="p-4 rounded-lg bg-background border">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-medium">Engagement</span>
                              <div className="flex items-center gap-2">
                                <Eye className="h-4 w-4 text-muted-foreground" />
                                <span className="font-semibold">{lead.exposeViews || 0} Views</span>
                                {lead.totalTimeOnExpose && (
                                  <span className="text-sm text-muted-foreground">• {lead.totalTimeOnExpose}</span>
                                )}
                              </div>
                            </div>
                            {lead.lastVisit && (
                              <p className="text-xs text-muted-foreground">
                                Letzter Besuch: {lead.lastVisit}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Lead Details */}
                        <div className="grid grid-cols-3 gap-4">
                          {lead.budget && (
                            <div className="p-3 rounded-lg bg-background border">
                              <p className="text-xs text-muted-foreground mb-1">Budget</p>
                              <p className="font-medium text-sm">{lead.budget}</p>
                            </div>
                          )}
                          {lead.timeline && (
                            <div className="p-3 rounded-lg bg-background border">
                              <p className="text-xs text-muted-foreground mb-1">Zeitrahmen</p>
                              <p className="font-medium text-sm">{lead.timeline}</p>
                            </div>
                          )}
                          {lead.financing && (
                            <div className="p-3 rounded-lg bg-background border">
                              <p className="text-xs text-muted-foreground mb-1">Finanzierung</p>
                              <p className="font-medium text-sm">{lead.financing}</p>
                            </div>
                          )}
                        </div>
                      </TabsContent>

                      {/* Activity Tab */}
                      <TabsContent value="activity" className="space-y-4">
                        {lead.exposeActivities && lead.exposeActivities.length > 0 ? (
                          <div className="space-y-2">
                            {lead.exposeActivities.map((activity, idx) => (
                              <div 
                                key={idx}
                                className="flex items-center gap-3 p-3 rounded-lg bg-background border"
                              >
                                <div className={cn(
                                  "w-8 h-8 rounded-full flex items-center justify-center",
                                  activity.type === 'view' && "bg-blue-500/10 text-blue-500",
                                  activity.type === 'section' && "bg-accent/10 text-accent",
                                  activity.type === 'document' && "bg-green-500/10 text-green-500",
                                  activity.type === 'contact' && "bg-purple-500/10 text-purple-500"
                                )}>
                                  {getActivityIcon(activity.type)}
                                </div>
                                <div className="flex-1">
                                  <p className="text-sm font-medium">{activity.label}</p>
                                  <p className="text-xs text-muted-foreground">{activity.timestamp}</p>
                                </div>
                                {activity.duration && (
                                  <Badge variant="secondary" className="text-xs">
                                    {activity.duration}
                                  </Badge>
                                )}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-8 text-muted-foreground">
                            <Eye className="h-8 w-8 mx-auto mb-2 opacity-50" />
                            <p>Keine Aktivitätsdaten verfügbar</p>
                          </div>
                        )}
                      </TabsContent>

                      {/* Communication Tab */}
                      <TabsContent value="communication" className="space-y-4">
                        {lead.emailEvents && lead.emailEvents.length > 0 ? (
                          <div className="space-y-2">
                            {lead.emailEvents.map((event, idx) => (
                              <div 
                                key={idx}
                                className="flex items-center gap-3 p-3 rounded-lg bg-background border"
                              >
                                <div className={cn(
                                  "w-8 h-8 rounded-full flex items-center justify-center",
                                  event.type === 'sent' && "bg-muted",
                                  event.type === 'opened' && "bg-green-500/10",
                                  event.type === 'clicked' && "bg-blue-500/10",
                                  event.type === 'replied' && "bg-accent/10"
                                )}>
                                  {getEmailIcon(event.type)}
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center gap-2">
                                    <p className="text-sm font-medium">
                                      {event.type === 'sent' && 'E-Mail gesendet'}
                                      {event.type === 'opened' && 'E-Mail geöffnet'}
                                      {event.type === 'clicked' && 'Link geklickt'}
                                      {event.type === 'replied' && 'Antwort erhalten'}
                                    </p>
                                    {event.details && (
                                      <Badge variant="secondary" className="text-xs">
                                        {event.details}
                                      </Badge>
                                    )}
                                  </div>
                                  {event.subject && (
                                    <p className="text-xs text-muted-foreground">{event.subject}</p>
                                  )}
                                  <p className="text-xs text-muted-foreground">{event.timestamp}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-8 text-muted-foreground">
                            <Mail className="h-8 w-8 mx-auto mb-2 opacity-50" />
                            <p>Noch keine Kommunikation</p>
                          </div>
                        )}
                      </TabsContent>
                    </Tabs>

                    {/* Actions */}
                    <div className="flex justify-end gap-2 mt-4 pt-4 border-t">
                      {lead.onofficeId && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          asChild
                        >
                          <a 
                            href={`https://app.onoffice.de/contact/${lead.onofficeId}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <ExternalLink className="h-4 w-4 mr-1" />
                            In onoffice öffnen
                          </a>
                        </Button>
                      )}
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleReply(lead)}
                      >
                        <Send className="h-4 w-4 mr-1" />
                        Antworten & Exposé senden
                      </Button>
                      <Button size="sm">
                        <Phone className="h-4 w-4 mr-1" />
                        Anrufen
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Reply Dialog */}
      <ReplyDialog
        open={replyDialogOpen}
        onOpenChange={setReplyDialogOpen}
        lead={selectedLead ? {
          name: selectedLead.name,
          email: selectedLead.email,
          message: selectedLead.message,
          source: selectedLead.source,
        } : null}
        propertyAddress={property.address}
        exposeUrl={exposeUrl}
      />
    </div>
  );
}
