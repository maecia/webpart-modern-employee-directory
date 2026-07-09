import * as React from 'react'
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

function applySortOrder(members: Member[], sortOrder: SortOrder): Member[] {
  const copy = [...members]
  switch (sortOrder) {
    case 'firstNameAsc':
      copy.sort((a, b) =>
        (a.givenName || a.displayName || '').localeCompare(
          b.givenName || b.displayName || '',
          'fr',
          { sensitivity: 'base' },
        ),
      )
      break
    case 'firstNameDesc':
      copy.sort((a, b) =>
        (b.givenName || b.displayName || '').localeCompare(
          a.givenName || a.displayName || '',
          'fr',
          { sensitivity: 'base' },
        ),
      )
      break
    case 'lastNameAsc':
      copy.sort((a, b) =>
        (a.surname || a.displayName || '').localeCompare(
          b.surname || b.displayName || '',
          'fr',
          { sensitivity: 'base' },
        ),
      )
      break
    case 'lastNameDesc':
      copy.sort((a, b) =>
        (b.surname || b.displayName || '').localeCompare(
          a.surname || a.displayName || '',
          'fr',
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
    Record<string, string | null>
  >({})
  const [selectedMember, setSelectedMember] = React.useState<Member | null>(
    null,
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
        const value = filterValues[filter.fieldName]
        if (value) {
          result = result.filter((m) => {
            const fieldValue =
              (m as any)[filter.fieldName] ??
              (m.customProperties && m.customProperties[filter.fieldName])
            return fieldValue === value
          })
        }
      })
    }

    if (!searchQuery.trim()) {
      result = applySortOrder([...result], config.sortOrder)
    }

    return result
  }, [members, searchQuery, filterValues, config.filters, config.sortOrder])

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
            cardFieldOrder={config.cardFieldOrder}
            onMemberClick={setSelectedMember}
          />
        ) : (
          <ListView
            members={filteredMembers}
            listFieldOrder={config.listFieldOrder}
            listFieldLabels={config.listFieldLabels}
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
  )
}

export default Directory
