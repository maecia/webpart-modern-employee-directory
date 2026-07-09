import * as React from 'react'
import { FilterField } from '../../../../models/Filter'
import { Member } from '../../../../models/Member'
import { strings } from '../../loc/mystrings'

interface FilterBarProps {
  filters: FilterField[]
  members: Member[]
  values: Record<string, string | null>
  onChange: (fieldName: string, value: string | null) => void
}

const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  members,
  values,
  onChange,
}) => {
  if (!filters || filters.length === 0) {
    return null
  }

  const getDistinctValues = (fieldName: string): string[] => {
    const unique = new Set<string>()
    members.forEach((member) => {
      const value =
        (member as any)[fieldName] ??
        (member.customProperties && member.customProperties[fieldName])
      if (value) unique.add(String(value))
    })
    return Array.from(unique).sort()
  }

  return (
    <>
      {filters.map((filter) => {
        const options = getDistinctValues(filter.fieldName)
        const disabled = options.length === 0
        const selected = values[filter.fieldName] || ''

        return (
          <div
            key={filter.fieldName}
            style={{
              position: 'relative',
              display: 'inline-flex',
              alignItems: 'center',
              flexShrink: 0,
            }}
          >
            <select
              aria-label={filter.label}
              value={selected}
              disabled={disabled}
              onChange={(e) => {
                const val = e.target.value
                onChange(filter.fieldName, val || null)
              }}
              style={{
                height: 38,
                appearance: 'none',
                WebkitAppearance: 'none',
                borderRadius: 20,
                border: '1px solid #c7c9cc',
                backgroundColor: disabled ? '#f3f2f1' : '#ffffff',
                color: selected ? '#323130' : '#605e5c',
                fontSize: 13,
                paddingLeft: 16,
                paddingRight: selected ? 52 : 36,
                cursor: disabled ? 'not-allowed' : 'pointer',
                outline: 'none',
                minWidth: 150,
                boxSizing: 'border-box',
              }}
            >
              <option value="">{filter.label}</option>
              {options.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>

            {/* Chevron icon */}
            <svg
              width="10"
              height="10"
              viewBox="0 0 10 6"
              fill="none"
              aria-hidden="true"
              style={{
                position: 'absolute',
                right: selected ? 30 : 14,
                pointerEvents: 'none',
                color: disabled ? '#605e5c' : '#605e5c',
              }}
            >
              <path
                d="M1 1l4 4 4-4"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>

            {/* Clear button */}
            {selected && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onChange(filter.fieldName, null)
                }}
                aria-label={strings.ClearSearch}
                  title={strings.ClearSearch}
                style={{
                  position: 'absolute',
                  right: 10,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#605e5c',
                  borderRadius: '50%',
                  width: 16,
                  height: 16,
                }}
              >
                <svg
                  width="8"
                  height="8"
                  viewBox="0 0 12 12"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M.293.293a1 1 0 0 1 1.414 0L6 4.586 10.293.293a1 1 0 1 1 1.414 1.414L7.414 6l4.293 4.293a1 1 0 0 1-1.414 1.414L6 7.414l-4.293 4.293A1 1 0 0 1 .293 10.707L4.586 6 .293 1.707A1 1 0 0 1 .293.293Z" />
                </svg>
              </button>
            )}
          </div>
        )
      })}
    </>
  )
}

export default FilterBar
