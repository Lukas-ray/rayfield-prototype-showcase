// Mailbox Integration Data Types and Dummy Data

export interface MailboxSettings {
  connected: boolean;
  provider: 'gmail' | 'microsoft365' | null;
  sendingIdentity: string;
  trackImmosmartOnly: boolean;
  followUpCadence: '3d' | '7d' | 't-2';
  autoSendMode: boolean;
}

export interface RequestPacket {
  id: string;
  holder: 'seller' | 'hausverwaltung' | 'notary' | 'authority';
  holderName: string;
  email: string;
  requestedItems: string[];
  status: 'not_started' | 'sent' | 'waiting' | 'complete' | 'blocked';
  sentAt?: string;
  nextFollowUp?: string;
  followUpsPaused: boolean;
}

export interface EmailThread {
  id: string;
  holder: string;
  holderType: 'seller' | 'hausverwaltung' | 'notary' | 'authority';
  subject: string;
  messages: EmailMessage[];
  status: 'active' | 'waiting' | 'complete' | 'blocked';
  lastActivity: string;
}

export interface EmailMessage {
  id: string;
  direction: 'outgoing' | 'incoming';
  from: string;
  to: string;
  subject: string;
  body: string;
  timestamp: string;
  attachments: EmailAttachment[];
  isFollowUp?: boolean;
  isDraft?: boolean;
}

export interface EmailAttachment {
  id: string;
  name: string;
  type: string;
  size: string;
  classified?: boolean;
  classifiedAs?: string;
  ingested?: boolean;
}

export interface MailException {
  id: string;
  type: 'vollmacht' | 'fee' | 'bounced' | 'reroute' | 'wrong_doc' | 'missing_pages';
  threadId: string;
  holder: string;
  description: string;
  timestamp: string;
  resolved: boolean;
  action?: string;
}

export const defaultMailboxSettings: MailboxSettings = {
  connected: false,
  provider: null,
  sendingIdentity: '',
  trackImmosmartOnly: true,
  followUpCadence: '3d',
  autoSendMode: false,
};

export const requestPackets: RequestPacket[] = [
  {
    id: '1',
    holder: 'seller',
    holderName: 'Hans Schmidt',
    email: 'hans.schmidt@email.de',
    requestedItems: ['Grundbuchauszug', 'Energieausweis', 'Wohnflächenberechnung', 'Mietvertrag'],
    status: 'not_started',
    followUpsPaused: false,
  },
  {
    id: '2',
    holder: 'hausverwaltung',
    holderName: 'Hausverwaltung Müller GmbH',
    email: 'info@hv-mueller.de',
    requestedItems: ['Teilungserklärung', 'Wirtschaftsplan 2024', 'Protokolle Eigentümerversammlung', 'Hausgeldabrechnung'],
    status: 'not_started',
    followUpsPaused: false,
  },
];

export const emailThreads: EmailThread[] = [];

export const initialExceptions: MailException[] = [];

export const holderConfig = {
  seller: { label: 'Verkäufer', color: 'text-blue-600', bg: 'bg-blue-100' },
  hausverwaltung: { label: 'Hausverwaltung', color: 'text-purple-600', bg: 'bg-purple-100' },
  notary: { label: 'Notar', color: 'text-amber-600', bg: 'bg-amber-100' },
  authority: { label: 'Behörde', color: 'text-slate-600', bg: 'bg-slate-100' },
};

export const statusConfig = {
  not_started: { label: 'Nicht gestartet', class: 'bg-muted text-muted-foreground' },
  sent: { label: 'Gesendet', class: 'bg-blue-100 text-blue-700' },
  waiting: { label: 'Warte auf Antwort', class: 'bg-amber-100 text-amber-700' },
  complete: { label: 'Vollständig', class: 'bg-green-100 text-green-700' },
  blocked: { label: 'Blockiert', class: 'bg-red-100 text-red-700' },
};

export const exceptionTypeConfig = {
  vollmacht: { label: 'Vollmacht benötigt', icon: '📝' },
  fee: { label: 'Gebühr erforderlich', icon: '💰' },
  bounced: { label: 'E-Mail unzustellbar', icon: '❌' },
  reroute: { label: 'Weiterleitung nötig', icon: '↗️' },
  wrong_doc: { label: 'Falsches Dokument', icon: '⚠️' },
  missing_pages: { label: 'Seiten fehlen', icon: '📄' },
};

// Reply simulation templates
export const replyTemplates = {
  docs_attached: {
    body: 'Sehr geehrte Damen und Herren,\n\nanbei erhalten Sie die angeforderten Unterlagen.\n\nMit freundlichen Grüßen',
    attachments: [
      { name: 'Grundbuchauszug_aktuell.pdf', type: 'Grundbuch', size: '2.4 MB' },
      { name: 'Energieausweis_2024.pdf', type: 'Energieausweis', size: '1.1 MB' },
    ],
  },
  redirect: {
    body: 'Sehr geehrte Damen und Herren,\n\nfür diese Unterlagen wenden Sie sich bitte an die Hausverwaltung.\n\nMit freundlichen Grüßen',
    attachments: [],
  },
  vollmacht_needed: {
    body: 'Sehr geehrte Damen und Herren,\n\nfür die Herausgabe der Unterlagen benötigen wir eine unterschriebene Vollmacht des Eigentümers.\n\nMit freundlichen Grüßen',
    attachments: [],
  },
  fee_required: {
    body: 'Sehr geehrte Damen und Herren,\n\nfür die Erstellung des Grundbuchauszugs fällt eine Gebühr von 20€ an. Bitte überweisen Sie den Betrag an folgende Bankverbindung.\n\nMit freundlichen Grüßen',
    attachments: [],
  },
};
