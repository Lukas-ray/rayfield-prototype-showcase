import { ArrowRight, Calendar, MapPin } from 'lucide-react';
import { Property, getWorkflowStateLabel, getWorkflowStateClass } from '@/data/dummyData';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface PropertyCardProps {
  property: Property;
  onClick: () => void;
}

export function PropertyCard({ property, onClick }: PropertyCardProps) {
  return (
    <div className="workspace-card group cursor-pointer" onClick={onClick}>
      <div className="flex gap-4">
        {/* Thumbnail */}
        <div className="relative w-32 h-24 rounded-md overflow-hidden flex-shrink-0">
          <img
            src={property.thumbnail}
            alt={property.address}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                {property.address}
              </h3>
              <div className="flex items-center gap-1 text-sm text-muted-foreground mt-0.5">
                <MapPin className="h-3.5 w-3.5" />
                {property.city}
              </div>
            </div>
            <span className={cn('status-badge', getWorkflowStateClass(property.workflowState))}>
              {getWorkflowStateLabel(property.workflowState)}
            </span>
          </div>

          <div className="mt-3 flex items-center gap-6 text-sm text-muted-foreground">
            <span>{property.propertyType}</span>
            <span>{property.rooms} Zimmer</span>
            <span>{property.area} m²</span>
            <span className="font-medium text-foreground">
              {property.price.toLocaleString('de-DE')} €
            </span>
          </div>

          <div className="mt-3 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Progress value={property.completionPercent} className="w-20 h-1.5" />
                <span className="text-xs text-muted-foreground">{property.completionPercent}%</span>
              </div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Calendar className="h-3 w-3" />
                {property.lastActivity}
              </div>
            </div>
            <Button variant="ghost" size="sm" className="gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              Öffnen <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Next Action */}
      <div className="mt-3 pt-3 border-t">
        <p className="text-sm">
          <span className="text-muted-foreground">Nächster Schritt: </span>
          <span className="font-medium text-accent">{property.nextAction}</span>
        </p>
      </div>
    </div>
  );
}
