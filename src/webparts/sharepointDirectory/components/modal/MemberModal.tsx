import * as React from 'react'
import { Modal } from '@fluentui/react/lib/Modal'
import { PersonaSize } from '@fluentui/react/lib/Persona'
import { useTheme } from '@fluentui/react/lib/Theme'
import { Member } from '../../../../models/Member'
import { getEntraFieldLabel } from '../../../../models/DirectoryConfig'
import { getTeamsDeepLink } from '../../../../utils/teamsDeepLink'
import { getMailtoLink } from '../../../../utils/formatUtils'
import { themeColorVars } from '../../../../utils/themeColors'
import { strings } from '../../loc/mystrings'
import PersonaAvatar from '../shared/PersonaAvatar'
import LazyPersonaAvatar from '../shared/LazyPersonaAvatar'
import TeamsIcon from '../shared/TeamsIcon'
import OutlookIcon from '../shared/OutlookIcon'

interface MemberModalProps {
  member: Member | null
  members: Member[]
  modalFieldOrder: string[]
  modalFieldLabels: Record<string, string>
  onDismiss: () => void
  onMemberClick: (member: Member) => void
}

const Divider = () => (
  <hr
    style={{
      border: 'none',
      borderTop: '1px solid var(--spdc-divider)',
      margin: '12px 0',
      width: '100%',
    }}
  />
)

/** Uniform label+value row used for every detail field */
const FieldRow = ({
  label,
  value,
  link,
}: {
  label: string
  value: string
  link?: string
}) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
    <span style={{ fontSize: 12, color: 'var(--spdc-text-secondary)' }}>{label}</span>
    {link ? (
      <a
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        style={{ fontSize: 14, color: 'var(--spdc-text-primary)', textDecoration: 'none' }}
        onClick={(e) => e.stopPropagation()}
      >
        {value}
      </a>
    ) : (
      <span style={{ fontSize: 14, color: 'var(--spdc-text-primary)' }}>{value}</span>
    )}
  </div>
)

