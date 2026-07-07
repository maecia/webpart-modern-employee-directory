import { useState, useEffect, useCallback } from 'react';
import { AccessControlService, AccessControl } from '../services/AccessControlService';
import { WebPartContext } from '@microsoft/sp-webpart-base';

interface UseAccessControlResult extends AccessControl {
  isLoading: boolean;
  error: string | null;
  retry: () => void;
}

export function useAccessControl(
  context: WebPartContext,
  groupId: number | null
): UseAccessControlResult {
  const [state, setState] = useState<UseAccessControlResult>({
    hasAccess: true,
    userGroups: [],
    isLoading: true,
    error: null,
    retry: () => {}
  });

  const checkAccess = useCallback(async () => {
    try {
      const accessControlService = new AccessControlService(context);
      const result = await accessControlService.checkAccess(groupId);
      setState(prev => ({
        ...prev,
        hasAccess: result.hasAccess,
        userGroups: result.userGroups,
        isLoading: false,
        error: null
      }));
    } catch (err) {
      setState(prev => ({
        ...prev,
        hasAccess: false,
        isLoading: false,
        error: 'Impossible de vérifier vos droits d\'accès.'
      }));
    }
  }, [context, groupId]);

  useEffect(() => {
    checkAccess();
  }, [checkAccess]);

  const retry = useCallback(() => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    checkAccess();
  }, [checkAccess]);

  return { ...state, retry };
}
