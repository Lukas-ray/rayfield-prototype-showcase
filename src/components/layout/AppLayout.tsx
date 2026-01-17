import { ReactNode, useState } from 'react';
import { AppSidebar } from './AppSidebar';
import { TopBar } from './TopBar';
import { cn } from '@/lib/utils';

interface AppLayoutProps {
  children: ReactNode;
  currentProperty?: string;
  onPropertyChange?: (id: string) => void;
}

export function AppLayout({ children, currentProperty, onPropertyChange }: AppLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <AppSidebar collapsed={sidebarCollapsed} onCollapsedChange={setSidebarCollapsed} />
      <div className={cn(
        "flex flex-col min-h-screen transition-all duration-300",
        sidebarCollapsed ? "ml-16" : "ml-64"
      )}>
        <TopBar currentProperty={currentProperty} onPropertyChange={onPropertyChange} />
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
