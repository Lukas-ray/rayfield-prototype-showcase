import { useState } from 'react';
import { Upload, Check, FileText, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { documents } from '@/data/dummyData';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

const requestedDocs = documents.filter(d => d.status === 'missing' || d.status === 'requested');

export default function ExternalUpload() {
  const { toast } = useToast();
  const [uploadedDocs, setUploadedDocs] = useState<string[]>([]);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleUpload = (docId: string) => {
    setUploadedDocs(prev => [...prev, docId]);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
    toast({
      title: 'Erfolgreich hochgeladen',
      description: 'Dokument wurde empfangen und wird verarbeitet.',
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="max-w-2xl mx-auto px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <FileText className="h-4 w-4 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-semibold">Dokumenten-Upload-Portal</h1>
              <p className="text-sm text-muted-foreground">Müllerstraße 42, Berlin</p>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-2xl mx-auto px-6 py-8">
        <div className="workspace-card mb-6">
          <h2 className="font-semibold mb-2">Angeforderte Dokumente</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Bitte laden Sie die folgenden Dokumente für das Objekt Müllerstraße 42 hoch.
            Akzeptierte Formate: PDF, JPG, PNG (max. 25 MB pro Datei).
          </p>

          {showSuccess && (
            <div className="mb-4 p-3 rounded-lg bg-success/10 border border-success/20 flex items-center gap-2">
              <Check className="h-5 w-5 text-success" />
              <span className="text-sm text-success">Dokument erfolgreich hochgeladen!</span>
            </div>
          )}

          <div className="space-y-3">
            {requestedDocs.map((doc) => {
              const isUploaded = uploadedDocs.includes(doc.id);
              return (
                <div
                  key={doc.id}
                  className={cn(
                    'flex items-center justify-between p-4 rounded-lg border-2 transition-colors',
                    isUploaded ? 'border-success bg-success/5' : 'border-dashed border-border'
                  )}
                >
                  <div className="flex items-center gap-3">
                    {isUploaded ? (
                      <div className="h-10 w-10 rounded-full bg-success/10 flex items-center justify-center">
                        <Check className="h-5 w-5 text-success" />
                      </div>
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                        <FileText className="h-5 w-5 text-muted-foreground" />
                      </div>
                    )}
                    <div>
                      <p className="font-medium">{doc.name}</p>
                      <p className="text-sm text-muted-foreground">{doc.type}</p>
                    </div>
                  </div>
                  {isUploaded ? (
                    <span className="status-badge status-ready">Hochgeladen</span>
                  ) : (
                    <Button onClick={() => handleUpload(doc.id)} variant="outline" className="gap-2">
                      <Upload className="h-4 w-4" />
                      Hochladen
                    </Button>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="text-center">
          <p className="text-sm text-muted-foreground mb-4">
            Fragen? Kontaktieren Sie direkt Ihren Makler.
          </p>
          <Button variant="ghost" asChild className="gap-2">
            <a href="/">
              <ChevronLeft className="h-4 w-4" />
              Zurück zu Immosmart
            </a>
          </Button>
        </div>
      </main>
    </div>
  );
}
