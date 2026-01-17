import { Lock, Gift, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface GatedContentCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  unlocked: boolean;
  unlockAction: string;
  onUnlock: () => void;
  children: React.ReactNode;
  previewImage?: string;
}

export function GatedContentCard({
  title,
  description,
  icon,
  unlocked,
  unlockAction,
  onUnlock,
  children,
  previewImage
}: GatedContentCardProps) {
  if (unlocked) {
    return <>{children}</>;
  }

  return (
    <div className="relative rounded-xl overflow-hidden border border-dashed border-accent/30 bg-gradient-to-br from-accent/5 to-primary/5">
      {/* Blurred Preview */}
      {previewImage && (
        <div className="absolute inset-0">
          <img src={previewImage} alt="" className="w-full h-full object-cover blur-md opacity-30" />
        </div>
      )}
      
      {/* Lock Overlay */}
      <div className="relative p-8 flex flex-col items-center justify-center min-h-[200px] text-center">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-accent/20 to-primary/20 flex items-center justify-center mb-4 animate-pulse">
          <Lock className="h-8 w-8 text-accent" />
        </div>
        
        <div className="flex items-center gap-2 mb-2">
          {icon}
          <h3 className="font-semibold text-lg">{title}</h3>
        </div>
        
        <p className="text-muted-foreground text-sm mb-4 max-w-sm">
          {description}
        </p>
        
        <Button 
          onClick={onUnlock}
          className="gap-2 bg-gradient-to-r from-accent to-primary hover:opacity-90"
        >
          <Gift className="h-4 w-4" />
          {unlockAction}
        </Button>
        
        <div className="flex items-center gap-1 mt-3 text-xs text-muted-foreground">
          <Sparkles className="h-3 w-3" />
          <span>Sofort freischalten</span>
        </div>
      </div>
    </div>
  );
}
