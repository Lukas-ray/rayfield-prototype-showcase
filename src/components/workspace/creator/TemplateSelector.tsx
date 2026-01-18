import { useState } from 'react';
import { Check, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

export interface Template {
  id: string;
  name: string;
  platform: string;
  aspectRatio: string;
  preview: string;
  category: 'minimal' | 'modern' | 'elegant' | 'bold';
}

const templates: Template[] = [
  { id: 't1', name: 'Minimal Clean', platform: 'Instagram', aspectRatio: '1:1', preview: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', category: 'minimal' },
  { id: 't2', name: 'Modern Gradient', platform: 'Instagram', aspectRatio: '1:1', preview: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', category: 'modern' },
  { id: 't3', name: 'Elegant Gold', platform: 'Instagram', aspectRatio: '1:1', preview: 'linear-gradient(135deg, #c9b037 0%, #dccc4e 50%, #c9b037 100%)', category: 'elegant' },
  { id: 't4', name: 'Bold Statement', platform: 'Instagram', aspectRatio: '1:1', preview: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)', category: 'bold' },
  { id: 't5', name: 'Story Highlight', platform: 'Instagram', aspectRatio: '9:16', preview: 'linear-gradient(180deg, #0f0c29 0%, #302b63 50%, #24243e 100%)', category: 'modern' },
  { id: 't6', name: 'Reel Dynamic', platform: 'Instagram', aspectRatio: '9:16', preview: 'linear-gradient(135deg, #ff6b6b 0%, #feca57 100%)', category: 'bold' },
  { id: 't7', name: 'Facebook Post', platform: 'Facebook', aspectRatio: '1.91:1', preview: 'linear-gradient(135deg, #4267B2 0%, #898F9C 100%)', category: 'minimal' },
  { id: 't8', name: 'LinkedIn Pro', platform: 'LinkedIn', aspectRatio: '1.91:1', preview: 'linear-gradient(135deg, #0077b5 0%, #00a0dc 100%)', category: 'elegant' },
  { id: 't9', name: 'YouTube Thumbnail', platform: 'YouTube', aspectRatio: '16:9', preview: 'linear-gradient(135deg, #ff0000 0%, #cc0000 100%)', category: 'bold' },
];

interface TemplateSelectorProps {
  selectedTemplate: Template | null;
  onSelect: (template: Template) => void;
  platformFilter?: string;
}

export function TemplateSelector({ selectedTemplate, onSelect, platformFilter }: TemplateSelectorProps) {
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  
  const categories = ['minimal', 'modern', 'elegant', 'bold'];
  
  const filteredTemplates = templates.filter(t => {
    if (platformFilter && t.platform !== platformFilter) return false;
    if (categoryFilter && t.category !== categoryFilter) return false;
    return true;
  });

  return (
    <div className="space-y-4">
      {/* Category Filter */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">Stil:</span>
        <div className="flex gap-1">
          <Badge 
            variant={categoryFilter === null ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => setCategoryFilter(null)}
          >
            Alle
          </Badge>
          {categories.map(cat => (
            <Badge
              key={cat}
              variant={categoryFilter === cat ? "default" : "outline"}
              className="cursor-pointer capitalize"
              onClick={() => setCategoryFilter(cat)}
            >
              {cat === 'minimal' ? 'Minimal' : cat === 'modern' ? 'Modern' : cat === 'elegant' ? 'Elegant' : 'Bold'}
            </Badge>
          ))}
        </div>
      </div>

      {/* Template Grid */}
      <div className="grid grid-cols-3 gap-3">
        {filteredTemplates.map(template => (
          <div
            key={template.id}
            onClick={() => onSelect(template)}
            className={cn(
              "relative rounded-xl overflow-hidden cursor-pointer transition-all hover:scale-[1.02]",
              selectedTemplate?.id === template.id 
                ? "ring-2 ring-accent ring-offset-2" 
                : "ring-1 ring-border hover:ring-accent/50"
            )}
          >
            {/* Preview */}
            <div 
              className={cn(
                "w-full flex items-center justify-center text-white relative",
                template.aspectRatio === '1:1' && "aspect-square",
                template.aspectRatio === '9:16' && "aspect-[9/16] max-h-40",
                template.aspectRatio === '16:9' && "aspect-video",
                template.aspectRatio === '1.91:1' && "aspect-[1.91/1]"
              )}
              style={{ background: template.preview }}
            >
              {/* Template Overlay */}
              <div className="absolute inset-0 flex flex-col items-center justify-center p-2 text-center">
                <div className="w-12 h-12 rounded-lg bg-white/20 backdrop-blur-sm mb-2" />
                <div className="w-16 h-2 rounded bg-white/40 mb-1" />
                <div className="w-12 h-2 rounded bg-white/30" />
              </div>
              
              {/* Selected Indicator */}
              {selectedTemplate?.id === template.id && (
                <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-accent flex items-center justify-center">
                  <Check className="h-4 w-4 text-accent-foreground" />
                </div>
              )}
              
              {/* Platform Badge */}
              <div className="absolute bottom-2 left-2">
                <Badge variant="secondary" className="text-xs bg-black/50 text-white border-0">
                  {template.aspectRatio}
                </Badge>
              </div>
            </div>
            
            {/* Info */}
            <div className="p-2 bg-background border-t">
              <p className="text-xs font-medium truncate">{template.name}</p>
              <p className="text-xs text-muted-foreground">{template.platform}</p>
            </div>
          </div>
        ))}
      </div>
      
      {/* AI Suggestion */}
      <div className="flex items-center gap-2 p-3 rounded-lg bg-accent/5 border border-accent/20">
        <Sparkles className="h-4 w-4 text-accent" />
        <span className="text-sm text-accent">KI-Empfehlung: "Elegant Gold" passt am besten zu dieser Luxus-Immobilie</span>
      </div>
    </div>
  );
}

export { templates };
