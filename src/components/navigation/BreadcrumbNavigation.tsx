import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from '@/components/ui/breadcrumb';
interface BreadcrumbPath {
  path: string;
  label: string;
  isLast?: boolean;
}
const BreadcrumbNavigation = () => {
  const location = useLocation();
  const pathSegments = location.pathname.split('/').filter(Boolean);

  // Get current form section from URL state or pathname
  const getCurrentFormSection = (): string | null => {
    // Check if we're in edit mode
    if (location.pathname.includes('/edit')) {
      // You could get this from URL params or React Router state
      // For now, we'll return null and let the form provider handle this
      return null;
    }
    return null;
  };
  const getFormSectionLabel = (sectionId: string): string => {
    const sectionLabels: Record<string, string> = {
      'identification': 'Identificación y Contacto',
      'finances': 'Finanzas y Patrimonio',
      'business': 'Negocio y Perfil Económico',
      'guarantors': 'Referencias Personales',
      'documents': 'Documentos y Cierre',
      'review': 'Revisión Final'
    };
    return sectionLabels[sectionId] || sectionId;
  };
  const getBreadcrumbPaths = (): BreadcrumbPath[] => {
    const result: BreadcrumbPath[] = [];

    // Home
    result.push({
      path: '/',
      label: 'Inicio'
    });
    if (pathSegments.length === 0) {
      return result;
    }

    // Build path segments
    let currentPath = '';
    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      const isLast = index === pathSegments.length - 1;
      switch (segment) {
        case 'applications':
          result.push({
            path: currentPath,
            label: 'Solicitudes',
            isLast
          });
          break;
        case 'prospects':
          result.push({
            path: currentPath,
            label: 'Prospectos',
            isLast
          });
          break;
        case 'alerts':
          result.push({
            path: currentPath,
            label: 'Alertas',
            isLast
          });
          break;
        case 'settings':
          result.push({
            path: currentPath,
            label: 'Ajustes',
            isLast
          });
          break;
        case 'edit':
          result.push({
            path: currentPath,
            label: 'Editar',
            isLast: !getCurrentFormSection() // Only last if no section
          });

          // Add current form section if available
          const currentSection = getCurrentFormSection();
          if (currentSection) {
            result.push({
              path: currentPath,
              label: getFormSectionLabel(currentSection),
              isLast: true
            });
          }
          break;
        case 'guarantors':
          result.push({
            path: currentPath,
            label: 'Fiadores',
            isLast
          });
          break;
        case 'new':
          result.push({
            path: currentPath,
            label: 'Nuevo',
            isLast
          });
          break;
        default:
          // Check if it's an ID segment (usually UUID or similar patterns)
          if (/^[a-zA-Z0-9-_]+$/.test(segment)) {
            // This is likely an ID - use contextual name
            if (pathSegments[index - 1] === 'applications') {
              result.push({
                path: currentPath,
                label: 'Solicitud',
                isLast
              });
            } else if (pathSegments[index - 1] === 'prospects') {
              result.push({
                path: currentPath,
                label: 'Prospecto',
                isLast
              });
            } else if (pathSegments[index - 1] === 'guarantors') {
              result.push({
                path: currentPath,
                label: 'Fiador',
                isLast
              });
            } else {
              result.push({
                path: currentPath,
                label: segment,
                isLast
              });
            }
          } else {
            // Regular segment
            result.push({
              path: currentPath,
              label: segment.charAt(0).toUpperCase() + segment.slice(1),
              isLast
            });
          }
      }
    });
    return result;
  };
  const breadcrumbPaths = getBreadcrumbPaths();
  if (breadcrumbPaths.length <= 1) {
    return null; // Don't show breadcrumbs on home page
  }
  return;
};
export default BreadcrumbNavigation;