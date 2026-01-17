import { ExternalLink, FileText, Scan, PenLine } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EvidenceItem {
  fact: string;
  source: 'scan' | 'document' | 'manual';
  value: string;
}

const evidenceItems: EvidenceItem[] = [
  { fact: 'Wohnfläche', source: 'scan', value: '85 m²' },
  { fact: 'Zimmeranzahl', source: 'scan', value: '3 Zimmer' },
  { fact: 'Baujahr', source: 'document', value: '1998' },
  { fact: 'Energieklasse', source: 'document', value: 'C' },
  { fact: 'Etage', source: 'scan', value: '3. OG' },
  { fact: 'Balkongröße', source: 'manual', value: '8 m²' },
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
  return (
    <div className="workspace-card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold">Evidenzbasierte Daten</h3>
        <span className="text-xs text-muted-foreground">Alle Fakten sind nachverfolgbar</span>
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
