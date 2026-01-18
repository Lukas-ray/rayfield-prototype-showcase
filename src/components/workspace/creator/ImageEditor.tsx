import { useState } from 'react';
import { Crop, SunMedium, Contrast, Droplets, RotateCcw, Check, Download, Maximize } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface ImageEditorProps {
  imageSrc: string;
  onSave?: (editedImageUrl: string) => void;
}

interface AspectRatio {
  name: string;
  platform: string;
  ratio: string;
  width: number;
  height: number;
}

const aspectRatios: AspectRatio[] = [
  { name: 'Original', platform: '', ratio: 'auto', width: 0, height: 0 },
  { name: '1:1', platform: 'Instagram Feed', ratio: '1/1', width: 1, height: 1 },
  { name: '4:5', platform: 'Instagram Portrait', ratio: '4/5', width: 4, height: 5 },
  { name: '9:16', platform: 'Story / Reel', ratio: '9/16', width: 9, height: 16 },
  { name: '16:9', platform: 'YouTube', ratio: '16/9', width: 16, height: 9 },
  { name: '4:3', platform: 'ImmoScout24', ratio: '4/3', width: 4, height: 3 },
  { name: '1.91:1', platform: 'Facebook/LinkedIn', ratio: '1.91/1', width: 1.91, height: 1 },
];

export function ImageEditor({ imageSrc, onSave }: ImageEditorProps) {
  const { toast } = useToast();
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [saturation, setSaturation] = useState(100);
  const [selectedRatio, setSelectedRatio] = useState<AspectRatio>(aspectRatios[0]);
  const [showWatermark, setShowWatermark] = useState(true);

  const resetFilters = () => {
    setBrightness(100);
    setContrast(100);
    setSaturation(100);
    setSelectedRatio(aspectRatios[0]);
  };

  const handleSave = () => {
    toast({
      title: 'Bild gespeichert',
      description: `Format: ${selectedRatio.name} | Filter angewendet`,
    });
    onSave?.(imageSrc);
  };

  const handleExport = () => {
    toast({
      title: 'Export gestartet',
      description: `Bild wird als ${selectedRatio.platform || 'Original'}-Format exportiert.`,
    });
  };

  const filterStyle = {
    filter: `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%)`,
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-4">
        {/* Image Preview */}
        <div className="col-span-2">
          <div className="relative rounded-xl overflow-hidden bg-slate-900 flex items-center justify-center min-h-[300px]">
            <div
              className={cn(
                "relative overflow-hidden",
                selectedRatio.ratio !== 'auto' && `aspect-[${selectedRatio.ratio}]`
              )}
              style={{
                aspectRatio: selectedRatio.ratio === 'auto' ? undefined : selectedRatio.ratio,
                maxWidth: '100%',
                maxHeight: '300px',
              }}
            >
              <img
                src={imageSrc}
                alt="Bearbeitung"
                className="w-full h-full object-cover"
                style={filterStyle}
              />
              
              {/* Watermark Preview */}
              {showWatermark && (
                <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-semibold text-slate-800">
                  IMMOSMART
                </div>
              )}
              
              {/* Crop Overlay */}
              {selectedRatio.ratio !== 'auto' && (
                <div className="absolute inset-0 border-2 border-dashed border-white/50 pointer-events-none" />
              )}
            </div>
            
            {/* Format Badge */}
            <div className="absolute top-3 left-3">
              <Badge className="bg-black/60 text-white border-0">
                {selectedRatio.name}
              </Badge>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="space-y-4">
          {/* Aspect Ratio Selection */}
          <div>
            <p className="text-sm font-medium mb-2 flex items-center gap-2">
              <Crop className="h-4 w-4" />
              Format
            </p>
            <div className="grid grid-cols-2 gap-1">
              {aspectRatios.map((ratio) => (
                <Button
                  key={ratio.name}
                  variant={selectedRatio.name === ratio.name ? "default" : "outline"}
                  size="sm"
                  className="text-xs h-auto py-1.5 px-2"
                  onClick={() => setSelectedRatio(ratio)}
                >
                  <span className="truncate">{ratio.name}</span>
                </Button>
              ))}
            </div>
            {selectedRatio.platform && (
              <p className="text-xs text-muted-foreground mt-1">
                Optimiert für: {selectedRatio.platform}
              </p>
            )}
          </div>

          {/* Brightness */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium flex items-center gap-2">
                <SunMedium className="h-4 w-4" />
                Helligkeit
              </p>
              <span className="text-xs text-muted-foreground">{brightness}%</span>
            </div>
            <Slider
              value={[brightness]}
              onValueChange={([v]) => setBrightness(v)}
              min={50}
              max={150}
              step={1}
              className="w-full"
            />
          </div>

          {/* Contrast */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium flex items-center gap-2">
                <Contrast className="h-4 w-4" />
                Kontrast
              </p>
              <span className="text-xs text-muted-foreground">{contrast}%</span>
            </div>
            <Slider
              value={[contrast]}
              onValueChange={([v]) => setContrast(v)}
              min={50}
              max={150}
              step={1}
              className="w-full"
            />
          </div>

          {/* Saturation */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium flex items-center gap-2">
                <Droplets className="h-4 w-4" />
                Sättigung
              </p>
              <span className="text-xs text-muted-foreground">{saturation}%</span>
            </div>
            <Slider
              value={[saturation]}
              onValueChange={([v]) => setSaturation(v)}
              min={0}
              max={200}
              step={1}
              className="w-full"
            />
          </div>

          {/* Watermark Toggle */}
          <div className="flex items-center justify-between py-2 border-t">
            <span className="text-sm">Wasserzeichen</span>
            <Button
              variant={showWatermark ? "default" : "outline"}
              size="sm"
              onClick={() => setShowWatermark(!showWatermark)}
            >
              {showWatermark ? 'An' : 'Aus'}
            </Button>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between pt-2 border-t">
        <Button variant="ghost" size="sm" onClick={resetFilters} className="gap-2">
          <RotateCcw className="h-4 w-4" />
          Zurücksetzen
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleExport} className="gap-2">
            <Download className="h-4 w-4" />
            Exportieren
          </Button>
          <Button size="sm" onClick={handleSave} className="gap-2">
            <Check className="h-4 w-4" />
            Übernehmen
          </Button>
        </div>
      </div>
    </div>
  );
}
