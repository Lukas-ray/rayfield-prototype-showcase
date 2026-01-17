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
    propertyType: 'Apartment',
    workflowState: 'draft',
    lastActivity: '2 hours ago',
    nextAction: 'Upload capture scan',
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
    lastActivity: '30 minutes ago',
    nextAction: 'Await capture completion',
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
    lastActivity: '1 day ago',
    nextAction: 'Request Energieausweis',
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
    propertyType: 'Apartment',
    workflowState: 'ready_to_publish',
    lastActivity: '4 hours ago',
    nextAction: 'Review & publish listing',
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
    lastActivity: '15 minutes ago',
    nextAction: 'Respond to 3 inquiries',
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
    lastActivity: '2 days ago',
    nextAction: 'Finalize offer documents',
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
    draft: 'Draft',
    capture_processing: 'Capture Processing',
    docs_missing: 'Documents Missing',
    ready_to_publish: 'Ready to Publish',
    inquiries_active: 'Inquiries Active',
    under_offer: 'Under Offer',
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
  { id: '1', type: 'photo', name: 'Living Room - Hero', url: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800', variant: 'hero', status: 'ready' },
  { id: '2', type: 'photo', name: 'Kitchen', url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800', variant: 'portal', status: 'ready' },
  { id: '3', type: 'photo', name: 'Master Bedroom', url: 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?w=800', variant: 'hero', status: 'ready' },
  { id: '4', type: 'floor_plan', name: 'Floor Plan v2', url: '/placeholder.svg', variant: 'portal', status: 'ready' },
  { id: '5', type: '3d_tour', name: '3D Virtual Tour', url: '/placeholder.svg', variant: 'hero', status: 'ready' },
  { id: '6', type: 'video', name: 'Property Walkthrough', url: '/placeholder.svg', variant: 'social', status: 'processing' },
];

export const documents: Document[] = [
  { id: '1', name: 'Grundbuchauszug', type: 'Land Registry', status: 'verified', uploadedAt: '2024-01-10', source: 'agent' },
  { id: '2', name: 'Energieausweis', type: 'Energy Certificate', status: 'missing' },
  { id: '3', name: 'Teilungserklärung', type: 'Declaration of Division', status: 'requested', source: 'hausverwaltung' },
  { id: '4', name: 'Wirtschaftsplan 2024', type: 'Economic Plan', status: 'received', uploadedAt: '2024-01-12', source: 'hausverwaltung' },
  { id: '5', name: 'Protokolle Eigentümerversammlung', type: 'Meeting Minutes', status: 'missing' },
  { id: '6', name: 'Hausgeldabrechnung', type: 'Service Charge Statement', status: 'verified', uploadedAt: '2024-01-08', source: 'seller' },
  { id: '7', name: 'Wohnflächenberechnung', type: 'Floor Area Calculation', status: 'received', uploadedAt: '2024-01-11', source: 'seller' },
  { id: '8', name: 'Mietvertrag', type: 'Rental Agreement', status: 'missing' },
];

export const agentRuns: AgentRun[] = [
  { id: '1', agentName: 'Listing Factory Agent', timestamp: '2024-01-14 14:32', status: 'completed', outputs: ['Generated listing title', 'Created 3 description variants', 'Extracted 12 structured fields'] },
  { id: '2', agentName: 'Document Pack Agent', timestamp: '2024-01-14 10:15', status: 'completed', outputs: ['Classified 4 documents', 'Identified 3 missing items', 'Generated request message'] },
  { id: '3', agentName: 'Lead Qualification Agent', timestamp: '2024-01-13 16:45', status: 'completed', outputs: ['Scored 5 leads', 'Flagged 2 high-priority'] },
];

export const auditEntries: AuditEntry[] = [
  { id: '1', action: 'Capture uploaded', actor: 'Maria Weber', actorType: 'user', timestamp: '2024-01-14 15:30', details: 'scan_v2.zip (2.4 GB)' },
  { id: '2', action: 'Agent run completed', actor: 'Listing Factory Agent', actorType: 'agent', timestamp: '2024-01-14 14:32', details: 'Generated 3 listing variants' },
  { id: '3', action: 'Document renamed', actor: 'System', actorType: 'agent', timestamp: '2024-01-14 12:15', details: 'grundbuch_scan.pdf → Grundbuchauszug_Müllerstr42.pdf' },
  { id: '4', action: 'Export generated', actor: 'Anna Fischer', actorType: 'user', timestamp: '2024-01-14 11:00', details: 'ImmoScout24 package' },
  { id: '5', action: 'Workflow state changed', actor: 'Thomas Müller', actorType: 'user', timestamp: '2024-01-13 16:20', details: 'Capture Processing → Documents Missing' },
  { id: '6', action: 'Document uploaded', actor: 'Hausverwaltung', actorType: 'user', timestamp: '2024-01-13 14:00', details: 'Wirtschaftsplan_2024.pdf' },
];

export const tasks: Task[] = [
  { id: '1', title: 'Review generated listing copy', owner: 'Agent', dueDate: 'Today', status: 'pending' },
  { id: '2', title: 'Request Energieausweis from seller', owner: 'Coordinator', dueDate: 'Tomorrow', status: 'in_progress' },
  { id: '3', title: 'Verify floor plan measurements', owner: 'Agent', dueDate: 'Jan 18', status: 'pending' },
  { id: '4', title: 'Schedule professional photos', owner: 'Agent', dueDate: 'Jan 20', status: 'completed' },
];

export const leads: Lead[] = [
  {
    id: '1',
    name: 'Sophie Richter',
    email: 'sophie.r@email.com',
    channel: 'portal',
    status: 'qualified',
    budget: '€500,000 - €600,000',
    timeline: '2-3 months',
    financingProof: true,
    propertyId: '4',
    messages: [
      { role: 'user', content: 'Is there enough space for a king-size bed in the master bedroom?' },
      { role: 'assistant', content: 'Yes! The master bedroom measures 4.2m x 3.8m, which comfortably fits a king-size bed (typically 2m x 2m) with space for nightstands on both sides.', source: 'scan' },
    ],
  },
  {
    id: '2',
    name: 'Michael Braun',
    email: 'm.braun@company.de',
    channel: 'website',
    status: 'new',
    budget: '€600,000 - €800,000',
    timeline: 'Immediately',
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
    budget: '€400,000 - €500,000',
    timeline: '3-6 months',
    financingProof: true,
    propertyId: '4',
    messages: [
      { role: 'user', content: 'What documents are available for the WEG?' },
      { role: 'assistant', content: 'Currently available: Teilungserklärung (verified), Wirtschaftsplan 2024 (verified), and Hausgeldabrechnung. The Protokolle from recent meetings are still pending.', source: 'document' },
    ],
  },
];

export const checklistTemplates = [
  { id: '1', name: 'Standard Apartment', items: 8, active: true },
  { id: '2', name: 'WEG Property', items: 12, active: true },
  { id: '3', name: 'New Construction', items: 6, active: false },
  { id: '4', name: 'Investment Property', items: 10, active: true },
];

export const exportPresets = [
  { id: '1', name: 'ImmoScout24', fields: 45, active: true },
  { id: '2', name: 'Immowelt', fields: 38, active: true },
  { id: '3', name: 'Kleinanzeigen', fields: 22, active: true },
  { id: '4', name: 'Generic XML', fields: 50, active: false },
];

export const roles = [
  { id: '1', name: 'Admin', users: 2, permissions: ['all'] },
  { id: '2', name: 'Agent', users: 5, permissions: ['properties', 'leads', 'publishing'] },
  { id: '3', name: 'Coordinator', users: 3, permissions: ['documents', 'tasks'] },
  { id: '4', name: 'Viewer', users: 8, permissions: ['read-only'] },
];
