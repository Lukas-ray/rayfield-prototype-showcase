import { ReactNode } from 'react';
import { AppSidebar } from './AppSidebar';
import { TopBar } from './TopBar';

interface AppLayoutProps {
  children: ReactNode;
  currentProperty?: string;
  onPropertyChange?: (id: string) => void;
}

export function AppLayout({ children, currentProperty, onPropertyChange }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <AppSidebar />
      <div className="ml-64 flex flex-col min-h-screen">
        <TopBar currentProperty={currentProperty} onPropertyChange={onPropertyChange} />
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
