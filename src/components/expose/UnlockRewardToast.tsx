import { Gift, Check, Star, Sparkles } from 'lucide-react';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface UnlockRewardToastProps {
  show: boolean;
  reward: string;
  nextReward?: string;
  onClose: () => void;
}

export function UnlockRewardToast({ show, reward, nextReward, onClose }: UnlockRewardToastProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (show) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(onClose, 300);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  if (!show && !isVisible) return null;

  return (
    <div 
      className={cn(
        "fixed bottom-6 left-1/2 -translate-x-1/2 z-50 transition-all duration-300",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      )}
    >
      <div className="bg-gradient-to-r from-accent to-primary text-accent-foreground rounded-2xl px-6 py-4 shadow-2xl shadow-accent/30 flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
          <Gift className="h-6 w-6" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <Check className="h-4 w-4" />
            <span className="font-semibold">Freigeschaltet!</span>
          </div>
          <p className="text-sm opacity-90">{reward}</p>
          {nextReward && (
            <p className="text-xs opacity-75 flex items-center gap-1 mt-1">
              <Star className="h-3 w-3" />
              Nächster Reward: {nextReward}
            </p>
          )}
        </div>
        <Sparkles className="h-5 w-5 animate-pulse" />
      </div>
    </div>
  );
}
