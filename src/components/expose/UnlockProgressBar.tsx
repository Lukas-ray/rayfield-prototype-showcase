import { Check, Lock, Gift, Star, Crown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface UnlockLevel {
  id: string;
  label: string;
  icon: React.ReactNode;
  unlocked: boolean;
  reward: string;
}

interface UnlockProgressBarProps {
  levels: UnlockLevel[];
  currentLevel: number;
}

export function UnlockProgressBar({ levels, currentLevel }: UnlockProgressBarProps) {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between relative">
        {/* Progress Line */}
        <div className="absolute left-0 right-0 top-1/2 h-1 bg-secondary -translate-y-1/2 z-0">
          <div 
            className="h-full bg-gradient-to-r from-accent to-primary transition-all duration-500"
            style={{ width: `${(currentLevel / (levels.length - 1)) * 100}%` }}
          />
        </div>
        
        {levels.map((level, idx) => (
          <div key={level.id} className="relative z-10 flex flex-col items-center">
            <div 
              className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300",
                level.unlocked 
                  ? "bg-gradient-to-br from-accent to-primary text-accent-foreground shadow-lg shadow-accent/30" 
                  : "bg-secondary text-muted-foreground"
              )}
            >
              {level.unlocked ? <Check className="h-5 w-5" /> : level.icon}
            </div>
            <span className={cn(
              "text-xs mt-2 font-medium transition-colors",
              level.unlocked ? "text-accent" : "text-muted-foreground"
            )}>
              {level.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
