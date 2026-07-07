import * as React from 'react'
import { Persona, PersonaSize } from '@fluentui/react/lib/Persona'

const defaultAvatarUrl = require('../../assets/default-avatar.png')

interface PersonaAvatarProps {
  photoUrl?: string
  displayName: string
  givenName?: string
  size?: PersonaSize
  coinSize?: number
  imageShouldFadeIn?: boolean
}

const PersonaAvatar: React.FC<PersonaAvatarProps> = ({
  photoUrl,
  displayName,
  givenName,
  size = PersonaSize.size48,
  coinSize,
  imageShouldFadeIn = true,
}) => {
  return (
    <Persona
      imageUrl={photoUrl || defaultAvatarUrl}
      text={displayName}
      secondaryText={givenName}
      size={size}
      coinSize={coinSize}
      hidePersonaDetails={true}
      imageShouldFadeIn={imageShouldFadeIn}
      styles={{
        root: {
          justifyContent: 'center',
        },
      }}
    />
  )
}

export default PersonaAvatar
