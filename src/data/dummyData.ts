export type WorkflowState = 'draft' | 'capture_processing' | 'docs_missing' | 'ready_to_publish' | 'inquiries_active' | 'under_offer';

export interface Agent {
  name: string;
  title: string;
  email: string;
  phone: string;
}

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
  agent?: Agent;
}

export interface MediaItem {
  id: string;
  type: 'photo' | 'video' | '3d_tour' | 'floor_plan';
  name: string;
  url: string;
  variant: 'hero' | 'portal' | 'social';
  status: 'processing' | 'ready';
}

export interface DocumentIssue {
  type: 'incomplete' | 'outdated' | 'wrong_property' | 'illegible' | 'missing_signature' | 'wrong_format';
  description: string;
  severity: 'low' | 'medium' | 'high';
  suggestedAction?: string;
}

export interface Document {
  id: string;
  name: string;
  type: string;
  status: 'missing' | 'requested' | 'review' | 'verified';
  uploadedAt?: string;
  source?: 'seller' | 'hausverwaltung' | 'agent';
  holder: 'seller' | 'hausverwaltung' | 'agent' | 'notary' | 'authority';
  holderName?: string;
  holderEmail?: string;
  aiAnalysis?: {
    analyzedAt: string;
    issues: DocumentIssue[];
    confidence: number;
  };
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
    address: 'Bahnhofsallee, Eching',
    city: '85386 Eching',
    propertyType: 'Wohnung',
    workflowState: 'draft',
    lastActivity: 'Vor 2 Stunden',
    nextAction: 'Capture-Scan hochladen',
    clientName: 'Hans Schmidt',
    price: 289000,
    area: 39,
    rooms: 2,
    completionPercent: 15,
    thumbnail: 'https://immosmart.de/wp-content/uploads/immomakler/attachments/5bac552036276bbb916dbbdab4cfa978/9f9299a3-d7dc-4531-8948-bbef1b02789f-900x600.avif',
    createdAt: '2024-01-15',
    agent: {
      name: 'Lars Roth',
      title: 'Geschäftsführer / Leiter Immobilienvertrieb',
      email: 'lars.roth@immosmart.de',
      phone: '+49 89 4141888-00',
    },
  },
  {
    id: '2',
    address: 'Glockenbachviertel',
    city: '80469 München Altstadt',
    propertyType: 'Wohn- & Geschäftshaus',
    workflowState: 'capture_processing',
    lastActivity: 'Vor 30 Minuten',
    nextAction: 'Auf Capture-Verarbeitung warten',
    clientName: 'Maria Weber',
    price: 8500000,
    area: 1215,
    rooms: 43,
    completionPercent: 35,
    thumbnail: 'https://immosmart.de/wp-content/uploads/immomakler/attachments/08a59dc1e6be04e28f81e3ef55976c12/01f2c2b1-4e87-449e-9d62-eb06184e1e5f-900x599.avif',
    createdAt: '2024-01-12',
    agent: {
      name: 'Fritz Stelzer',
      title: 'Geschäftsführender Gesellschafter',
      email: 'fritz.stelzer@immosmart.de',
      phone: '+49 89 4141888-00',
    },
  },
  {
    id: '3',
    address: 'Am Schlosspark 12',
    city: '85411 Hohenkammer',
    propertyType: 'Reihenmittelhaus',
    workflowState: 'docs_missing',
    lastActivity: 'Vor 1 Tag',
    nextAction: 'Energieausweis anfordern',
    clientName: 'Thomas Müller',
    price: 750000,
    area: 145,
    rooms: 5,
    completionPercent: 55,
    thumbnail: 'https://immosmart.de/wp-content/uploads/immomakler/attachments/88733dc72d3d0ed52a8960af789d758e/76925-900x600.avif',
    createdAt: '2024-01-08',
    agent: {
      name: 'Florian Hubrich',
      title: 'Prokurist / Immobilienmakler',
      email: 'florian.hubrich@immosmart.de',
      phone: '+49 89 4141888-86',
    },
  },
  {
    id: '4',
    address: 'Pelkovenstraße 45',
    city: '80992 München Moosach',
    propertyType: 'Penthouse',
    workflowState: 'ready_to_publish',
    lastActivity: 'Vor 4 Stunden',
    nextAction: 'Inserat prüfen & veröffentlichen',
    clientName: 'Anna Fischer',
    price: 1130000,
    area: 132,
    rooms: 3,
    completionPercent: 90,
    thumbnail: 'https://immosmart.de/wp-content/uploads/immomakler/attachments/a778be3f2716cc6486df38ff4bfcb5b5/c370ecb5-5137-47f0-9048-c2f8153b5113-900x600.avif',
    createdAt: '2024-01-05',
    agent: {
      name: 'Doreen Hesse',
      title: 'Immobilienmaklerin',
      email: 'doreen.hesse@immosmart.de',
      phone: '+49 89 4141888-00',
    },
  },
  {
    id: '5',
    address: 'Bodenseestraße 128',
    city: '81245 München Pasing',
    propertyType: 'Wohnung',
    workflowState: 'inquiries_active',
    lastActivity: 'Vor 15 Minuten',
    nextAction: 'Auf 3 Anfragen antworten',
    price: 574000,
    area: 88,
    rooms: 3,
    completionPercent: 100,
    thumbnail: 'https://immosmart.de/wp-content/uploads/immomakler/attachments/3500dea561948c22f21eacc4d10ebc06/a1f85964-0b13-45a2-b714-8b837e747e28-900x600.avif',
    createdAt: '2024-01-02',
    agent: {
      name: 'Florian Hubrich',
      title: 'Prokurist / Immobilienmakler',
      email: 'florian.hubrich@immosmart.de',
      phone: '+49 89 4141888-86',
    },
  },
  {
    id: '6',
    address: 'Gutshof Amerang',
    city: '83123 Amerang',
    propertyType: 'Mehrparteienhaus',
    workflowState: 'under_offer',
    lastActivity: 'Vor 2 Tagen',
    nextAction: 'Angebotsunterlagen finalisieren',
    clientName: 'Klaus Becker',
    price: 1970000,
    area: 505,
    rooms: 20,
    completionPercent: 100,
    thumbnail: 'https://immosmart.de/wp-content/uploads/immomakler/attachments/dd80ee0be55a944d68a0d508ee3d3639/76171-900x600.avif',
    createdAt: '2023-12-20',
    agent: {
      name: 'Doreen Hesse',
      title: 'Immobilienmaklerin',
      email: 'doreen.hesse@immosmart.de',
      phone: '+49 89 4141888-00',
    },
  },
  {
    id: '7',
    address: 'Englschalkinger Straße 89',
    city: '81927 München Bogenhausen',
    propertyType: 'Dachgeschosswohnung',
    workflowState: 'ready_to_publish',
    lastActivity: 'Vor 5 Stunden',
    nextAction: 'Inserat prüfen & veröffentlichen',
    clientName: 'Lisa Hoffmann',
    price: 469000,
    area: 54,
    rooms: 2,
    completionPercent: 85,
    thumbnail: 'https://immosmart.de/wp-content/uploads/immomakler/attachments/4e41cede93095c3dacd186a326689b50/ae8c1bb9-1a22-4f15-b4ac-33e03088bda5-900x600.avif',
    createdAt: '2024-01-10',
    agent: {
      name: 'Florian Hubrich',
      title: 'Prokurist / Immobilienmakler',
      email: 'florian.hubrich@immosmart.de',
      phone: '+49 89 4141888-86',
    },
  },
  {
    id: '8',
    address: 'Berg-am-Laim-Straße 42',
    city: '81673 München Berg am Laim',
    propertyType: 'Apartment',
    workflowState: 'inquiries_active',
    lastActivity: 'Vor 1 Stunde',
    nextAction: 'Besichtigungstermine koordinieren',
    clientName: 'Michael Braun',
    price: 195000,
    area: 28,
    rooms: 1,
    completionPercent: 100,
    thumbnail: 'https://immosmart.de/wp-content/uploads/immomakler/attachments/5a057afaa77e6bfdab2832f456cd6c8a/bfb8bd98-6b2b-4a5c-af6e-3e2591e32851-900x600.avif',
    createdAt: '2024-01-03',
    agent: {
      name: 'Moritz Kalb',
      title: 'Immobilienmakler',
      email: 'moritz.kalb@immosmart.de',
      phone: '+49 89 4141888-00',
    },
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

// Document templates per property - key is propertyId
export const propertyDocuments: Record<string, Document[]> = {
  // Property 1 - Bahnhofsallee, Eching - Draft, nur wenige Dokumente
  '1': [
    { id: '1', name: 'Grundbuchauszug', type: 'Grundbuch', status: 'missing', holder: 'authority', holderName: 'Grundbuchamt Freising', holderEmail: 'grundbuchamt@freising.de' },
    { id: '2', name: 'Energieausweis', type: 'Energieausweis', status: 'missing', holder: 'seller', holderName: 'Hans Schmidt', holderEmail: 'hans.schmidt@email.de' },
    { id: '3', name: 'Teilungserklärung', type: 'Teilungserklärung', status: 'missing', holder: 'hausverwaltung', holderName: 'HV Eching GmbH', holderEmail: 'info@hv-eching.de' },
    { id: '4', name: 'Wohnflächenberechnung', type: 'Flächenberechnung', status: 'missing', holder: 'seller', holderName: 'Hans Schmidt', holderEmail: 'hans.schmidt@email.de' },
  ],
  // Property 2 - Glockenbachviertel - Capture Processing, einige Dokumente angefordert
  '2': [
    { id: '1', name: 'Grundbuchauszug', type: 'Grundbuch', status: 'verified', uploadedAt: '2024-01-10', holder: 'authority', holderName: 'Grundbuchamt München', holderEmail: 'grundbuchamt@muenchen.de' },
    { id: '2', name: 'Energieausweis', type: 'Energieausweis', status: 'requested', holder: 'seller', holderName: 'Maria Weber', holderEmail: 'maria.weber@email.de' },
    { id: '3', name: 'Baulastenverzeichnis', type: 'Baulastenverzeichnis', status: 'missing', holder: 'authority', holderName: 'Bauamt München', holderEmail: 'bauamt@muenchen.de' },
    { id: '4', name: 'Mieterliste', type: 'Mieterliste', status: 'verified', uploadedAt: '2024-01-08', holder: 'seller', holderName: 'Maria Weber', holderEmail: 'maria.weber@email.de' },
    { id: '5', name: 'Gewerbemietverträge', type: 'Gewerbemietvertrag', status: 'missing', holder: 'seller', holderName: 'Maria Weber', holderEmail: 'maria.weber@email.de' },
    { id: '6', name: 'Brandschutznachweis', type: 'Brandschutz', status: 'missing', holder: 'authority', holderName: 'Branddirektion München', holderEmail: 'branddirektion@muenchen.de' },
  ],
  // Property 3 - Am Schlosspark - Docs Missing, mehrere fehlen
  '3': [
    { id: '1', name: 'Grundbuchauszug', type: 'Grundbuch', status: 'verified', uploadedAt: '2024-01-10', holder: 'authority', holderName: 'Grundbuchamt Freising', holderEmail: 'grundbuchamt@freising.de' },
    { id: '2', name: 'Energieausweis', type: 'Energieausweis', status: 'missing', holder: 'seller', holderName: 'Thomas Müller', holderEmail: 'thomas.mueller@email.de' },
    { id: '3', name: 'Teilungserklärung', type: 'Teilungserklärung', status: 'requested', holder: 'hausverwaltung', holderName: 'HV Hohenkammer', holderEmail: 'info@hv-hohenkammer.de' },
    { id: '4', name: 'Wirtschaftsplan 2024', type: 'Wirtschaftsplan', status: 'verified', uploadedAt: '2024-01-12', holder: 'hausverwaltung', holderName: 'HV Hohenkammer', holderEmail: 'info@hv-hohenkammer.de' },
    { id: '5', name: 'Protokolle Eigentümerversammlung', type: 'Protokolle', status: 'missing', holder: 'hausverwaltung', holderName: 'HV Hohenkammer', holderEmail: 'info@hv-hohenkammer.de' },
    { id: '6', name: 'Hausgeldabrechnung', type: 'Hausgeldabrechnung', status: 'verified', uploadedAt: '2024-01-08', holder: 'seller', holderName: 'Thomas Müller', holderEmail: 'thomas.mueller@email.de' },
  ],
  // Property 4 - Pelkovenstraße - Ready to Publish, mit Review-Beispiel
  '4': [
    { id: '1', name: 'Grundbuchauszug', type: 'Grundbuch', status: 'verified', uploadedAt: '2024-01-05', holder: 'authority', holderName: 'Grundbuchamt München', holderEmail: 'grundbuchamt@muenchen.de' },
    { id: '2', name: 'Energieausweis', type: 'Energieausweis', status: 'review', uploadedAt: '2024-01-06', holder: 'seller', holderName: 'Anna Fischer', holderEmail: 'anna.fischer@email.de', aiAnalysis: { analyzedAt: '2024-01-06 10:15', issues: [{ type: 'outdated', description: 'Der Energieausweis ist vom 15.03.2014 und damit älter als 10 Jahre. Ab Mai 2024 ist er nicht mehr gültig.', severity: 'high', suggestedAction: 'Neuen Energieausweis beim Energieberater beantragen.' }, { type: 'incomplete', description: 'Modernisierungsempfehlungen fehlen (Anlage zum Energieausweis).', severity: 'low', suggestedAction: 'Anlage mit Modernisierungsempfehlungen nachreichen.' }], confidence: 0.94 } },
    { id: '3', name: 'Teilungserklärung', type: 'Teilungserklärung', status: 'verified', uploadedAt: '2024-01-04', holder: 'hausverwaltung', holderName: 'HV Moosach GmbH', holderEmail: 'info@hv-moosach.de' },
    { id: '4', name: 'Wirtschaftsplan 2024', type: 'Wirtschaftsplan', status: 'review', uploadedAt: '2024-01-07', holder: 'hausverwaltung', holderName: 'HV Moosach GmbH', holderEmail: 'info@hv-moosach.de', aiAnalysis: { analyzedAt: '2024-01-07 16:45', issues: [{ type: 'wrong_property', description: 'Der Wirtschaftsplan bezieht sich auf "Pelkovenstraße 43" statt "Pelkovenstraße 45". Möglicherweise falsches Dokument.', severity: 'high', suggestedAction: 'Korrekten Wirtschaftsplan für Pelkovenstraße 45 anfordern.' }], confidence: 0.91 } },
    { id: '5', name: 'Protokolle Eigentümerversammlung', type: 'Protokolle', status: 'verified', uploadedAt: '2024-01-03', holder: 'hausverwaltung', holderName: 'HV Moosach GmbH', holderEmail: 'info@hv-moosach.de' },
    { id: '6', name: 'Hausgeldabrechnung', type: 'Hausgeldabrechnung', status: 'verified', uploadedAt: '2024-01-08', holder: 'seller', holderName: 'Anna Fischer', holderEmail: 'anna.fischer@email.de' },
    { id: '7', name: 'Wohnflächenberechnung', type: 'Flächenberechnung', status: 'verified', uploadedAt: '2024-01-02', holder: 'seller', holderName: 'Anna Fischer', holderEmail: 'anna.fischer@email.de' },
    { id: '8', name: 'Flurkarte', type: 'Flurkarte', status: 'verified', uploadedAt: '2024-01-01', holder: 'authority', holderName: 'Katasteramt München', holderEmail: 'katasteramt@muenchen.de' },
  ],
  // Property 5 - Bodenseestraße - Inquiries Active, alles vorhanden
  '5': [
    { id: '1', name: 'Grundbuchauszug', type: 'Grundbuch', status: 'verified', uploadedAt: '2024-01-02', holder: 'authority', holderName: 'Grundbuchamt München', holderEmail: 'grundbuchamt@muenchen.de' },
    { id: '2', name: 'Energieausweis', type: 'Energieausweis', status: 'verified', uploadedAt: '2024-01-02', holder: 'seller', holderName: 'Frank Meier', holderEmail: 'frank.meier@email.de' },
    { id: '3', name: 'Teilungserklärung', type: 'Teilungserklärung', status: 'verified', uploadedAt: '2024-01-01', holder: 'hausverwaltung', holderName: 'HV Pasing', holderEmail: 'info@hv-pasing.de' },
    { id: '4', name: 'Hausgeldabrechnung', type: 'Hausgeldabrechnung', status: 'verified', uploadedAt: '2024-01-01', holder: 'seller', holderName: 'Frank Meier', holderEmail: 'frank.meier@email.de' },
    { id: '5', name: 'Wohnflächenberechnung', type: 'Flächenberechnung', status: 'verified', uploadedAt: '2024-01-02', holder: 'seller', holderName: 'Frank Meier', holderEmail: 'frank.meier@email.de' },
  ],
  // Property 6 - Gutshof Amerang - Under Offer, alles komplett
  '6': [
    { id: '1', name: 'Grundbuchauszug', type: 'Grundbuch', status: 'verified', uploadedAt: '2023-12-15', holder: 'authority', holderName: 'Grundbuchamt Rosenheim', holderEmail: 'grundbuchamt@rosenheim.de' },
    { id: '2', name: 'Energieausweis', type: 'Energieausweis', status: 'verified', uploadedAt: '2023-12-16', holder: 'seller', holderName: 'Klaus Becker', holderEmail: 'klaus.becker@email.de' },
    { id: '3', name: 'Baulastenverzeichnis', type: 'Baulastenverzeichnis', status: 'verified', uploadedAt: '2023-12-14', holder: 'authority', holderName: 'Bauamt Amerang', holderEmail: 'bauamt@amerang.de' },
    { id: '4', name: 'Flurkarte', type: 'Flurkarte', status: 'verified', uploadedAt: '2023-12-13', holder: 'authority', holderName: 'Katasteramt Rosenheim', holderEmail: 'katasteramt@rosenheim.de' },
    { id: '5', name: 'Mieterliste', type: 'Mieterliste', status: 'verified', uploadedAt: '2023-12-17', holder: 'seller', holderName: 'Klaus Becker', holderEmail: 'klaus.becker@email.de' },
    { id: '6', name: 'Mietverträge', type: 'Mietvertrag', status: 'verified', uploadedAt: '2023-12-18', holder: 'seller', holderName: 'Klaus Becker', holderEmail: 'klaus.becker@email.de' },
  ],
  // Property 7 - Englschalkinger Straße - Ready to Publish, fast alles da
  '7': [
    { id: '1', name: 'Grundbuchauszug', type: 'Grundbuch', status: 'verified', uploadedAt: '2024-01-08', holder: 'authority', holderName: 'Grundbuchamt München', holderEmail: 'grundbuchamt@muenchen.de' },
    { id: '2', name: 'Energieausweis', type: 'Energieausweis', status: 'verified', uploadedAt: '2024-01-09', holder: 'seller', holderName: 'Lisa Hoffmann', holderEmail: 'lisa.hoffmann@email.de' },
    { id: '3', name: 'Teilungserklärung', type: 'Teilungserklärung', status: 'verified', uploadedAt: '2024-01-07', holder: 'hausverwaltung', holderName: 'HV Bogenhausen', holderEmail: 'info@hv-bogenhausen.de' },
    { id: '4', name: 'Hausgeldabrechnung', type: 'Hausgeldabrechnung', status: 'verified', uploadedAt: '2024-01-10', holder: 'seller', holderName: 'Lisa Hoffmann', holderEmail: 'lisa.hoffmann@email.de' },
    { id: '5', name: 'Wohnflächenberechnung', type: 'Flächenberechnung', status: 'review', uploadedAt: '2024-01-11', holder: 'seller', holderName: 'Lisa Hoffmann', holderEmail: 'lisa.hoffmann@email.de', aiAnalysis: { analyzedAt: '2024-01-11 14:32', issues: [{ type: 'incomplete', description: 'Die Balkonfläche fehlt in der Berechnung. Das Dokument zeigt 54m² Wohnfläche, aber der Grundriss zeigt einen Balkon von ca. 8m², der anteilig berücksichtigt werden sollte.', severity: 'medium', suggestedAction: 'Bitte um aktualisierte Wohnflächenberechnung inklusive Balkonfläche (anteilig 25-50%).' }], confidence: 0.87 } },
  ],
  // Property 8 - Berg-am-Laim-Straße - Inquiries Active, komplett
  '8': [
    { id: '1', name: 'Grundbuchauszug', type: 'Grundbuch', status: 'verified', uploadedAt: '2024-01-01', holder: 'authority', holderName: 'Grundbuchamt München', holderEmail: 'grundbuchamt@muenchen.de' },
    { id: '2', name: 'Energieausweis', type: 'Energieausweis', status: 'verified', uploadedAt: '2024-01-02', holder: 'seller', holderName: 'Michael Braun', holderEmail: 'michael.braun@email.de' },
    { id: '3', name: 'Teilungserklärung', type: 'Teilungserklärung', status: 'verified', uploadedAt: '2024-01-01', holder: 'hausverwaltung', holderName: 'HV Berg am Laim', holderEmail: 'info@hv-bal.de' },
    { id: '4', name: 'Hausgeldabrechnung', type: 'Hausgeldabrechnung', status: 'verified', uploadedAt: '2024-01-03', holder: 'seller', holderName: 'Michael Braun', holderEmail: 'michael.braun@email.de' },
  ],
};

// Legacy export for backwards compatibility
export const documents: Document[] = propertyDocuments['3'] || [];

export const agentRuns: AgentRun[] = [
  { id: '1', agentName: 'Listing Factory Agent', timestamp: '2024-01-14 14:32', status: 'completed', outputs: ['Inseratstitel generiert', '3 Beschreibungsvarianten erstellt', '12 strukturierte Felder extrahiert'] },
  { id: '2', agentName: 'Document Pack Agent', timestamp: '2024-01-14 10:15', status: 'completed', outputs: ['4 Dokumente klassifiziert', '3 fehlende Dokumente identifiziert', 'Anfragenachricht generiert'] },
  { id: '3', agentName: 'Lead Qualification Agent', timestamp: '2024-01-13 16:45', status: 'completed', outputs: ['5 Leads bewertet', '2 mit hoher Priorität markiert'] },
];

export const auditEntries: AuditEntry[] = [
  { id: '1', action: 'Capture hochgeladen', actor: 'Maria Weber', actorType: 'user', timestamp: '2024-01-14 15:30', details: 'scan_v2.zip (2,4 GB)' },
  { id: '2', action: 'Agent-Lauf abgeschlossen', actor: 'Listing Factory Agent', actorType: 'agent', timestamp: '2024-01-14 14:32', details: '3 Inseratsvarianten generiert' },
  { id: '3', action: 'Dokument umbenannt', actor: 'System', actorType: 'agent', timestamp: '2024-01-14 12:15', details: 'grundbuch_scan.pdf → Grundbuchauszug_Maximilianstr42.pdf' },
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

// Transaction Coordination Types
export type MilestoneStatus = 'not_started' | 'in_progress' | 'done' | 'blocked';
export type StakeholderRole = 'seller' | 'buyer' | 'agent' | 'notary' | 'bank' | 'coordinator';
export type RiskLevel = 'low' | 'medium' | 'high';
export type TransactionDocStatus = 'missing' | 'uploaded' | 'verified';

export interface TransactionMilestone {
  id: string;
  name: string;
  status: MilestoneStatus;
  owner: StakeholderRole;
  dueDate: string;
  evidence?: { type: 'file' | 'email' | 'note'; name: string };
  completedAt?: string;
}

export interface TransactionTask {
  id: string;
  title: string;
  owner: StakeholderRole;
  dueDate: string;
  completed: boolean;
  category: 'buyer' | 'seller' | 'agent' | 'notary_bank';
  dependency?: string;
}

export interface TransactionDocument {
  id: string;
  name: string;
  status: TransactionDocStatus;
  evidenceSource?: 'upload' | 'email' | 'manual';
  uploadedAt?: string;
}

export interface TransactionStakeholder {
  id: string;
  name: string;
  role: StakeholderRole;
  email: string;
  phone?: string;
  waitingOn?: string;
}

export interface TransactionLogEntry {
  id: string;
  type: 'milestone' | 'task' | 'document' | 'note';
  action: string;
  actor: string;
  timestamp: string;
  details?: string;
}

export interface Transaction {
  id: string;
  propertyId: string;
  propertyAddress: string;
  sellerName: string;
  buyerName: string;
  currentMilestone: string;
  nextMilestoneDate: string;
  risk: RiskLevel;
  riskReason?: string;
  topBlocker?: string;
  owner: string;
  milestones: TransactionMilestone[];
  tasks: TransactionTask[];
  documents: TransactionDocument[];
  stakeholders: TransactionStakeholder[];
  activityLog: TransactionLogEntry[];
}

// Transaction sample data
export const transactions: Transaction[] = [
  {
    id: 'tx1',
    propertyId: '6',
    propertyAddress: 'Gutshof Amerang, 83123 Amerang',
    sellerName: 'Klaus Becker',
    buyerName: 'Stefan & Anna Weber',
    currentMilestone: 'Notary Scheduled',
    nextMilestoneDate: '25.01.2026',
    risk: 'medium',
    riskReason: 'Missing documents',
    topBlocker: 'Vertragsentwurf ausstehend',
    owner: 'Doreen Hesse',
    milestones: [
      { id: 'm1', name: 'Angebot angenommen', status: 'done', owner: 'agent', dueDate: '10.01.2026', completedAt: '10.01.2026', evidence: { type: 'email', name: 'Angebotsbestätigung.eml' } },
      { id: 'm2', name: 'Finanzierung bestätigt', status: 'done', owner: 'bank', dueDate: '15.01.2026', completedAt: '14.01.2026', evidence: { type: 'file', name: 'Finanzierungszusage.pdf' } },
      { id: 'm3', name: 'Due Diligence abgeschlossen', status: 'done', owner: 'buyer', dueDate: '18.01.2026', completedAt: '17.01.2026', evidence: { type: 'note', name: 'Prüfung abgeschlossen' } },
      { id: 'm4', name: 'Notartermin vereinbart', status: 'in_progress', owner: 'notary', dueDate: '22.01.2026' },
      { id: 'm5', name: 'Vertragsentwurf geprüft', status: 'blocked', owner: 'agent', dueDate: '25.01.2026' },
      { id: 'm6', name: 'Unterzeichnung', status: 'not_started', owner: 'notary', dueDate: '28.01.2026' },
      { id: 'm7', name: 'Zahlung bestätigt', status: 'not_started', owner: 'bank', dueDate: '05.02.2026' },
      { id: 'm8', name: 'Übergabe', status: 'not_started', owner: 'agent', dueDate: '15.02.2026' },
      { id: 'm9', name: 'Abgeschlossen', status: 'not_started', owner: 'agent', dueDate: '15.02.2026' },
    ],
    tasks: [
      { id: 't1', title: 'Finanzierungsnachweis prüfen', owner: 'agent', dueDate: '20.01.2026', completed: true, category: 'agent' },
      { id: 't2', title: 'Vertragsentwurf beim Notar anfordern', owner: 'agent', dueDate: '21.01.2026', completed: false, category: 'notary_bank' },
      { id: 't3', title: 'Übergabeprotokoll vorbereiten', owner: 'agent', dueDate: '10.02.2026', completed: false, category: 'agent' },
      { id: 't4', title: 'Personalausweis-Kopie senden', owner: 'buyer', dueDate: '22.01.2026', completed: false, category: 'buyer' },
      { id: 't5', title: 'Grundschuldbestellung vorbereiten', owner: 'bank', dueDate: '23.01.2026', completed: false, category: 'notary_bank', dependency: 'Finanzierungsbestätigung' },
      { id: 't6', title: 'Löschungsbewilligung besorgen', owner: 'seller', dueDate: '24.01.2026', completed: false, category: 'seller' },
    ],
    documents: [
      { id: 'd1', name: 'Energieausweis', status: 'verified', evidenceSource: 'upload', uploadedAt: '12.01.2026' },
      { id: 'd2', name: 'Grundriss', status: 'verified', evidenceSource: 'upload', uploadedAt: '12.01.2026' },
      { id: 'd3', name: 'Finanzierungsbestätigung', status: 'verified', evidenceSource: 'email', uploadedAt: '14.01.2026' },
      { id: 'd4', name: 'Personalausweis (Käufer)', status: 'missing' },
      { id: 'd5', name: 'WEG-Unterlagen', status: 'uploaded', evidenceSource: 'upload', uploadedAt: '16.01.2026' },
      { id: 'd6', name: 'Vertragsentwurf', status: 'missing' },
      { id: 'd7', name: 'Unterschriebener Kaufvertrag', status: 'missing' },
      { id: 'd8', name: 'Übergabeprotokoll', status: 'missing' },
    ],
    stakeholders: [
      { id: 's1', name: 'Dr. Thomas Müller', role: 'seller', email: 'thomas.mueller@email.de', phone: '+49 89 123456', waitingOn: 'Löschungsbewilligung' },
      { id: 's2', name: 'Stefan Weber', role: 'buyer', email: 'stefan.weber@email.de', phone: '+49 89 234567', waitingOn: 'Personalausweis-Kopie' },
      { id: 's3', name: 'Notar Dr. Huber', role: 'notary', email: 'huber@notar-muenchen.de', phone: '+49 89 345678', waitingOn: 'Vertragsentwurf' },
      { id: 's4', name: 'Sparkasse München', role: 'bank', email: 'finanzierung@spk-muc.de', phone: '+49 89 456789' },
      { id: 's5', name: 'Florian Hubrich', role: 'agent', email: 'florian.hubrich@immosmart.de', phone: '+49 89 4141888-86' },
    ],
    activityLog: [
      { id: 'a1', type: 'milestone', action: 'Due Diligence abgeschlossen', actor: 'Stefan Weber', timestamp: '17.01.2026 14:30', details: 'Alle Unterlagen geprüft' },
      { id: 'a2', type: 'document', action: 'WEG-Unterlagen hochgeladen', actor: 'Dr. Thomas Müller', timestamp: '16.01.2026 10:15' },
      { id: 'a3', type: 'milestone', action: 'Finanzierung bestätigt', actor: 'Sparkasse München', timestamp: '14.01.2026 16:00', details: 'Zusage per E-Mail' },
      { id: 'a4', type: 'task', action: 'Finanzierungsnachweis geprüft', actor: 'Florian Hubrich', timestamp: '14.01.2026 17:30' },
      { id: 'a5', type: 'note', action: 'Notiz hinzugefügt', actor: 'Florian Hubrich', timestamp: '13.01.2026 09:00', details: 'Käufer wünscht Übergabe am 15.02.' },
    ],
  },
  {
    id: 'tx2',
    propertyId: '5',
    propertyAddress: 'Bodenseestraße 128, München Pasing',
    sellerName: 'Frank Meier',
    buyerName: 'Julia Schneider',
    currentMilestone: 'Financing Confirmed',
    nextMilestoneDate: '28.01.2026',
    risk: 'low',
    owner: 'Florian Hubrich',
    milestones: [
      { id: 'm1', name: 'Angebot angenommen', status: 'done', owner: 'agent', dueDate: '12.01.2026', completedAt: '12.01.2026', evidence: { type: 'email', name: 'Zusage.eml' } },
      { id: 'm2', name: 'Finanzierung bestätigt', status: 'done', owner: 'bank', dueDate: '18.01.2026', completedAt: '17.01.2026', evidence: { type: 'file', name: 'Zusage_HypoVereinsbank.pdf' } },
      { id: 'm3', name: 'Due Diligence abgeschlossen', status: 'in_progress', owner: 'buyer', dueDate: '22.01.2026' },
      { id: 'm4', name: 'Notartermin vereinbart', status: 'not_started', owner: 'notary', dueDate: '25.01.2026' },
      { id: 'm5', name: 'Vertragsentwurf geprüft', status: 'not_started', owner: 'agent', dueDate: '28.01.2026' },
      { id: 'm6', name: 'Unterzeichnung', status: 'not_started', owner: 'notary', dueDate: '02.02.2026' },
      { id: 'm7', name: 'Zahlung bestätigt', status: 'not_started', owner: 'bank', dueDate: '10.02.2026' },
      { id: 'm8', name: 'Übergabe', status: 'not_started', owner: 'agent', dueDate: '01.03.2026' },
      { id: 'm9', name: 'Abgeschlossen', status: 'not_started', owner: 'agent', dueDate: '01.03.2026' },
    ],
    tasks: [
      { id: 't1', title: 'Objektbesichtigung dokumentieren', owner: 'agent', dueDate: '20.01.2026', completed: true, category: 'agent' },
      { id: 't2', title: 'Mängelliste erstellen', owner: 'buyer', dueDate: '22.01.2026', completed: false, category: 'buyer' },
      { id: 't3', title: 'Notartermin koordinieren', owner: 'agent', dueDate: '23.01.2026', completed: false, category: 'notary_bank' },
    ],
    documents: [
      { id: 'd1', name: 'Energieausweis', status: 'verified', evidenceSource: 'upload', uploadedAt: '13.01.2026' },
      { id: 'd2', name: 'Grundriss', status: 'verified', evidenceSource: 'upload', uploadedAt: '13.01.2026' },
      { id: 'd3', name: 'Finanzierungsbestätigung', status: 'verified', evidenceSource: 'email', uploadedAt: '17.01.2026' },
      { id: 'd4', name: 'Personalausweis (Käufer)', status: 'uploaded', evidenceSource: 'upload', uploadedAt: '18.01.2026' },
      { id: 'd5', name: 'WEG-Unterlagen', status: 'verified', evidenceSource: 'upload', uploadedAt: '14.01.2026' },
      { id: 'd6', name: 'Vertragsentwurf', status: 'missing' },
      { id: 'd7', name: 'Unterschriebener Kaufvertrag', status: 'missing' },
      { id: 'd8', name: 'Übergabeprotokoll', status: 'missing' },
    ],
    stakeholders: [
      { id: 's1', name: 'Frank Meier', role: 'seller', email: 'frank.meier@email.de', phone: '+49 89 567890' },
      { id: 's2', name: 'Julia Schneider', role: 'buyer', email: 'julia.schneider@email.de', phone: '+49 89 678901', waitingOn: 'Mängelliste' },
      { id: 's3', name: 'Notar Schmidt', role: 'notary', email: 'schmidt@notar-muc.de', phone: '+49 89 789012' },
      { id: 's4', name: 'HypoVereinsbank', role: 'bank', email: 'baufi@hvb.de' },
      { id: 's5', name: 'Doreen Hesse', role: 'agent', email: 'doreen.hesse@immosmart.de', phone: '+49 89 4141888-00' },
    ],
    activityLog: [
      { id: 'a1', type: 'milestone', action: 'Finanzierung bestätigt', actor: 'HypoVereinsbank', timestamp: '17.01.2026 11:00' },
      { id: 'a2', type: 'document', action: 'Personalausweis hochgeladen', actor: 'Julia Schneider', timestamp: '18.01.2026 09:30' },
      { id: 'a3', type: 'task', action: 'Objektbesichtigung dokumentiert', actor: 'Doreen Hesse', timestamp: '20.01.2026 15:00' },
    ],
  },
  {
    id: 'tx3',
    propertyId: '8',
    propertyAddress: 'Berg-am-Laim-Straße 42, München',
    sellerName: 'Michael Braun',
    buyerName: 'Investmentgruppe Süd GmbH',
    currentMilestone: 'Offer Accepted',
    nextMilestoneDate: '30.01.2026',
    risk: 'high',
    riskReason: 'Financing delay',
    topBlocker: 'Finanzierungsnachweis fehlt',
    owner: 'Moritz Kalb',
    milestones: [
      { id: 'm1', name: 'Angebot angenommen', status: 'done', owner: 'agent', dueDate: '15.01.2026', completedAt: '15.01.2026', evidence: { type: 'email', name: 'LOI_signed.pdf' } },
      { id: 'm2', name: 'Finanzierung bestätigt', status: 'blocked', owner: 'bank', dueDate: '22.01.2026' },
      { id: 'm3', name: 'Due Diligence abgeschlossen', status: 'not_started', owner: 'buyer', dueDate: '28.01.2026' },
      { id: 'm4', name: 'Notartermin vereinbart', status: 'not_started', owner: 'notary', dueDate: '05.02.2026' },
      { id: 'm5', name: 'Vertragsentwurf geprüft', status: 'not_started', owner: 'agent', dueDate: '10.02.2026' },
      { id: 'm6', name: 'Unterzeichnung', status: 'not_started', owner: 'notary', dueDate: '15.02.2026' },
      { id: 'm7', name: 'Zahlung bestätigt', status: 'not_started', owner: 'bank', dueDate: '01.03.2026' },
      { id: 'm8', name: 'Übergabe', status: 'not_started', owner: 'agent', dueDate: '15.03.2026' },
      { id: 'm9', name: 'Abgeschlossen', status: 'not_started', owner: 'agent', dueDate: '15.03.2026' },
    ],
    tasks: [
      { id: 't1', title: 'Finanzierungsnachweis nachfassen', owner: 'agent', dueDate: '19.01.2026', completed: false, category: 'agent' },
      { id: 't2', title: 'Alternative Finanzierung prüfen', owner: 'buyer', dueDate: '25.01.2026', completed: false, category: 'buyer', dependency: 'Finanzierungsnachweis' },
      { id: 't3', title: 'Verkäufer über Verzögerung informieren', owner: 'agent', dueDate: '20.01.2026', completed: true, category: 'seller' },
    ],
    documents: [
      { id: 'd1', name: 'Energieausweis', status: 'verified', evidenceSource: 'upload', uploadedAt: '10.01.2026' },
      { id: 'd2', name: 'Grundriss', status: 'verified', evidenceSource: 'upload', uploadedAt: '10.01.2026' },
      { id: 'd3', name: 'Finanzierungsbestätigung', status: 'missing' },
      { id: 'd4', name: 'Handelsregisterauszug (Käufer)', status: 'uploaded', evidenceSource: 'upload', uploadedAt: '16.01.2026' },
      { id: 'd5', name: 'Vollmacht Geschäftsführer', status: 'missing' },
      { id: 'd6', name: 'Vertragsentwurf', status: 'missing' },
      { id: 'd7', name: 'Unterschriebener Kaufvertrag', status: 'missing' },
      { id: 'd8', name: 'Übergabeprotokoll', status: 'missing' },
    ],
    stakeholders: [
      { id: 's1', name: 'Klaus Becker', role: 'seller', email: 'klaus.becker@email.de', phone: '+49 89 890123', waitingOn: 'Status-Update' },
      { id: 's2', name: 'Max Huber (Investmentgruppe)', role: 'buyer', email: 'huber@invest-sued.de', phone: '+49 89 901234', waitingOn: 'Finanzierungsnachweis' },
      { id: 's3', name: 'Notar Dr. Klein', role: 'notary', email: 'klein@notar-leo.de', phone: '+49 89 012345' },
      { id: 's4', name: 'Deutsche Bank', role: 'bank', email: 'gewerbe@db.de', waitingOn: 'Kreditentscheidung' },
      { id: 's5', name: 'Lars Roth', role: 'agent', email: 'lars.roth@immosmart.de', phone: '+49 89 4141888-00' },
    ],
    activityLog: [
      { id: 'a1', type: 'milestone', action: 'Angebot angenommen', actor: 'Klaus Becker', timestamp: '15.01.2026 10:00', details: 'LOI unterschrieben' },
      { id: 'a2', type: 'note', action: 'Risiko auf Hoch gesetzt', actor: 'Lars Roth', timestamp: '18.01.2026 14:00', details: 'Finanzierungsverzögerung gemeldet' },
      { id: 'a3', type: 'task', action: 'Verkäufer informiert', actor: 'Lars Roth', timestamp: '20.01.2026 09:00', details: 'Telefonat mit Herrn Becker' },
    ],
  },
];

export const getStakeholderLabel = (role: StakeholderRole): string => {
  const labels: Record<StakeholderRole, string> = {
    seller: 'Verkäufer',
    buyer: 'Käufer',
    agent: 'Makler',
    notary: 'Notar',
    bank: 'Bank',
    coordinator: 'Koordinator',
  };
  return labels[role];
};

export const getMilestoneStatusLabel = (status: MilestoneStatus): string => {
  const labels: Record<MilestoneStatus, string> = {
    not_started: 'Nicht gestartet',
    in_progress: 'In Bearbeitung',
    done: 'Erledigt',
    blocked: 'Blockiert',
  };
  return labels[status];
};

export const getRiskLabel = (risk: RiskLevel): string => {
  const labels: Record<RiskLevel, string> = {
    low: 'Niedrig',
    medium: 'Mittel',
    high: 'Hoch',
  };
  return labels[risk];
};
