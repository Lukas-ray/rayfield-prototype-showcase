import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Sparkles, Search, FileText, Users, Building2, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { properties, propertyDocuments, leads as leadsData } from '@/data/dummyData';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  source?: string;
  cards?: ResultCard[];
}

interface ResultCard {
  type: 'property' | 'document' | 'lead';
  title: string;
  subtitle: string;
  link?: string;
  status?: string;
  icon: 'building' | 'file' | 'user';
}

const suggestedQueries = [
  { text: "Zeige alle Objekte von Thomas Müller", icon: Building2 },
  { text: "Welche Dokumente fehlen noch?", icon: FileText },
  { text: "Wer sind die heißesten Leads?", icon: Users },
  { text: "Status Pelkovenstraße", icon: Search },
];

// Simulated AI responses based on query
const getAIResponse = (query: string): Message => {
  const lowerQuery = query.toLowerCase();
  
  // Property searches
  if (lowerQuery.includes('müller') || lowerQuery.includes('thomas')) {
    const prop = properties.find(p => p.clientName?.includes('Müller'));
    if (prop) {
      return {
        role: 'assistant',
        content: `Ich habe 1 Objekt von Thomas Müller gefunden:`,
        source: 'Objektdatenbank',
        cards: [{
          type: 'property',
          title: prop.address,
          subtitle: `${prop.propertyType} • ${prop.area}m² • ${(prop.price / 1000).toFixed(0)}T€`,
          status: prop.workflowState === 'docs_missing' ? 'Dokumente fehlen' : prop.workflowState,
          link: `/property/${prop.id}`,
          icon: 'building',
        }],
      };
    }
  }
  
  // Document searches
  if (lowerQuery.includes('dokument') && (lowerQuery.includes('fehl') || lowerQuery.includes('missing'))) {
    const missingDocs: ResultCard[] = [];
    Object.entries(propertyDocuments).forEach(([propId, docs]) => {
      const prop = properties.find(p => p.id === propId);
      docs.filter(d => d.status === 'missing').forEach(doc => {
        if (missingDocs.length < 5) {
          missingDocs.push({
            type: 'document',
            title: doc.name,
            subtitle: prop ? `${prop.address} • ${doc.holder}` : doc.holder,
            status: 'Fehlt',
            link: `/property/${propId}?tab=documents`,
            icon: 'file',
          });
        }
      });
    });
    
    return {
      role: 'assistant',
      content: `Es fehlen noch ${missingDocs.length} Dokumente über alle Objekte:`,
      source: 'Dokumenten-Hub',
      cards: missingDocs,
    };
  }
  
  // Lead searches
  if (lowerQuery.includes('lead') || lowerQuery.includes('heiß') || lowerQuery.includes('interessent')) {
    const hotLeads = leadsData.filter(l => l.financingProof || l.status === 'viewing_scheduled');
    return {
      role: 'assistant',
      content: `${hotLeads.length} qualifizierte Leads mit hohem Potenzial:`,
      source: 'Lead-Datenbank',
      cards: hotLeads.slice(0, 4).map(lead => ({
        type: 'lead' as const,
        title: lead.name,
        subtitle: `${lead.channel} • Budget: ${lead.budget}`,
        status: lead.financingProof ? '🔥 Finanzierung bestätigt' : lead.status,
        link: `/property/${lead.propertyId}?tab=leads`,
        icon: 'user' as const,
      })),
    };
  }
  
  // Specific property status
  if (lowerQuery.includes('pelkoven') || lowerQuery.includes('status')) {
    const prop = properties.find(p => p.address.toLowerCase().includes('pelkoven'));
    if (prop) {
      const docs = propertyDocuments[prop.id] || [];
      const verifiedCount = docs.filter(d => d.status === 'verified').length;
      const totalDocs = docs.length;
      
      return {
        role: 'assistant',
        content: `**${prop.address}** ist zu ${prop.completionPercent}% fertig.\n\n📍 Status: Bereit zur Veröffentlichung\n📄 Dokumente: ${verifiedCount}/${totalDocs} verifiziert\n💰 Preis: ${(prop.price / 1000).toFixed(0)}T€\n👤 Verkäufer: ${prop.clientName || 'Nicht angegeben'}\n\n**Nächster Schritt:** ${prop.nextAction}`,
        source: 'Property Record',
        cards: [{
          type: 'property',
          title: prop.address,
          subtitle: 'Zum Objekt-Arbeitsbereich',
          link: `/property/${prop.id}`,
          icon: 'building',
        }],
      };
    }
  }
  
  // Generic helpful response
  return {
    role: 'assistant',
    content: `Ich kann Ihnen helfen bei:\n\n• **Objekte suchen** – Nach Adresse, Verkäufer oder Status\n• **Dokumente prüfen** – Fehlende oder ausstehende Dokumente\n• **Leads analysieren** – Qualifizierte Interessenten finden\n• **Status-Updates** – Fortschritt einzelner Objekte\n\nProbieren Sie eine der Vorschläge unten oder stellen Sie eine spezifische Frage.`,
  };
};

