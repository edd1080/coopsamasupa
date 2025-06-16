
import { useRef, useCallback } from 'react';
import { isEqual } from 'lodash';

interface UseIncrementalSaveProps {
  currentData: any;
  onSave: (changedData: any, hasChanges: boolean) => Promise<void>;
}

export const useIncrementalSave = ({ currentData, onSave }: UseIncrementalSaveProps) => {
  const lastSavedDataRef = useRef<any>({});
  const savingRef = useRef(false);

  const getChangedFields = useCallback((current: any, previous: any, path = ''): any => {
    const changes: any = {};
    
    // Handle null/undefined cases
    if (!current && !previous) return changes;
    if (!current && previous) return { [path || 'data']: current };
    if (current && !previous) return { [path || 'data']: current };
    
    // If both are primitive values, compare directly
    if (typeof current !== 'object' || typeof previous !== 'object') {
      return !isEqual(current, previous) ? { [path || 'data']: current } : changes;
    }
    
    // Compare objects
    const allKeys = new Set([...Object.keys(current || {}), ...Object.keys(previous || {})]);
    
    for (const key of allKeys) {
      const currentValue = current?.[key];
      const previousValue = previous?.[key];
      const currentPath = path ? `${path}.${key}` : key;
      
      if (!isEqual(currentValue, previousValue)) {
        if (typeof currentValue === 'object' && currentValue !== null && 
            typeof previousValue === 'object' && previousValue !== null) {
          // Recursively check nested objects
          const nestedChanges = getChangedFields(currentValue, previousValue, currentPath);
          Object.assign(changes, nestedChanges);
        } else {
          // Direct assignment for primitive values or null/undefined
          changes[key] = currentValue;
        }
      }
    }
    
    return changes;
  }, []);

  const saveIncremental = useCallback(async (forceFullSave = false) => {
    if (savingRef.current) {
      console.log('🔄 Save already in progress, skipping...');
      return;
    }

    savingRef.current = true;
    
    try {
      const previousData = lastSavedDataRef.current;
      const changedData = forceFullSave ? currentData : getChangedFields(currentData, previousData);
      const hasChanges = Object.keys(changedData).length > 0 || forceFullSave;
      
      console.log('💾 Incremental save analysis:', {
        hasChanges,
        changedFields: Object.keys(changedData),
        forceFullSave,
        changedData: hasChanges ? changedData : 'No changes'
      });
      
      if (hasChanges || forceFullSave) {
        await onSave(forceFullSave ? currentData : changedData, hasChanges);
        // Only update reference after successful save
        lastSavedDataRef.current = { ...currentData };
        console.log('✅ Incremental save completed successfully');
      } else {
        console.log('ℹ️ No changes detected, skipping save');
      }
    } catch (error) {
      console.error('❌ Incremental save failed:', error);
      throw error;
    } finally {
      savingRef.current = false;
    }
  }, [currentData, getChangedFields, onSave]);

  const updateLastSavedData = useCallback((data: any) => {
    lastSavedDataRef.current = { ...data };
  }, []);

  const hasUnsavedChanges = useCallback(() => {
    const changes = getChangedFields(currentData, lastSavedDataRef.current);
    return Object.keys(changes).length > 0;
  }, [currentData, getChangedFields]);

  return {
    saveIncremental,
    updateLastSavedData,
    hasUnsavedChanges,
    getChangedFields: () => getChangedFields(currentData, lastSavedDataRef.current)
  };
};
