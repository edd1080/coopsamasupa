import React from 'react';
import { RefreshCw } from 'lucide-react';
import { usePullToRefresh } from '@/hooks/usePullToRefresh';

interface PullToRefreshProps {
  onRefresh: () => Promise<void>;
  children: React.ReactNode;
  className?: string;
}

export const PullToRefresh: React.FC<PullToRefreshProps> = ({
  onRefresh,
  children,
  className = '',
}) => {
  const {
    elementRef,
    isRefreshing,
    isPulling,
    refreshIndicatorStyle,
    threshold,
  } = usePullToRefresh({ onRefresh });

  return (
    <div className={`relative ${className}`}>
      {/* Refresh Indicator */}
      <div
        className="absolute top-0 left-0 right-0 flex items-center justify-center py-4 bg-background/80 backdrop-blur-sm transition-all duration-200 z-10"
        style={refreshIndicatorStyle}
      >
        <div className="flex items-center gap-2 text-muted-foreground">
          <RefreshCw 
            className={`h-5 w-5 ${isRefreshing ? 'animate-spin' : ''}`} 
          />
          <span className="text-sm font-medium">
            {isRefreshing 
              ? 'Actualizando...' 
              : isPulling 
                ? 'Suelta para actualizar' 
                : 'Desliza hacia abajo para actualizar'
            }
          </span>
        </div>
      </div>

      {/* Content */}
      <div
        ref={elementRef}
        className="h-full overflow-auto"
        style={{
          transform: `translateY(${isPulling ? Math.min(refreshIndicatorStyle.transform.match(/-?\d+/)?.[0] || 0, threshold) : 0}px)`,
        }}
      >
        {children}
      </div>
    </div>
  );
};
