import * as React from 'react'
import { useTheme } from '@fluentui/react/lib/Theme'
import { Member } from '../../../models/Member'
import { DirectoryProps } from './Directory.types'
import { SortOrder } from '../../../models/DirectoryConfig'
import CardView from './cardView/CardView'
import ListView from './listView/ListView'
import MemberModal from './modal/MemberModal'
import Banner from './Banner'
import LoadingState from './shared/LoadingState'
import ErrorState from './shared/ErrorState'
import EmptyState from './shared/EmptyState'
import ErrorBoundary from './shared/ErrorBoundary'
import { strings, getLocale } from '../loc/mystrings'
import { themeColorVars } from '../../../utils/themeColors'

function applySortOrder(members: Member[], sortOrder: SortOrder): Member[] {
  const copy = [...members]
  switch (sortOrder) {
    case 'firstNameAsc':
      copy.sort((a, b) =>
        (a.givenName || a.displayName || '').localeCompare(
          b.givenName || b.displayName || '',
          getLocale(),
          { sensitivity: 'base' },
        ),
      )
      break
    case 'firstNameDesc':
      copy.sort((a, b) =>
        (b.givenName || b.displayName || '').localeCompare(
          a.givenName || a.displayName || '',
          getLocale(),
          { sensitivity: 'base' },
        ),
      )
      break
    case 'lastNameAsc':
      copy.sort((a, b) =>
        (a.surname || a.displayName || '').localeCompare(
          b.surname || b.displayName || '',
          getLocale(),
          { sensitivity: 'base' },
        ),
      )
      break
    case 'lastNameDesc':
      copy.sort((a, b) =>
        (b.surname || b.displayName || '').localeCompare(
          a.surname || a.displayName || '',
          getLocale(),
          { sensitivity: 'base' },
        ),
      )
      break
    case 'random':
      const rng = createSeededRng(members.length)
      for (let i = copy.length - 1; i > 0; i--) {
        const j = rng() % (i + 1)
        ;[copy[i], copy[j]] = [copy[j], copy[i]]
      }
      break
  }
  return copy
}

function createSeededRng(seed: number): () => number {
  let s = seed
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff
    return s >>> 0
  }
}

function searchScore(member: any, query: string): number {
  let score = 0
  const fields = [
    member.displayName,
    member.givenName,
    member.surname,
    member.jobTitle,
    member.department,
    member.email,
    member.officeLocation,
    member.mobilePhone,
    member.managerDisplayName,
  ].filter(Boolean) as string[]
  const customProps = member.customProperties || {}
  const customValues = Object.values(customProps).filter(Boolean) as string[]

  const allValues = [...fields, ...customValues]
  const lowerValues = allValues.map((v) => v.toLowerCase())
  const q = query

  for (const v of lowerValues) {
    if (v === q) score += 100
    else if (v.startsWith(q)) score += 50
    else if (v.indexOf(q) !== -1) score += 10
  }

  return score
}

