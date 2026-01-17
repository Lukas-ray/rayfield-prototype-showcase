export type WorkflowState = 'draft' | 'capture_processing' | 'docs_missing' | 'ready_to_publish' | 'inquiries_active' | 'under_offer';

export interface Property {
  id: string;
  address: string;
  city: string;
  propertyType: string;
  workflowState: WorkflowState;
  lastActivity: string;
  nextAction: string;
  clientName?: string;
  price: number;
  area: number;
  rooms: number;
  completionPercent: number;
  thumbnail: string;
  createdAt: string;
}

export interface MediaItem {
  id: string;
  type: 'photo' | 'video' | '3d_tour' | 'floor_plan';
  name: string;
  url: string;
  variant: 'hero' | 'portal' | 'social';
  status: 'processing' | 'ready';
}

export interface Document {
  id: string;
  name: string;
  type: string;
  status: 'missing' | 'requested' | 'received' | 'verified';
  uploadedAt?: string;
  source?: 'seller' | 'hausverwaltung' | 'agent';
}

export interface AgentRun {
  id: string;
  agentName: string;
  timestamp: string;
  status: 'running' | 'completed' | 'failed';
  outputs: string[];
}

export interface AuditEntry {
  id: string;
  action: string;
  actor: string;
  actorType: 'user' | 'agent';
  timestamp: string;
  details?: string;
}

export interface Task {
  id: string;
  title: string;
  owner: string;
  dueDate: string;
  status: 'pending' | 'in_progress' | 'completed';
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  channel: 'portal' | 'website' | 'referral';
  status: 'new' | 'qualified' | 'viewing_scheduled' | 'offer_made';
  budget: string;
  timeline: string;
  financingProof: boolean;
  propertyId: string;
  messages: { role: 'user' | 'assistant'; content: string; source?: string }[];
}

export const properties: Property[] = [
  {
    id: '1',
    address: 'Müllerstraße 42',
    city: 'Berlin Mitte',
    propertyType: 'Wohnung',
    workflowState: 'draft',
    lastActivity: 'Vor 2 Stunden',
    nextAction: 'Capture-Scan hochladen',
    clientName: 'Hans Schmidt',
    price: 485000,
    area: 85,
    rooms: 3,
    completionPercent: 15,
    thumbnail: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=300&fit=crop',
    createdAt: '2024-01-15',
  },
  {
    id: '2',
    address: 'Prenzlauer Allee 156',
    city: 'Berlin Prenzlauer Berg',
    propertyType: 'Penthouse',
    workflowState: 'capture_processing',
    lastActivity: 'Vor 30 Minuten',
    nextAction: 'Auf Capture-Verarbeitung warten',
    clientName: 'Maria Weber',
    price: 1250000,
    area: 145,
    rooms: 5,
    completionPercent: 35,
    thumbnail: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&h=300&fit=crop',
    createdAt: '2024-01-12',
  },
  {
    id: '3',
    address: 'Friedrichstraße 89',
    city: 'Berlin Kreuzberg',
    propertyType: 'Loft',
    workflowState: 'docs_missing',
    lastActivity: 'Vor 1 Tag',
    nextAction: 'Energieausweis anfordern',
    clientName: 'Thomas Müller',
    price: 720000,
    area: 120,
    rooms: 4,
    completionPercent: 55,
    thumbnail: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400&h=300&fit=crop',
    createdAt: '2024-01-08',
  },
  {
    id: '4',
    address: 'Kantstraße 23',
    city: 'Berlin Charlottenburg',
    propertyType: 'Wohnung',
    workflowState: 'ready_to_publish',
    lastActivity: 'Vor 4 Stunden',
    nextAction: 'Inserat prüfen & veröffentlichen',
    clientName: 'Anna Fischer',
    price: 595000,
    area: 95,
    rooms: 3,
    completionPercent: 85,
    thumbnail: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&h=300&fit=crop',
    createdAt: '2024-01-05',
  },
  {
    id: '5',
    address: 'Schönhauser Allee 78',
    city: 'Berlin Pankow',
    propertyType: 'Maisonette',
    workflowState: 'inquiries_active',
    lastActivity: 'Vor 15 Minuten',
    nextAction: 'Auf 3 Anfragen antworten',
    price: 680000,
    area: 110,
    rooms: 4,
    completionPercent: 90,
    thumbnail: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=400&h=300&fit=crop',
    createdAt: '2024-01-02',
  },
  {
    id: '6',
    address: 'Kurfürstendamm 215',
    city: 'Berlin Wilmersdorf',
    propertyType: 'Villa',
    workflowState: 'under_offer',
    lastActivity: 'Vor 2 Tagen',
    nextAction: 'Angebotsunterlagen finalisieren',
    clientName: 'Klaus Becker',
    price: 2100000,
    area: 280,
    rooms: 7,
    completionPercent: 95,
    thumbnail: 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=400&h=300&fit=crop',
    createdAt: '2023-12-20',
  },
];

