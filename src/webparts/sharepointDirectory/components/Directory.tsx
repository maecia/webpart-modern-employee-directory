import * as React from 'react'
import { Member } from '../../../models/Member'
import { DirectoryProps } from './Directory.types'
import CardView from './cardView/CardView'
import ListView from './listView/ListView'
import MemberModal from './modal/MemberModal'
import Banner from './Banner'
import LoadingState from './shared/LoadingState'
import ErrorState from './shared/ErrorState'
import EmptyState from './shared/EmptyState'

function searchScore(member: any, query: string): number {
  let score = 0
  const disp = (member.displayName || '').toLowerCase()
  const given = (member.givenName || '').toLowerCase()
  const sur = (member.surname || '').toLowerCase()

  if (disp === query) {
    score += 100
  }
  if (disp.startsWith(query)) {
    score += 50
  }
  if (sur === query) {
    score += 80
  }
  if (sur.startsWith(query)) {
    score += 40
  }
  if (given === query) {
    score += 80
  }
  if (given.startsWith(query)) {
    score += 40
  }
  if (disp.indexOf(query) !== -1) {
    score += 10
  }
  if (sur.indexOf(query) !== -1 || given.indexOf(query) !== -1) {
    score += 5
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
    Record<string, string | null>
  >({})
  const [selectedMember, setSelectedMember] = React.useState<Member | null>(
    null,
  )

  React.useEffect(() => {
    setView(config.defaultView)
  }, [config.defaultView])

  const filteredMembers = React.useMemo(() => {
    let result = members.filter((m) => m.isVisible)

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      result = result
        .filter(
          (m) =>
            (m.displayName &&
              m.displayName.toLowerCase().indexOf(query) !== -1) ||
            (m.givenName && m.givenName.toLowerCase().indexOf(query) !== -1) ||
            (m.surname && m.surname.toLowerCase().indexOf(query) !== -1),
        )
        .sort((a, b) => searchScore(b, query) - searchScore(a, query))
    }

    if (config.filters.length > 0) {
      config.filters.forEach((filter) => {
        const value = filterValues[filter.fieldName]
        if (value) {
          result = result.filter((m) => {
            const fieldValue = (m as any)[filter.fieldName]
            return fieldValue === value
          })
        }
      })
    }

    if (!searchQuery.trim()) {
      result = [...result].sort((a, b) =>
        (a.givenName || a.displayName || '').localeCompare(
          b.givenName || b.displayName || '',
          'fr',
          { sensitivity: 'base' },
        ),
      )
    }

    return result
  }, [members, searchQuery, filterValues, config.filters])

  const resultCount = filteredMembers.length

  const handleFilterChange = (fieldName: string, value: string | null) => {
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
    <div
      role="region"
      aria-label="Annuaire SharePoint"
      aria-live="polite"
      style={{ backgroundColor: '#faf9f8', minHeight: '100%' }}
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
      />

      <div
        key={view}
        style={{
          animation: 'spdir-fadein 0.18s ease',
        }}
      >
        <style>{`
          @keyframes spdir-fadein {
            from { opacity: 0; transform: translateY(6px); }
            to   { opacity: 1; transform: translateY(0); }
          }
        `}</style>
        {filteredMembers.length === 0 ? (
          <EmptyState />
        ) : view === 'card' ? (
          <CardView
            members={filteredMembers}
            cardFields={config.cardFields}
            onMemberClick={setSelectedMember}
          />
        ) : (
          <ListView
            members={filteredMembers}
            listFields={config.listFields}
            onMemberClick={setSelectedMember}
          />
        )}
      </div>

      <MemberModal
        member={selectedMember}
        modalFields={config.modalFields}
        onDismiss={() => setSelectedMember(null)}
      />
    </div>
  )
}

export default Directory
