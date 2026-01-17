import { useState } from 'react';
import { Building2, Settings, Home, LayoutDashboard, ChevronLeft, ChevronRight } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const navigation = [
  { name: 'Objekte', href: '/', icon: Home },
  { name: 'Einstellungen', href: '/admin', icon: Settings },
];

interface AppSidebarProps {
  collapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
}

export function AppSidebar({ collapsed = false, onCollapsedChange }: AppSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(collapsed);

  const toggleCollapsed = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    onCollapsedChange?.(newState);
  };

  return (
    <aside className={cn(
      "fixed left-0 top-0 z-40 h-screen bg-sidebar border-r border-sidebar-border transition-all duration-300",
      isCollapsed ? "w-16" : "w-64"
    )}>
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className={cn(
          "flex h-16 items-center border-b border-sidebar-border",
          isCollapsed ? "justify-center px-2" : "gap-3 px-6"
        )}>
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-accent to-accent/80 shadow-lg flex-shrink-0">
            <Building2 className="h-5 w-5 text-sidebar-primary-foreground" />
          </div>
          {!isCollapsed && (
            <span className="text-xl font-semibold text-sidebar-foreground">Rayfield</span>
          )}
        </div>

        {/* Toggle Button */}
        <div className={cn("px-3 py-2", isCollapsed && "px-2")}>
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleCollapsed}
            className={cn(
              "w-full text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent",
              isCollapsed ? "justify-center px-0" : "justify-start"
            )}
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <>
                <ChevronLeft className="h-4 w-4 mr-2" />
                Einklappen
              </>
            )}
          </Button>
        </div>

        {/* Navigation */}
        <nav className={cn("flex-1 space-y-1 py-2", isCollapsed ? "px-2" : "px-3")}>
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              end={item.href === '/'}
              className={({ isActive }) =>
                cn(
                  'flex items-center rounded-lg text-sm font-medium transition-all duration-200',
                  isCollapsed ? 'justify-center p-2.5' : 'gap-3 px-3 py-2.5',
                  isActive 
                    ? 'bg-accent text-sidebar-primary-foreground shadow-md' 
                    : 'text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground'
                )
              }
              title={isCollapsed ? item.name : undefined}
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              {!isCollapsed && item.name}
            </NavLink>
          ))}
        </nav>

        {/* Workspace indicator */}
        <div className={cn("border-t border-sidebar-border", isCollapsed ? "p-2" : "p-4")}>
          <div className={cn(
            "flex items-center rounded-lg bg-sidebar-accent/50",
            isCollapsed ? "justify-center p-2" : "gap-3 p-2"
          )}>
            <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-accent/20 to-accent/10 flex items-center justify-center flex-shrink-0">
              <LayoutDashboard className="h-4 w-4 text-accent" />
            </div>
            {!isCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-sidebar-foreground truncate">Immosmart GmbH</p>
                <p className="text-xs text-accent">6 aktive Objekte</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
}
