import React from 'react';
import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';

const subformHeaderVariants = cva(
  "p-2 rounded-lg mb-2 shadow-sm",
  {
    variants: {
      variant: {
        applicant: "bg-gradient-to-r from-accent to-accent/90 text-accent-foreground",
        reference: "bg-gradient-to-r from-accent to-accent/90 text-accent-foreground"
      }
    },
    defaultVariants: {
      variant: "applicant"
    }
  }
);

interface SubformHeaderProps extends VariantProps<typeof subformHeaderVariants> {
  icon?: React.ReactNode;
  title: string;
  subtitle?: string;
  className?: string;
}

const SubformHeader: React.FC<SubformHeaderProps> = ({ 
  icon, 
  title, 
  subtitle, 
  variant,
  className 
}) => {
  return (
    <div className={cn(subformHeaderVariants({ variant }), className)}>
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold leading-tight mb-0.5">
            {title}
          </h3>
          {subtitle && (
            <p className="text-xs leading-relaxed text-accent-foreground/90">
              {subtitle}
            </p>
          )}
        </div>
        {icon && (
          <div className="flex-shrink-0 p-1 bg-white/20 rounded-sm ml-2">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
};

export default SubformHeader;