import { Search, Bell, ChevronDown, Building2, Home, Settings, LayoutDashboard, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { properties } from '@/data/dummyData';
import { useNavigate } from 'react-router-dom';
import immosmartLogo from '@/assets/immosmart-logo.svg';

interface TopBarProps {
  currentProperty?: string;
  onPropertyChange?: (id: string) => void;
}

export function TopBar({ currentProperty, onPropertyChange }: TopBarProps) {
  const selectedProperty = properties.find(p => p.id === currentProperty);
  const navigate = useNavigate();

  return (
    <header className="h-16 border-b bg-card flex items-center justify-between px-6">
      {/* Logo & Search */}
      <div className="flex items-center gap-6">
        <div 
          className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
          onClick={() => navigate('/')}
        >
          <img src={immosmartLogo} alt="Immosmart" className="h-8 w-8" />
          <span className="font-semibold text-lg">Immosmart</span>
        </div>
        <div className="relative w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Objekte, Dokumente, Leads suchen..."
            className="pl-10 bg-secondary border-0"
          />
        </div>
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

        {/* User Menu with Navigation */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="flex items-center gap-2 cursor-pointer group">
              <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center group-hover:ring-2 ring-primary/20 transition-all">
                <span className="text-sm font-medium text-primary-foreground">AF</span>
              </div>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            {/* User Info */}
            <div className="px-2 py-2 border-b">
              <p className="text-sm font-medium">Anna Fischer</p>
              <p className="text-xs text-muted-foreground">anna@immosmart.de</p>
            </div>
            
            {/* Navigation Items */}
            <DropdownMenuItem onClick={() => navigate('/')} className="gap-3 py-2.5">
              <Home className="h-4 w-4" />
              <span>Objekte</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate('/admin')} className="gap-3 py-2.5">
              <Settings className="h-4 w-4" />
              <span>Einstellungen</span>
            </DropdownMenuItem>
            
            <DropdownMenuSeparator />
            
            {/* Workspace Info */}
            <div className="px-2 py-2">
              <div className="flex items-center gap-3 p-2 rounded-lg bg-muted/50">
                <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-accent/20 to-accent/10 flex items-center justify-center">
                  <LayoutDashboard className="h-4 w-4 text-accent" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">Immosmart GmbH</p>
                  <p className="text-xs text-accent">6 aktive Objekte</p>
                </div>
              </div>
            </div>
            
            <DropdownMenuSeparator />
            
            <DropdownMenuItem className="gap-3 py-2.5 text-destructive focus:text-destructive">
              <LogOut className="h-4 w-4" />
              <span>Abmelden</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}