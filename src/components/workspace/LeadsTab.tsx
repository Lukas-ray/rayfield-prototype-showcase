import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { User, Mail, Phone, Calendar, Globe, Instagram, MessageSquare, Star, StarOff, Clock, CheckCircle2, Send } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { ReplyDialog } from './ReplyDialog';
import { properties } from '@/data/dummyData';
import ebayLogo from '@/assets/ebay-kleinanzeigen-logo.png';

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
    status: 'new',
    starred: true,
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

export function LeadsTab() {
  const { id } = useParams();
  const [leads, setLeads] = useState(initialLeads);
  const [filter, setFilter] = useState<'all' | Lead['status']>('all');
  const [replyDialogOpen, setReplyDialogOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

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
                className="p-4 rounded-lg border bg-card hover:border-primary/30 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <button 
                      onClick={() => toggleStar(lead.id)}
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
                  </div>
                </div>
                <div className="flex justify-end gap-2 mt-3 pt-3 border-t">
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
