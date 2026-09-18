import * as React from 'react'
import { strings } from '../../loc/mystrings'

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  placeholder,
}) => {
  const resolvedPlaceholder = placeholder ?? strings.SearchPlaceholder
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        height: 38,
        borderRadius: 20,
        border: '1px solid var(--spdc-border-input)',
        backgroundColor: 'var(--spdc-surface)',
        paddingLeft: 12,
        paddingRight: 12,
        gap: 8,
        boxSizing: 'border-box',
        flexShrink: 0,
        minWidth: 240,
        outline: 'none',
      }}
    >
      <svg
        width="14"
        height="14"
        viewBox="0 0 16 16"
        aria-hidden="true"
        style={{ flexShrink: 0, fill: 'var(--spdc-text-secondary)' }}
      >
        <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.099zm-5.242 1.656a5.5 5.5 0 1 1 0-11 5.5 5.5 0 0 1 0 11z" />
      </svg>
      <input
        type="text"
        placeholder={resolvedPlaceholder}
        aria-label={resolvedPlaceholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          border: 'none',
          outline: 'none',
          background: 'transparent',
          fontSize: 13,
          color: 'var(--spdc-text-strong)',
          width: '100%',
          lineHeight: '1',
        }}
      />
      {value && (
        <button
          onClick={() => onChange('')}
          aria-label={strings.ClearSearch}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: 0,
            display: 'flex',
            alignItems: 'center',
            color: 'var(--spdc-text-secondary)',
            flexShrink: 0,
          }}
        >
          <svg
            width="10"
            height="10"
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
}

export default SearchBar
