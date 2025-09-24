import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useFormContext } from './RequestFormProvider';

interface SafeNavigationWrapperProps {
  children: React.ReactNode;
}

const SafeNavigationWrapper: React.FC<SafeNavigationWrapperProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { formData, handleExit, showExitDialog } = useFormContext();

  useEffect(() => {
    const preventBlankPage = () => {
      // Check if we're in a valid form state
      if (!formData || Object.keys(formData).length === 0) {
        console.warn('Form data missing, redirecting to applications');
        navigate('/applications', { replace: true });
        return;
      }

      // Check if we're in an invalid route state
      if (location.pathname.includes('/applications/') && !formData.id && !formData.applicationId) {
        console.warn('Invalid application route without ID, redirecting to applications');
        navigate('/applications', { replace: true });
        return;
      }
    };

    // Small delay to allow context to initialize
    const timer = setTimeout(preventBlankPage, 100);
    
    return () => clearTimeout(timer);
  }, [formData, location.pathname, navigate]);

  // Handle browser back button
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      // Don't interfere if exit dialog is already showing
      if (showExitDialog) {
        console.log('🚫 SafeNavigationWrapper: Exit dialog is showing, not interfering');
        return;
      }
      
      event.preventDefault();
      
      // Show exit confirmation if user tries to navigate away
      const confirmExit = window.confirm(
        '¿Está seguro que desea salir del formulario? Los cambios no guardados se perderán.'
      );
      
      if (confirmExit) {
        console.log('🔄 SafeNavigationWrapper: User confirmed exit via back button');
        handleExit(false); // Exit without saving
      } else {
        // Push current state back to prevent navigation
        window.history.pushState(null, '', location.pathname);
      }
    };

    window.addEventListener('popstate', handlePopState);
    
    // Push initial state to handle back button
    window.history.pushState(null, '', location.pathname);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [handleExit, location.pathname, showExitDialog]);

  return <>{children}</>;
};

export default SafeNavigationWrapper;