import * as React from 'react'
import { strings } from '../../loc/mystrings'
import {
  STANDARD_FIELD_KEYS,
  getAvailableEntraIdFieldGroups,
  getEntraFieldLabel,
} from '../../../../models/DirectoryConfig'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface DnDFieldSelectorProps {
  view: 'card' | 'list' | 'modal'
  selectedKeys: string[]
  labelsJson: string
  detectedExtAttrs: string[]
  primaryColor: string
  supportedLanguages: string[]
  onUpdateKeys: (keys: string[]) => void
  onUpdateLabels: (labelsJson: string) => void
}

/** Return the human-readable name for a language code, e.g. "fr" → "Français" */
function getLangName(code: string): string {
  const key = `Lang_${code}`
  return (strings as any)[key] || code.toUpperCase()
}

// ─── Constants ────────────────────────────────────────────────────────────────

const LOCKED_ORDER = ['photo', 'firstName', 'name']

/** Fields that cannot be reordered and whose labels cannot be customized — applies to all views */
const LOCKED_KEYS = new Set(LOCKED_ORDER)

// ─── Helpers ──────────────────────────────────────────────────────────────────

function parseLabels(json: string): Record<string, { fr: string; en: string }> {
  try {
    return JSON.parse(json) || {}
  } catch {
    return {}
  }
}

function defaultLabel(key: string): string {
  switch (key) {
    case 'photo':
      return strings.FieldPhoto
    case 'name':
      return strings.FieldName
    case 'firstName':
      return strings.FieldFirstName
    case 'email':
      return strings.FieldEmail
    case 'phone':
      return strings.FieldPhone
    case 'jobTitle':
      return strings.FieldJobTitle
    case 'department':
      return strings.FieldDepartment
    case 'officeLocation':
      return strings.FieldOfficeLocation
    case 'manager':
      return strings.FieldManager
    case 'outlook':
      return strings.FieldOutlook
    case 'teams':
      return strings.FieldTeams
    default:
      return getEntraFieldLabel(key)
  }
}

/** Ensure locked fields (photo, firstName, name) always come first in their predefined order */
function reorderWithLockedPrefix(keys: string[]): string[] {
  const locked = LOCKED_ORDER.filter((k) => keys.includes(k))
  const rest = keys.filter((k) => !LOCKED_KEYS.has(k))
  return [...locked, ...rest]
}

// ─── Style factory (dynamic — depends on primaryColor) ────────────────────────

