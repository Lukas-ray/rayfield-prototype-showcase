import { ArrowRight, Calendar, MapPin, Home, Bed, Maximize } from 'lucide-react';
import { Property, getWorkflowStateLabel, getWorkflowStateClass } from '@/data/dummyData';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

interface PropertyCardProps {
  property: Property;
  onClick: () => void;
}

export function PropertyCard({ property, onClick }: PropertyCardProps) {
  const isUrgent = property.workflowState === 'docs_missing';
  const isActive = property.workflowState === 'inquiries_active';

  return (
    <div 
      className={cn(
        "workspace-card group cursor-pointer transition-all duration-200",
        isUrgent && "ring-2 ring-warning/30",
        isActive && "ring-2 ring-accent/30"
      )} 
      onClick={onClick}
    >
      <div className="flex gap-4">
        {/* Thumbnail */}
        <div className="relative w-36 h-28 rounded-lg overflow-hidden flex-shrink-0">
          <img
            src={property.thumbnail}
            alt={property.address}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {/* Price overlay */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
            <span className="text-white font-semibold text-sm">
              {property.price.toLocaleString('de-DE')} €
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="font-semibold text-foreground group-hover:text-accent transition-colors">
                {property.address}
              </h3>
              <div className="flex items-center gap-1 text-sm text-muted-foreground mt-0.5">
                <MapPin className="h-3.5 w-3.5 text-accent" />
                {property.city}
              </div>
            </div>
            <span className={cn('status-badge', getWorkflowStateClass(property.workflowState))}>
              {getWorkflowStateLabel(property.workflowState)}
            </span>
          </div>

          {/* Property details with icons */}
          <div className="mt-3 flex items-center gap-4 text-sm text-muted-foreground">
            <Badge variant="secondary" className="gap-1 font-normal">
              <Home className="h-3 w-3" />
              {property.propertyType}
            </Badge>
            <Badge variant="secondary" className="gap-1 font-normal">
              <Bed className="h-3 w-3" />
              {property.rooms} Zimmer
            </Badge>
            <Badge variant="secondary" className="gap-1 font-normal">
              <Maximize className="h-3 w-3" />
              {property.area} m²
            </Badge>
          </div>

          <div className="mt-3 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Progress 
                  value={property.completionPercent} 
                  className={cn(
                    "w-24 h-2",
                    property.completionPercent === 100 && "[&>div]:bg-success"
                  )} 
                />
                <span className={cn(
                  "text-xs font-medium",
                  property.completionPercent === 100 ? "text-success" : "text-muted-foreground"
                )}>
                  {property.completionPercent}%
                </span>
              </div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Calendar className="h-3 w-3" />
                {property.lastActivity}
              </div>
            </div>
            <Button 
              variant="default" 
              size="sm" 
              className="gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-accent hover:bg-accent/90"
            >
              Öffnen <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Next Action */}
      <div className={cn(
        "mt-3 pt-3 border-t flex items-center gap-2",
        isUrgent && "border-warning/30"
      )}>
        <span className={cn(
          "inline-flex h-2 w-2 rounded-full",
          isUrgent ? "bg-warning animate-pulse" : "bg-accent"
        )} />
        <p className="text-sm">
          <span className="text-muted-foreground">Nächster Schritt: </span>
          <span className="font-medium text-foreground">{property.nextAction}</span>
        </p>
      </div>
    </div>
  );
}
