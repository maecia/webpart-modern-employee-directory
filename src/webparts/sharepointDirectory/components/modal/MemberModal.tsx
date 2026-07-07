import * as React from 'react'
import { Modal } from '@fluentui/react/lib/Modal'
import { Icon } from '@fluentui/react/lib/Icon'
import { PersonaSize } from '@fluentui/react/lib/Persona'
import { Member } from '../../../../models/Member'
import { CardFieldName } from '../../../../models/DirectoryConfig'
import { getTeamsDeepLink } from '../../../../utils/teamsDeepLink'
import { getMailtoLink } from '../../../../utils/formatUtils'
import PersonaAvatar from '../shared/PersonaAvatar'
import TeamsIcon from '../shared/TeamsIcon'
import OutlookIcon from '../shared/OutlookIcon'

interface MemberModalProps {
  member: Member | null
  modalFields: CardFieldName[]
  onDismiss: () => void
}

const Divider = () => (
  <hr
    style={{
      border: 'none',
      borderTop: '1px solid #edebe9',
      margin: '12px 0',
      width: '100%',
    }}
  />
)

const FieldIcon = ({ name }: { name: string }) => (
  <Icon iconName={name} styles={{ root: { color: '#605e5c', fontSize: 16 } }} />
)

const MemberModal: React.FC<MemberModalProps> = ({
  member,
  modalFields,
  onDismiss,
}) => {
  if (!member) return null

  const fullName =
    `${member.givenName || ''} ${member.surname || ''}`.trim() ||
    member.displayName

  const hasDetailFields =
    (modalFields.includes('email') && !!member.email) ||
    (modalFields.includes('phone') && !!member.mobilePhone) ||
    (modalFields.includes('department') && !!member.department) ||
    (modalFields.includes('officeLocation') && !!member.officeLocation) ||
    (modalFields.includes('manager') && !!member.managerDisplayName)

  const hasActionButtons =
    (modalFields.includes('outlook') && !!member.email) ||
    (modalFields.includes('teams') && !!member.teamsId)

  return (
    <Modal
      isOpen={!!member}
      onDismiss={onDismiss}
      isBlocking={false}
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
        `}</style>
        <button
          onClick={onDismiss}
          aria-label="Fermer"
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
            color: '#605e5c',
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

        {modalFields.includes('photo') && (
          <PersonaAvatar
            photoUrl={member.photoUrl}
            displayName={member.displayName}
            givenName={member.givenName}
            size={PersonaSize.size100}
            coinSize={80}
            imageShouldFadeIn={false}
          />
        )}

        {(modalFields.includes('name') ||
          modalFields.includes('firstName')) && (
          <h2
            style={{
              margin: '16px 0 4px',
              fontSize: 20,
              fontWeight: 600,
              color: '#201f1e',
              textAlign: 'center',
            }}
          >
            {fullName}
          </h2>
        )}

        {modalFields.includes('jobTitle') && member.jobTitle && (
          <p
            style={{
              margin: '0 0 4px',
              fontSize: 14,
              color: '#605e5c',
              textAlign: 'center',
            }}
          >
            {member.jobTitle}
          </p>
        )}

        {modalFields.includes('officeLocation') && member.officeLocation && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              marginBottom: 4,
            }}
          >
            <FieldIcon name="MapPin" />
            <span style={{ fontSize: 13, color: '#605e5c' }}>
              {member.officeLocation}
            </span>
          </div>
        )}

        {hasDetailFields && (
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
              {modalFields.includes('email') && member.email && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <FieldIcon name="Mail" />
                  <a
                    href={getMailtoLink(member.email)}
                    style={{
                      fontSize: 14,
                      color: '#201f1e',
                      textDecoration: 'none',
                    }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    {member.email}
                  </a>
                </div>
              )}
              {modalFields.includes('phone') && member.mobilePhone && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <FieldIcon name="Phone" />
                  <span style={{ fontSize: 14, color: '#201f1e' }}>
                    {member.mobilePhone}
                  </span>
                </div>
              )}
              {modalFields.includes('department') && member.department && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <FieldIcon name="Org" />
                  <span style={{ fontSize: 14, color: '#201f1e' }}>
                    {member.department}
                  </span>
                </div>
              )}
              {modalFields.includes('manager') && member.managerDisplayName && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <FieldIcon name="Contact" />
                  <span style={{ fontSize: 14, color: '#201f1e' }}>
                    {member.managerDisplayName}
                  </span>
                </div>
              )}
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
            {modalFields.includes('teams') && member.teamsId && (
              <button
                onClick={() =>
                  window.open(getTeamsDeepLink(member.teamsId!), '_blank')
                }
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#f3f4f6'
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
                  border: '1.5px solid #0099a4',
                  background: 'transparent',
                  color: '#0099a4',
                  fontSize: 15,
                  fontWeight: 500,
                  cursor: 'pointer',
                  transition: 'background-color 0.15s ease',
                }}
              >
                <TeamsIcon size={20} />
                Contacter via Teams
              </button>
            )}
            {modalFields.includes('outlook') && member.email && (
              <button
                onClick={() =>
                  window.open(getMailtoLink(member.email!), '_blank')
                }
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#f3f4f6'
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
                Envoyer un email
              </button>
            )}
          </div>
        )}
      </div>
    </Modal>
  )
}

export default MemberModal
