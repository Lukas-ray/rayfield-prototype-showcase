import { ExternalLink, FileText, Scan, PenLine, Shield, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';

interface EvidenceItem {
  fact: string;
  source: 'scan' | 'document' | 'manual';
  value: string;
  confidence?: number;
  verified?: boolean;
  needsVerification?: boolean;
}

const evidenceItems: EvidenceItem[] = [
  { fact: 'Wohnfläche', source: 'scan', value: '85 m²', confidence: 98, verified: true },
  { fact: 'Zimmeranzahl', source: 'scan', value: '3 Zimmer', confidence: 99, verified: true },
  { fact: 'Baujahr', source: 'document', value: '1998', confidence: 100, verified: true },
  { fact: 'Energieklasse', source: 'document', value: 'C', confidence: 95, verified: true },
  { fact: 'Etage', source: 'scan', value: '3. OG', confidence: 87, needsVerification: true },
  { fact: 'Balkongröße', source: 'manual', value: '8 m²', verified: true },
];

const sourceIcons = {
  scan: Scan,
  document: FileText,
  manual: PenLine,
};

const sourceLabels = {
  scan: 'Scan',
  document: 'Dokument',
  manual: 'Manuell',
};

export function EvidenceSection() {
  const verifiedCount = evidenceItems.filter(i => i.verified).length;
  const needsVerificationCount = evidenceItems.filter(i => i.needsVerification).length;
  const overallConfidence = Math.round(
    evidenceItems.reduce((acc, i) => acc + (i.confidence || 100), 0) / evidenceItems.length
  );

  return (
    <div className="workspace-card">
      {/* Premium Header */}
      <div className="flex items-center justify-between mb-4 pb-4 border-b">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-accent/10">
            <Shield className="h-5 w-5 text-accent" />
          </div>
          <div>
            <h3 className="font-semibold">Property Record</h3>
            <p className="text-xs text-muted-foreground">Evidenzbasierte Fakten mit nachverfolgbaren Quellen</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm font-medium">{overallConfidence}% Konfidenz</p>
            <Progress value={overallConfidence} className="w-24 h-1.5 mt-1" />
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="flex items-center gap-1 text-success">
              <CheckCircle2 className="h-3.5 w-3.5" />
              {verifiedCount} verifiziert
            </span>
            {needsVerificationCount > 0 && (
              <span className="flex items-center gap-1 text-warning">
                <AlertCircle className="h-3.5 w-3.5" />
                {needsVerificationCount} prüfen
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Needs Verification Queue */}
      {needsVerificationCount > 0 && (
        <div className="mb-4 p-3 rounded-lg bg-warning/5 border border-warning/20">
          <p className="text-sm font-medium text-warning mb-2 flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            Prüfung erforderlich
          </p>
          <div className="space-y-2">
            {evidenceItems.filter(i => i.needsVerification).map((item, index) => (
              <div key={index} className="flex items-center justify-between p-2 rounded bg-card">
                <div className="flex items-center gap-2">
                  <span className="text-sm">{item.fact}: <strong>{item.value}</strong></span>
                  <span className="text-xs text-muted-foreground">({item.confidence}% Konfidenz)</span>
                </div>
                <Button variant="outline" size="sm" className="h-7 text-xs">
                  Bestätigen
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Evidence Grid */}
      <div className="grid grid-cols-2 gap-3">
        {evidenceItems.filter(i => !i.needsVerification).map((item, index) => {
          const Icon = sourceIcons[item.source];
          return (
            <div key={index} className={cn(
              "flex items-center justify-between p-3 rounded-lg transition-colors",
              item.verified ? "bg-secondary/50" : "bg-warning/5"
            )}>
              <div>
                <p className="text-sm text-muted-foreground">{item.fact}</p>
                <p className="font-medium">{item.value}</p>
              </div>
              <div className="flex items-center gap-2">
                {item.confidence && (
                  <span className="text-xs text-muted-foreground">{item.confidence}%</span>
                )}
                <span className={cn(
                  "evidence-badge",
                  item.verified && "bg-success/10 text-success"
                )}>
                  <Icon className="h-3 w-3" />
                  {sourceLabels[item.source]}
                </span>
                <Button variant="ghost" size="icon" className="h-6 w-6">
                  <ExternalLink className="h-3 w-3" />
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
