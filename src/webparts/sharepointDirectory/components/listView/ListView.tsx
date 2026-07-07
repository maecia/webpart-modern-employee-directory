import * as React from 'react'
import { PersonaSize } from '@fluentui/react/lib/Persona'
import { useTheme } from '@fluentui/react/lib/Theme'
import { Member } from '../../../../models/Member'
import { CardFieldName } from '../../../../models/DirectoryConfig'
import { usePagination } from '../../../../hooks/usePagination'
import { getTeamsDeepLink } from '../../../../utils/teamsDeepLink'
import { getMailtoLink } from '../../../../utils/formatUtils'
import PersonaAvatar from '../shared/PersonaAvatar'
import TeamsIcon from '../shared/TeamsIcon'
import OutlookIcon from '../shared/OutlookIcon'

interface ListViewProps {
  members: Member[]
  listFields: CardFieldName[]
  onMemberClick: (member: Member) => void
}

interface SortState {
  key:
    | 'displayName'
    | 'jobTitle'
    | 'email'
    | 'mobilePhone'
    | 'department'
    | 'officeLocation'
    | 'managerDisplayName'
  descending: boolean
}

const headerCellStyle: React.CSSProperties = {
  padding: '10px 16px',
  textAlign: 'left',
  fontSize: 11,
  fontWeight: 600,
  color: '#605e5c',
  letterSpacing: '0.04em',
  textTransform: 'uppercase',
  borderBottom: '1px solid #edebe9',
  userSelect: 'none',
  cursor: 'pointer',
  whiteSpace: 'nowrap',
  backgroundColor: '#F8F9FB',
}

const cellStyle: React.CSSProperties = {
  padding: '10px 16px',
  fontSize: 14,
  color: '#201f1e',
  verticalAlign: 'middle',
}