export function GlobalAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "Hallo! Ich bin Ihr Immosmart-Assistent. Fragen Sie mich nach Objekten, Dokumenten, Leads oder Status-Updates – ich durchsuche alle Daten für Sie.",
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (text?: string) => {
    const messageText = text || input;
    if (!messageText.trim()) return;

    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: messageText }]);
    setIsTyping(true);

    // Simulate AI response with typing delay
    setTimeout(() => {
      const response = getAIResponse(messageText);
      setMessages(prev => [...prev, response]);
      setIsTyping(false);
    }, 800);
  };

  const getIcon = (iconType: string) => {
    switch (iconType) {
      case 'building': return <Building2 className="h-4 w-4" />;
      case 'file': return <FileText className="h-4 w-4" />;
      case 'user': return <Users className="h-4 w-4" />;
      default: return <Search className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status?: string) => {
    if (!status) return 'bg-muted text-muted-foreground';
    if (status.includes('Fehlt') || status.includes('missing')) return 'bg-destructive/10 text-destructive';
    if (status.includes('🔥') || status.includes('bestätigt')) return 'bg-green-500/10 text-green-600';
    return 'bg-accent/10 text-accent';
  };

  return (
    <>
      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 z-50',
          isOpen 
            ? 'bg-muted hover:bg-muted/80 rotate-0' 
            : 'bg-gradient-to-br from-primary to-accent hover:shadow-xl hover:scale-105'
        )}
      >
        {isOpen ? (
          <X className="h-6 w-6 text-foreground" />
        ) : (
          <div className="relative">
            <MessageCircle className="h-6 w-6 text-primary-foreground" />
            <Sparkles className="h-3 w-3 text-yellow-300 absolute -top-1 -right-1 animate-pulse" />
          </div>
        )}
      </button>

      {/* Chat Panel */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-[420px] max-h-[600px] bg-card rounded-2xl shadow-2xl border z-50 flex flex-col overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
          {/* Header */}
          <div className="p-4 border-b bg-gradient-to-r from-primary/5 to-accent/5">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <h3 className="font-semibold">Immosmart Assistent</h3>
                <p className="text-xs text-muted-foreground">Suche in Objekten, Dokumenten & Leads</p>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-[300px] max-h-[400px]">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={cn(
                  'animate-in fade-in-50 duration-300',
                  msg.role === 'user' ? 'flex justify-end' : ''
                )}
              >
                <div className={cn(
                  'max-w-[90%] rounded-2xl px-4 py-3',
                  msg.role === 'user' 
                    ? 'bg-primary text-primary-foreground rounded-br-md' 
                    : 'bg-muted/50 rounded-bl-md'
                )}>
                  <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                  
                  {msg.source && (
                    <div className="mt-2 flex items-center gap-1.5">
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-background/50 text-muted-foreground">
                        Quelle: {msg.source}
                      </span>
                    </div>
                  )}
                  
                  {msg.cards && msg.cards.length > 0 && (
                    <div className="mt-3 space-y-2">
                      {msg.cards.map((card, j) => (
                        <a
                          key={j}
                          href={card.link}
                          className="flex items-center gap-3 p-3 bg-background rounded-xl border hover:border-accent/50 hover:shadow-sm transition-all group"
                        >
                          <div className="h-9 w-9 rounded-lg bg-accent/10 flex items-center justify-center text-accent shrink-0">
                            {getIcon(card.icon)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{card.title}</p>
                            <p className="text-xs text-muted-foreground truncate">{card.subtitle}</p>
                          </div>
                          {card.status && (
                            <span className={cn(
                              'text-[10px] px-2 py-0.5 rounded-full shrink-0',
                              getStatusColor(card.status)
                            )}>
                              {card.status}
                            </span>
                          )}
                          <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-accent transition-colors shrink-0" />
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-accent rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 bg-accent rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 bg-accent rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
                <span className="text-xs">Suche...</span>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Suggested Queries */}
          {messages.length < 3 && (
            <div className="px-4 pb-3 flex flex-wrap gap-2">
              {suggestedQueries.map((q, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(q.text)}
                  className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full bg-secondary hover:bg-accent/10 hover:text-accent transition-colors"
                >
                  <q.icon className="h-3 w-3" />
                  {q.text}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="p-4 border-t bg-muted/20">
            <div className="flex gap-2">
              <Input
                placeholder="Suchen Sie nach Objekten, Dokumenten, Leads..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !isTyping && handleSend()}
                className="flex-1 bg-background border-muted-foreground/20 focus:border-accent"
                disabled={isTyping}
              />
              <Button 
                size="icon" 
                onClick={() => handleSend()} 
                disabled={isTyping || !input.trim()}
                className="bg-primary hover:bg-primary/90"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
