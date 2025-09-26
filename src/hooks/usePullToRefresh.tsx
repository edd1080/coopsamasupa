import { useEffect, useRef, useState } from 'react';

interface UsePullToRefreshOptions {
  onRefresh: () => Promise<void>;
  threshold?: number;
  resistance?: number;
}

export const usePullToRefresh = ({ 
  onRefresh, 
  threshold = 80, 
  resistance = 0.5 
}: UsePullToRefreshOptions) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const [isPulling, setIsPulling] = useState(false);
  
  const startY = useRef(0);
  const currentY = useRef(0);
  const elementRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const handleTouchStart = (e: TouchEvent) => {
      // Only trigger if we're at the top of the scrollable area
      if (element.scrollTop === 0) {
        startY.current = e.touches[0].clientY;
        setIsPulling(true);
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isPulling) return;

      currentY.current = e.touches[0].clientY;
      const distance = Math.max(0, currentY.current - startY.current);
      
      // Apply resistance
      const resistedDistance = distance * resistance;
      setPullDistance(resistedDistance);

      // Prevent default scrolling when pulling
      if (distance > 0) {
        e.preventDefault();
      }
    };

    const handleTouchEnd = async () => {
      if (!isPulling) return;

      setIsPulling(false);
      
      if (pullDistance >= threshold && !isRefreshing) {
        console.log('🔄 Pull-to-refresh triggered');
        setIsRefreshing(true);
        try {
          console.log('🔄 Calling onRefresh function...');
          await onRefresh();
          console.log('✅ Pull-to-refresh completed successfully');
        } catch (error) {
          console.error('❌ Pull-to-refresh failed:', error);
        } finally {
          console.log('🔄 Resetting pull-to-refresh state');
          setIsRefreshing(false);
        }
      }
      
      setPullDistance(0);
    };

    element.addEventListener('touchstart', handleTouchStart, { passive: false });
    element.addEventListener('touchmove', handleTouchMove, { passive: false });
    element.addEventListener('touchend', handleTouchEnd);

    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchmove', handleTouchMove);
      element.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isPulling, pullDistance, threshold, resistance, onRefresh, isRefreshing]);

  const refreshIndicatorStyle = {
    transform: `translateY(${Math.min(pullDistance, threshold)}px)`,
    opacity: Math.min(pullDistance / threshold, 1),
  };

  return {
    elementRef,
    isRefreshing,
    isPulling,
    pullDistance,
    refreshIndicatorStyle,
    threshold,
  };
};
