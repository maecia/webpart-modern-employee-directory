import * as React from 'react'
import { PersonaSize } from '@fluentui/react/lib/Persona'
import { useTheme } from '@fluentui/react/lib/Theme'
import { Member } from '../../../../models/Member'
import { CardFieldName } from '../../../../models/DirectoryConfig'
import { getTeamsDeepLink } from '../../../../utils/teamsDeepLink'
import { getMailtoLink } from '../../../../utils/formatUtils'
import PersonaAvatar from '../shared/PersonaAvatar'
import TeamsIcon from '../shared/TeamsIcon'
import OutlookIcon from '../shared/OutlookIcon'

interface MemberCardProps {
  member: Member
  cardFields: CardFieldName[]
  onClick: (member: Member) => void
}

const MemberCard: React.FC<MemberCardProps> = ({
  member,
  cardFields,
  onClick,
}) => {
  const theme = useTheme()
  const primaryColor = theme?.palette?.themePrimary || '#1B7A6E'
  const fullName =
    `${member.givenName || ''} ${member.surname || ''}`.trim() ||
    member.displayName

  const fieldValue = (field: CardFieldName): string | undefined => {
    switch (field) {
      case 'email':
        return member.email
      case 'phone':
        return member.mobilePhone
      case 'jobTitle':
        return member.jobTitle
      case 'department':
        return member.department
      case 'officeLocation':
        return member.officeLocation
      case 'manager':
        return member.managerDisplayName
      default:
        return undefined
    }
  }

  const textFields = cardFields.filter(
    (f) =>
      !['photo', 'name', 'firstName', 'outlook', 'teams'].includes(f) && fieldValue(f),
  )

  return (
    <div
      style={{
        background: '#ffffff',
        borderRadius: 12,
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        cursor: 'pointer',
        overflow: 'hidden',
        transition: 'box-shadow 0.15s ease',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        padding: '16px',
        gap: 14,
      }}
      onClick={() => onClick(member)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onClick(member)
        }
      }}
      onMouseEnter={(e) => {
        ;(e.currentTarget as HTMLElement).style.boxShadow =
          '0 4px 16px rgba(0,0,0,0.14)'
      }}
      onMouseLeave={(e) => {
        ;(e.currentTarget as HTMLElement).style.boxShadow =
          '0 2px 8px rgba(0,0,0,0.08)'
      }}
      aria-label={`${fullName} - Cliquez pour les détails`}
    >
      {cardFields.includes('photo') && (
        <PersonaAvatar
          photoUrl={member.photoUrl}
          displayName={member.displayName}
          givenName={member.givenName}
          size={PersonaSize.size100}
          coinSize={80}
        />
      )}

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          minWidth: 0,
        }}
      >
        {(cardFields.includes('name') || cardFields.includes('firstName')) && (
          <span
            style={{
              fontSize: 16,
              fontWeight: 600,
              color: '#201f1e',
              lineHeight: 1.3,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {cardFields.includes('firstName') && member.givenName ? member.givenName : ''}
            {cardFields.includes('name') && cardFields.includes('firstName') && member.givenName && member.surname ? ' ' : ''}
            {cardFields.includes('name') && member.surname ? member.surname : ''}
            {!member.givenName && !member.surname ? fullName : ''}
          </span>
        )}

        {textFields.map((field) => (
          <span
            key={field}
            style={{
              fontSize: 13,
              color: '#605e5c',
              lineHeight: 1.4,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {fieldValue(field)}
          </span>
        ))}

        {(member.email || member.teamsId) && (
          <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
            {member.email && cardFields.includes('outlook') && (
              <a
                href={getMailtoLink(member.email!)}
                title="Envoyer un email"
                aria-label="Envoyer un email"
                onClick={(e) => e.stopPropagation()}
                style={{ display: 'flex', alignItems: 'center' }}
              >
                <OutlookIcon size={20} />
              </a>
            )}
            {member.teamsId && cardFields.includes('teams') && (
              <a
                href={getTeamsDeepLink(member.teamsId!)}
                target="_blank"
                rel="noopener noreferrer"
                title="Contacter via Teams"
                aria-label="Contacter via Teams"
                onClick={(e) => e.stopPropagation()}
                style={{ display: 'flex', alignItems: 'center' }}
              >
                <TeamsIcon size={20} />
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default MemberCard
