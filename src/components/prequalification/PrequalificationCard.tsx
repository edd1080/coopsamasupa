
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { CheckCircle, AlertCircle, XCircle, Calendar, User, Banknote, MoreVertical, FileSpreadsheet, Edit, Trash2 } from 'lucide-react';
import { formatCurrency } from '@/utils/prequalificationEngine';
import { useToast } from '@/hooks/use-toast';

interface PrequalificationCardProps {
  prequalification: {
    id: string;
    client_name: string;
    requested_amount: number;
    monthly_income: number;
    credit_purpose: string;
    evaluation_status: string;
    evaluation_reason: string;
    can_proceed: boolean;
    created_at: string;
  };
  onDelete: (id: string, clientName: string) => void;
  onRepeat: (id: string) => void;
}

const PrequalificationCard: React.FC<PrequalificationCardProps> = ({
  prequalification,
  onDelete,
  onRepeat
}) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showDialog, setShowDialog] = useState(false);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'green':
        return <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200 flex items-center gap-1">
            <CheckCircle className="h-3 w-3" />
            <span>Aprobada</span>
          </Badge>;
      case 'yellow':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200 flex items-center gap-1">
            <AlertCircle className="h-3 w-3" />
            <span>Condicional</span>
          </Badge>;
      case 'red':
        return <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200 flex items-center gap-1">
            <XCircle className="h-3 w-3" />
            <span>Rechazada</span>
          </Badge>;
      default:
        return null;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es-GT', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    }).format(date);
  };

  const handleCardClick = () => {
    setShowDialog(true);
  };

  const handleStartApplication = () => {
    setShowDialog(false);
    toast({
      title: "Iniciando solicitud",
      description: "Redirigiendo al formulario de solicitud completa...",
      duration: 3000
    });
    navigate('/applications/new');
  };

  const handleRepeatPrequalification = () => {
    onRepeat(prequalification.id);
    toast({
      title: "Repetir precalificación",
      description: "Pre-llenando formulario con datos anteriores...",
      duration: 3000
    });
  };

  const handleDeletePrequalification = () => {
    onDelete(prequalification.id, prequalification.client_name);
  };

  return (
    <>
      <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={handleCardClick}>
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold flex items-center gap-2 mb-1">
                <User className="h-4 w-4 text-muted-foreground" />
                {prequalification.client_name}
              </h3>
              <div className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
                <Calendar className="h-3 w-3" />
                {formatDate(prequalification.created_at)}
              </div>
              {getStatusBadge(prequalification.evaluation_status)}
            </div>
            
            <div className="flex flex-col items-end gap-2">
              <div className="flex items-center gap-1 text-lg font-semibold text-primary">
                <Banknote className="h-5 w-5" />
                {formatCurrency(prequalification.requested_amount)}
              </div>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 w-8 p-0"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onClick={handleRepeatPrequalification}>
                    <Edit className="mr-2 h-4 w-4" />
                    <span>Repetir precalificación</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    className="text-destructive focus:text-destructive" 
                    onClick={handleDeletePrequalification}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    <span>Eliminar</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <div className="text-sm bg-muted/50 p-2 rounded-md">
            <p className="font-medium text-muted-foreground text-xs mb-1">Evaluación:</p>
            <p className="text-sm">{prequalification.evaluation_reason}</p>
          </div>
        </CardContent>
      </Card>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="w-[calc(100vw-2rem)] max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              {prequalification.client_name}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary mb-1">
                {formatCurrency(prequalification.requested_amount)}
              </div>
              <div className="text-sm text-muted-foreground">
                Monto solicitado
              </div>
            </div>

            <div className="flex justify-center">
              {getStatusBadge(prequalification.evaluation_status)}
            </div>

            <div className="text-sm bg-muted/50 p-3 rounded-md">
              <p className="font-medium text-muted-foreground mb-1">Evaluación:</p>
              <p>{prequalification.evaluation_reason}</p>
            </div>

            <div className="space-y-3 pt-2">
              {prequalification.can_proceed && (
                <Button onClick={handleStartApplication} className="w-full">
                  <FileSpreadsheet className="mr-2 h-4 w-4" />
                  Iniciar Solicitud
                </Button>
              )}
              
              <Button variant="outline" onClick={() => setShowDialog(false)} className="w-full">
                Cancelar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PrequalificationCard;
