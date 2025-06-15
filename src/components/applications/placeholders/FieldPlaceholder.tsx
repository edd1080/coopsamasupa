
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronRight, Plus } from 'lucide-react';

interface FieldPlaceholderProps {
  label: string;
  value?: string | number | null;
  placeholder?: string;
  onEdit?: () => void;
  showEditButton?: boolean;
  className?: string;
}

const FieldPlaceholder: React.FC<FieldPlaceholderProps> = ({
  label,
  value,
  placeholder = "Por ingresar",
  onEdit,
  showEditButton = true,
  className = ""
}) => {
  const hasValue = value !== null && value !== undefined && value !== '';
  
  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <p className="text-sm text-muted-foreground">{label}</p>
          {hasValue ? (
            <p className="font-medium">{value}</p>
          ) : (
            <p className="text-muted-foreground italic">{placeholder}</p>
          )}
        </div>
        {showEditButton && onEdit && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onEdit}
            className="text-xs"
          >
            {hasValue ? 'Editar' : 'Completar'}
            <ChevronRight className="h-3 w-3 ml-1" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default FieldPlaceholder;
