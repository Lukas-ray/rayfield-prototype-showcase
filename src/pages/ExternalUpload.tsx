import { useState } from 'react';
import { Upload, Check, FileText, ChevronLeft, Shield, Clock, HelpCircle, Phone, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { documents } from '@/data/dummyData';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const requestedDocs = documents.filter(d => d.status === 'missing' || d.status === 'requested');

export default function ExternalUpload() {
  const { toast } = useToast();
  const [uploadedDocs, setUploadedDocs] = useState<string[]>([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [dragOver, setDragOver] = useState<string | null>(null);

  const handleUpload = (docId: string) => {
    setUploadedDocs(prev => [...prev, docId]);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
    toast({
      title: 'Erfolgreich hochgeladen',
      description: 'Dokument wurde empfangen und wird verarbeitet.',
    });
  };

  const handleDragOver = (e: React.DragEvent, docId: string) => {
    e.preventDefault();
    setDragOver(docId);
  };

  const handleDragLeave = () => {
    setDragOver(null);
  };

  const handleDrop = (e: React.DragEvent, docId: string) => {
    e.preventDefault();
    setDragOver(null);
    handleUpload(docId);
  };

  const uploadedCount = uploadedDocs.length;
  const totalCount = requestedDocs.length;
  const progress = totalCount > 0 ? (uploadedCount / totalCount) * 100 : 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header with Immosmart Branding */}
      <header className="border-b bg-white shadow-sm">
        <div className="max-w-3xl mx-auto px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Immosmart Logo */}
              <div className="relative">
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                  <span className="text-white font-bold text-lg">IS</span>
                </div>
                <div className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-emerald-400 border-2 border-white" />
              </div>
              <div>
                <h1 className="font-bold text-xl text-slate-800">Immosmart</h1>
                <p className="text-sm text-slate-500">Sicheres Dokumenten-Portal</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <Shield className="h-4 w-4 text-emerald-500" />
              <span>SSL-verschlüsselt</span>
            </div>
          </div>
        </div>
      </header>

      {/* Property Info Banner */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white">
        <div className="max-w-3xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-emerald-100 text-sm mb-1">Dokumente für Immobilie</p>
              <h2 className="text-2xl font-semibold">Maximilianstraße 42, München</h2>
              <p className="text-emerald-100 text-sm mt-1">Ansprechpartner: Max Mustermann</p>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-2 text-emerald-100 text-sm mb-1">
                <Clock className="h-4 w-4" />
                <span>Frist: 25. Januar 2024</span>
              </div>
              <div className="bg-white/20 rounded-full px-4 py-2 backdrop-blur-sm">
                <span className="font-medium">{uploadedCount} von {totalCount}</span>
                <span className="text-emerald-100 ml-1">hochgeladen</span>
              </div>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-4">
            <div className="h-2 bg-white/20 rounded-full overflow-hidden">
              <div 
                className="h-full bg-white rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="max-w-3xl mx-auto px-6 py-8">
        {/* Success Message */}
        {showSuccess && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center gap-3 animate-in slide-in-from-top-2">
            <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center">
              <Check className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <p className="font-medium text-emerald-800">Dokument erfolgreich hochgeladen!</p>
              <p className="text-sm text-emerald-600">Wir haben Ihre Datei erhalten und prüfen sie.</p>
            </div>
          </div>
        )}

        {/* All Complete Message */}
        {uploadedCount === totalCount && totalCount > 0 && (
          <div className="mb-6 p-6 rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200 text-center">
            <div className="h-16 w-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
              <Check className="h-8 w-8 text-emerald-600" />
            </div>
            <h3 className="text-xl font-semibold text-emerald-800 mb-2">Alle Dokumente hochgeladen!</h3>
            <p className="text-emerald-600">Vielen Dank! Wir haben alle angeforderten Unterlagen erhalten.</p>
          </div>
        )}

        {/* Document Cards */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mb-8">
          <div className="p-5 border-b border-slate-100 bg-slate-50">
            <h2 className="font-semibold text-lg text-slate-800">Angeforderte Dokumente</h2>
            <p className="text-sm text-slate-500 mt-1">
              Klicken oder ziehen Sie Ihre Dateien in die entsprechenden Felder.
            </p>
          </div>

          <div className="divide-y divide-slate-100">
            {requestedDocs.map((doc) => {
              const isUploaded = uploadedDocs.includes(doc.id);
              const isDragOver = dragOver === doc.id;
              
              return (
                <div
                  key={doc.id}
                  onDragOver={(e) => handleDragOver(e, doc.id)}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, doc.id)}
                  className={cn(
                    'flex items-center justify-between p-5 transition-all duration-200',
                    isUploaded && 'bg-emerald-50/50',
                    isDragOver && !isUploaded && 'bg-emerald-50 ring-2 ring-inset ring-emerald-400'
                  )}
                >
                  <div className="flex items-center gap-4">
                    {isUploaded ? (
                      <div className="h-12 w-12 rounded-xl bg-emerald-100 flex items-center justify-center">
                        <Check className="h-6 w-6 text-emerald-600" />
                      </div>
                    ) : (
                      <div className={cn(
                        "h-12 w-12 rounded-xl flex items-center justify-center transition-colors",
                        isDragOver ? "bg-emerald-100" : "bg-slate-100"
                      )}>
                        <FileText className={cn(
                          "h-6 w-6 transition-colors",
                          isDragOver ? "text-emerald-600" : "text-slate-400"
                        )} />
                      </div>
                    )}
                    <div>
                      <p className={cn(
                        "font-medium",
                        isUploaded ? "text-emerald-800" : "text-slate-800"
                      )}>{doc.name}</p>
                      <p className="text-sm text-slate-500">{doc.type}</p>
                    </div>
                  </div>
                  
                  {isUploaded ? (
                    <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100 text-emerald-700">
                      <Check className="h-4 w-4" />
                      <span className="text-sm font-medium">Hochgeladen</span>
                    </div>
                  ) : (
                    <Button 
                      onClick={() => handleUpload(doc.id)} 
                      className={cn(
                        "gap-2 transition-all",
                        isDragOver 
                          ? "bg-emerald-600 hover:bg-emerald-700" 
                          : "bg-slate-800 hover:bg-slate-900"
                      )}
                    >
                      <Upload className="h-4 w-4" />
                      Datei auswählen
                    </Button>
                  )}
                </div>
              );
            })}
          </div>

          {/* Upload Info */}
          <div className="p-4 bg-slate-50 border-t border-slate-100">
            <p className="text-xs text-slate-500 text-center">
              Akzeptierte Formate: PDF, JPG, PNG • Maximale Dateigröße: 25 MB pro Datei
            </p>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mb-8">
          <div className="p-5 border-b border-slate-100 bg-slate-50">
            <div className="flex items-center gap-2">
              <HelpCircle className="h-5 w-5 text-slate-400" />
              <h2 className="font-semibold text-lg text-slate-800">Häufige Fragen</h2>
            </div>
          </div>
          
          <Accordion type="single" collapsible className="px-5">
            <AccordionItem value="security">
              <AccordionTrigger className="text-sm">Wie sicher sind meine Dokumente?</AccordionTrigger>
              <AccordionContent className="text-sm text-slate-600">
                Alle hochgeladenen Dokumente werden SSL-verschlüsselt übertragen und auf sicheren Servern in Deutschland gespeichert. 
                Der Zugriff ist ausschließlich Ihrem Immobilienmakler und autorisierten Mitarbeitern vorbehalten.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="formats">
              <AccordionTrigger className="text-sm">Welche Dateiformate werden unterstützt?</AccordionTrigger>
              <AccordionContent className="text-sm text-slate-600">
                Wir akzeptieren PDF, JPG und PNG-Dateien. Für die beste Qualität empfehlen wir PDF-Dokumente. 
                Falls Sie Dokumente scannen müssen, nutzen Sie gerne eine Scanner-App auf Ihrem Smartphone.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="missing">
              <AccordionTrigger className="text-sm">Was, wenn ich ein Dokument nicht habe?</AccordionTrigger>
              <AccordionContent className="text-sm text-slate-600">
                Kontaktieren Sie bitte Ihren Makler direkt. Gemeinsam finden wir eine Lösung – 
                oft können fehlende Dokumente bei den zuständigen Ämtern oder der Hausverwaltung angefordert werden.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        {/* Contact Section */}
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 text-white">
          <h3 className="font-semibold text-lg mb-2">Fragen oder Probleme?</h3>
          <p className="text-slate-300 text-sm mb-4">
            Ihr persönlicher Ansprechpartner hilft Ihnen gerne weiter.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button variant="secondary" className="gap-2 bg-white/10 hover:bg-white/20 text-white border-0">
              <Phone className="h-4 w-4" />
              +49 89 123 456 78
            </Button>
            <Button variant="secondary" className="gap-2 bg-white/10 hover:bg-white/20 text-white border-0">
              <Mail className="h-4 w-4" />
              makler@immosmart.de
            </Button>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 pt-6 border-t border-slate-100">
          <Button variant="ghost" asChild className="gap-2 text-slate-500 hover:text-slate-700">
            <a href="/">
              <ChevronLeft className="h-4 w-4" />
              Zurück zu Immosmart
            </a>
          </Button>
          <p className="text-xs text-slate-400 mt-4">
            © 2024 Immosmart Immobilien • Datenschutz • Impressum
          </p>
        </div>
      </main>
    </div>
  );
}