const ListView: React.FC<ListViewProps> = ({
  members,
  listFields,
  onMemberClick,
}) => {
  const { visibleItems, hasMore, loadMore } = usePagination(members, 'list')
  const theme = useTheme()
  const primaryColor = theme?.palette?.themePrimary || '#1B7A6E'
  const [loadMoreHovered, setLoadMoreHovered] = React.useState(false)
  const [sortState, setSortState] = React.useState<SortState>({
    key: 'displayName',
    descending: false,
  })
  const [hoveredCol, setHoveredCol] = React.useState<SortState['key'] | null>(
    null,
  )

  const sorted = React.useMemo(() => {
    const result = [...visibleItems]
    const { key, descending } = sortState
    result.sort((a, b) => {
      const aVal = String((a as any)[key] || '')
      const bVal = String((b as any)[key] || '')
      const cmp = aVal.localeCompare(bVal, 'fr', { sensitivity: 'base' })
      return descending ? -cmp : cmp
    })
    return result
  }, [visibleItems, sortState])

  const toggleSort = (key: SortState['key']) => {
    setSortState((prev) =>
      prev.key === key
        ? { key, descending: !prev.descending }
        : { key, descending: false },
    )
  }

  const sortIndicator = (key: SortState['key']) => {
    const isActive = sortState.key === key
    const isHovered = hoveredCol === key
    return (
      <span
        style={{
          display: 'inline-block',
          width: 14,
          marginLeft: 4,
          textAlign: 'center',
          opacity: isActive ? 0.8 : 0.4,
        }}
      >
        {isActive ? (sortState.descending ? '↓' : '↑') : isHovered ? '↕' : ''}
      </span>
    )
  }

  const sortableThProps = (key: SortState['key']) => ({
    style: {
      ...headerCellStyle,
      backgroundColor: hoveredCol === key ? '#eef0f4' : '#F8F9FB',
      transition: 'background-color 0.15s ease',
    },
    onClick: () => toggleSort(key),
    onMouseEnter: () => setHoveredCol(key),
    onMouseLeave: () => setHoveredCol(null),
  })

  const showJobTitle = listFields.includes('jobTitle')
  const showEmail = listFields.includes('email')
  const showPhone = listFields.includes('phone')
  const showDepartment = listFields.includes('department')
  const showLocation = listFields.includes('officeLocation')
  const showManager = listFields.includes('manager')
  const showTeams = listFields.includes('teams')
  const showOutlook = listFields.includes('outlook')
  const showPhoto = listFields.includes('photo')
  const showName = listFields.includes('name')
  const showFirstName = listFields.includes('firstName')
  const showCollaborateur = showPhoto || showName || showFirstName

  return (
    <div style={{ padding: '8px 24px 32px' }}>
      <div style={{ overflowX: 'auto' }}>
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            backgroundColor: '#ffffff',
          }}
        >
          <thead>
            <tr>
              {showCollaborateur && (
                <th
                  {...sortableThProps('displayName')}
                  style={{
                    ...sortableThProps('displayName').style,
                    paddingLeft: showPhoto ? 60 : 16,
                  }}
                >
                  Collaborateur {sortIndicator('displayName')}
                </th>
              )}
              {showJobTitle && (
                <th {...sortableThProps('jobTitle')}>
                  Poste {sortIndicator('jobTitle')}
                </th>
              )}
              {showEmail && (
                <th {...sortableThProps('email')}>
                  E-mail {sortIndicator('email')}
                </th>
              )}
              {showPhone && (
                <th {...sortableThProps('mobilePhone')}>
                  Téléphone {sortIndicator('mobilePhone')}
                </th>
              )}
              {showDepartment && (
                <th {...sortableThProps('department')}>
                  Département {sortIndicator('department')}
                </th>
              )}
              {showLocation && (
                <th {...sortableThProps('officeLocation')}>
                  Localisation {sortIndicator('officeLocation')}
                </th>
              )}
              {showManager && (
                <th {...sortableThProps('managerDisplayName')}>
                  Manager {sortIndicator('managerDisplayName')}
                </th>
              )}
              {showOutlook && (
                <th
                  style={{ ...headerCellStyle, cursor: 'default', width: 48 }}
                />
              )}
              {showTeams && (
                <th
                  style={{ ...headerCellStyle, cursor: 'default', width: 48 }}
                />
              )}
            </tr>
          </thead>
          <tbody>
            {sorted.map((member) => {
              const fullName =
                `${member.givenName || ''} ${member.surname || ''}`.trim() ||
                member.displayName
              return (
                <tr
                  key={member.id}
                  onClick={() => onMemberClick(member)}
                  style={{
                    cursor: 'pointer',
                    borderBottom: '1px solid #f3f2f1',
                  }}
                  onMouseEnter={(e) => {
                    ;(e.currentTarget as HTMLElement).style.backgroundColor =
                      '#faf9f8'
                  }}
                  onMouseLeave={(e) => {
                    ;(e.currentTarget as HTMLElement).style.backgroundColor =
                      'transparent'
                  }}
                >
                  {showCollaborateur && (
                    <td style={cellStyle}>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 12,
                        }}
                      >
                        {showPhoto && (
                          <PersonaAvatar
                            photoUrl={member.photoUrl}
                            displayName={member.displayName}
                            givenName={member.givenName}
                            size={PersonaSize.size32}
                          />
                        )}
                        {(showName || showFirstName) && (
                          <span style={{ fontWeight: 500 }}>
                            {showFirstName && showName
                              ? fullName
                              : showFirstName
                                ? member.givenName || ''
                                : `${member.givenName ? '' : ''}${member.surname || member.displayName}`}
                          </span>
                        )}
                      </div>
                    </td>
                  )}
                  {showJobTitle && (
                    <td style={cellStyle}>{member.jobTitle || ''}</td>
                  )}
                  {showEmail && <td style={cellStyle}>{member.email || ''}</td>}
                  {showPhone && (
                    <td style={cellStyle}>{member.mobilePhone || ''}</td>
                  )}
                  {showDepartment && (
                    <td style={cellStyle}>{member.department || ''}</td>
                  )}
                  {showLocation && (
                    <td style={cellStyle}>{member.officeLocation || ''}</td>
                  )}
                  {showManager && (
                    <td style={cellStyle}>{member.managerDisplayName || ''}</td>
                  )}
                  {showOutlook && (
                    <td style={{ ...cellStyle, padding: '10px 8px' }}>
                      {member.email && (
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
                    </td>
                  )}
                  {showTeams && (
                    <td style={{ ...cellStyle, padding: '10px 8px' }}>
                      {member.teamsId && (
                        <button
                          style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            padding: 4,
                            borderRadius: 4,
                            display: 'flex',
                            alignItems: 'center',
                          }}
                          title="Contacter via Teams"
                          aria-label="Contacter via Teams"
                          onClick={(e) => {
                            e.stopPropagation()
                            window.open(
                              getTeamsDeepLink(member.teamsId!),
                              '_blank',
                            )
                          }}
                        >
                          <TeamsIcon size={20} />
                        </button>
                      )}
                    </td>
                  )}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {hasMore && (
        <div
          style={{ display: 'flex', justifyContent: 'center', marginTop: 24 }}
        >
          <button
            onClick={loadMore}
            onMouseEnter={() => setLoadMoreHovered(true)}
            onMouseLeave={() => setLoadMoreHovered(false)}
            style={{
              padding: '8px 24px',
              borderRadius: 20,
              border: `1px solid ${primaryColor}`,
              background: loadMoreHovered ? '#f3f2f1' : '#ffffff',
              cursor: 'pointer',
              fontSize: 14,
              color: primaryColor,
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              transition: 'background 0.15s ease',
            }}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M7 1a1 1 0 0 1 1 1v4h4a1 1 0 1 1 0 2H8v4a1 1 0 1 1-2 0V8H2a1 1 0 1 1 0-2h4V2a1 1 0 0 1 1-1z" />
            </svg>
            Voir plus de collaborateurs
          </button>
        </div>
      )}
    </div>
  )
}

export default ListView