export const getWorkflowStateLabel = (state: WorkflowState): string => {
  const labels: Record<WorkflowState, string> = {
    draft: 'Entwurf',
    capture_processing: 'Capture wird verarbeitet',
    docs_missing: 'Dokumente fehlen',
    ready_to_publish: 'Bereit zur Veröffentlichung',
    inquiries_active: 'Anfragen aktiv',
    under_offer: 'Angebot liegt vor',
  };
  return labels[state];
};

export const getWorkflowStateClass = (state: WorkflowState): string => {
  const classes: Record<WorkflowState, string> = {
    draft: 'status-draft',
    capture_processing: 'status-processing',
    docs_missing: 'status-missing',
    ready_to_publish: 'status-ready',
    inquiries_active: 'status-active',
    under_offer: 'status-offer',
  };
  return classes[state];
};

export const mediaItems: MediaItem[] = [
  { id: '1', type: 'photo', name: 'Wohnzimmer - Hero', url: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800', variant: 'hero', status: 'ready' },
  { id: '2', type: 'photo', name: 'Küche', url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800', variant: 'portal', status: 'ready' },
  { id: '3', type: 'photo', name: 'Schlafzimmer', url: 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?w=800', variant: 'hero', status: 'ready' },
  { id: '4', type: 'floor_plan', name: 'Grundriss v2', url: '/placeholder.svg', variant: 'portal', status: 'ready' },
  { id: '5', type: '3d_tour', name: '3D Virtueller Rundgang', url: '/placeholder.svg', variant: 'hero', status: 'ready' },
  { id: '6', type: 'video', name: 'Objektrundgang', url: '/placeholder.svg', variant: 'social', status: 'processing' },
];

export const documents: Document[] = [
  { id: '1', name: 'Grundbuchauszug', type: 'Grundbuch', status: 'verified', uploadedAt: '2024-01-10', source: 'agent' },
  { id: '2', name: 'Energieausweis', type: 'Energieausweis', status: 'missing' },
  { id: '3', name: 'Teilungserklärung', type: 'Teilungserklärung', status: 'requested', source: 'hausverwaltung' },
  { id: '4', name: 'Wirtschaftsplan 2024', type: 'Wirtschaftsplan', status: 'received', uploadedAt: '2024-01-12', source: 'hausverwaltung' },
  { id: '5', name: 'Protokolle Eigentümerversammlung', type: 'Protokolle', status: 'missing' },
  { id: '6', name: 'Hausgeldabrechnung', type: 'Hausgeldabrechnung', status: 'verified', uploadedAt: '2024-01-08', source: 'seller' },
  { id: '7', name: 'Wohnflächenberechnung', type: 'Flächenberechnung', status: 'received', uploadedAt: '2024-01-11', source: 'seller' },
  { id: '8', name: 'Mietvertrag', type: 'Mietvertrag', status: 'missing' },
];

export const agentRuns: AgentRun[] = [
  { id: '1', agentName: 'Listing Factory Agent', timestamp: '2024-01-14 14:32', status: 'completed', outputs: ['Inseratstitel generiert', '3 Beschreibungsvarianten erstellt', '12 strukturierte Felder extrahiert'] },
  { id: '2', agentName: 'Document Pack Agent', timestamp: '2024-01-14 10:15', status: 'completed', outputs: ['4 Dokumente klassifiziert', '3 fehlende Dokumente identifiziert', 'Anfragenachricht generiert'] },
  { id: '3', agentName: 'Lead Qualification Agent', timestamp: '2024-01-13 16:45', status: 'completed', outputs: ['5 Leads bewertet', '2 mit hoher Priorität markiert'] },
];

export const auditEntries: AuditEntry[] = [
  { id: '1', action: 'Capture hochgeladen', actor: 'Maria Weber', actorType: 'user', timestamp: '2024-01-14 15:30', details: 'scan_v2.zip (2,4 GB)' },
  { id: '2', action: 'Agent-Lauf abgeschlossen', actor: 'Listing Factory Agent', actorType: 'agent', timestamp: '2024-01-14 14:32', details: '3 Inseratsvarianten generiert' },
  { id: '3', action: 'Dokument umbenannt', actor: 'System', actorType: 'agent', timestamp: '2024-01-14 12:15', details: 'grundbuch_scan.pdf → Grundbuchauszug_Müllerstr42.pdf' },
  { id: '4', action: 'Export generiert', actor: 'Anna Fischer', actorType: 'user', timestamp: '2024-01-14 11:00', details: 'ImmoScout24 Paket' },
  { id: '5', action: 'Workflow-Status geändert', actor: 'Thomas Müller', actorType: 'user', timestamp: '2024-01-13 16:20', details: 'Capture wird verarbeitet → Dokumente fehlen' },
  { id: '6', action: 'Dokument hochgeladen', actor: 'Hausverwaltung', actorType: 'user', timestamp: '2024-01-13 14:00', details: 'Wirtschaftsplan_2024.pdf' },
];

export const tasks: Task[] = [
  { id: '1', title: 'Generierten Inseratstext prüfen', owner: 'Makler', dueDate: 'Heute', status: 'pending' },
  { id: '2', title: 'Energieausweis vom Verkäufer anfordern', owner: 'Koordinator', dueDate: 'Morgen', status: 'in_progress' },
  { id: '3', title: 'Grundriss-Maße verifizieren', owner: 'Makler', dueDate: '18. Jan', status: 'pending' },
  { id: '4', title: 'Professionelle Fotos planen', owner: 'Makler', dueDate: '20. Jan', status: 'completed' },
];

export const leads: Lead[] = [
  {
    id: '1',
    name: 'Sophie Richter',
    email: 'sophie.r@email.com',
    channel: 'portal',
    status: 'qualified',
    budget: '500.000 € - 600.000 €',
    timeline: '2-3 Monate',
    financingProof: true,
    propertyId: '4',
    messages: [
      { role: 'user', content: 'Passt ein Kingsize-Bett ins Schlafzimmer?' },
      { role: 'assistant', content: 'Ja! Das Schlafzimmer misst 4,2m x 3,8m, was bequem Platz für ein Kingsize-Bett (typischerweise 2m x 2m) mit Nachttischen auf beiden Seiten bietet.', source: 'scan' },
    ],
  },
  {
    id: '2',
    name: 'Michael Braun',
    email: 'm.braun@company.de',
    channel: 'website',
    status: 'new',
    budget: '600.000 € - 800.000 €',
    timeline: 'Sofort',
    financingProof: false,
    propertyId: '5',
    messages: [],
  },
  {
    id: '3',
    name: 'Lisa Hoffmann',
    email: 'l.hoffmann@gmail.com',
    channel: 'referral',
    status: 'viewing_scheduled',
    budget: '400.000 € - 500.000 €',
    timeline: '3-6 Monate',
    financingProof: true,
    propertyId: '4',
    messages: [
      { role: 'user', content: 'Welche Dokumente sind für die WEG verfügbar?' },
      { role: 'assistant', content: 'Aktuell verfügbar: Teilungserklärung (verifiziert), Wirtschaftsplan 2024 (verifiziert) und Hausgeldabrechnung. Die Protokolle der letzten Versammlungen stehen noch aus.', source: 'document' },
    ],
  },
];

export const checklistTemplates = [
  { id: '1', name: 'Standard Wohnung', items: 8, active: true },
  { id: '2', name: 'WEG-Objekt', items: 12, active: true },
  { id: '3', name: 'Neubau', items: 6, active: false },
  { id: '4', name: 'Kapitalanlage', items: 10, active: true },
];

export const exportPresets = [
  { id: '1', name: 'ImmoScout24', fields: 45, active: true },
  { id: '2', name: 'Immowelt', fields: 38, active: true },
  { id: '3', name: 'Kleinanzeigen', fields: 22, active: true },
  { id: '4', name: 'Generisches XML', fields: 50, active: false },
];

export const roles = [
  { id: '1', name: 'Admin', users: 2, permissions: ['alle'] },
  { id: '2', name: 'Makler', users: 5, permissions: ['objekte', 'leads', 'veröffentlichung'] },
  { id: '3', name: 'Koordinator', users: 3, permissions: ['dokumente', 'aufgaben'] },
  { id: '4', name: 'Betrachter', users: 8, permissions: ['nur-lesen'] },
];
