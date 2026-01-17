import { useState } from 'react';
import { Play, Check, AlertCircle, Calendar, DollarSign, Clock, Mail, Phone, Globe } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { TourConciergeChatbot } from '@/components/leads/TourConciergeChatbot';
import { leads, properties } from '@/data/dummyData';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

const channelIcons = {
  portal: Globe,
  website: Globe,
  referral: Mail,
};

const statusConfig = {
  new: { label: 'Neu', class: 'status-draft' },
  qualified: { label: 'Qualifiziert', class: 'status-ready' },
  viewing_scheduled: { label: 'Besichtigung geplant', class: 'status-active' },
  offer_made: { label: 'Angebot abgegeben', class: 'status-offer' },
};

export default function Leads() {
  const { toast } = useToast();
  const [selectedLead, setSelectedLead] = useState(leads[0]);
  const [qualificationScore, setQualificationScore] = useState<number | null>(null);

  const property = properties.find(p => p.id === selectedLead.propertyId);
  const ChannelIcon = channelIcons[selectedLead.channel];

  const handleRunQualification = () => {
    // Simulate qualification
    setTimeout(() => {
      setQualificationScore(85);
      toast({
        title: 'Lead-Qualifizierung abgeschlossen',
        description: `${selectedLead.name} hat 85/100 Punkte erreicht - Lead mit hoher Priorität.`,
      });
    }, 1000);
  };

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Leads</h1>
            <p className="text-muted-foreground">{leads.length} Anfragen über alle Objekte</p>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-6 h-[calc(100vh-200px)]">
          {/* Lead List */}
          <div className="col-span-3 workspace-card p-0 overflow-hidden">
            <div className="p-4 border-b">
              <h3 className="font-semibold">Anfragen-Posteingang</h3>
            </div>
            <div className="overflow-y-auto">
              {leads.map((lead) => (
                <div
                  key={lead.id}
                  onClick={() => {
                    setSelectedLead(lead);
                    setQualificationScore(null);
                  }}
                  className={cn(
                    'p-4 border-b cursor-pointer transition-colors',
                    selectedLead.id === lead.id ? 'bg-accent/5' : 'hover:bg-secondary/50'
                  )}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium">{lead.name}</p>
                      <p className="text-xs text-muted-foreground">{lead.email}</p>
                    </div>
                    <span className={cn('status-badge', statusConfig[lead.status].class)}>
                      {statusConfig[lead.status].label}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2 truncate">
                    {properties.find(p => p.id === lead.propertyId)?.address}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Lead Details */}
          <div className="col-span-5 space-y-4 overflow-y-auto">
            {/* Lead Info */}
            <div className="workspace-card">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-semibold">{selectedLead.name}</h2>
                  <p className="text-sm text-muted-foreground">{selectedLead.email}</p>
                </div>
                <div className="flex items-center gap-2">
                  <ChannelIcon className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm capitalize">{selectedLead.channel}</span>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Interessiert an: <span className="font-medium text-foreground">{property?.address}</span>
              </p>
            </div>

            {/* Qualification Panel */}
            <div className="workspace-card">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Qualifizierung</h3>
                <Button onClick={handleRunQualification} size="sm" className="gap-2">
                  <Play className="h-4 w-4" />
                  Qualification Agent starten
                </Button>
              </div>

              {qualificationScore && (
                <div className="mb-4 p-4 rounded-lg bg-success/10 border border-success/20">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Qualifizierungspunktzahl</span>
                    <span className="text-2xl font-bold text-success">{qualificationScore}/100</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">Hohe Priorität - Finanzierung verifiziert, Zeitplan passt</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 rounded-lg bg-secondary/50">
                  <div className="flex items-center gap-2 mb-1">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Budget</span>
                  </div>
                  <p className="font-medium">{selectedLead.budget}</p>
                </div>
                <div className="p-3 rounded-lg bg-secondary/50">
                  <div className="flex items-center gap-2 mb-1">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Zeitrahmen</span>
                  </div>
                  <p className="font-medium">{selectedLead.timeline}</p>
                </div>
                <div className="col-span-2 p-3 rounded-lg bg-secondary/50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {selectedLead.financingProof ? (
                        <Check className="h-4 w-4 text-success" />
                      ) : (
                        <AlertCircle className="h-4 w-4 text-warning" />
                      )}
                      <span className="text-sm">Finanzierungsnachweis</span>
                    </div>
                    <span className={cn(
                      'text-sm font-medium',
                      selectedLead.financingProof ? 'text-success' : 'text-warning'
                    )}>
                      {selectedLead.financingProof ? 'Verifiziert' : 'Ausstehend'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Scheduling Panel */}
            <div className="workspace-card">
              <h3 className="font-semibold mb-4">Terminplanung</h3>
              <div className="grid grid-cols-3 gap-3">
                {['Mo 15., 10:00', 'Di 16., 14:00', 'Mi 17., 11:00'].map((slot) => (
                  <Button key={slot} variant="outline" className="flex-col h-auto py-3">
                    <Calendar className="h-4 w-4 mb-1" />
                    <span className="text-xs">{slot}</span>
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {/* Tour Concierge Chatbot */}
          <div className="col-span-4">
            <TourConciergeChatbot />
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
