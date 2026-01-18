import { Instagram, Facebook, Linkedin, Youtube } from 'lucide-react';
import { cn } from '@/lib/utils';
import ebayLogo from '@/assets/ebay-kleinanzeigen-logo.png';

interface PlatformLogoProps {
  platform: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeClasses = {
  sm: 'w-5 h-5 text-[8px]',
  md: 'w-8 h-8 text-xs',
  lg: 'w-10 h-10 text-sm',
};

const iconSizeClasses = {
  sm: 'w-3 h-3',
  md: 'w-4 h-4',
  lg: 'w-5 h-5',
};

export function PlatformLogo({ platform, size = 'md', className }: PlatformLogoProps) {
  const sizeClass = sizeClasses[size];
  const iconSize = iconSizeClasses[size];

  switch (platform.toLowerCase()) {
    case 'immoscout24':
    case 'immoscout':
      return (
        <div className={cn(
          "rounded-md bg-[#ff7500] flex items-center justify-center text-white font-bold",
          sizeClass,
          className
        )}>
          IS24
        </div>
      );
    case 'immowelt':
      return (
        <div className={cn(
          "rounded-md bg-[#003366] flex items-center justify-center text-white font-bold",
          sizeClass,
          className
        )}>
          IW
        </div>
      );
    case 'kleinanzeigen':
    case 'ebay kleinanzeigen':
    case 'ebay-kleinanzeigen':
      return (
        <img 
          src={ebayLogo} 
          alt="Kleinanzeigen" 
          className={cn("rounded-md object-cover", sizeClass, className)} 
        />
      );
    case 'immonet':
      return (
        <div className={cn(
          "rounded-md bg-[#004a99] flex items-center justify-center text-white font-bold",
          sizeClass,
          className
        )}>
          IN
        </div>
      );
    case 'instagram':
      return (
        <div className={cn(
          "rounded-md bg-gradient-to-br from-[#f09433] via-[#e6683c] to-[#bc1888] flex items-center justify-center",
          sizeClass,
          className
        )}>
          <Instagram className={cn("text-white", iconSize)} />
        </div>
      );
    case 'facebook':
      return (
        <div className={cn(
          "rounded-md bg-[#1877f2] flex items-center justify-center",
          sizeClass,
          className
        )}>
          <Facebook className={cn("text-white", iconSize)} />
        </div>
      );
    case 'linkedin':
      return (
        <div className={cn(
          "rounded-md bg-[#0a66c2] flex items-center justify-center",
          sizeClass,
          className
        )}>
          <Linkedin className={cn("text-white", iconSize)} />
        </div>
      );
    case 'youtube':
      return (
        <div className={cn(
          "rounded-md bg-[#ff0000] flex items-center justify-center",
          sizeClass,
          className
        )}>
          <Youtube className={cn("text-white", iconSize)} />
        </div>
      );
    case 'website':
    case 'eigene website':
      return (
        <div className={cn(
          "rounded-md bg-accent flex items-center justify-center text-white font-bold",
          sizeClass,
          className
        )}>
          WEB
        </div>
      );
    default:
      return (
        <div className={cn(
          "rounded-md bg-muted flex items-center justify-center text-muted-foreground font-bold",
          sizeClass,
          className
        )}>
          {platform.slice(0, 2).toUpperCase()}
        </div>
      );
  }
}
