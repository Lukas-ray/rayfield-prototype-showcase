import { Upload, FileText, RefreshCw, User, Bot, ArrowUpRight, Clock } from 'lucide-react';
import { auditEntries, AuditEntry } from '@/data/dummyData';
import { cn } from '@/lib/utils';

const actionIcons: Record<string, typeof Upload> = {
  'Capture hochgeladen': Upload,
  'Agent-Lauf abgeschlossen': Bot,
  'Dokument umbenannt': FileText,
  'Export generiert': ArrowUpRight,
  'Workflow-Status geändert': RefreshCw,
  'Dokument hochgeladen': Upload,
};

export function ActivityTab() {
  return (
    <div className="workspace-card max-w-3xl">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-semibold">Audit-Log</h3>
        <span className="text-xs text-muted-foreground">Unveränderliches Protokoll aller Aktionen</span>
      </div>

      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-5 top-0 bottom-0 w-px bg-border" />

        <div className="space-y-4">
          {auditEntries.map((entry, index) => {
            const Icon = actionIcons[entry.action] || FileText;
            return (
              <div key={entry.id} className="relative flex gap-4 animate-fade-in" style={{ animationDelay: `${index * 50}ms` }}>
                {/* Icon */}
                <div className={cn(
                  'relative z-10 h-10 w-10 rounded-full flex items-center justify-center',
                  entry.actorType === 'agent' ? 'bg-accent/10 text-accent' : 'bg-secondary text-muted-foreground'
                )}>
                  {entry.actorType === 'agent' ? (
                    <Bot className="h-5 w-5" />
                  ) : (
                    <User className="h-5 w-5" />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 pb-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium">{entry.action}</p>
                      <p className="text-sm text-muted-foreground">
                        von {entry.actor}
                        {entry.actorType === 'agent' && (
                          <span className="ml-1 evidence-badge">KI</span>
                        )}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {entry.timestamp}
                    </div>
                  </div>
                  {entry.details && (
                    <div className="mt-2 p-2 rounded bg-secondary/50 text-sm">
                      {entry.details}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
