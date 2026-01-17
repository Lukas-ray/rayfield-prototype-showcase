import { useState } from 'react';
import { AlertCircle, Check, Link2, Play, ExternalLink } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const exportPackages = [
  { id: '1', name: 'ImmoScout24 Package', created: 'Jan 14, 14:32', status: 'ready' },
  { id: '2', name: 'Generic XML Export', created: 'Jan 13, 10:15', status: 'ready' },
];

const connectors = [
  { id: 'onoffice', name: 'onOffice', status: 'disconnected', logo: '🏢' },
  { id: 'flowfact', name: 'Flowfact', status: 'disconnected', logo: '📊' },
  { id: 'propstack', name: 'Propstack', status: 'connected', logo: '🏠' },
];

const validationWarnings = [
  { type: 'missing', field: 'Energy Certificate Number', message: 'Required for portal listing' },
  { type: 'inconsistency', field: 'Living Area', message: 'Document states 87m², scan shows 85m²' },
];

export default function Publishing() {
  const { toast } = useToast();
  const [integrationDialogOpen, setIntegrationDialogOpen] = useState(false);
  const [selectedConnector, setSelectedConnector] = useState<string | null>(null);

  const handleConnect = (connectorId: string) => {
    setSelectedConnector(connectorId);
    setIntegrationDialogOpen(true);
  };

  const handlePublish = (connectorId: string) => {
    toast({
      title: 'Publishing initiated',
      description: `Listing sent to ${connectors.find(c => c.id === connectorId)?.name}. Check activity log for status.`,
    });
  };

  return (
    <AppLayout>
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Publishing</h1>
          <p className="text-muted-foreground">Prepare and distribute listings to portals</p>
        </div>

        <div className="grid grid-cols-3 gap-6">
          {/* Listing Draft Form */}
          <div className="col-span-2 space-y-6">
            <div className="workspace-card">
              <h3 className="font-semibold mb-4">Listing Draft</h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    defaultValue="Lichtdurchflutete 3-Zimmer Altbauwohnung in Mitte"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="short">Short Description</Label>
                  <Input
                    id="short"
                    defaultValue="Traumhafte Altbauwohnung mit Stuck, Dielen und Balkon in bester Lage."
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="long">Full Description</Label>
                  <Textarea
                    id="long"
                    rows={6}
                    defaultValue="Diese wunderschöne 3-Zimmer Wohnung besticht durch ihren klassischen Altbaucharme mit hohen Decken, originalen Stuckelementen und gepflegten Dielenböden. Die großzügige Wohnfläche von 85 m² verteilt sich optimal auf Wohnzimmer, Schlafzimmer, Arbeitszimmer sowie eine moderne Einbauküche."
                    className="mt-1"
                  />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="price">Price</Label>
                    <Input id="price" defaultValue="€485,000" className="mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="area">Living Area</Label>
                    <Input id="area" defaultValue="85 m²" className="mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="rooms">Rooms</Label>
                    <Input id="rooms" defaultValue="3" className="mt-1" />
                  </div>
                </div>
              </div>
            </div>

            {/* Export Packages */}
            <div className="workspace-card">
              <h3 className="font-semibold mb-4">Export Packages</h3>
              <div className="space-y-3">
                {exportPackages.map((pkg) => (
                  <div key={pkg.id} className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                    <div>
                      <p className="font-medium">{pkg.name}</p>
                      <p className="text-xs text-muted-foreground">Created {pkg.created}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="status-badge status-ready">Ready</span>
                      <Button variant="ghost" size="sm">
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Validation Report */}
            <div className="workspace-card">
              <h3 className="font-semibold mb-4">Validation Report</h3>
              <div className="space-y-3">
                {validationWarnings.map((warning, i) => (
                  <div key={i} className="p-3 rounded-lg bg-warning/10 border border-warning/20">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="h-4 w-4 text-warning mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">{warning.field}</p>
                        <p className="text-xs text-muted-foreground">{warning.message}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Connectors */}
            <div className="workspace-card">
              <h3 className="font-semibold mb-4">Portal Connectors</h3>
              <div className="space-y-3">
                {connectors.map((connector) => (
                  <div key={connector.id} className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{connector.logo}</span>
                      <div>
                        <p className="font-medium">{connector.name}</p>
                        <p className={cn(
                          'text-xs',
                          connector.status === 'connected' ? 'text-success' : 'text-muted-foreground'
                        )}>
                          {connector.status === 'connected' ? '● Connected' : '○ Not connected'}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {connector.status === 'connected' ? (
                        <Button size="sm" onClick={() => handlePublish(connector.id)}>
                          <Play className="h-4 w-4 mr-1" />
                          Publish
                        </Button>
                      ) : (
                        <Button size="sm" variant="outline" onClick={() => handleConnect(connector.id)}>
                          <Link2 className="h-4 w-4 mr-1" />
                          Connect
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Integration Stub Dialog */}
      <Dialog open={integrationDialogOpen} onOpenChange={setIntegrationDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Connect to {connectors.find(c => c.id === selectedConnector)?.name}</DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <p className="text-sm text-muted-foreground">
              This is a stub integration. In production, you would authenticate with the portal's API here.
            </p>
            <div className="p-4 rounded-lg bg-secondary/50">
              <p className="text-sm font-medium mb-2">Connection would require:</p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• API credentials or OAuth authorization</li>
                <li>• Field mapping configuration</li>
                <li>• Media format preferences</li>
              </ul>
            </div>
          </div>
          <Button onClick={() => {
            setIntegrationDialogOpen(false);
            toast({
              title: 'Integration stub',
              description: 'This connection is simulated. Audit entry logged.',
            });
          }} className="w-full">
            Simulate Connection
          </Button>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}
