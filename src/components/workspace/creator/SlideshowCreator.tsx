import { useState } from 'react';
import { Play, Pause, Music, Clock, Shuffle, ChevronLeft, ChevronRight, Download, Sparkles, Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface SlideshowCreatorProps {
  images: string[];
  onExport?: (config: SlideshowConfig) => void;
}

interface SlideshowConfig {
  images: string[];
  duration: number;
  transition: string;
  music: string | null;
  format: string;
}

const transitions = [
  { id: 'fade', name: 'Überblenden', icon: '✨' },
  { id: 'slide', name: 'Schieben', icon: '➡️' },
  { id: 'zoom', name: 'Zoom', icon: '🔍' },
  { id: 'kenburns', name: 'Ken Burns', icon: '🎬' },
];

const musicTracks = [
  { id: 'ambient', name: 'Ambient Piano', duration: '2:30', mood: 'ruhig' },
  { id: 'upbeat', name: 'Modern Upbeat', duration: '2:15', mood: 'energisch' },
  { id: 'cinematic', name: 'Cinematic Strings', duration: '3:00', mood: 'elegant' },
  { id: 'acoustic', name: 'Acoustic Warmth', duration: '2:45', mood: 'gemütlich' },
];

const formats = [
  { id: 'reel', name: 'Instagram Reel', ratio: '9:16', duration: '15-90s' },
  { id: 'story', name: 'Instagram Story', ratio: '9:16', duration: '15s' },
  { id: 'tiktok', name: 'TikTok', ratio: '9:16', duration: '15-60s' },
  { id: 'youtube', name: 'YouTube Short', ratio: '9:16', duration: '60s' },
  { id: 'landscape', name: 'YouTube Video', ratio: '16:9', duration: 'unbegrenzt' },
];

export function SlideshowCreator({ images, onExport }: SlideshowCreatorProps) {
  const { toast } = useToast();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedTransition, setSelectedTransition] = useState(transitions[0]);
  const [selectedMusic, setSelectedMusic] = useState<typeof musicTracks[0] | null>(musicTracks[2]);
  const [selectedFormat, setSelectedFormat] = useState(formats[0]);
  const [slideDuration, setSlideDuration] = useState(3);
  const [selectedImages, setSelectedImages] = useState<string[]>(images.slice(0, 6));

  const togglePlayback = () => {
    setIsPlaying(!isPlaying);
    if (!isPlaying) {
      // Simulate slideshow playback
      const interval = setInterval(() => {
        setCurrentSlide(prev => {
          if (prev >= selectedImages.length - 1) {
            setIsPlaying(false);
            clearInterval(interval);
            return 0;
          }
          return prev + 1;
        });
      }, slideDuration * 1000);
    }
  };

  const handleExport = () => {
    toast({
      title: 'Video wird erstellt',
      description: `${selectedFormat.name} mit ${selectedImages.length} Bildern wird generiert...`,
    });
    
    onExport?.({
      images: selectedImages,
      duration: slideDuration,
      transition: selectedTransition.id,
      music: selectedMusic?.id || null,
      format: selectedFormat.id,
    });

    setTimeout(() => {
      toast({
        title: 'Video fertig!',
        description: 'Ihr Slideshow-Video ist bereit zum Download.',
      });
    }, 3000);
  };

  const shuffleImages = () => {
    setSelectedImages([...selectedImages].sort(() => Math.random() - 0.5));
    toast({ title: 'Reihenfolge gemischt' });
  };

  return (
    <div className="space-y-4">
      {/* Preview Area */}
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2">
          {/* Main Preview */}
          <div 
            className={cn(
              "relative rounded-xl overflow-hidden bg-slate-900 flex items-center justify-center",
              selectedFormat.ratio === '9:16' ? "aspect-[9/16] max-h-[400px]" : "aspect-video"
            )}
          >
            {selectedImages[currentSlide] && (
              <img
                src={selectedImages[currentSlide]}
                alt={`Slide ${currentSlide + 1}`}
                className={cn(
                  "w-full h-full object-cover transition-all duration-500",
                  selectedTransition.id === 'zoom' && "scale-105",
                  selectedTransition.id === 'kenburns' && "scale-110"
                )}
              />
            )}
            
            {/* Playback Controls Overlay */}
            <div className="absolute inset-0 flex items-center justify-center">
              <Button
                variant="secondary"
                size="lg"
                className="rounded-full w-16 h-16 bg-white/20 backdrop-blur-sm hover:bg-white/30"
                onClick={togglePlayback}
              >
                {isPlaying ? (
                  <Pause className="h-8 w-8 text-white" />
                ) : (
                  <Play className="h-8 w-8 text-white ml-1" />
                )}
              </Button>
            </div>

            {/* Progress Bar */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
              <div 
                className="h-full bg-white transition-all duration-300"
                style={{ width: `${((currentSlide + 1) / selectedImages.length) * 100}%` }}
              />
            </div>

            {/* Slide Counter */}
            <div className="absolute top-3 right-3 bg-black/60 text-white px-2 py-1 rounded-full text-xs">
              {currentSlide + 1} / {selectedImages.length}
            </div>

            {/* Format Badge */}
            <div className="absolute top-3 left-3">
              <Badge className="bg-black/60 text-white border-0">
                {selectedFormat.name}
              </Badge>
            </div>

            {/* Music Indicator */}
            {selectedMusic && (
              <div className="absolute bottom-4 left-3 flex items-center gap-2 bg-black/60 text-white px-2 py-1 rounded-full text-xs">
                <Music className="h-3 w-3" />
                {selectedMusic.name}
              </div>
            )}
          </div>

          {/* Slide Navigation */}
          <div className="flex items-center justify-center gap-2 mt-3">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentSlide(Math.max(0, currentSlide - 1))}
              disabled={currentSlide === 0}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="flex gap-1">
              {selectedImages.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  className={cn(
                    "w-2 h-2 rounded-full transition-all",
                    idx === currentSlide ? "bg-accent w-4" : "bg-muted hover:bg-muted-foreground/50"
                  )}
                />
              ))}
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentSlide(Math.min(selectedImages.length - 1, currentSlide + 1))}
              disabled={currentSlide === selectedImages.length - 1}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Settings Panel */}
        <div className="space-y-4">
          {/* Format Selection */}
          <div>
            <p className="text-sm font-medium mb-2">Format</p>
            <div className="space-y-1">
              {formats.slice(0, 4).map((format) => (
                <Button
                  key={format.id}
                  variant={selectedFormat.id === format.id ? "default" : "ghost"}
                  size="sm"
                  className="w-full justify-start text-xs h-auto py-1.5"
                  onClick={() => setSelectedFormat(format)}
                >
                  <span>{format.name}</span>
                  <Badge variant="outline" className="ml-auto text-[10px]">{format.ratio}</Badge>
                </Button>
              ))}
            </div>
          </div>

          {/* Transition Style */}
          <div>
            <p className="text-sm font-medium mb-2">Übergang</p>
            <div className="grid grid-cols-2 gap-1">
              {transitions.map((transition) => (
                <Button
                  key={transition.id}
                  variant={selectedTransition.id === transition.id ? "default" : "outline"}
                  size="sm"
                  className="text-xs"
                  onClick={() => setSelectedTransition(transition)}
                >
                  <span className="mr-1">{transition.icon}</span>
                  {transition.name}
                </Button>
              ))}
            </div>
          </div>

          {/* Slide Duration */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Dauer pro Bild
              </p>
              <span className="text-xs text-muted-foreground">{slideDuration}s</span>
            </div>
            <Slider
              value={[slideDuration]}
              onValueChange={([v]) => setSlideDuration(v)}
              min={1}
              max={8}
              step={0.5}
              className="w-full"
            />
          </div>

          {/* Music Selection */}
          <div>
            <p className="text-sm font-medium mb-2 flex items-center gap-2">
              <Volume2 className="h-4 w-4" />
              Hintergrundmusik
            </p>
            <div className="space-y-1 max-h-32 overflow-y-auto">
              <Button
                variant={selectedMusic === null ? "default" : "ghost"}
                size="sm"
                className="w-full justify-start text-xs"
                onClick={() => setSelectedMusic(null)}
              >
                Keine Musik
              </Button>
              {musicTracks.map((track) => (
                <Button
                  key={track.id}
                  variant={selectedMusic?.id === track.id ? "default" : "ghost"}
                  size="sm"
                  className="w-full justify-start text-xs h-auto py-1.5"
                  onClick={() => setSelectedMusic(track)}
                >
                  <Music className="h-3 w-3 mr-2" />
                  <span className="flex-1 text-left">{track.name}</span>
                  <span className="text-muted-foreground">{track.duration}</span>
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Image Selection Strip */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-medium">Bilder auswählen ({selectedImages.length})</p>
          <Button variant="ghost" size="sm" onClick={shuffleImages} className="gap-1 text-xs">
            <Shuffle className="h-3 w-3" />
            Mischen
          </Button>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {images.map((img, idx) => (
            <div
              key={idx}
              onClick={() => {
                if (selectedImages.includes(img)) {
                  setSelectedImages(selectedImages.filter(i => i !== img));
                } else {
                  setSelectedImages([...selectedImages, img]);
                }
              }}
              className={cn(
                "relative flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden cursor-pointer transition-all",
                selectedImages.includes(img) 
                  ? "ring-2 ring-accent" 
                  : "opacity-50 hover:opacity-80"
              )}
            >
              <img src={img} alt="" className="w-full h-full object-cover" />
              {selectedImages.includes(img) && (
                <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-accent flex items-center justify-center text-[10px] text-white font-bold">
                  {selectedImages.indexOf(img) + 1}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Export Button */}
      <div className="flex items-center justify-between pt-3 border-t">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Sparkles className="h-4 w-4 text-accent" />
          <span>Geschätzte Länge: {(selectedImages.length * slideDuration).toFixed(0)}s</span>
        </div>
        <Button onClick={handleExport} className="gap-2">
          <Download className="h-4 w-4" />
          Video generieren
        </Button>
      </div>
    </div>
  );
}
