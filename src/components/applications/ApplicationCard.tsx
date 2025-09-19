import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from "@/components/ui/badge";
import { Progress } from '@/components/ui/progress';
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger, ContextMenuSeparator } from "@/components/ui/context-menu";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Calendar, FileText, Edit, Trash2, MoreVertical, CheckCircle, AlertCircle, BarChart3, Banknote, FileSignature, UserCheck, FileImage, Users, X, Clock, Eye } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { formatApplicationId } from '@/utils/applicationIdGenerator';
import { getFirstNameAndLastName } from '@/lib/nameUtils';
import { formatDateToGuatemalan } from '@/utils/dateUtils';
import { formatCurrencyWithSymbol } from '@/utils/formatters';
interface Application {
  id: string;
  applicationId?: string;
  externalReferenceId?: string;
  clientName: string;
  product: string;
  amount: string;
  status: string;
  date: string;
  progress: number;
  stage: string;
  isDraft?: boolean;
}
interface ApplicationCardProps {
  application: Application;
  onEdit: (id: string, clientName: string, e?: React.MouseEvent) => void;
  onCancel: (id: string, clientName: string, e?: React.MouseEvent) => void;
  onDelete: (id: string, clientName: string, e?: React.MouseEvent) => void;
}
const ApplicationCard: React.FC<ApplicationCardProps> = ({
  application,
  onEdit,
  onCancel,
  onDelete
}) => {
  const navigate = useNavigate();
  const {
    toast
  } = useToast();
  const handleViewApplication = (id: string) => {
    // Para ambos (borradores y aplicaciones completas), ir a la página de detalles
    navigate(`/applications/${id}`);
  };
  const handleEditApplication = (id: string, clientName: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();

    // Tanto borradores como aplicaciones completas van al formulario para edición
    navigate(`/request-form/${id}`);
  };
  const handleContinueApplication = (id: string, clientName: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();

    // Ir directamente al formulario para continuar
    navigate(`/request-form/${id}`);
  };
  const getStatusBadge = (status: string, isDraft?: boolean) => {
    // Para borradores, mostrar como "Activo" pero con indicador visual sutil
    if (status === 'draft') {
      return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 text-xs px-2 py-0.5">
          Activo
        </Badge>;
    }
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 text-xs px-2 py-0.5">
            Activo
          </Badge>;
      case 'submitted':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 text-xs px-2 py-0.5">
            Enviada
          </Badge>;
      case 'reviewing':
        return <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-200 text-xs px-2 py-0.5">
            Verificación
          </Badge>;
      case 'approved':
        return <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200 text-xs px-2 py-0.5">
            Aprobado
          </Badge>;
      case 'rejected':
        return <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200 text-xs px-2 py-0.5">
            Rechazado
          </Badge>;
      case 'cancelled':
        return <Badge variant="outline" className="bg-gray-100 text-gray-800 border-gray-200 text-xs px-2 py-0.5">
            Cancelado
          </Badge>;
      default:
        return null;
    }
  };
  const formatDate = (dateString: string) => {
    return formatDateToGuatemalan(dateString);
  };
  const getStageIcon = (stage: string) => {
    switch (stage) {
      case 'Información Financiera':
        return <Banknote className="h-4 w-4 mr-2" />;
      case 'Firma de Acta':
        return <FileSignature className="h-4 w-4 mr-2" />;
      case 'Análisis de Carácter':
        return <UserCheck className="h-4 w-4 mr-2" />;
      case 'Documentos e Imágenes':
        return <FileImage className="h-4 w-4 mr-2" />;
      case 'Fiadores':
        return <Users className="h-4 w-4 mr-2" />;
      default:
        return null;
    }
  };
  const isDraft = application.status === 'draft';
  return <ContextMenu>
      <ContextMenuTrigger>
        <Card className="card-hover cursor-pointer group relative" onClick={() => handleViewApplication(application.id)}>
          <CardContent className="p-4">
            <div className="flex flex-col">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1 pr-4">
                  <h3 className="text-section-title font-semibold">{getFirstNameAndLastName(application.clientName)}</h3>
                  <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground whitespace-nowrap">
                    <Calendar className="h-3 w-3" />
                    <span>{formatDate(application.date)}</span>
                    <FileText className="h-3 w-3 ml-2" />
                    <span className="truncate">
                      {application.status === 'draft' 
                        ? 'Borrador' 
                        : `ID: ${application.externalReferenceId || formatApplicationId(application.id)}`
                      }
                    </span>
                  </div>
                </div>
                
                <div className="flex flex-col items-end gap-2">
                  {getStatusBadge(application.status, isDraft)}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 ml-auto transition-opacity" onClick={e => e.stopPropagation()}>
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuItem onClick={() => handleViewApplication(application.id)}>
                        <Eye className="mr-2 h-4 w-4" />
                        <span>Ver detalles</span>
                      </DropdownMenuItem>
                      {isDraft ? <DropdownMenuItem onClick={e => handleContinueApplication(application.id, application.clientName, e)}>
                          <Edit className="mr-2 h-4 w-4" />
                          <span>Continuar</span>
                        </DropdownMenuItem> : application.status !== 'submitted' && <DropdownMenuItem onClick={e => handleEditApplication(application.id, application.clientName, e)}>
                          <Edit className="mr-2 h-4 w-4" />
                          <span>Editar</span>
                        </DropdownMenuItem>}
                      {application.status !== 'cancelled' && application.status !== 'approved' && <DropdownMenuItem onClick={e => onCancel(application.id, application.clientName, e)}>
                          <X className="mr-2 h-4 w-4" />
                          <span>Cancelar solicitud</span>
                        </DropdownMenuItem>}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={e => onDelete(application.id, application.clientName, e)}>
                        <Trash2 className="mr-2 h-4 w-4" />
                        <span>Eliminar</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
              
              <div className="mt-1 mb-1">
                <div className="flex items-center text-base font-medium mb-1">
                  {getStageIcon(application.stage)}
                  <span>{application.stage}</span>
                </div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-muted-foreground">Progreso</span>
                  <span className="font-medium">{Math.round(application.progress / 6 * 100)}%</span>
                </div>
                <Progress value={application.progress / 6 * 100} className="h-1.5" />
              </div>
              
              {!isDraft && application.product && application.amount && (
                <div className="flex justify-between items-center mt-2 text-sm">
                  <div className="font-medium">{application.product}</div>
                  <div className="text-primary">{formatCurrencyWithSymbol(application.amount)}</div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </ContextMenuTrigger>
      <ContextMenuContent className="w-48">
        <ContextMenuItem onClick={() => handleViewApplication(application.id)}>
          <Eye className="mr-2 h-4 w-4" />
          <span>Ver detalles</span>
        </ContextMenuItem>
        {isDraft ? <ContextMenuItem onClick={e => handleContinueApplication(application.id, application.clientName, e)}>
            <Edit className="mr-2 h-4 w-4" />
            <span>Continuar</span>
          </ContextMenuItem> : application.status !== 'submitted' && <ContextMenuItem onClick={e => onEdit(application.id, application.clientName, e)}>
            <Edit className="mr-2 h-4 w-4" />
            <span>Editar</span>
          </ContextMenuItem>}
        {application.status !== 'cancelled' && application.status !== 'approved' && <ContextMenuItem onClick={e => onCancel(application.id, application.clientName, e)}>
            <X className="mr-2 h-4 w-4" />
            <span>Cancelar solicitud</span>
          </ContextMenuItem>}
        <ContextMenuSeparator />
        <ContextMenuItem className="text-destructive focus:text-destructive" onClick={e => onDelete(application.id, application.clientName, e)}>
          <Trash2 className="mr-2 h-4 w-4" />
          <span>Eliminar</span>
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>;
};
export default ApplicationCard;