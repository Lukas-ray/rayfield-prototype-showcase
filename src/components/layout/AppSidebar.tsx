import { Building2, Settings, Home, LayoutDashboard, ChevronLeft, ChevronRight } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'Objekte', href: '/', icon: Home },
  { name: 'Einstellungen', href: '/admin', icon: Settings },
];

interface AppSidebarProps {
  collapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
}

export function AppSidebar({ collapsed = false, onCollapsedChange }: AppSidebarProps) {
  const toggleCollapsed = () => {
    onCollapsedChange?.(!collapsed);
  };

  return (
    <aside className={cn(
      "fixed left-0 top-0 z-40 h-screen bg-sidebar border-r border-sidebar-border transition-all duration-300",
      collapsed ? "w-16" : "w-64"
    )}>
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className={cn(
          "flex h-16 items-center border-b border-sidebar-border relative",
          collapsed ? "justify-center px-2" : "gap-3 px-6"
        )}>
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-accent to-accent/80 shadow-lg flex-shrink-0">
            <Building2 className="h-5 w-5 text-sidebar-primary-foreground" />
          </div>
          {!collapsed && (
            <span className="text-xl font-semibold text-sidebar-foreground">Rayfield</span>
          )}
          
          {/* Collapse Toggle - positioned at edge */}
          <button
            onClick={toggleCollapsed}
            className={cn(
              "absolute flex items-center justify-center w-6 h-6 rounded-full bg-sidebar-accent border border-sidebar-border shadow-sm hover:bg-accent hover:text-sidebar-primary-foreground transition-all duration-200",
              "-right-3"
            )}
            title={collapsed ? "Ausklappen" : "Einklappen"}
          >
            {collapsed ? (
              <ChevronRight className="h-3.5 w-3.5" />
            ) : (
              <ChevronLeft className="h-3.5 w-3.5" />
            )}
          </button>
        </div>

        {/* Navigation */}
        <nav className={cn("flex-1 space-y-1 py-2", collapsed ? "px-2" : "px-3")}>
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              end={item.href === '/'}
              className={({ isActive }) =>
                cn(
                  'flex items-center rounded-lg text-sm font-medium transition-all duration-200',
                  collapsed ? 'justify-center p-2.5' : 'gap-3 px-3 py-2.5',
                  isActive 
                    ? 'bg-accent text-sidebar-primary-foreground shadow-md' 
                    : 'text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground'
                )
              }
              title={collapsed ? item.name : undefined}
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              {!collapsed && item.name}
            </NavLink>
          ))}
        </nav>

        {/* Workspace indicator */}
        <div className={cn("border-t border-sidebar-border", collapsed ? "p-2" : "p-4")}>
          <div className={cn(
            "flex items-center rounded-lg bg-sidebar-accent/50",
            collapsed ? "justify-center p-2" : "gap-3 p-2"
          )}>
            <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-accent/20 to-accent/10 flex items-center justify-center flex-shrink-0">
              <LayoutDashboard className="h-4 w-4 text-accent" />
            </div>
            {!collapsed && (
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
