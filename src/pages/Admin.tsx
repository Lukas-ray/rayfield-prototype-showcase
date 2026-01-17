import { useState } from 'react';
import { Plus, Check, X, Users, FileText, Settings, Shield } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { checklistTemplates, exportPresets, roles } from '@/data/dummyData';
import { cn } from '@/lib/utils';

export default function Admin() {
  const [templates, setTemplates] = useState(checklistTemplates);
  const [presets, setPresets] = useState(exportPresets);

  const toggleTemplate = (id: string) => {
    setTemplates(prev => prev.map(t => t.id === id ? { ...t, active: !t.active } : t));
  };

  const togglePreset = (id: string) => {
    setPresets(prev => prev.map(p => p.id === id ? { ...p, active: !p.active } : p));
  };

  return (
    <AppLayout>
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Admin</h1>
          <p className="text-muted-foreground">System configuration and settings</p>
        </div>

        <div className="grid grid-cols-2 gap-6">
          {/* Checklist Templates */}
          <div className="workspace-card">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-muted-foreground" />
                <h3 className="font-semibold">Checklist Templates</h3>
              </div>
              <Button size="sm" variant="outline">
                <Plus className="h-4 w-4 mr-1" />
                Add
              </Button>
            </div>
            <div className="space-y-3">
              {templates.map((template) => (
                <div key={template.id} className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                  <div>
                    <p className="font-medium">{template.name}</p>
                    <p className="text-xs text-muted-foreground">{template.items} items</p>
                  </div>
                  <Switch
                    checked={template.active}
                    onCheckedChange={() => toggleTemplate(template.id)}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Naming Conventions */}
          <div className="workspace-card">
            <div className="flex items-center gap-2 mb-4">
              <Settings className="h-5 w-5 text-muted-foreground" />
              <h3 className="font-semibold">Naming Conventions</h3>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-muted-foreground">Document Pattern</label>
                <Input
                  defaultValue="{DocType}_{Address}_{Year}.pdf"
                  className="mt-1 font-mono text-sm"
                />
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Media Pattern</label>
                <Input
                  defaultValue="{PropertyID}_{Room}_{Variant}_{Seq}.jpg"
                  className="mt-1 font-mono text-sm"
                />
              </div>
              <div className="p-3 rounded-lg bg-secondary/50">
                <p className="text-xs text-muted-foreground mb-1">Preview:</p>
                <p className="text-sm font-mono">Grundbuchauszug_Muellerstr42_2024.pdf</p>
              </div>
            </div>
          </div>

          {/* Export Presets */}
          <div className="workspace-card">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-muted-foreground" />
                <h3 className="font-semibold">Export Presets</h3>
              </div>
              <Button size="sm" variant="outline">
                <Plus className="h-4 w-4 mr-1" />
                Add
              </Button>
            </div>
            <div className="space-y-3">
              {presets.map((preset) => (
                <div key={preset.id} className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                  <div>
                    <p className="font-medium">{preset.name}</p>
                    <p className="text-xs text-muted-foreground">{preset.fields} fields mapped</p>
                  </div>
                  <Switch
                    checked={preset.active}
                    onCheckedChange={() => togglePreset(preset.id)}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Roles & Permissions */}
          <div className="workspace-card">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-muted-foreground" />
                <h3 className="font-semibold">Roles & Permissions</h3>
              </div>
              <Button size="sm" variant="outline">
                <Plus className="h-4 w-4 mr-1" />
                Add Role
              </Button>
            </div>
            <div className="space-y-3">
              {roles.map((role) => (
                <div key={role.id} className="p-3 rounded-lg bg-secondary/50">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <p className="font-medium">{role.name}</p>
                    </div>
                    <span className="text-xs text-muted-foreground">{role.users} users</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {role.permissions.map((perm) => (
                      <span key={perm} className="evidence-badge text-xs">{perm}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
