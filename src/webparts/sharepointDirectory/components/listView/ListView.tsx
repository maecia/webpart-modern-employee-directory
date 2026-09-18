import * as React from 'react'
import { PersonaSize } from '@fluentui/react/lib/Persona'
import { useTheme } from '@fluentui/react/lib/Theme'
import { Member } from '../../../../models/Member'
import { getEntraFieldLabel } from '../../../../models/DirectoryConfig'
import { usePagination } from '../../../../hooks/usePagination'
import { getTeamsDeepLink } from '../../../../utils/teamsDeepLink'
import { getMailtoLink } from '../../../../utils/formatUtils'
import { strings, getLocale } from '../../loc/mystrings'
import PersonaAvatar from '../shared/PersonaAvatar'
import LazyPersonaAvatar from '../shared/LazyPersonaAvatar'
import TeamsIcon from '../shared/TeamsIcon'
import OutlookIcon from '../shared/OutlookIcon'
import Pagination from '../shared/Pagination'

interface ListViewProps {
  members: Member[]
  /** Ordered field keys (CardFieldName + custom) */
  listFieldOrder: string[]
  /** Localized labels for custom fields */
  listFieldLabels: Record<string, string>
  /** Number of rows displayed per page */
  pageSize: number
  /** Changes when the search or filters change, to reset the current page. */
  resetKey?: string
  onMemberClick: (member: Member) => void
}

interface SortState {
  key: string
  descending: boolean
}

const headerCellStyle: React.CSSProperties = {
  padding: '10px 16px',
  textAlign: 'left',
  fontSize: 11,
  fontWeight: 600,
  color: 'var(--spdc-text-secondary)',
  letterSpacing: '0.04em',
  textTransform: 'uppercase',
  borderBottom: '1px solid var(--spdc-divider)',
  userSelect: 'none',
  cursor: 'pointer',
  whiteSpace: 'nowrap',
  backgroundColor: 'var(--spdc-surface-alt)',
}

const cellStyle: React.CSSProperties = {
  padding: '10px 16px',
  fontSize: 14,
  color: 'var(--spdc-text-primary)',
  verticalAlign: 'middle',
}

