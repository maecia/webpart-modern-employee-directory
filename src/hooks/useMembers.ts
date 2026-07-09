import { useState, useEffect, useCallback, useRef } from 'react';
import { Member } from '../models/Member';
import { GraphService } from '../services/GraphService';
import { strings } from '../webparts/sharepointDirectory/loc/mystrings';
import { WebPartContext } from '@microsoft/sp-webpart-base';

interface UseMembersResult {
  members: Member[];
  isLoading: boolean;
  error: string | null;
  retry: () => void;
}

export function useMembers(
  context: WebPartContext,
  customFieldKeys: string[] = [],
  onDetectedExtensionAttrs?: (attrs: string[]) => void,
): UseMembersResult {
  const [members, setMembers] = useState<Member[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const serviceRef = useRef<GraphService | null>(null);

  const loadMembers = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      serviceRef.current?.dispose();
      const service = new GraphService(context);
      serviceRef.current = service;

      const { members: data, detectedExtensionAttrs } = await service.getMembers(customFieldKeys);

      if (detectedExtensionAttrs.length > 0 && onDetectedExtensionAttrs) {
        onDetectedExtensionAttrs(detectedExtensionAttrs);
      }

      const membersWithPhotos = await Promise.all(
        data.map(async (member) => {
          if (member.id) {
            const photoUrl = await service.getMemberPhoto(member.id);
            return { ...member, photoUrl: photoUrl || undefined };
          }
          return member;
        })
      );

      setMembers(membersWithPhotos);
    } catch (err) {
      setError(strings.ErrorLoading);
    } finally {
      setIsLoading(false);
    }
  }, [context, retryCount, customFieldKeys.join(',')]);

  useEffect(() => {
    loadMembers();
    return () => {
      serviceRef.current?.dispose();
    };
  }, [loadMembers]);

  const retry = useCallback(() => {
    setRetryCount(c => c + 1);
  }, []);

  return { members, isLoading, error, retry };
}
