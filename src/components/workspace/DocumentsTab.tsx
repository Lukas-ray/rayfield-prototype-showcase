import { useState } from 'react';
import { Upload, Play, FileText, Check, Clock, AlertCircle, Send, Link, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { documents as initialDocs, Document } from '@/data/dummyData';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

const statusConfig = {
  missing: { icon: AlertCircle, label: 'Missing', class: 'text-destructive' },
  requested: { icon: Clock, label: 'Requested', class: 'text-warning' },
  received: { icon: FileText, label: 'Received', class: 'text-info' },
  verified: { icon: Check, label: 'Verified', class: 'text-success' },
};

interface AgentResult {
  classified: { name: string; type: string }[];
  missing: string[];
}

export function DocumentsTab() {
  const { toast } = useToast();
  const [docs, setDocs] = useState<Document[]>(initialDocs);
  const [agentDialogOpen, setAgentDialogOpen] = useState(false);
  const [showUploadPreview, setShowUploadPreview] = useState(false);
  const [previewFile, setPreviewFile] = useState({ original: '', suggested: '', type: '' });

  const agentResult: AgentResult = {
    classified: [
      { name: 'grundbuch_scan.pdf', type: 'Land Registry' },
      { name: 'energie.pdf', type: 'Energy Certificate' },
      { name: 'wplan_2024.pdf', type: 'Economic Plan' },
    ],
    missing: ['Energieausweis', 'Protokolle Eigentümerversammlung', 'Mietvertrag'],
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    // Simulate file classification
    setPreviewFile({
      original: 'hausgeld_jan2024.pdf',
      suggested: 'Hausgeldabrechnung_Muellerstr42_2024.pdf',
      type: 'Service Charge Statement',
    });
    setShowUploadPreview(true);
  };

  const handleConfirmUpload = () => {
    setShowUploadPreview(false);
    toast({
      title: 'Document uploaded',
      description: 'File has been classified and renamed.',
    });
  };

  const handleGenerateRequest = () => {
    toast({
      title: 'Request message generated',
      description: 'Email draft created for missing documents.',
    });
  };

  const handleGenerateBuyerPack = () => {
    toast({
      title: 'Buyer Safe Pack generated',
      description: 'Document package ready for download.',
    });
  };

  const copyUploadLink = () => {
    navigator.clipboard.writeText('https://upload.rayfield.io/p/abc123');
    toast({
      title: 'Link copied',
      description: 'Seller upload link copied to clipboard.',
    });
  };

  return (
    <div className="grid grid-cols-3 gap-6">
      {/* Document Checklist */}
      <div className="col-span-2 workspace-card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">Document Checklist</h3>
          <Button onClick={() => setAgentDialogOpen(true)} className="gap-2">
            <Play className="h-4 w-4" />
            Run Document Pack Agent
          </Button>
        </div>
        
        <div className="space-y-2">
          {docs.map((doc) => {
            const status = statusConfig[doc.status];
            const StatusIcon = status.icon;
            return (
              <div key={doc.id} className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                <div className="flex items-center gap-3">
                  <StatusIcon className={cn('h-5 w-5', status.class)} />
                  <div>
                    <p className="font-medium">{doc.name}</p>
                    <p className="text-xs text-muted-foreground">{doc.type}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={cn('status-badge', `status-${doc.status === 'verified' ? 'ready' : doc.status === 'received' ? 'processing' : doc.status === 'requested' ? 'missing' : 'draft'}`)}>
                    {status.label}
                  </span>
                  {doc.source && (
                    <span className="evidence-badge">{doc.source}</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Upload & External Portal */}
      <div className="space-y-6">
        {/* Upload Area */}
        <div className="workspace-card">
          <h3 className="font-semibold mb-4">Upload Documents</h3>
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:border-accent transition-colors"
          >
            <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">
              Drop files here or click to browse
            </p>
          </div>
        </div>

        {/* External Portal Link */}
        <div className="workspace-card">
          <h3 className="font-semibold mb-4">Seller Upload Portal</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Share this link with sellers or Hausverwaltung to request documents.
          </p>
          <div className="flex gap-2">
            <Button variant="outline" onClick={copyUploadLink} className="flex-1 gap-2">
              <Link className="h-4 w-4" />
              Copy Link
            </Button>
            <Button variant="outline" asChild>
              <a href="/external-upload" target="_blank">
                <ExternalLink className="h-4 w-4" />
              </a>
            </Button>
          </div>
        </div>
      </div>

      {/* Upload Preview Dialog */}
      <Dialog open={showUploadPreview} onOpenChange={setShowUploadPreview}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Document Classification Preview</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-secondary/50">
              <p className="text-sm text-muted-foreground">Original filename</p>
              <p className="font-medium">{previewFile.original}</p>
            </div>
            <div className="flex items-center justify-center">
              <span className="text-muted-foreground">↓</span>
            </div>
            <div className="p-4 rounded-lg bg-accent/10 border border-accent">
              <p className="text-sm text-muted-foreground">Suggested name</p>
              <p className="font-medium">{previewFile.suggested}</p>
              <p className="text-sm text-accent mt-1">Type: {previewFile.type}</p>
            </div>
          </div>
          <Button onClick={handleConfirmUpload} className="w-full mt-4">
            Confirm & Upload
          </Button>
        </DialogContent>
      </Dialog>

      {/* Agent Results Dialog */}
      <Dialog open={agentDialogOpen} onOpenChange={setAgentDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Document Pack Agent Results</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Classified Documents</h4>
              <div className="space-y-2">
                {agentResult.classified.map((doc, i) => (
                  <div key={i} className="flex items-center justify-between p-2 rounded bg-secondary/50">
                    <span className="text-sm">{doc.name}</span>
                    <span className="evidence-badge">{doc.type}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-medium mb-2">Missing Documents</h4>
              <div className="space-y-2">
                {agentResult.missing.map((doc, i) => (
                  <div key={i} className="flex items-center gap-2 p-2 rounded bg-destructive/10">
                    <AlertCircle className="h-4 w-4 text-destructive" />
                    <span className="text-sm">{doc}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleGenerateRequest} variant="outline" className="flex-1 gap-2">
                <Send className="h-4 w-4" />
                Generate Request Message
              </Button>
              <Button onClick={handleGenerateBuyerPack} className="flex-1 gap-2">
                <FileText className="h-4 w-4" />
                Generate Buyer Safe Pack
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
