import { FolderOpen } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { documents as allDocs } from '@/data/dummyData';

export default function Documents() {
  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Documents</h1>
          <p className="text-muted-foreground">Central document repository across all properties</p>
        </div>

        <div className="workspace-card">
          <div className="flex items-center gap-3 p-8 border-2 border-dashed rounded-lg mb-6">
            <FolderOpen className="h-10 w-10 text-muted-foreground" />
            <div>
              <p className="font-medium">Document Library</p>
              <p className="text-sm text-muted-foreground">
                Select a property to view its documents, or upload new documents here.
              </p>
            </div>
          </div>

          <h3 className="font-semibold mb-4">Recent Documents</h3>
          <div className="space-y-2">
            {allDocs.slice(0, 5).map((doc) => (
              <div key={doc.id} className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                <div>
                  <p className="font-medium">{doc.name}</p>
                  <p className="text-xs text-muted-foreground">{doc.type}</p>
                </div>
                {doc.uploadedAt && (
                  <span className="text-xs text-muted-foreground">{doc.uploadedAt}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
