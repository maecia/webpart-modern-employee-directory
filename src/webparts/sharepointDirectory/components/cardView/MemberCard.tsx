import * as React from 'react'
import { PersonaSize } from '@fluentui/react/lib/Persona'
import { useTheme } from '@fluentui/react/lib/Theme'
import { strings } from '../../loc/mystrings'
import { Member } from '../../../../models/Member'
import { getTeamsDeepLink } from '../../../../utils/teamsDeepLink'
import { getMailtoLink } from '../../../../utils/formatUtils'
import PersonaAvatar from '../shared/PersonaAvatar'
import TeamsIcon from '../shared/TeamsIcon'
import OutlookIcon from '../shared/OutlookIcon'

interface MemberCardProps {
  member: Member
  cardFieldOrder: string[]
  members: Member[]
  onClick: (member: Member) => void
}

const MemberCard: React.FC<MemberCardProps> = ({
  member,
  cardFieldOrder,
  members,
  onClick,
}) => {
  const fullName =
    `${member.givenName || ''} ${member.surname || ''}`.trim() ||
    member.displayName

  const theme = useTheme()
  const primaryColor = theme?.palette?.themePrimary || '#1B7A6E'

  const showPhoto = cardFieldOrder.includes('photo')
  const showName = cardFieldOrder.includes('name')
  const showFirst = cardFieldOrder.includes('firstName')

  // Only photo/name/firstName are structurally fixed at the card top.
  // All other fields (including outlook/teams) respect the declared order.
  const STRUCTURAL = new Set(['photo', 'name', 'firstName'])
  const contentFields = cardFieldOrder.filter((k) => !STRUCTURAL.has(k))

  // Group consecutive outlook/teams into a single icon row for better appearance
  type ContentGroup =
    | { type: 'text'; key: string }
    | { type: 'icons'; keys: string[] }
  const ICON_KEYS = new Set(['outlook', 'teams'])
  const contentGroups: ContentGroup[] = []
  for (const key of contentFields) {
    if (ICON_KEYS.has(key)) {
      const last = contentGroups[contentGroups.length - 1]
      if (last && last.type === 'icons') {
        last.keys.push(key)
      } else {
        contentGroups.push({ type: 'icons', keys: [key] })
      }
    } else {
      contentGroups.push({ type: 'text', key })
    }
  }

  const renderField = (key: string): React.ReactNode => {
    const STANDARD: Record<string, (m: Member) => string | undefined> = {
      email: (m) => m.email,
      phone: (m) => m.mobilePhone,
      jobTitle: (m) => m.jobTitle,
      department: (m) => m.department,
      officeLocation: (m) => m.officeLocation,
    }

    if (key === 'manager') {
      if (!member.managerDisplayName) return null
      const managerMember = member.managerId
        ? members.find((m) => m.id === member.managerId)
        : undefined
      return (
        <>
          <style>{`
            .spdir-mgr-link { display: inline-block; width: fit-content; position: relative; padding-bottom: 2px; }
            .spdir-mgr-link::after { content: ''; position: absolute; bottom: 0; left: 0; width: 100%; height: 1px; background: currentColor; transform-origin: right; transform: scaleX(0); transition: transform 0.3s ease; }
            .spdir-mgr-link:hover::after { transform: scaleX(1); }
          `}</style>
          <span
            className="spdir-mgr-link"
            style={{
              fontSize: 13,
              color: managerMember ? primaryColor : '#605e5c',
              lineHeight: 1.4,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              cursor: managerMember ? 'pointer' : 'default',
            }}
            onClick={
              managerMember
                ? (e) => {
                    e.stopPropagation()
                    onClick(managerMember)
                  }
                : undefined
            }
            title={managerMember ? strings.ViewProfile : undefined}
          >
            {member.managerDisplayName}
          </span>
        </>
      )
    }

    if (STANDARD[key]) {
      const val = STANDARD[key](member)
      if (!val) return null
      return (
        <span
          style={{
            fontSize: 13,
            color: '#605e5c',
            lineHeight: 1.4,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {val}
        </span>
      )
    }

    // EntraID / custom
    const val = member.customProperties?.[key]
    if (!val) return null
    return (
      <span
        style={{
          fontSize: 13,
          color: '#605e5c',
          lineHeight: 1.4,
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}
      >
        {val}
      </span>
    )
  }

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
      aria-label={`${fullName} - ${strings.ClickForDetails}`}
    >
      {showPhoto && (
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
        {(showName || showFirst) && (
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
            {showFirst && member.givenName ? member.givenName : ''}
            {showName && showFirst && member.givenName && member.surname
              ? ' '
              : ''}
            {showName && member.surname ? member.surname : ''}
            {!member.givenName && !member.surname ? fullName : ''}
          </span>
        )}

        {contentGroups.map((group, gi) => {
          if (group.type === 'icons') {
            const iconNodes = group.keys
              .map((k) => {
                if (k === 'outlook' && member.email) {
                  return (
                    <a
                      key="outlook"
                      href={getMailtoLink(member.email)}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={strings.SendEmail}
                      aria-label={strings.SendEmail}
                      onClick={(e) => e.stopPropagation()}
                      style={{ display: 'flex', alignItems: 'center' }}
                    >
                      <OutlookIcon size={20} />
                    </a>
                  )
                }
                if (k === 'teams' && member.teamsId) {
                  return (
                    <a
                      key="teams"
                      href={getTeamsDeepLink(member.teamsId)}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={strings.ContactViaTeams}
                      aria-label={strings.ContactViaTeams}
                      onClick={(e) => e.stopPropagation()}
                      style={{ display: 'flex', alignItems: 'center' }}
                    >
                      <TeamsIcon size={20} />
                    </a>
                  )
                }
                return null
              })
              .filter(Boolean)
            if (iconNodes.length === 0) return null
            return (
              <div
                key={`icons_${gi}`}
                style={{ display: 'flex', gap: 8, marginTop: 4 }}
              >
                {iconNodes}
              </div>
            )
          }
          const node = renderField(group.key)
          if (!node) return null
          return <React.Fragment key={group.key}>{node}</React.Fragment>
        })}
      </div>
    </div>
  )
}

export default MemberCard
