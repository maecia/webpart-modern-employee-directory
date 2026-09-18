import { useState, useEffect, useCallback, useRef } from 'react'
import { Member } from '../models/Member'
import { GraphService } from '../services/GraphService'
import { strings } from '../webparts/sharepointDirectory/loc/mystrings'
import { WebPartContext } from '@microsoft/sp-webpart-base'

interface UseMembersResult {
  members: Member[]
  isLoading: boolean
  error: string | null
  retry: () => void
}

export function useMembers(
  context: WebPartContext,
  customFieldKeys: string[] = [],
  onDetectedExtensionAttrs?: (attrs: string[]) => void,
): UseMembersResult {
  const [members, setMembers] = useState<Member[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [retryCount, setRetryCount] = useState(0)
  const serviceRef = useRef<GraphService | null>(null)

  // Stable primitive key so the callback is not recreated on every array render,
  // and a ref for the callback so it never becomes a reactive dependency.
  const customFieldsKey = customFieldKeys.join(',')
  const onDetectedExtAttrsRef = useRef(onDetectedExtensionAttrs)
  onDetectedExtAttrsRef.current = onDetectedExtensionAttrs

  const loadMembers = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      serviceRef.current?.dispose()
      const service = new GraphService(context)
      serviceRef.current = service

      const keys = customFieldsKey ? customFieldsKey.split(',') : []
      const { members: data, detectedExtensionAttrs } =
        await service.getMembers(keys)

      if (detectedExtensionAttrs.length > 0 && onDetectedExtAttrsRef.current) {
        onDetectedExtAttrsRef.current(detectedExtensionAttrs)
      }

      setMembers(data)
    } catch (err) {
      setError(strings.ErrorLoading)
    } finally {
      setIsLoading(false)
    }
    // retryCount is a deliberate trigger: bumping it re-creates this callback and reloads.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [context, retryCount, customFieldsKey])

  useEffect(() => {
    loadMembers()
    return () => {
      serviceRef.current?.dispose()
    }
  }, [loadMembers])

  const retry = useCallback(() => {
    setRetryCount((c) => c + 1)
  }, [])

  return { members, isLoading, error, retry }
}
