import { useState, useRef, useEffect } from 'react';
import { Send, ExternalLink, Sparkles, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  source?: string;
  link?: { label: string; url: string };
}

const suggestedQuestions = [
  "Wo könnte ein Bett ins Schlafzimmer passen?",
  "Gibt es Platz für eine Waschmaschine?",
  "Welche Dokumente sind für die WEG verfügbar?",
];

const dummyResponses: Record<string, Message> = {
  "wo könnte ein bett ins schlafzimmer passen?": {
    role: 'assistant',
    content: "Das Schlafzimmer misst 4,2m x 3,8m. Ein Kingsize-Bett (2m x 2m) würde am besten an der Nordwand passen, mit 1,2m Abstand auf jeder Seite für Nachttische und 1,8m am Fußende für eine Kommode oder Sitzbereich.",
    source: 'scan',
    link: { label: 'Im 3D-Rundgang ansehen', url: '/property/4?tab=media' },
  },
  "gibt es platz für eine waschmaschine?": {
    role: 'assistant',
    content: "Ja! Der Hauswirtschaftsbereich im Bad hat vorgesehene Anschlüsse für einen Waschmaschinen-Trockner-Turm. Der Platz misst 65cm breit x 60cm tief x 180cm hoch, geeignet für europäische Standardgeräte.",
    source: 'scan',
    link: { label: 'Grundriss ansehen', url: '/property/4?tab=media' },
  },
  "welche dokumente sind für die weg verfügbar?": {
    role: 'assistant',
    content: "Derzeit verfügbare WEG-Dokumente: ✓ Teilungserklärung (verifiziert), ✓ Wirtschaftsplan 2024 (verifiziert), ✓ Hausgeldabrechnung. Noch ausstehend: Protokolle der letzten Eigentümerversammlungen.",
    source: 'dokument',
    link: { label: 'Dokumente ansehen', url: '/property/4?tab=documents' },
  },
};

export function TourConciergeChatbot() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "Hallo! Ich bin der Tour-Concierge für die Kantstraße 23. Ich kann Fragen zur Immobilie beantworten und nutze dabei verifizierte Daten aus unseren Scans und Dokumenten. Wie kann ich Ihnen helfen?",
    },
  ]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (text?: string) => {
    const messageText = text || input;
    if (!messageText.trim()) return;

    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: messageText }]);

    // Simulate AI response
    setTimeout(() => {
      const lowerText = messageText.toLowerCase();
      let response = dummyResponses[lowerText];
      
      if (!response) {
        // Generic response for unknown questions
        if (lowerText.includes('bett') || lowerText.includes('möbel') || lowerText.includes('pass')) {
          response = {
            role: 'assistant',
            content: "Basierend auf dem 3D-Scan kann ich die Raummaße genau sehen. Der Wohnbereich bietet ausreichend Platz für eine Standard-Sofa-Anordnung mit Couchtisch.",
            source: 'scan',
          };
        } else if (lowerText.includes('dokument') || lowerText.includes('weg') || lowerText.includes('unterlagen')) {
          response = {
            role: 'assistant',
            content: "Ich kann Ihnen helfen, Informationen aus den Objektdokumenten zu finden. Wir haben verifizierte Kopien des Grundbuchauszugs, Energieausweises und der WEG-Dokumentation.",
            source: 'dokument',
            link: { label: 'Alle Dokumente ansehen', url: '/property/4?tab=documents' },
          };
        } else {
          response = {
            role: 'assistant',
            content: "Dabei helfe ich gerne! Ich kann Informationen über Raummaße, Möbelplatzierung, verfügbare Dokumente und Objektmerkmale geben. Über welchen Aspekt möchten Sie mehr erfahren?",
          };
        }
      }

      setMessages(prev => [...prev, response]);
    }, 800);
  };

  return (
    <div className="flex flex-col h-full bg-card rounded-lg border">
      {/* Header */}
      <div className="p-4 border-b flex items-center gap-3">
        <div className="h-10 w-10 rounded-full bg-accent/10 flex items-center justify-center">
          <MessageCircle className="h-5 w-5 text-accent" />
        </div>
        <div>
          <h3 className="font-semibold">Tour-Concierge</h3>
          <p className="text-xs text-muted-foreground">KI-gestützte Objekt-FAQ</p>
        </div>
        <Sparkles className="h-4 w-4 text-accent ml-auto" />
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={cn(
              'chat-bubble animate-fade-in',
              msg.role === 'user' ? 'chat-bubble-user' : 'chat-bubble-assistant'
            )}
          >
            {msg.content}
            {msg.source && (
              <div className="mt-2">
                <span className="evidence-badge text-xs">Quelle: {msg.source}</span>
              </div>
            )}
            {msg.link && (
              <button className="mt-2 flex items-center gap-1 text-xs text-accent hover:underline">
                <ExternalLink className="h-3 w-3" />
                {msg.link.label}
              </button>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Questions */}
      {messages.length < 4 && (
        <div className="px-4 pb-2 flex flex-wrap gap-2">
          {suggestedQuestions.map((q, i) => (
            <button
              key={i}
              onClick={() => handleSend(q)}
              className="text-xs px-3 py-1.5 rounded-full bg-secondary hover:bg-muted transition-colors text-left"
            >
              {q}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="p-4 border-t flex gap-2">
        <Input
          placeholder="Fragen zur Immobilie..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          className="flex-1"
        />
        <Button size="icon" onClick={() => handleSend()}>
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
