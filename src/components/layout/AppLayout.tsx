import { ReactNode } from 'react';
import { TopBar } from './TopBar';

interface AppLayoutProps {
  children: ReactNode;
  currentProperty?: string;
  onPropertyChange?: (id: string) => void;
}

export function AppLayout({ children, currentProperty, onPropertyChange }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <TopBar currentProperty={currentProperty} onPropertyChange={onPropertyChange} />
      <main className="flex-1 p-6">
        {children}
      </main>
    </div>
  );
}