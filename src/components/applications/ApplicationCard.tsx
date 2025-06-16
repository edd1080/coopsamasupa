import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from "@/components/ui/badge";
import { Progress } from '@/components/ui/progress';
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger, ContextMenuSeparator } from "@/components/ui/context-menu";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Calendar, FileText, Edit, Trash2, MoreVertical, CheckCircle, AlertCircle, BarChart3, Banknote, FileSignature, UserCheck, FileImage, Users, X, Clock } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface Application {
  id: string;
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
  const { toast } = useToast();

  const handleViewApplication = (id: string) => {
    // Si es un borrador, ir al formulario para continuar editando
    if ((application as any).isDraft) {
      navigate(`/request-form/${id}`);
      toast({
        title: "Continuando borrador",
        description: `Abriendo borrador de ${application.clientName}`,
        duration: 3000
      });
    } else {
      // Si es aplicación completa, ir a detalles
      navigate(`/applications/${id}`);
    }
  };

  const handleEditApplication = (id: string, clientName: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    
    // Tanto borradores como aplicaciones completas van al formulario para edición
    navigate(`/request-form/${id}`);
    toast({
      title: "Edición iniciada",
      description: `Editando solicitud de ${clientName}`,
      duration: 3000
    });
  };

  const getStatusBadge = (status: string, isDraft?: boolean) => {
    // Para borradores, mostrar como "Activo" pero con indicador visual sutil
    if (isDraft) {
      return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 flex items-center gap-1 text-sm px-3 py-1">
          <BarChart3 className="h-4 w-4" />
          <span>Activo</span>
          <span className="text-xs opacity-70">(Borrador)</span>
        </Badge>;
    }
    
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 flex items-center gap-1 text-sm px-3 py-1">
            <BarChart3 className="h-4 w-4" />
            <span>Activo</span>
          </Badge>;
      case 'reviewing':
        return <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-200 flex items-center gap-1 text-sm px-3 py-1">
            <Clock className="h-4 w-4" />
            <span>Verificación</span>
          </Badge>;
      case 'approved':
        return <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200 flex items-center gap-1 text-sm px-3 py-1">
            <CheckCircle className="h-4 w-4" />
            <span>Aprobado</span>
          </Badge>;
      case 'rejected':
        return <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200 flex items-center gap-1 text-sm px-3 py-1">
            <AlertCircle className="h-4 w-4" />
            <span>Rechazado</span>
          </Badge>;
      case 'cancelled':
        return <Badge variant="outline" className="bg-gray-100 text-gray-800 border-gray-200 flex items-center gap-1 text-sm px-3 py-1">
            <X className="h-4 w-4" />
            <span>Cancelado</span>
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

  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <Card className="card-hover cursor-pointer group relative" onClick={() => handleViewApplication(application.id)}>
          <CardContent className="p-4">
            <div className="flex flex-col">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="text-section-title font-semibold">{application.clientName}</h3>
                  <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    <span>{formatDate(application.date)}</span>
                    <FileText className="h-3 w-3 ml-2" />
                    <span>{application.id}</span>
                  </div>
                </div>
                
                <div className="flex flex-col items-end gap-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 ml-auto transition-opacity" onClick={e => e.stopPropagation()}>
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuItem onClick={() => handleViewApplication(application.id)}>
                        <FileText className="mr-2 h-4 w-4" />
                        <span>Ver detalles</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={e => handleEditApplication(application.id, application.clientName, e)}>
                        <Edit className="mr-2 h-4 w-4" />
                        <span>Editar</span>
                      </DropdownMenuItem>
                      {application.status !== 'cancelled' && application.status !== 'approved' && (
                        <DropdownMenuItem onClick={e => onCancel(application.id, application.clientName, e)}>
                          <X className="mr-2 h-4 w-4" />
                          <span>Cancelar solicitud</span>
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={e => onDelete(application.id, application.clientName, e)}>
                        <Trash2 className="mr-2 h-4 w-4" />
                        <span>Eliminar</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  
                  {getStatusBadge(application.status, (application as any).isDraft)}
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
              
              <div className="flex justify-between items-center mt-2 text-sm">
                <div className="font-medium">{application.product}</div>
                <div className="text-primary">{application.amount}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </ContextMenuTrigger>
      <ContextMenuContent className="w-48">
        <ContextMenuItem onClick={() => handleViewApplication(application.id)}>
          <FileText className="mr-2 h-4 w-4" />
          <span>Ver detalles</span>
        </ContextMenuItem>
        <ContextMenuItem onClick={e => onEdit(application.id, application.clientName, e)}>
          <Edit className="mr-2 h-4 w-4" />
          <span>Editar</span>
        </ContextMenuItem>
        {application.status !== 'cancelled' && application.status !== 'approved' && (
          <ContextMenuItem onClick={e => onCancel(application.id, application.clientName, e)}>
            <X className="mr-2 h-4 w-4" />
            <span>Cancelar solicitud</span>
          </ContextMenuItem>
        )}
        <ContextMenuSeparator />
        <ContextMenuItem className="text-destructive focus:text-destructive" onClick={e => onDelete(application.id, application.clientName, e)}>
          <Trash2 className="mr-2 h-4 w-4" />
          <span>Eliminar</span>
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
};

export default ApplicationCard;
