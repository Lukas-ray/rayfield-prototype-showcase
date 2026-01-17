import { useState } from 'react';
import { Mail, Phone, User, ArrowRight, Gift, Check, Sparkles, Crown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface QuickUnlockFormProps {
  currentLevel: number;
  onUnlock: (level: number, data: { email?: string; phone?: string; name?: string }) => void;
}

const unlockSteps = [
  {
    level: 1,
    field: 'email',
    label: 'E-Mail',
    placeholder: 'ihre@email.de',
    icon: Mail,
    reward: '3D-Tour & alle Bilder',
    type: 'email'
  },
  {
    level: 2,
    field: 'phone',
    label: 'Telefon',
    placeholder: '+49 123 456789',
    icon: Phone,
    reward: 'Grundrisse & Energieausweis',
    type: 'tel'
  },
  {
    level: 3,
    field: 'name',
    label: 'Vollständiger Name',
    placeholder: 'Max Mustermann',
    icon: User,
    reward: 'Priority-Status & Preishistorie',
    type: 'text'
  }
];

export function QuickUnlockForm({ currentLevel, onUnlock }: QuickUnlockFormProps) {
  const [formData, setFormData] = useState({ email: '', phone: '', name: '' });
  
  const currentStep = unlockSteps.find(s => s.level === currentLevel + 1);
  const completedSteps = unlockSteps.filter(s => s.level <= currentLevel);
  
  if (!currentStep && currentLevel >= 3) {
    return (
      <div className="p-6 rounded-xl bg-gradient-to-br from-accent/10 to-primary/10 border border-accent/20 text-center">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-accent to-primary flex items-center justify-center mx-auto mb-4">
          <Crown className="h-8 w-8 text-accent-foreground" />
        </div>
        <h3 className="font-semibold text-lg mb-2">Alle Inhalte freigeschaltet!</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Sie haben vollen Zugriff auf alle Premium-Features dieses Exposés.
        </p>
        <div className="flex flex-wrap gap-2 justify-center">
          {unlockSteps.map(step => (
            <div key={step.level} className="flex items-center gap-1 text-xs bg-accent/20 text-accent px-3 py-1 rounded-full">
              <Check className="h-3 w-3" />
              {step.reward.split(' & ')[0]}
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!currentStep) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const value = formData[currentStep.field as keyof typeof formData];
    if (value.trim()) {
      onUnlock(currentStep.level, { [currentStep.field]: value });
    }
  };

  const Icon = currentStep.icon;

  return (
    <div className="rounded-xl overflow-hidden">
      {/* Progress indicator */}
      <div className="flex gap-1 p-4 bg-secondary/50">
        {unlockSteps.map((step, idx) => (
          <div 
            key={step.level}
            className={cn(
              "h-1 flex-1 rounded-full transition-colors",
              step.level <= currentLevel ? "bg-accent" : 
              step.level === currentLevel + 1 ? "bg-accent/50" : "bg-muted"
            )}
          />
        ))}
      </div>
      
      <div className="p-6 bg-gradient-to-br from-accent/5 to-primary/5 border border-accent/20 rounded-b-xl">
        {/* Completed badges */}
        {completedSteps.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {completedSteps.map(step => (
              <div key={step.level} className="flex items-center gap-1 text-xs bg-accent/20 text-accent px-2 py-1 rounded-full">
                <Check className="h-3 w-3" />
                {step.label}
              </div>
            ))}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent to-primary flex items-center justify-center">
              <Icon className="h-5 w-5 text-accent-foreground" />
            </div>
            <div>
              <h3 className="font-semibold">Schritt {currentStep.level}/3</h3>
              <p className="text-xs text-muted-foreground">{currentStep.label} angeben</p>
            </div>
          </div>
          
          {/* Reward preview */}
          <div className="flex items-center gap-2 p-3 rounded-lg bg-accent/10 border border-accent/20 mb-4">
            <Gift className="h-4 w-4 text-accent flex-shrink-0" />
            <span className="text-sm">
              <span className="font-medium">Reward:</span> {currentStep.reward}
            </span>
            <Sparkles className="h-3 w-3 text-accent ml-auto animate-pulse" />
          </div>
          
          <div className="flex gap-2">
            <Input
              type={currentStep.type}
              placeholder={currentStep.placeholder}
              value={formData[currentStep.field as keyof typeof formData]}
              onChange={(e) => setFormData({ ...formData, [currentStep.field]: e.target.value })}
              className="flex-1"
              required
            />
            <Button type="submit" className="gap-2 bg-gradient-to-r from-accent to-primary hover:opacity-90">
              Freischalten
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
