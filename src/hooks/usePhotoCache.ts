import { useRef, useCallback, useEffect } from 'react'
import { WebPartContext } from '@microsoft/sp-webpart-base'
import { GraphService } from '../services/GraphService'
import { GetPhotoFn } from '../webparts/sharepointDirectory/components/PhotoContext'

export function usePhotoCache(context: WebPartContext): GetPhotoFn {
  const serviceRef = useRef<GraphService | null>(null)
  const cacheRef = useRef(new Map<string, string | null>())
  const pendingRef = useRef(new Map<string, Promise<string | null>>())

  if (!serviceRef.current) {
    serviceRef.current = new GraphService(context)
  }

  useEffect(() => {
    return () => {
      serviceRef.current?.dispose()
      serviceRef.current = null
    }
  }, [])

  const getPhoto = useCallback(
    async (userId: string): Promise<string | null> => {
      if (cacheRef.current.has(userId)) {
        return cacheRef.current.get(userId)!
      }
      if (pendingRef.current.has(userId)) {
        return pendingRef.current.get(userId)!
      }
      const promise = serviceRef.current!.getMemberPhoto(userId).then((url) => {
        cacheRef.current.set(userId, url)
        pendingRef.current.delete(userId)
        return url
      })
      pendingRef.current.set(userId, promise)
      return promise
    },
    [],
  )

  return getPhoto
}
