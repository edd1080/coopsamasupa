import React from 'react';
import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';

const subformHeaderVariants = cva(
  "p-4 rounded-lg mb-4 shadow-md",
  {
    variants: {
      variant: {
        applicant: "bg-gradient-to-r from-primary to-primary/90 text-primary-foreground",
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
      <div className="flex items-start gap-3">
        {icon && (
          <div className="flex-shrink-0 p-1.5 bg-white/20 rounded-md">
            {icon}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h2 className="text-lg font-semibold leading-tight mb-1">
            {title}
          </h2>
          {subtitle && (
            <p className={cn(
              "text-sm leading-relaxed",
              variant === "applicant" ? "text-primary-foreground/90" : "text-accent-foreground/90"
            )}>
              {subtitle}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SubformHeader;