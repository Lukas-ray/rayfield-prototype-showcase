import { useState } from 'react';
import { 
  MapPin, Train, ShoppingCart, Trees, School, Hospital, 
  Pill, Coffee, Dumbbell, Church, Building2, Bus, Car,
  Plus, X, Check, ChevronDown, Clock, Footprints
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';

interface POI {
  id: string;
  type: string;
  name: string;
  distance: number; // in minutes
  transportMode: 'walk' | 'car' | 'transit';
}

interface LocationMapSectionProps {
  address: string;
  city: string;
  editable?: boolean;
}

const poiTypes = [
  { id: 'subway', label: 'U-Bahn', icon: Train, color: 'text-blue-500 bg-blue-500/10' },
  { id: 'bus', label: 'Bus', icon: Bus, color: 'text-green-500 bg-green-500/10' },
  { id: 'supermarket', label: 'Supermarkt', icon: ShoppingCart, color: 'text-orange-500 bg-orange-500/10' },
  { id: 'pharmacy', label: 'Apotheke', icon: Pill, color: 'text-red-500 bg-red-500/10' },
  { id: 'hospital', label: 'Krankenhaus', icon: Hospital, color: 'text-red-600 bg-red-600/10' },
  { id: 'school', label: 'Schule', icon: School, color: 'text-purple-500 bg-purple-500/10' },
  { id: 'kindergarten', label: 'Kindergarten', icon: Building2, color: 'text-pink-500 bg-pink-500/10' },
  { id: 'park', label: 'Park', icon: Trees, color: 'text-green-600 bg-green-600/10' },
  { id: 'gym', label: 'Fitnessstudio', icon: Dumbbell, color: 'text-amber-500 bg-amber-500/10' },
  { id: 'cafe', label: 'Café', icon: Coffee, color: 'text-brown-500 bg-amber-700/10' },
  { id: 'church', label: 'Kirche', icon: Church, color: 'text-gray-600 bg-gray-600/10' },
  { id: 'parking', label: 'Parkhaus', icon: Car, color: 'text-slate-500 bg-slate-500/10' },
];

const transportModes = [
  { id: 'walk', label: 'Zu Fuß', icon: Footprints },
  { id: 'car', label: 'Auto', icon: Car },
  { id: 'transit', label: 'ÖPNV', icon: Train },
];

const initialPOIs: POI[] = [
  { id: '1', type: 'subway', name: 'U-Bahn Odeonsplatz', distance: 5, transportMode: 'walk' },
  { id: '2', type: 'supermarket', name: 'REWE', distance: 3, transportMode: 'walk' },
  { id: '3', type: 'pharmacy', name: 'Stadt-Apotheke', distance: 4, transportMode: 'walk' },
  { id: '4', type: 'park', name: 'Hofgarten', distance: 8, transportMode: 'walk' },
  { id: '5', type: 'school', name: 'Grundschule am Dom', distance: 10, transportMode: 'walk' },
  { id: '6', type: 'cafe', name: 'Café Luitpold', distance: 2, transportMode: 'walk' },
];

export function LocationMapSection({ address, city, editable = false }: LocationMapSectionProps) {
  const [pois, setPois] = useState<POI[]>(initialPOIs);
  const [isAddingPOI, setIsAddingPOI] = useState(false);
  const [newPOI, setNewPOI] = useState<Partial<POI>>({ 
    type: 'supermarket', 
    name: '', 
    distance: 5, 
    transportMode: 'walk' 
  });
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const getPoiType = (typeId: string) => poiTypes.find(t => t.id === typeId);
  const getTransportMode = (modeId: string) => transportModes.find(m => m.id === modeId);

  const handleAddPOI = () => {
    if (!newPOI.name || !newPOI.type) return;
    
    const poi: POI = {
      id: Date.now().toString(),
      type: newPOI.type!,
      name: newPOI.name!,
      distance: newPOI.distance || 5,
      transportMode: newPOI.transportMode as 'walk' | 'car' | 'transit' || 'walk',
    };
    
    setPois(prev => [...prev, poi]);
    setNewPOI({ type: 'supermarket', name: '', distance: 5, transportMode: 'walk' });
    setIsAddingPOI(false);
  };

  const handleRemovePOI = (id: string) => {
    setPois(prev => prev.filter(p => p.id !== id));
  };

  // Group POIs by type
  const groupedPOIs = pois.reduce((acc, poi) => {
    if (!acc[poi.type]) acc[poi.type] = [];
    acc[poi.type].push(poi);
    return acc;
  }, {} as Record<string, POI[]>);

  const filteredPOIs = selectedCategory 
    ? pois.filter(p => p.type === selectedCategory)
    : pois;

  // Encode address for Google Maps embed
  const encodedAddress = encodeURIComponent(`${address}, ${city}, Germany`);

  return (
    <div className="space-y-6">
      {/* Map */}
      <div className="aspect-video rounded-xl overflow-hidden relative bg-muted">
        <iframe
          src={`https://www.google.com/maps?q=${encodedAddress}&output=embed`}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Standort auf Karte"
        />
        <div className="absolute bottom-4 left-4 bg-background/90 backdrop-blur px-3 py-2 rounded-lg shadow-lg">
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="h-4 w-4 text-accent" />
            <span className="font-medium">{address}</span>
          </div>
          <p className="text-xs text-muted-foreground ml-6">{city}</p>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant={selectedCategory === null ? "default" : "outline"}
          size="sm"
          onClick={() => setSelectedCategory(null)}
        >
          Alle ({pois.length})
        </Button>
        {Object.entries(groupedPOIs).map(([typeId, typePois]) => {
          const poiType = getPoiType(typeId);
          if (!poiType) return null;
          const Icon = poiType.icon;
          return (
            <Button
              key={typeId}
              variant={selectedCategory === typeId ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(typeId)}
              className="gap-1"
            >
              <Icon className="h-3 w-3" />
              {poiType.label} ({typePois.length})
            </Button>
          );
        })}
      </div>

      {/* POI List */}
      <div className="grid grid-cols-2 gap-3">
        {filteredPOIs.map(poi => {
          const poiType = getPoiType(poi.type);
          const transport = getTransportMode(poi.transportMode);
          if (!poiType) return null;
          const Icon = poiType.icon;
          const TransportIcon = transport?.icon || Footprints;

          return (
            <div 
              key={poi.id}
              className="group flex items-center gap-3 p-3 rounded-xl bg-secondary/30 hover:bg-secondary/50 transition-colors"
            >
              <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", poiType.color)}>
                <Icon className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">{poi.name}</p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <TransportIcon className="h-3 w-3" />
                  <span>{poi.distance} Min</span>
                </div>
              </div>
              {editable && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="opacity-0 group-hover:opacity-100 h-8 w-8"
                  onClick={() => handleRemovePOI(poi.id)}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          );
        })}

        {/* Add POI Button */}
        {editable && (
          <Popover open={isAddingPOI} onOpenChange={setIsAddingPOI}>
            <PopoverTrigger asChild>
              <button className="flex items-center justify-center gap-2 p-3 rounded-xl border-2 border-dashed border-muted-foreground/30 text-muted-foreground hover:border-accent hover:text-accent transition-colors">
                <Plus className="h-5 w-5" />
                <span className="text-sm font-medium">POI hinzufügen</span>
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-80" align="start">
              <div className="space-y-4">
                <h4 className="font-medium">Neuen Ort hinzufügen</h4>
                
                <div className="space-y-2">
                  <label className="text-sm text-muted-foreground">Kategorie</label>
                  <Select
                    value={newPOI.type}
                    onValueChange={(value) => setNewPOI({ ...newPOI, type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {poiTypes.map(type => {
                        const Icon = type.icon;
                        return (
                          <SelectItem key={type.id} value={type.id}>
                            <div className="flex items-center gap-2">
                              <Icon className="h-4 w-4" />
                              {type.label}
                            </div>
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm text-muted-foreground">Name</label>
                  <Input
                    placeholder="z.B. REWE, U-Bahn Marienplatz..."
                    value={newPOI.name}
                    onChange={(e) => setNewPOI({ ...newPOI, name: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <label className="text-sm text-muted-foreground">Entfernung (Min)</label>
                    <Input
                      type="number"
                      min={1}
                      max={60}
                      value={newPOI.distance}
                      onChange={(e) => setNewPOI({ ...newPOI, distance: parseInt(e.target.value) || 5 })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm text-muted-foreground">Transportmittel</label>
                    <Select
                      value={newPOI.transportMode}
                      onValueChange={(value) => setNewPOI({ ...newPOI, transportMode: value as 'walk' | 'car' | 'transit' })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {transportModes.map(mode => {
                          const Icon = mode.icon;
                          return (
                            <SelectItem key={mode.id} value={mode.id}>
                              <div className="flex items-center gap-2">
                                <Icon className="h-4 w-4" />
                                {mode.label}
                              </div>
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <Button variant="outline" size="sm" onClick={() => setIsAddingPOI(false)}>
                    Abbrechen
                  </Button>
                  <Button size="sm" onClick={handleAddPOI} className="gap-1">
                    <Check className="h-4 w-4" />
                    Hinzufügen
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        )}
      </div>

      {/* Quick Stats */}
      <div className="flex flex-wrap gap-2">
        {pois.filter(p => p.distance <= 5).length > 0 && (
          <Badge variant="secondary" className="gap-1">
            <Clock className="h-3 w-3" />
            {pois.filter(p => p.distance <= 5).length} Orte in 5 Min erreichbar
          </Badge>
        )}
        {groupedPOIs['subway'] && (
          <Badge variant="secondary" className="gap-1 text-blue-600">
            <Train className="h-3 w-3" />
            {groupedPOIs['subway'][0].distance} Min zur U-Bahn
          </Badge>
        )}
        {groupedPOIs['supermarket'] && (
          <Badge variant="secondary" className="gap-1 text-orange-600">
            <ShoppingCart className="h-3 w-3" />
            {groupedPOIs['supermarket'][0].distance} Min zum Supermarkt
          </Badge>
        )}
      </div>
    </div>
  );
}
