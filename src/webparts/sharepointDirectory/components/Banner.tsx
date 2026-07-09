import * as React from 'react'
import { Text } from '@fluentui/react/lib/Text'
import { useTheme } from '@fluentui/react/lib/Theme'
import { FilterField } from '../../../models/Filter'
import { Member } from '../../../models/Member'
import { strings } from '../loc/mystrings'
import SearchBar from './search/SearchBar'
import FilterBar from './search/FilterBar'
import CsvExport from './export/CsvExport'

interface BannerProps {
  searchQuery: string
  onSearchChange: (value: string) => void
  filters: FilterField[]
  members: Member[]
  filterValues: Record<string, string | null>
  onFilterChange: (fieldName: string, value: string | null) => void
  resultCount: number
  activeView: 'card' | 'list'
  onViewChange: (view: 'card' | 'list') => void
  filteredMembers: Member[]
}

const Banner: React.FC<BannerProps> = ({
  searchQuery,
  onSearchChange,
  filters,
  members,
  filterValues,
  onFilterChange,
  resultCount,
  activeView,
  onViewChange,
  filteredMembers,
}) => {
  const theme = useTheme()
  const primaryColor = theme?.palette?.themePrimary || '#1B7A6E'
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 8,
        padding: '12px 24px',
        minHeight: 64,
        backgroundColor: '#ffffff',
        borderBottom: '1px solid #edebe9',
        boxSizing: 'border-box',
      }}
    >
      {/* Search */}
      <SearchBar value={searchQuery} onChange={onSearchChange} />

      {/* Filters */}
      {filters.length > 0 && (
        <FilterBar
          filters={filters}
          members={members}
          values={filterValues}
          onChange={onFilterChange}
        />
      )}

      {/* Spacer — pushes right-side items to the end on wide screens */}
      <div style={{ flex: 1, minWidth: 16 }} />

      {/* Count */}
      <Text
        variant="small"
        styles={{ root: { whiteSpace: 'nowrap', color: '#6B7280' } }}
      >
        {strings.ResultsLabel} {resultCount}{' '}
        {resultCount <= 1
          ? strings.CollaboratorSingular
          : strings.CollaboratorPlural}
      </Text>

      {/* View toggle pill */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          border: '1px solid #e0e0e0',
          borderRadius: 20,
          padding: 3,
          gap: 2,
          backgroundColor: '#ffffff',
          flexShrink: 0,
        }}
      >
        <button
          onClick={() => onViewChange('card')}
          title={strings.ViewTrombinoscope}
          aria-label={strings.ViewTrombinoscope}
          aria-pressed={activeView === 'card'}
          style={{
            width: 32,
            height: 32,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '50%',
            backgroundColor:
              activeView === 'card' ? primaryColor : 'transparent',
            color: activeView === 'card' ? '#ffffff' : '#a8a8a8',
            cursor: 'pointer',
            border: 'none',
            outline: 'none',
            padding: 0,
            flexShrink: 0,
            transition: 'background-color 0.2s ease, color 0.2s ease',
          }}
        >
          <svg
            width="15"
            height="15"
            viewBox="0 0 16 16"
            fill="currentColor"
            aria-hidden="true"
          >
            <rect x="1" y="1" width="6" height="6" rx="1" />
            <rect x="9" y="1" width="6" height="6" rx="1" />
            <rect x="1" y="9" width="6" height="6" rx="1" />
            <rect x="9" y="9" width="6" height="6" rx="1" />
          </svg>
        </button>
        <button
          onClick={() => onViewChange('list')}
          title={strings.ViewList}
          aria-label={strings.ViewList}
          aria-pressed={activeView === 'list'}
          style={{
            width: 32,
            height: 32,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '50%',
            backgroundColor:
              activeView === 'list' ? primaryColor : 'transparent',
            color: activeView === 'list' ? '#ffffff' : '#a8a8a8',
            cursor: 'pointer',
            border: 'none',
            outline: 'none',
            padding: 0,
            flexShrink: 0,
            transition: 'background-color 0.2s ease, color 0.2s ease',
          }}
        >
          <svg
            width="15"
            height="15"
            viewBox="0 0 16 16"
            fill="currentColor"
            aria-hidden="true"
          >
            <rect x="1" y="2" width="14" height="2" rx="1" />
            <rect x="1" y="7" width="14" height="2" rx="1" />
            <rect x="1" y="12" width="14" height="2" rx="1" />
          </svg>
        </button>
      </div>

      {/* Export */}
      <CsvExport members={filteredMembers} />
    </div>
  )
}

export default Banner
