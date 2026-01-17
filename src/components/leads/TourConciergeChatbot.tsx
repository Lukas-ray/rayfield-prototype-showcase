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
  "Where could a bed fit in the master bedroom?",
  "Is there space for a washer?",
  "What documents are available for the WEG?",
];

const dummyResponses: Record<string, Message> = {
  "where could a bed fit in the master bedroom?": {
    role: 'assistant',
    content: "The master bedroom measures 4.2m x 3.8m. A king-size bed (2m x 2m) would fit best along the north wall, leaving 1.2m clearance on each side for nightstands and 1.8m at the foot of the bed for a dresser or seating area.",
    source: 'scan',
    link: { label: 'View in 3D Tour', url: '/property/4?tab=media' },
  },
  "is there space for a washer?": {
    role: 'assistant',
    content: "Yes! The utility area in the bathroom has designated plumbing connections for a washer-dryer stack. The space measures 65cm wide x 60cm deep x 180cm high, suitable for standard European appliances.",
    source: 'scan',
    link: { label: 'View Floor Plan', url: '/property/4?tab=media' },
  },
  "what documents are available for the weg?": {
    role: 'assistant',
    content: "Currently available WEG documents: ✓ Teilungserklärung (verified), ✓ Wirtschaftsplan 2024 (verified), ✓ Hausgeldabrechnung. Still pending: Protokolle from recent Eigentümerversammlungen.",
    source: 'document',
    link: { label: 'View Documents', url: '/property/4?tab=documents' },
  },
};

export function TourConciergeChatbot() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "Hello! I'm the Tour Concierge for Kantstraße 23. I can answer questions about the property using verified data from our scans and documents. How can I help you?",
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
        if (lowerText.includes('bed') || lowerText.includes('furniture') || lowerText.includes('fit')) {
          response = {
            role: 'assistant',
            content: "Based on the 3D scan, I can see the room dimensions clearly. The living area has ample space for a standard sofa arrangement with a coffee table.",
            source: 'scan',
          };
        } else if (lowerText.includes('document') || lowerText.includes('weg') || lowerText.includes('paper')) {
          response = {
            role: 'assistant',
            content: "I can help you find information from the property documents. We have verified copies of the land registry, energy certificate, and WEG documentation.",
            source: 'document',
            link: { label: 'View All Documents', url: '/property/4?tab=documents' },
          };
        } else {
          response = {
            role: 'assistant',
            content: "I'd be happy to help with that! I can provide information about room dimensions, furniture placement, available documents, and property features. What specific aspect would you like to know more about?",
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
          <h3 className="font-semibold">Tour Concierge</h3>
          <p className="text-xs text-muted-foreground">AI-powered property Q&A</p>
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
                <span className="evidence-badge text-xs">Source: {msg.source}</span>
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
          placeholder="Ask about the property..."
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
