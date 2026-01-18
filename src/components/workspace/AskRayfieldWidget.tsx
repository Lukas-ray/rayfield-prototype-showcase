import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  source?: string;
  link?: { label: string; tab: string };
}

const suggestedQuestions = [
  { text: "Was fehlt zur Veröffentlichung?", navigateTo: 'workflow' },
  { text: "Anfragenachricht für Dokumente erstellen", navigateTo: 'documents' },
  { text: "Zeige die letzte Agent-Ausgabe", navigateTo: 'overview' },
];

export function AskImmosmart() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "Hallo! Ich bin Ihr Immosmart-Assistent. Ich kann Ihnen helfen, den Status dieses Objekts zu verstehen und Aktionen durchzuführen.",
    },
  ]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);

    // Simulate AI response
    setTimeout(() => {
      let response: Message;
      if (userMessage.toLowerCase().includes('fehlt') || userMessage.toLowerCase().includes('veröffentlich')) {
        response = {
          role: 'assistant',
          content: "Um dieses Objekt zu veröffentlichen, benötigen Sie noch: 1) Energieausweis-Dokument, 2) Mindest-Dokumentenpaket-Gate erfüllen. Die Hero-Fotos und der Grundriss sind bereits vorhanden.",
          source: 'objektdatensatz',
          link: { label: 'Workflow anzeigen', tab: 'workflow' },
        };
      } else if (userMessage.toLowerCase().includes('anfrage') || userMessage.toLowerCase().includes('nachricht')) {
        response = {
          role: 'assistant',
          content: "Ich habe eine Anfragenachricht für die fehlenden Dokumente vorbereitet. Sie finden sie im Dokumente-Tab unter 'Anfragenachricht generieren'.",
          link: { label: 'Zu Dokumente', tab: 'documents' },
        };
      } else {
        response = {
          role: 'assistant',
          content: "Ich kann Ihnen bei Workflow-Status, Dokumentenanforderungen und Objektinformationen helfen. Fragen Sie mich, was zur Veröffentlichung fehlt oder lassen Sie Anfragenachrichten generieren.",
        };
      }
      setMessages(prev => [...prev, response]);
    }, 800);
  };

  const handleSuggestion = (suggestion: typeof suggestedQuestions[0]) => {
    setMessages(prev => [...prev, { role: 'user', content: suggestion.text }]);
    
    setTimeout(() => {
      let response: Message;
      if (suggestion.text.includes('fehlt')) {
        response = {
          role: 'assistant',
          content: "Um zum Status 'Veröffentlicht' zu gelangen, benötigen Sie: ✓ Hero-Fotos (erfüllt), ✓ Grundriss (erfüllt), ✗ Mindest-Dokumentenpaket (nicht erfüllt - Energieausweis fehlt).",
          source: 'workflow_gates',
          link: { label: 'Gates anzeigen', tab: 'workflow' },
        };
      } else if (suggestion.text.includes('Anfrage')) {
        response = {
          role: 'assistant',
          content: "Ich kann eine E-Mail zur Anforderung des Energieausweises und der Protokolle von der Hausverwaltung erstellen. Klicken Sie unten, um zu Dokumente zu gehen und sie zu generieren.",
          link: { label: 'In Dokumente generieren', tab: 'documents' },
        };
      } else {
        response = {
          role: 'assistant',
          content: "Der letzte Agent-Lauf war der Listing Factory Agent heute um 14:32. Er hat 3 Inseratsvarianten generiert und 12 strukturierte Felder aus dem Scan extrahiert.",
          source: 'agent_runs',
          link: { label: 'Ausgabe anzeigen', tab: 'media' },
        };
      }
      setMessages(prev => [...prev, response]);
    }, 600);
  };

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-elevated flex items-center justify-center transition-all z-50',
          isOpen ? 'bg-muted' : 'bg-primary hover:bg-primary/90'
        )}
      >
        {isOpen ? (
          <X className="h-6 w-6 text-foreground" />
        ) : (
          <MessageCircle className="h-6 w-6 text-primary-foreground" />
        )}
      </button>

      {/* Chat Panel */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-96 bg-card rounded-xl shadow-modal border z-50 animate-slide-up">
          {/* Header */}
          <div className="p-4 border-b">
            <h3 className="font-semibold">Immosmart fragen</h3>
            <p className="text-xs text-muted-foreground">KI-Assistent für dieses Objekt</p>
          </div>

          {/* Messages */}
          <div className="h-80 overflow-y-auto p-4 space-y-3">
            {messages.map((msg, i) => (
              <div key={i} className={cn('chat-bubble', msg.role === 'user' ? 'chat-bubble-user' : 'chat-bubble-assistant')}>
                {msg.content}
                {msg.source && (
                  <div className="mt-1">
                    <span className="evidence-badge text-xs">{msg.source}</span>
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

          {/* Suggestions */}
          {messages.length < 3 && (
            <div className="px-4 pb-2 flex flex-wrap gap-2">
              {suggestedQuestions.map((q, i) => (
                <button
                  key={i}
                  onClick={() => handleSuggestion(q)}
                  className="text-xs px-3 py-1.5 rounded-full bg-secondary hover:bg-muted transition-colors"
                >
                  {q.text}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="p-4 border-t flex gap-2">
            <Input
              placeholder="Fragen zu diesem Objekt..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              className="flex-1"
            />
            <Button size="icon" onClick={handleSend}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
