import React from 'react';
import { cn } from '@/lib/utils';

interface SubformHeaderProps {
  icon?: React.ReactNode;
  title: string;
  subtitle?: string;
  className?: string;
}

const SubformHeader: React.FC<SubformHeaderProps> = ({ 
  icon, 
  title, 
  subtitle, 
  className 
}) => {
  return (
    <div className={cn(
      "bg-gradient-to-r from-primary to-primary/90 text-primary-foreground p-6 rounded-lg mb-6 shadow-lg",
      className
    )}>
      <div className="flex items-start gap-3">
        {icon && (
          <div className="flex-shrink-0 p-2 bg-white/20 rounded-lg">
            {icon}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h2 className="text-xl font-semibold leading-tight mb-1">
            {title}
          </h2>
          {subtitle && (
            <p className="text-primary-foreground/90 text-sm leading-relaxed">
              {subtitle}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SubformHeader;