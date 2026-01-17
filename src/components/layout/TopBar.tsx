import { Search, Bell, ChevronDown, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { properties } from '@/data/dummyData';

interface TopBarProps {
  currentProperty?: string;
  onPropertyChange?: (id: string) => void;
}

export function TopBar({ currentProperty, onPropertyChange }: TopBarProps) {
  const selectedProperty = properties.find(p => p.id === currentProperty);

  return (
    <header className="h-16 border-b bg-card flex items-center justify-between px-6">
      {/* Search */}
      <div className="relative w-80">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Objekte, Dokumente, Leads suchen..."
          className="pl-10 bg-secondary border-0"
        />
      </div>

      <div className="flex items-center gap-4">
        {/* Property Switcher */}
        {onPropertyChange && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Building2 className="h-4 w-4" />
                <span className="max-w-[200px] truncate">
                  {selectedProperty ? selectedProperty.address : 'Objekt auswählen'}
                </span>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64">
              {properties.map((property) => (
                <DropdownMenuItem
                  key={property.id}
                  onClick={() => onPropertyChange(property.id)}
                  className="flex flex-col items-start"
                >
                  <span className="font-medium">{property.address}</span>
                  <span className="text-xs text-muted-foreground">{property.city}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        {/* Notifications */}
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-accent" />
        </Button>

        {/* User */}
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
            <span className="text-sm font-medium text-primary-foreground">AF</span>
          </div>
        </div>
      </div>
    </header>
  );
}