const ListView: React.FC<ListViewProps> = ({
  members,
  listFieldOrder,
  listFieldLabels,
  pageSize,
  resetKey,
  onMemberClick,
}) => {
  const theme = useTheme()
  const primaryColor = theme?.palette?.themePrimary || '#1B7A6E'
  const [sortState, setSortState] = React.useState<SortState>({
    key: 'displayName',
    descending: false,
  })
  const [hoveredCol, setHoveredCol] = React.useState<string | null>(null)

  // ── Column definitions built from listFieldOrder ──────────────────────────
  // `name` and `firstName` are merged into a single "name group" column at
  // whichever position comes first.
  type ColDef = {
    key: string
    sortKey?: string
    renderHeader: () => React.ReactNode
    renderCell: (member: Member) => React.ReactNode
    headerStyle?: React.CSSProperties
    cellStyle?: React.CSSProperties
  }

  const columns = React.useMemo<ColDef[]>(() => {
    const cols: ColDef[] = []
    let nameGroupAdded = false
    const showFirstName = listFieldOrder.includes('firstName')
    const showLastName = listFieldOrder.includes('name')

    for (const key of listFieldOrder) {
      switch (key) {
        case 'photo':
          cols.push({
            key: 'photo',
            renderHeader: () => null,
            renderCell: (m) => (
              <LazyPersonaAvatar
                userId={m.id}
                displayName={m.displayName}
                givenName={m.givenName}
                size={PersonaSize.size32}
              />
            ),
            headerStyle: {
              ...headerCellStyle,
              cursor: 'default',
              width: 44,
              padding: '10px 0 10px 16px',
            },
            cellStyle: { ...cellStyle, width: 44, padding: '10px 0 10px 16px' },
          })
          break

        case 'name':
        case 'firstName':
          if (!nameGroupAdded) {
            nameGroupAdded = true
            cols.push({
              key: 'name_group',
              sortKey: 'displayName',
              renderHeader: () =>
                listFieldLabels['name'] || strings.HeaderCollaborator,
              renderCell: (m) => {
                const fullName =
                  `${m.givenName || ''} ${m.surname || ''}`.trim() ||
                  m.displayName
                if (showFirstName && showLastName)
                  return <span style={{ fontWeight: 500 }}>{fullName}</span>
                if (showFirstName)
                  return (
                    <span style={{ fontWeight: 500 }}>{m.givenName || ''}</span>
                  )
                return (
                  <span style={{ fontWeight: 500 }}>
                    {m.surname || m.displayName}
                  </span>
                )
              },
            })
          }
          break

        case 'jobTitle':
          cols.push({
            key: 'jobTitle',
            sortKey: 'jobTitle',
            renderHeader: () =>
              listFieldLabels['jobTitle'] || strings.HeaderJobTitle,
            renderCell: (m) => m.jobTitle || '',
          })
          break

        case 'email':
          cols.push({
            key: 'email',
            sortKey: 'email',
            renderHeader: () => listFieldLabels['email'] || strings.HeaderEmail,
            renderCell: (m) => m.email || '',
          })
          break

        case 'phone':
          cols.push({
            key: 'phone',
            sortKey: 'mobilePhone',
            renderHeader: () => listFieldLabels['phone'] || strings.HeaderPhone,
            renderCell: (m) => m.mobilePhone || '',
          })
          break

        case 'department':
          cols.push({
            key: 'department',
            sortKey: 'department',
            renderHeader: () =>
              listFieldLabels['department'] || strings.HeaderDepartment,
            renderCell: (m) => m.department || '',
          })
          break

        case 'officeLocation':
          cols.push({
            key: 'officeLocation',
            sortKey: 'officeLocation',
            renderHeader: () =>
              listFieldLabels['officeLocation'] || strings.HeaderLocation,
            renderCell: (m) => m.officeLocation || '',
          })
          break

        case 'manager':
          cols.push({
            key: 'manager',
            sortKey: 'managerDisplayName',
            renderHeader: () => strings.HeaderManager,
            renderCell: (m) => {
              const mgr = m.managerId
                ? members.find((x) => x.id === m.managerId)
                : undefined
              if (mgr) {
                return (
                  <span
                    className="spdir-mgr-link"
                    style={{ color: primaryColor, cursor: 'pointer' }}
                    onClick={(e) => {
                      e.stopPropagation()
                      onMemberClick(mgr)
                    }}
                    title={strings.ViewProfile}
                  >
                    {m.managerDisplayName || ''}
                  </span>
                )
              }
              return m.managerDisplayName || ''
            },
          })
          break

        case 'outlook':
          cols.push({
            key: 'outlook',
            renderHeader: () => null,
            renderCell: (m) =>
              m.email ? (
                <a
                  href={getMailtoLink(m.email)}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={strings.SendEmail}
                  aria-label={strings.SendEmail}
                  onClick={(e) => e.stopPropagation()}
                  style={{ display: 'flex', alignItems: 'center' }}
                >
                  <OutlookIcon size={20} />
                </a>
              ) : null,
            headerStyle: { ...headerCellStyle, cursor: 'default', width: 48 },
            cellStyle: { ...cellStyle, padding: '10px 8px' },
          })
          break

        case 'teams':
          cols.push({
            key: 'teams',
            renderHeader: () => null,
            renderCell: (m) =>
              m.teamsId ? (
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
                  title={strings.ContactViaTeams}
                  aria-label={strings.ContactViaTeams}
                  onClick={(e) => {
                    e.stopPropagation()
                    window.open(getTeamsDeepLink(m.teamsId!), '_blank')
                  }}
                >
                  <TeamsIcon size={20} />
                </button>
              ) : null,
            headerStyle: { ...headerCellStyle, cursor: 'default', width: 48 },
            cellStyle: { ...cellStyle, padding: '10px 8px' },
          })
          break

        default: {
          // Custom / EntraID field
          const label = listFieldLabels[key] || getEntraFieldLabel(key)
          cols.push({
            key,
            sortKey: key,
            renderHeader: () => label,
            renderCell: (m) => m.customProperties?.[key] || '',
          })
          break
        }
      }
    }
    return cols
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listFieldOrder, listFieldLabels, members, primaryColor])

  // ── Sorting ───────────────────────────────────────────────────────────────
  const sorted = React.useMemo(() => {
    const result = [...members]
    result.sort((a, b) => {
      let aVal: string
      let bVal: string
      const k = sortState.key
      if (k === 'displayName') {
        aVal = `${a.givenName || ''} ${a.surname || ''}`.trim() || a.displayName
        bVal = `${b.givenName || ''} ${b.surname || ''}`.trim() || b.displayName
      } else if ((a as any)[k] !== undefined) {
        aVal = String((a as any)[k] || '')
        bVal = String((b as any)[k] || '')
      } else {
        aVal = a.customProperties?.[k] || ''
        bVal = b.customProperties?.[k] || ''
      }
      const cmp = aVal.localeCompare(bVal, getLocale(), { sensitivity: 'base' })
      return sortState.descending ? -cmp : cmp
    })
    return result
  }, [members, sortState])

  const {
    pageItems,
    page,
    totalPages,
    startIndex,
    endIndex,
    totalItems,
    setPage,
    reset,
  } = usePagination(sorted, pageSize)

  // Reset to the first page when the search/filters or the sort column change.
  React.useEffect(() => {
    reset()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resetKey, sortState.key, sortState.descending])

  const toggleSort = (key: string) => {
    setSortState((prev) =>
      prev.key === key
        ? { key, descending: !prev.descending }
        : { key, descending: false },
    )
  }

  const sortIndicator = (key: string) => {
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

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div style={{ padding: '8px 24px 32px' }}>
      <style>{`
        .spdir-mgr-link {
          display: inline-block;
          width: fit-content;
          position: relative;
          padding-bottom: 2px;
        }
        .spdir-mgr-link::after {
          content: '';
          position: absolute;
          bottom: 0; left: 0;
          width: 100%; height: 1px;
          background: currentColor;
          transform-origin: right;
          transform: scaleX(0);
          transition: transform 0.3s ease;
        }
        .spdir-mgr-link:hover::after { transform: scaleX(1); }
      `}</style>

      <div style={{ overflowX: 'auto' }}>
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            backgroundColor: 'var(--spdc-surface)',
          }}
        >
          <caption
            style={{
              border: 0,
              clip: 'rect(0 0 0 0)',
              height: 1,
              margin: -1,
              overflow: 'hidden',
              padding: 0,
              position: 'absolute',
              width: 1,
              whiteSpace: 'nowrap',
            }}
          >
            {strings.ResultsLabel}
          </caption>
          <thead>
            <tr>
              {columns.map((col) => {
                const header = col.renderHeader()
                if (!col.sortKey || !header) {
                  return (
                    <th
                      key={col.key}
                      scope="col"
                      style={col.headerStyle || headerCellStyle}
                    >
                      {header}
                    </th>
                  )
                }
                const sk = col.sortKey
                return (
                  <th
                    key={col.key}
                    scope="col"
                    style={{
                      ...(col.headerStyle || headerCellStyle),
                      backgroundColor:
                        hoveredCol === sk ? 'var(--spdc-header-hover)' : 'var(--spdc-surface-alt)',
                      transition: 'background-color 0.15s ease',
                    }}
                    onClick={() => toggleSort(sk)}
                    onMouseEnter={() => setHoveredCol(sk)}
                    onMouseLeave={() => setHoveredCol(null)}
                  >
                    {header}
                    {sortIndicator(sk)}
                  </th>
                )
              })}
            </tr>
          </thead>
          <tbody>
            {pageItems.map((member) => (
              <tr
                key={member.id}
                tabIndex={0}
                role="button"
                aria-label={
                  `${member.givenName || ''} ${member.surname || ''}`.trim() ||
                  member.displayName
                }
                onClick={() => onMemberClick(member)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    onMemberClick(member)
                  }
                }}
                style={{ cursor: 'pointer', borderBottom: '1px solid var(--spdc-hover)' }}
                onMouseEnter={(e) => {
                  ;(e.currentTarget as HTMLElement).style.backgroundColor =
                    'var(--spdc-page-bg)'
                }}
                onMouseLeave={(e) => {
                  ;(e.currentTarget as HTMLElement).style.backgroundColor =
                    'transparent'
                }}
              >
                {columns.map((col) => (
                  <td key={col.key} style={col.cellStyle || cellStyle}>
                    {col.renderCell(member)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Pagination
        page={page}
        totalPages={totalPages}
        startIndex={startIndex}
        endIndex={endIndex}
        totalItems={totalItems}
        onPageChange={setPage}
      />
    </div>
  )
}

export default ListView
