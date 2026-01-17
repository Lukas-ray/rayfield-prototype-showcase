import { Building2, Settings, Home, LayoutDashboard, FileText, Upload } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'Objekte', href: '/', icon: Home },
  { name: 'Dokumente', href: '/documents', icon: FileText },
  { name: 'Veröffentlichung', href: '/publishing', icon: Upload },
  { name: 'Einstellungen', href: '/admin', icon: Settings },
];

export function AppSidebar() {
  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 bg-sidebar border-r border-sidebar-border">
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex h-16 items-center gap-3 px-6 border-b border-sidebar-border">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-accent to-accent/80 shadow-lg">
            <Building2 className="h-5 w-5 text-sidebar-primary-foreground" />
          </div>
          <span className="text-xl font-semibold text-sidebar-foreground">Rayfield</span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 px-3 py-4">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              end={item.href === '/'}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200',
                  isActive 
                    ? 'bg-accent text-sidebar-primary-foreground shadow-md' 
                    : 'text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground'
                )
              }
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </NavLink>
          ))}
        </nav>

        {/* Workspace indicator */}
        <div className="border-t border-sidebar-border p-4">
          <div className="flex items-center gap-3 p-2 rounded-lg bg-sidebar-accent/50">
            <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-accent/20 to-accent/10 flex items-center justify-center">
              <LayoutDashboard className="h-4 w-4 text-accent" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-sidebar-foreground truncate">Büro Berlin</p>
              <p className="text-xs text-accent">6 aktive Objekte</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