const MemberModal: React.FC<MemberModalProps> = ({
  member,
  members,
  modalFieldOrder,
  modalFieldLabels,
  onDismiss,
  onMemberClick,
}) => {
  const theme = useTheme()
  const primaryColor = theme?.palette?.themePrimary || '#1B7A6E'
  const themeVars = React.useMemo(
    () => themeColorVars(theme) as React.CSSProperties,
    [theme],
  )

  if (!member) return null

  const fullName =
    `${member.givenName || ''} ${member.surname || ''}`.trim() ||
    member.displayName

  const managerMember = member.managerId
    ? members.find((m) => m.id === member.managerId)
    : undefined

  // Fields shown in the fixed header (position-based, not ordered)
  const showPhoto = modalFieldOrder.includes('photo')
  const showName =
    modalFieldOrder.includes('name') || modalFieldOrder.includes('firstName')
  const showFirstName = modalFieldOrder.includes('firstName')
  const showLastName = modalFieldOrder.includes('name')

  // Detail fields: everything except photo / name / firstName (rendered in declared order)
  const HEADER = new Set(['photo', 'name', 'firstName'])
  const detailFields = modalFieldOrder.filter((k) => !HEADER.has(k))

  const DETAIL_FIELDS = new Set([
    'jobTitle',
    'email',
    'phone',
    'department',
    'officeLocation',
    'manager',
  ])
  const ACTION_FIELDS = new Set(['outlook', 'teams'])

  const hasDetailSection = detailFields.some((k) => {
    if (ACTION_FIELDS.has(k)) return false
    switch (k) {
      case 'email':
        return !!member.email
      case 'phone':
        return !!member.mobilePhone
      case 'department':
        return !!member.department
      case 'officeLocation':
        return !!member.officeLocation
      case 'manager':
        return !!member.managerDisplayName
      case 'jobTitle':
        return !!member.jobTitle
      default:
        return !!member.customProperties?.[k]
    }
  })

  const hasActionButtons =
    (detailFields.includes('outlook') && !!member.email) ||
    (detailFields.includes('teams') && !!member.teamsId)

  return (
    <Modal
      isOpen={!!member}
      onDismiss={onDismiss}
      isBlocking={false}
      titleAriaId="spdir-modal-title"
      styles={{
        main: {
          maxWidth: 480,
          minWidth: 340,
          borderRadius: 12,
          padding: 0,
          overflow: 'hidden',
        },
      }}
    >
      <div
        style={{
          ...themeVars,
          position: 'relative',
          padding: '32px 28px 28px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          animation: 'spdir-modal-in 0.2s ease',
        }}
      >
        <style>{`
          @keyframes spdir-modal-in {
            from { opacity: 0; }
            to   { opacity: 1; }
          }
          .spdir-mgr-link {
            display: inline-block;
            width: fit-content;
            align-self: flex-start;
            position: relative;
            padding-bottom: 2px;
          }
          .spdir-mgr-link::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            height: 1px;
            background: currentColor;
            transform-origin: right;
            transform: scaleX(0);
            transition: transform 0.3s ease;
          }
          .spdir-mgr-link:hover::after {
            transform: scaleX(1);
          }
        `}</style>
        <button
          onClick={onDismiss}
          aria-label={strings.CloseModal}
          style={{
            position: 'absolute',
            top: 12,
            right: 12,
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: 6,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--spdc-text-secondary)',
          }}
        >
          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M.293.293a1 1 0 0 1 1.414 0L6 4.586 10.293.293a1 1 0 1 1 1.414 1.414L7.414 6l4.293 4.293a1 1 0 0 1-1.414 1.414L6 7.414l-4.293 4.293A1 1 0 0 1 .293 10.707L4.586 6 .293 1.707A1 1 0 0 1 .293.293Z" />
          </svg>
        </button>

        {showPhoto && (
          <LazyPersonaAvatar
            userId={member.id}
            displayName={member.displayName}
            givenName={member.givenName}
            size={PersonaSize.size100}
            coinSize={80}
            imageShouldFadeIn={false}
          />
        )}

        {showName && (
          <h2
            id="spdir-modal-title"
            style={{
              margin: '16px 0 4px',
              fontSize: 20,
              fontWeight: 600,
              color: 'var(--spdc-text-primary)',
              textAlign: 'center',
            }}
          >
            {showFirstName && member.givenName ? member.givenName : ''}
            {showFirstName && showLastName && member.givenName && member.surname
              ? ' '
              : ''}
            {showLastName && member.surname ? member.surname : ''}
            {!member.givenName && !member.surname ? fullName : ''}
          </h2>
        )}

        {hasDetailSection && (
          <>
            <Divider />
            <div
              style={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                gap: 12,
              }}
            >
              {detailFields.map((key) => {
                if (ACTION_FIELDS.has(key)) return null

                switch (key) {
                  case 'jobTitle':
                    return member.jobTitle ? (
                      <FieldRow
                        key={key}
                        label={strings.FieldJobTitle}
                        value={member.jobTitle}
                      />
                    ) : null

                  case 'email':
                    return member.email ? (
                      <FieldRow
                        key={key}
                        label={strings.FieldEmail}
                        value={member.email}
                        link={getMailtoLink(member.email)}
                      />
                    ) : null

                  case 'phone':
                    return member.mobilePhone ? (
                      <FieldRow
                        key={key}
                        label={strings.FieldPhone}
                        value={member.mobilePhone}
                      />
                    ) : null

                  case 'department':
                    return member.department ? (
                      <FieldRow
                        key={key}
                        label={strings.LabelDepartment}
                        value={member.department}
                      />
                    ) : null

                  case 'officeLocation':
                    return member.officeLocation ? (
                      <FieldRow
                        key={key}
                        label={strings.LabelLocation}
                        value={member.officeLocation}
                      />
                    ) : null

                  case 'manager':
                    return member.managerDisplayName ? (
                      <div
                        key={key}
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          gap: 2,
                        }}
                      >
                        <span
                          style={{
                            fontSize: 12,
                            color: 'var(--spdc-text-secondary)',
                            marginBottom: 4,
                          }}
                        >
                          {strings.LabelManager}
                        </span>
                        {managerMember ? (
                          <span
                            className="spdir-mgr-link"
                            role="button"
                            tabIndex={0}
                            style={{
                              fontSize: 14,
                              color: primaryColor,
                              cursor: 'pointer',
                            }}
                            onClick={(e) => {
                              e.stopPropagation()
                              onDismiss()
                              setTimeout(
                                () => onMemberClick(managerMember),
                                100,
                              )
                            }}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault()
                                e.stopPropagation()
                                onDismiss()
                                setTimeout(
                                  () => onMemberClick(managerMember),
                                  100,
                                )
                              }
                            }}
                          >
                            {member.managerDisplayName}
                          </span>
                        ) : (
                          <span style={{ fontSize: 14, color: 'var(--spdc-text-primary)' }}>
                            {member.managerDisplayName}
                          </span>
                        )}
                      </div>
                    ) : null

                  default: {
                    const val = member.customProperties?.[key]
                    if (!val) return null
                    const label =
                      modalFieldLabels[key] || getEntraFieldLabel(key)
                    return <FieldRow key={key} label={label} value={val} />
                  }
                }
              })}
            </div>
          </>
        )}

        {hasActionButtons && (
          <div
            style={{
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              gap: 10,
              marginTop: 16,
            }}
          >
            {detailFields.includes('teams') && member.teamsId && (
              <button
                onClick={() =>
                  window.open(getTeamsDeepLink(member.teamsId!), '_blank')
                }
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--spdc-action-hover)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent'
                }}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 10,
                  padding: '12px 20px',
                  borderRadius: 30,
                  border: '1.5px solid #6264A7',
                  background: 'transparent',
                  color: '#6264A7',
                  fontSize: 15,
                  fontWeight: 500,
                  cursor: 'pointer',
                  transition: 'background-color 0.15s ease',
                }}
              >
                <TeamsIcon size={20} />
                {strings.ContactViaTeams}
              </button>
            )}
            {detailFields.includes('outlook') && member.email && (
              <button
                onClick={() =>
                  window.open(getMailtoLink(member.email!), '_blank')
                }
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--spdc-action-hover)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent'
                }}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 10,
                  padding: '12px 20px',
                  borderRadius: 30,
                  border: '1.5px solid #0078D4',
                  background: 'transparent',
                  color: '#0078D4',
                  fontSize: 15,
                  fontWeight: 500,
                  cursor: 'pointer',
                  transition: 'background-color 0.15s ease',
                }}
              >
                <OutlookIcon size={20} />
                {strings.SendEmail}
              </button>
            )}
          </div>
        )}
      </div>
    </Modal>
  )
}

export default MemberModal
