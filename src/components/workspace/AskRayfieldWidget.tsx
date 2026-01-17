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
  { text: "What's missing to publish?", navigateTo: 'workflow' },
  { text: "Generate request message for docs", navigateTo: 'documents' },
  { text: "Show me the latest agent output", navigateTo: 'overview' },
];

export function AskRayfieldWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "Hi! I'm your Rayfield assistant. I can help you understand this property's status and take actions.",
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
      if (userMessage.toLowerCase().includes('missing') || userMessage.toLowerCase().includes('publish')) {
        response = {
          role: 'assistant',
          content: "To publish this property, you still need: 1) Energieausweis document, 2) Complete the Minimum doc pack gate. The hero photos and floor plan requirements are already met.",
          source: 'property_record',
          link: { label: 'View Workflow', tab: 'workflow' },
        };
      } else if (userMessage.toLowerCase().includes('request') || userMessage.toLowerCase().includes('message')) {
        response = {
          role: 'assistant',
          content: "I've prepared a request message for the missing documents. You can find it in the Documents tab under 'Generate Request Message'.",
          link: { label: 'Go to Documents', tab: 'documents' },
        };
      } else {
        response = {
          role: 'assistant',
          content: "I can help you with workflow status, document requests, and property information. Try asking about what's needed to publish or generate request messages.",
        };
      }
      setMessages(prev => [...prev, response]);
    }, 800);
  };

  const handleSuggestion = (suggestion: typeof suggestedQuestions[0]) => {
    setMessages(prev => [...prev, { role: 'user', content: suggestion.text }]);
    
    setTimeout(() => {
      let response: Message;
      if (suggestion.text.includes('missing')) {
        response = {
          role: 'assistant',
          content: "To move to Published state, you need: ✓ Hero photos (met), ✓ Floor plan (met), ✗ Minimum doc pack (not met - missing Energieausweis).",
          source: 'workflow_gates',
          link: { label: 'View Gates', tab: 'workflow' },
        };
      } else if (suggestion.text.includes('request')) {
        response = {
          role: 'assistant',
          content: "I can generate an email requesting the Energieausweis and Protokolle from the Hausverwaltung. Click below to go to Documents and generate it.",
          link: { label: 'Generate in Documents', tab: 'documents' },
        };
      } else {
        response = {
          role: 'assistant',
          content: "The latest agent run was Listing Factory Agent at 14:32 today. It generated 3 listing variants and extracted 12 structured fields from the scan.",
          source: 'agent_runs',
          link: { label: 'View Output', tab: 'media' },
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
            <h3 className="font-semibold">Ask Rayfield</h3>
            <p className="text-xs text-muted-foreground">AI assistant for this property</p>
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
              placeholder="Ask about this property..."
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
