import { ExternalLink, FileText, Scan, PenLine } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EvidenceItem {
  fact: string;
  source: 'scan' | 'document' | 'manual';
  value: string;
}

const evidenceItems: EvidenceItem[] = [
  { fact: 'Living Area', source: 'scan', value: '85 m²' },
  { fact: 'Room Count', source: 'scan', value: '3 rooms' },
  { fact: 'Year Built', source: 'document', value: '1998' },
  { fact: 'Energy Class', source: 'document', value: 'C' },
  { fact: 'Floor Level', source: 'scan', value: '3rd floor' },
  { fact: 'Balcony Size', source: 'manual', value: '8 m²' },
];

const sourceIcons = {
  scan: Scan,
  document: FileText,
  manual: PenLine,
};

const sourceLabels = {
  scan: 'Scan',
  document: 'Document',
  manual: 'Manual',
};

export function EvidenceSection() {
  return (
    <div className="workspace-card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold">Evidence-First Data</h3>
        <span className="text-xs text-muted-foreground">All facts are traceable</span>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {evidenceItems.map((item, index) => {
          const Icon = sourceIcons[item.source];
          return (
            <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
              <div>
                <p className="text-sm text-muted-foreground">{item.fact}</p>
                <p className="font-medium">{item.value}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="evidence-badge">
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