const Directory: React.FC<DirectoryProps> = ({
  config,
  members,
  isLoading,
  error,
  onRetry,
}) => {
  const [view, setView] = React.useState<'card' | 'list'>(config.defaultView)
  const [searchQuery, setSearchQuery] = React.useState('')
  const [filterValues, setFilterValues] = React.useState<
    Record<string, string[] | null>
  >({})
  const [selectedMember, setSelectedMember] = React.useState<Member | null>(
    null,
  )
  const theme = useTheme()
  const primaryColor = theme?.palette?.themePrimary || '#1B7A6E'
  const themeVars = React.useMemo(
    () => themeColorVars(theme) as React.CSSProperties,
    [theme],
  )

  React.useEffect(() => {
    setView(config.defaultView)
  }, [config.defaultView])

  const filteredMembers = React.useMemo(() => {
    let result = members.filter(
      (m) => m.isVisible && (m.givenName || m.surname),
    )

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      result = result
        .filter((m) => {
          const fields = [
            m.displayName,
            m.givenName,
            m.surname,
            m.jobTitle,
            m.department,
            m.email,
            m.officeLocation,
            m.mobilePhone,
            m.managerDisplayName,
          ]
          const customValues = Object.values(m.customProperties || {})
          return [...fields, ...customValues].some(
            (v) => v && v.toLowerCase().indexOf(query) !== -1,
          )
        })
        .sort((a, b) => searchScore(b, query) - searchScore(a, query))
    }

    if (config.filters.length > 0) {
      config.filters.forEach((filter) => {
        const values = filterValues[filter.fieldName]
        if (values && values.length > 0) {
          result = result.filter((m) => {
            const fieldValue =
              (m as any)[filter.fieldName] ??
              (m.customProperties && m.customProperties[filter.fieldName])
            return values.includes(fieldValue)
          })
        }
      })
    }

    // While pages are still arriving, keep the order returned by Graph so the
    // list does not jump around; apply the configured sort once loading is done.
    if (!searchQuery.trim() && !isLoading) {
      result = applySortOrder([...result], config.sortOrder)
    }

    return result
  }, [
    members,
    searchQuery,
    filterValues,
    config.filters,
    config.sortOrder,
    isLoading,
  ])

  const resultCount = filteredMembers.length
  // Any change of search or filters returns the user to the first page.
  const paginationResetKey = `${searchQuery}|${JSON.stringify(filterValues)}`

  const handleFilterChange = (fieldName: string, value: string[] | null) => {
    setFilterValues((prev) => ({
      ...prev,
      [fieldName]: value,
    }))
  }

  if (isLoading) {
    return <LoadingState />
  }

  if (error) {
    return <ErrorState message={error} onRetry={onRetry} />
  }

  return (
    <ErrorBoundary>
      <div
        id="spdir-root"
        role="region"
        aria-label={strings.DirectoryRegionLabel}
        aria-live="polite"
        style={{
          ...themeVars,
          backgroundColor: 'var(--spdc-page-bg)',
          minHeight: '100%',
        }}
      >
        <Banner
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          filters={config.filters}
          members={members}
          filterValues={filterValues}
          onFilterChange={handleFilterChange}
          resultCount={resultCount}
          activeView={view}
          onViewChange={setView}
          filteredMembers={filteredMembers}
          listFieldOrder={config.listFieldOrder}
          listFieldLabels={config.listFieldLabels}
        />

        <div
          key={view}
          style={{
            animation: 'spdir-fadein 0.18s ease',
          }}
        >
          <style>{`
          #spdir-root *:focus,
          #spdir-root *:focus-visible,
          #spdir-root *:focus-within,
          #spdir-root:focus-within {
            outline: none !important;
            box-shadow: none !important;
          }
          @keyframes spdir-fadein {
            from { opacity: 0; transform: translateY(6px); }
            to   { opacity: 1; transform: translateY(0); }
          }
          @media (prefers-reduced-motion: reduce) {
            #spdir-root *, #spdir-root *::before, #spdir-root *::after {
              animation-duration: 0.01ms !important;
              animation-iteration-count: 1 !important;
              transition-duration: 0.01ms !important;
            }
          }
        `}</style>
          {filteredMembers.length === 0 ? (
            <EmptyState />
          ) : view === 'card' ? (
            <CardView
              members={filteredMembers}
              cardFieldOrder={config.cardFieldOrder}
              pageSize={config.pageSize}
              resetKey={paginationResetKey}
              onMemberClick={setSelectedMember}
            />
          ) : (
            <ListView
              members={filteredMembers}
              listFieldOrder={config.listFieldOrder}
              listFieldLabels={config.listFieldLabels}
              pageSize={config.pageSize}
              resetKey={paginationResetKey}
              onMemberClick={setSelectedMember}
            />
          )}
        </div>

        <MemberModal
          member={selectedMember}
          members={members}
          modalFieldOrder={config.modalFieldOrder}
          modalFieldLabels={config.modalFieldLabels}
          onDismiss={() => setSelectedMember(null)}
          onMemberClick={setSelectedMember}
        />
      </div>
    </ErrorBoundary>
  )
}

export default Directory