function createStyles(primary: string) {
  return {
    root: { fontSize: 13, padding: '4px 0' } as React.CSSProperties,

    sectionLabel: {
      display: 'block',
      fontSize: 14,
      fontWeight: 600,
      color: '#323130',
      marginTop: 12,
      marginBottom: 4,
    } as React.CSSProperties,

    // ── Fluent UI dropdown trigger ──────────────────────────────────────────
    selectTrigger: (open: boolean): React.CSSProperties => ({
      height: open ? 33 : 32,
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      padding: '0 30px 0 8px',
      appearance: 'none' as any,
      WebkitAppearance: 'none' as any,
      borderRadius: 'var(--borderRadiusMedium, 4px)',
      border: '1px solid var(--colorNeutralStroke1, #d1d1d1)',
      borderBottomWidth: open ? '2px' : '1px',
      borderBottomStyle: 'solid',
      borderBottomColor: open ? primary : 'var(--colorNeutralStrokeAccessiblePressed, #616161)',
      background: '#ffffff',
      fontSize: 14,
      fontFamily:
        '"Segoe UI", "Segoe UI Web (West European)", "Segoe UI", -apple-system, BlinkMacSystemFont, Roboto, "Helvetica Neue", sans-serif',
      fontWeight: 400,
      color: '#323130',
      cursor: 'pointer',
      textAlign: 'left' as const,
      boxSizing: 'border-box' as const,
      outline: 'none',
    }),

    dropdownPanel: {
      position: 'absolute' as const,
      top: 'calc(100% + 4px)',
      left: 0,
      right: 0,
      zIndex: 9999,
      background: '#ffffff',
      border: '1px solid #8a8886',
      borderRadius: 2,
      maxHeight: 300,
      overflowY: 'auto' as const,
      boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
    } as React.CSSProperties,

    groupHeader: {
      fontSize: 11,
      fontWeight: 700,
      color: '#a19f9d',
      textTransform: 'uppercase' as const,
      letterSpacing: '0.05em',
      padding: '8px 8px 3px',
      background: '#faf9f8',
      borderBottom: '1px solid #f3f2f1',
      position: 'sticky' as const,
      top: 0,
      zIndex: 1,
    } as React.CSSProperties,

    checkItem: (checked: boolean, hovered: boolean): React.CSSProperties => ({
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      padding: '0 8px',
      height: 36,
      cursor: 'pointer',
      background: 'transparent',
      userSelect: 'none' as const,
      color: '#201f1e',
      fontSize: 14,
    }),

    checkBox: (checked: boolean): React.CSSProperties => ({
      width: 16,
      height: 16,
      border: checked ? `2px solid ${primary}` : '1.5px solid #8a8886',
      borderRadius: 2,
      background: checked ? primary : '#fff',
      flexShrink: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }),

    // ── DnD ordered list ──────────────────────────────────────────────────
    divider: {
      height: 1,
      background: '#edebe9',
      margin: '12px 0 8px',
    } as React.CSSProperties,

    dragRow: (
      isDragging: boolean,
      isDragOver: boolean,
    ): React.CSSProperties => ({
      display: 'flex',
      alignItems: 'flex-start',
      gap: 8,
      padding: '6px 8px',
      marginBottom: 4,
      background: isDragOver ? '#f0f6ff' : isDragging ? '#f3f2f1' : '#faf9f8',
      border: isDragOver ? `1.5px dashed ${primary}` : '1px solid #edebe9',
      borderRadius: 4,
      opacity: isDragging ? 0.5 : 1,
      transition: 'background 0.1s, border 0.1s',
    }),

    lockedRow: {
      display: 'flex',
      alignItems: 'flex-start',
      gap: 8,
      padding: '6px 8px',
      marginBottom: 4,
      background: '#faf9f8',
      border: '1px solid #edebe9',
      borderRadius: 4,
      opacity: 0.7,
    } as React.CSSProperties,

    handle: {
    color: '#8a8886',
    cursor: 'grab',
      userSelect: 'none' as const,
      flexShrink: 0,
      paddingTop: 2,
    } as React.CSSProperties,

    handleLocked: {
      color: '#e1dfdd',
      cursor: 'default',
      userSelect: 'none' as const,
      flexShrink: 0,
      paddingTop: 2,
    } as React.CSSProperties,

    fieldLabel: {
      flex: 1,
      fontSize: 13,
      color: '#201f1e',
      paddingTop: 1,
    } as React.CSSProperties,

    labelRow: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: 4,
      marginTop: 6,
    } as React.CSSProperties,

    labelCaption: {
      fontSize: 11,
      fontWeight: 600,
      color: '#605e5c',
      marginBottom: 2,
    } as React.CSSProperties,

    labelInput: {
      width: '100%',
      height: 28,
      fontSize: 13,
      padding: '0 6px',
      border: '1px solid #8a8886',
      borderRadius: 2,
      color: '#201f1e',
      background: '#fff',
      boxSizing: 'border-box' as const,
      outline: 'none',
    } as React.CSSProperties,

    lockedLabel: {
      fontSize: 13,
      color: '#605e5c',
      padding: '4px 6px',
      background: '#f3f2f1',
      borderRadius: 2,
      userSelect: 'none' as const,
    } as React.CSSProperties,

    removeBtn: {
      background: 'none',
      border: 'none',
      padding: '2px 4px',
      cursor: 'pointer',
      color: '#605e5c',
      fontSize: 16,
      lineHeight: '1',
      flexShrink: 0,
    } as React.CSSProperties,

    hint: {
      fontSize: 11,
      color: '#605e5c',
      marginBottom: 6,
    } as React.CSSProperties,
  }
}

// ─── Main component ──────────────────────────────────────────────────────────

