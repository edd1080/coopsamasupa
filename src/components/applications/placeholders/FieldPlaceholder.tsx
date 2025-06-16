
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronRight, Plus, AlertCircle } from 'lucide-react';

interface FieldPlaceholderProps {
  label: string;
  value?: string | number | null;
  placeholder?: string;
  onEdit?: () => void;
  showEditButton?: boolean;
  className?: string;
  required?: boolean;
}

const FieldPlaceholder: React.FC<FieldPlaceholderProps> = ({
  label,
  value,
  placeholder = "Por ingresar",
  onEdit,
  showEditButton = true,
  className = "",
  required = false
}) => {
  const hasValue = value !== null && value !== undefined && value !== '';
  const showRequiredIndicator = required && !hasValue;
  
  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center gap-1">
            <p className="text-sm text-muted-foreground">{label}</p>
            {showRequiredIndicator && (
              <AlertCircle className="h-3 w-3 text-amber-500" />
            )}
          </div>
          {hasValue ? (
            <p className="font-medium">{value}</p>
          ) : (
            <p className={`italic ${showRequiredIndicator ? 'text-amber-600' : 'text-muted-foreground'}`}>
              {showRequiredIndicator ? 'Requerido - Por ingresar' : placeholder}
            </p>
          )}
        </div>
        {showEditButton && onEdit && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onEdit}
            className={`text-xs ${showRequiredIndicator ? 'text-amber-600 hover:text-amber-700' : ''}`}
          >
            {hasValue ? 'Editar' : (showRequiredIndicator ? 'Completar' : 'Agregar')}
            <ChevronRight className="h-3 w-3 ml-1" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default FieldPlaceholder;
