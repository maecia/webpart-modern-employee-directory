import * as React from 'react'
import { FilterField } from '../../../../models/Filter'
import { Member } from '../../../../models/Member'
import { strings } from '../../loc/mystrings'

interface FilterBarProps {
  filters: FilterField[]
  members: Member[]
  values: Record<string, string[] | null>
  onChange: (fieldName: string, value: string[] | null) => void
}

interface MultiSelectProps {
  label: string
  options: string[]
  selected: string[]
  disabled: boolean
  onToggle: (value: string) => void
  onClear: () => void
}

const MultiSelect: React.FC<MultiSelectProps> = ({
  label,
  options,
  selected,
  disabled,
  onToggle,
  onClear,
}) => {
  const [open, setOpen] = React.useState(false)
  const [search, setSearch] = React.useState('')
  const containerRef = React.useRef<HTMLDivElement>(null)
  const inputRef = React.useRef<HTMLInputElement>(null)

  const filtered = React.useMemo(() => {
    if (!search) return options
    const q = search.toLowerCase()
    return options.filter((o) => o.toLowerCase().includes(q))
  }, [options, search])

  React.useEffect(() => {
    if (open) requestAnimationFrame(() => inputRef.current?.focus())
  }, [open])

  const handleBlur = (e: React.FocusEvent<HTMLDivElement>) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setOpen(false)
      setSearch('')
    }
  }

  const handleToggle = () => {
    if (disabled) return
    setOpen((o) => !o)
    if (open) setSearch('')
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') { setOpen(false); setSearch('') }
  }

  const hasSelection = selected.length > 0

  const buttonLabel = hasSelection
    ? selected.length === 1
      ? selected[0]
      : `${label} (${selected.length})`
    : label

  return (
    <div
      ref={containerRef}
      tabIndex={-1}
      style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', flexShrink: 0 }}
      onKeyDown={handleKeyDown}
      onBlur={handleBlur}
    >
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={label}
        disabled={disabled}
        onClick={handleToggle}
        style={{
          height: 38,
          borderRadius: 20,
          border: `1px solid ${open ? 'var(--spdc-brand-solid)' : hasSelection ? 'var(--spdc-brand-solid)' : 'var(--spdc-border-input)'}`,
          backgroundColor: hasSelection ? 'var(--spdc-brand-tint)' : disabled ? 'var(--spdc-hover)' : 'var(--spdc-surface)',
          color: hasSelection ? 'var(--spdc-brand-text)' : disabled ? 'var(--spdc-placeholder)' : 'var(--spdc-text-secondary)',
          fontWeight: hasSelection ? 600 : 400,
          fontSize: 13,
          paddingLeft: 16,
          paddingRight: hasSelection ? 52 : 36,
          cursor: disabled ? 'not-allowed' : 'pointer',
          outline: 'none',
          minWidth: 150,
          maxWidth: 220,
          boxSizing: 'border-box',
          textAlign: 'left',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          transition: 'border-color 0.15s ease, background-color 0.15s ease',
        }}
      >
        {buttonLabel}
      </button>

      <svg
        width="10"
        height="10"
        viewBox="0 0 10 6"
        fill="none"
        aria-hidden="true"
        style={{
          position: 'absolute',
          right: hasSelection ? 30 : 14,
          pointerEvents: 'none',
          color: hasSelection ? 'var(--spdc-brand-text)' : 'var(--spdc-text-secondary)',
          transform: open ? 'rotate(180deg)' : 'none',
          transition: 'transform 0.15s ease',
        }}
      >
        <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>

      {hasSelection && (
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onClear() }}
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
            color: 'var(--spdc-brand-text)',
            borderRadius: '50%',
            width: 16,
            height: 16,
          }}
        >
          <svg width="8" height="8" viewBox="0 0 12 12" fill="currentColor" aria-hidden="true">
            <path d="M.293.293a1 1 0 0 1 1.414 0L6 4.586 10.293.293a1 1 0 1 1 1.414 1.414L7.414 6l4.293 4.293a1 1 0 0 1-1.414 1.414L6 7.414l-4.293 4.293A1 1 0 0 1 .293 10.707L4.586 6 .293 1.707A1 1 0 0 1 .293.293Z" />
          </svg>
        </button>
      )}

      {open && (
        <div
          role="listbox"
          aria-multiselectable="true"
          aria-label={label}
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            marginTop: 4,
            minWidth: '100%',
            maxWidth: 320,
            backgroundColor: 'var(--spdc-surface)',
            border: '1px solid var(--spdc-divider)',
            borderRadius: 8,
            boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
            zIndex: 9999,
            overflow: 'hidden',
          }}
        >
          <div style={{ padding: '8px 8px 4px', borderBottom: '1px solid var(--spdc-hover)' }}>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <svg
                width="14"
                height="14"
                viewBox="0 0 16 16"
                fill="none"
                aria-hidden="true"
                style={{ position: 'absolute', left: 8, color: 'var(--spdc-text-secondary)', pointerEvents: 'none' }}
              >
                <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.099zm-5.242 1.656a5.5 5.5 0 1 1 0-11 5.5 5.5 0 0 1 0 11z" fill="currentColor" />
              </svg>
              <input
                ref={inputRef}
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={strings.FilterSearch}
                style={{
                  width: '100%',
                  height: 32,
                  paddingLeft: 30,
                  paddingRight: 8,
                  border: '1px solid var(--spdc-border-input)',
                  borderRadius: 6,
                  fontSize: 13,
                  outline: 'none',
                  boxSizing: 'border-box',
                  color: 'var(--spdc-text-strong)',
                }}
              />
            </div>
          </div>

          <ul style={{ margin: 0, padding: '4px 0', listStyle: 'none', maxHeight: 220, overflowY: 'auto' }}>
            {filtered.length === 0 ? (
              <li style={{ padding: '8px 16px', fontSize: 13, color: 'var(--spdc-text-secondary)' }}>—</li>
            ) : (
              filtered.map((opt) => {
                const isChecked = selected.includes(opt)
                return (
                  <li
                    key={opt}
                    role="option"
                    aria-selected={isChecked}
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => onToggle(opt)}
                    style={{
                      padding: '7px 12px',
                      fontSize: 13,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      color: 'var(--spdc-text-strong)',
                      backgroundColor: isChecked ? 'var(--spdc-brand-tint)' : 'transparent',
                      userSelect: 'none',
                    }}
                    onMouseEnter={(e) => {
                      if (!isChecked) (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--spdc-page-bg)'
                    }}
                    onMouseLeave={(e) => {
                      ;(e.currentTarget as HTMLElement).style.backgroundColor = isChecked ? 'var(--spdc-brand-tint)' : 'transparent'
                    }}
                  >
                    <span
                      aria-hidden="true"
                      style={{
                        width: 16,
                        height: 16,
                        borderRadius: 3,
                        border: `2px solid ${isChecked ? 'var(--spdc-brand-solid)' : 'var(--spdc-border-input)'}`,
                        backgroundColor: isChecked ? 'var(--spdc-brand-solid)' : 'var(--spdc-surface)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        transition: 'background-color 0.1s ease, border-color 0.1s ease',
                      }}
                    >
                      {isChecked && (
                        <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                          <path d="M1 4l3 3 5-6" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </span>
                    {opt}
                  </li>
                )
              })
            )}
          </ul>
        </div>
      )}
    </div>
  )
}

const FilterBar: React.FC<FilterBarProps> = ({ filters, members, values, onChange }) => {
  if (!filters || filters.length === 0) return null

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
        const selected = values[filter.fieldName] || []

        return (
          <MultiSelect
            key={filter.fieldName}
            label={filter.label}
            options={options}
            selected={selected}
            disabled={disabled}
            onToggle={(val) => {
              const current = values[filter.fieldName] || []
              const next = current.includes(val)
                ? current.filter((v) => v !== val)
                : [...current, val]
              onChange(filter.fieldName, next.length > 0 ? next : null)
            }}
            onClear={() => onChange(filter.fieldName, null)}
          />
        )
      })}
    </>
  )
}

export default FilterBar