const DnDFieldSelector: React.FC<DnDFieldSelectorProps> = ({
  view,
  selectedKeys: initialKeys,
  labelsJson: initialLabelsJson,
  detectedExtAttrs,
  primaryColor,
  supportedLanguages,
  onUpdateKeys,
  onUpdateLabels,
}) => {
  const S = React.useMemo(() => createStyles(primaryColor), [primaryColor])

  // ── Inner sub‑components (closed over S) ────────────────────────────────
  const DragHandle: React.FC = () => (
    <svg
      width="10"
      height="16"
      viewBox="0 0 10 16"
      fill="#8a8886"
      style={S.handle}
      aria-hidden
    >
      <circle cx="3" cy="3" r="1.5" />
      <circle cx="7" cy="3" r="1.5" />
      <circle cx="3" cy="8" r="1.5" />
      <circle cx="7" cy="8" r="1.5" />
      <circle cx="3" cy="13" r="1.5" />
      <circle cx="7" cy="13" r="1.5" />
    </svg>
  )

  const CheckItem: React.FC<{
    label: string
    checked: boolean
    onToggle: () => void
  }> = ({ label, checked, onToggle }) => {
    const [hovered, setHovered] = React.useState(false)
    return (
      <div
        style={S.checkItem(checked, hovered)}
        onClick={onToggle}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        role="checkbox"
        aria-checked={checked}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === ' ' || e.key === 'Enter') {
            e.preventDefault()
            onToggle()
          }
        }}
      >
        <div style={S.checkBox(checked)}>
          {checked && (
            <svg
              width="10"
              height="8"
              viewBox="0 0 10 8"
              fill="#fff"
              aria-hidden
            >
              <path
                d="M1 3.5L4 6.5L9 1"
                stroke="#fff"
                strokeWidth="1.5"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </div>
        <span>{label}</span>
      </div>
    )
  }

  const [keys, setKeys] = React.useState<string[]>(() =>
    reorderWithLockedPrefix(initialKeys),
  )
  const [labels, setLabels] = React.useState<
    Record<string, Record<string, string>>
  >(() => parseLabels(initialLabelsJson))
  const [dropdownOpen, setDropdownOpen] = React.useState(false)
  const dropdownRef = React.useRef<HTMLDivElement>(null)

  // Drag state — indices are relative to draggableKeys only
  const dragFromRef = React.useRef<number | null>(null)
  const [dragOver, setDragOver] = React.useState<number | null>(null)
  const [dragging, setDragging] = React.useState<number | null>(null)

  const groups = getAvailableEntraIdFieldGroups()

  const isSelected = (k: string) => keys.includes(k)

  const lockedCount = React.useMemo(
    () => LOCKED_ORDER.filter((k) => keys.includes(k)).length,
    [keys],
  )

  const draggableKeys = keys

  // Close dropdown on outside click
  React.useEffect(() => {
    if (!dropdownOpen) return
    const handler = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [dropdownOpen])

  // ── Toggle ────────────────────────────────────────────────────────────────
  const toggle = (k: string) => {
    const removing = isSelected(k)
    const newKeys = removing
      ? reorderWithLockedPrefix(keys.filter((x) => x !== k))
      : reorderWithLockedPrefix([...keys, k])
    setKeys(newKeys)
    onUpdateKeys(newKeys)
    if (removing) {
      const nl = { ...labels }
      delete nl[k]
      setLabels(nl)
      onUpdateLabels(JSON.stringify(nl))
    }
  }

  // ── Drag & drop ───────────────────────────────────────────────────────────
  const handleDragStart = (idx: number) => {
    dragFromRef.current = idx
    setDragging(idx)
  }
  const handleDragOver = (e: React.DragEvent, idx: number) => {
    e.preventDefault()
    setDragOver(idx)
  }
  const handleDrop = (toIdx: number) => {
    const fromIdx = dragFromRef.current
    dragFromRef.current = null
    setDragging(null)
    setDragOver(null)
    // Prevent dropping into locked area (indices 0..lockedCount-1)
    if (fromIdx === null || fromIdx === toIdx || toIdx < lockedCount) return
    const next = [...draggableKeys]
    const [moved] = next.splice(fromIdx, 1)
    next.splice(toIdx, 0, moved)
    onUpdateKeys(next)
    setKeys(next)
  }
  const handleDragEnd = () => {
    dragFromRef.current = null
    setDragging(null)
    setDragOver(null)
  }

  // ── Labels ────────────────────────────────────────────────────────────────
  const updateLabelLocal = (k: string, lang: string, val: string) => {
    setLabels((prev) => {
      const next = { ...prev, [k]: { ...(prev[k] || {}), [lang]: val } }
      onUpdateLabels(JSON.stringify(next))
      return next
    })
  }

  // ── Select trigger text ───────────────────────────────────────────────────
  const selectedCount = keys.length
  const buttonText =
    selectedCount === 0
      ? strings.DnD_NoSelection
      : `${selectedCount} ${strings.DnD_AvailableFields.toLowerCase()}`

  const standardFields = [
    { key: 'photo', label: strings.FieldPhoto },
    { key: 'name', label: strings.FieldName },
    { key: 'firstName', label: strings.FieldFirstName },
    { key: 'email', label: strings.FieldEmail },
    { key: 'phone', label: strings.FieldPhone },
    { key: 'jobTitle', label: strings.FieldJobTitle },
    { key: 'department', label: strings.FieldDepartment },
    { key: 'officeLocation', label: strings.FieldOfficeLocation },
    { key: 'manager', label: strings.FieldManager },
    { key: 'outlook', label: strings.FieldOutlook },
    { key: 'teams', label: strings.FieldTeams },
  ]

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div style={S.root}>
      {/* ══ FIELD PICKER ════════════════════════════════════════════════════ */}
      <span style={S.sectionLabel}>{strings.DnD_AvailableFields}</span>

      <div ref={dropdownRef} style={{ position: 'relative', marginBottom: 16 }}>
        <div style={{ position: 'relative' }}>
          <button
            type="button"
            style={S.selectTrigger(dropdownOpen)}
            onClick={() => setDropdownOpen((o) => !o)}
            aria-haspopup="listbox"
            aria-expanded={dropdownOpen}
          >
            <span
              style={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                flex: 1,
                color: selectedCount === 0 ? '#605e5c' : '#323130',
              }}
            >
              {buttonText}
            </span>
          </button>
          <svg
            fill="currentColor"
            aria-hidden="true"
            width="1em"
            height="1em"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
            style={{
              position: 'absolute',
              right: 8,
              top: '50%',
              transform: 'translateY(-50%)',
              pointerEvents: 'none',
              fontSize: 14,
              color: '#605e5c',
            }}
          >
            <path
              d="M15.85 7.65c.2.2.2.5 0 .7l-5.46 5.49a.55.55 0 0 1-.78 0L4.15 8.35a.5.5 0 1 1 .7-.7L10 12.8l5.15-5.16c.2-.2.5-.2.7 0Z"
              fill="currentColor"
            ></path>
          </svg>
        </div>

        {/* Dropdown panel */}
        {dropdownOpen && (
          <div style={S.dropdownPanel} role="listbox" aria-multiselectable>
            <div style={S.groupHeader}>{strings.DnD_StandardGroup}</div>
            {standardFields.map((f) => (
              <CheckItem
                key={f.key}
                label={f.label}
                checked={isSelected(f.key)}
                onToggle={() => toggle(f.key)}
              />
            ))}

            {groups.map((group) => (
              <div key={group.groupKey}>
                <div style={S.groupHeader}>{group.label}</div>
                {group.fields.map((f) => (
                  <CheckItem
                    key={f.key}
                    label={f.label}
                    checked={isSelected(f.key)}
                    onToggle={() => toggle(f.key)}
                  />
                ))}
              </div>
            ))}

            {detectedExtAttrs.length > 0 && (
              <div>
                <div style={S.groupHeader}>{strings.DnD_ExtAttrGroup}</div>
                {detectedExtAttrs.map((k) => (
                  <CheckItem
                    key={k}
                    label={getEntraFieldLabel(k)}
                    checked={isSelected(k)}
                    onToggle={() => toggle(k)}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ══ DISPLAY ORDER ════════════════════════════════════════════════════ */}
      <span style={S.sectionLabel}>{strings.DnD_DisplayOrder}</span>

      {keys.length === 0 ? (
        <div style={S.hint}>{strings.DnD_NoSelection}</div>
      ) : (
        <>
          <div style={S.hint}>{strings.DnD_DragHint}</div>

          {draggableKeys.map((key, idx) => {
            const isLocked = LOCKED_KEYS.has(key)
            const isDraggingThis = dragging === idx
            const isDragOverThis = dragOver === idx && dragging !== idx
            const showLabels = view !== 'card'

            return (
              <div
                key={key}
                {...(!isLocked
                  ? {
                      draggable: true,
                      onDragStart: () => handleDragStart(idx),
                      onDragOver: (e: React.DragEvent) =>
                        handleDragOver(e, idx),
                      onDrop: () => handleDrop(idx),
                      onDragEnd: handleDragEnd,
                    }
                  : {})}
                style={
                  isLocked
                    ? S.lockedRow
                    : S.dragRow(isDraggingThis, isDragOverThis)
                }
              >
                {isLocked ? (
                  <svg
                    width="10"
                    height="16"
                    viewBox="0 0 10 16"
                    fill="#e1dfdd"
                    style={S.handleLocked}
                    aria-hidden
                  >
                    <circle cx="3" cy="3" r="1.5" />
                    <circle cx="7" cy="3" r="1.5" />
                    <circle cx="3" cy="8" r="1.5" />
                    <circle cx="7" cy="8" r="1.5" />
                    <circle cx="3" cy="13" r="1.5" />
                    <circle cx="7" cy="13" r="1.5" />
                  </svg>
                ) : (
                  <DragHandle />
                )}

                <div style={{ flex: 1, minWidth: 0 }}>
                  <span style={S.fieldLabel}>{defaultLabel(key)}</span>

                  {showLabels && !isLocked && (
                    <div style={S.labelRow}>
                      {supportedLanguages.map((lang) => (
                        <div key={lang}>
                          <div style={S.labelCaption}>{getLangName(lang)}</div>
                          <input
                            type="text"
                            style={S.labelInput}
                            defaultValue={labels[key]?.[lang] || ''}
                            placeholder={defaultLabel(key)}
                            onChange={(e) => updateLabelLocal(key, lang, e.target.value)}
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <button
                  style={S.removeBtn}
                  onClick={() => toggle(key)}
                  title={strings.DnD_RemoveField}
                  aria-label={`${strings.DnD_RemoveField}: ${defaultLabel(key)}`}
                >
                  ×
                </button>
              </div>
            )
          })}
        </>
      )}
    </div>
  )
}

export default DnDFieldSelector
