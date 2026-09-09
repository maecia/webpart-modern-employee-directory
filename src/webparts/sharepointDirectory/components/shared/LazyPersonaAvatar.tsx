import * as React from 'react'
import { PersonaSize } from '@fluentui/react/lib/Persona'
import { PhotoContext } from '../PhotoContext'
import PersonaAvatar from './PersonaAvatar'

interface LazyPersonaAvatarProps {
  userId: string
  displayName: string
  givenName?: string
  size?: PersonaSize
  coinSize?: number
  imageShouldFadeIn?: boolean
}

const LazyPersonaAvatar: React.FC<LazyPersonaAvatarProps> = ({
  userId,
  displayName,
  givenName,
  size,
  coinSize,
  imageShouldFadeIn,
}) => {
  const [photoUrl, setPhotoUrl] = React.useState<string | undefined>(undefined)
  const ref = React.useRef<HTMLDivElement>(null)
  const getPhoto = React.useContext(PhotoContext)
  const loadedRef = React.useRef(false)

  React.useEffect(() => {
    if (!userId || !getPhoto || loadedRef.current) return
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          observer.disconnect()
          loadedRef.current = true
          getPhoto(userId).then((url) => {
            if (url) setPhotoUrl(url)
          })
        }
      },
      { rootMargin: '200px' },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [userId, getPhoto])

  return (
    <div ref={ref}>
      <PersonaAvatar
        photoUrl={photoUrl}
        displayName={displayName}
        givenName={givenName}
        size={size}
        coinSize={coinSize}
        imageShouldFadeIn={imageShouldFadeIn}
      />
    </div>
  )
}

export default LazyPersonaAvatar
