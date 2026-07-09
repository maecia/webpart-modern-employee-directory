import * as React from 'react'
import { CsvService } from '../../../../services/CsvService'
import { Member } from '../../../../models/Member'
import { strings } from '../../loc/mystrings'
import {
  getEntraFieldLabel,
  STANDARD_FIELD_KEYS,
} from '../../../../models/DirectoryConfig'

// Keys that have no exportable text value — skip in CSV
const SKIP_KEYS = new Set(['photo', 'outlook', 'teams'])

/** Read the value of a field from a Member object */
function getMemberFieldValue(m: Member, key: string): string {
  switch (key) {
    case 'firstName':
      return m.givenName || ''
    case 'name':
      return m.surname || ''
    case 'email':
      return m.email || ''
    case 'phone':
      return m.mobilePhone || ''
    case 'jobTitle':
      return m.jobTitle || ''
    case 'department':
      return m.department || ''
    case 'officeLocation':
      return m.officeLocation || ''
    case 'manager':
      return m.managerDisplayName || ''
    default:
      return (m.customProperties && m.customProperties[key]) || ''
  }
}

/** Column header: admin label → standard i18n label → EntraID label → key */
function getColumnHeader(
  key: string,
  listFieldLabels: Record<string, string>,
): string {
  if (listFieldLabels[key]) return listFieldLabels[key]
  const standardMap: Record<string, string> = {
    firstName: strings.FieldFirstName,
    name: strings.FieldName,
    email: strings.FieldEmail,
    phone: strings.FieldPhone,
    jobTitle: strings.FieldJobTitle,
    department: strings.FieldDepartment,
    officeLocation: strings.FieldOfficeLocation,
    manager: strings.FieldManager,
  }
  if (standardMap[key]) return standardMap[key]
  if (!STANDARD_FIELD_KEYS.has(key)) return getEntraFieldLabel(key)
  return key
}

interface CsvExportProps {
  members: Member[]
  listFieldOrder: string[]
  listFieldLabels: Record<string, string>
}

const CsvExport: React.FC<CsvExportProps> = ({
  members,
  listFieldOrder,
  listFieldLabels,
}) => {
  const csvService = new CsvService()
  const disabled = members.length === 0
  const [hovered, setHovered] = React.useState(false)

  const handleExport = () => {
    // Use exactly the configured list field order, skip non-exportable keys
    const keys = listFieldOrder.filter((k) => !SKIP_KEYS.has(k))
    const headers = keys.map((k) => getColumnHeader(k, listFieldLabels))
    const rows = members.map((m) => keys.map((k) => getMemberFieldValue(m, k)))
    const date = new Date().toISOString().split('T')[0]
    csvService.exportToCsv(headers, rows, `annuaire-sharepoint-${date}.csv`)
  }

  return (
    <button
      onClick={handleExport}
      disabled={disabled}
      title={strings.ExportCsv}
      onMouseEnter={() => !disabled && setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        height: 38,
        paddingLeft: 14,
        paddingRight: 14,
        borderRadius: 20,
        border: '1px solid #c7c9cc',
        backgroundColor: hovered ? '#f3f2f1' : '#ffffff',
        color: disabled ? '#a19f9d' : '#6B7280',
        fontSize: 13,
        cursor: disabled ? 'not-allowed' : 'pointer',
        whiteSpace: 'nowrap',
        flexShrink: 0,
        outline: 'none',
        transition: 'background-color 0.15s ease',
      }}
    >
      <svg
        width="13"
        height="13"
        viewBox="0 0 16 16"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M8 12.5a.5.5 0 0 1-.5-.5V3a.5.5 0 0 1 1 0v9a.5.5 0 0 1-.5.5z" />
        <path d="M4.646 9.146a.5.5 0 0 1 .708 0L8 11.793l2.646-2.647a.5.5 0 0 1 .708.708l-3 3a.5.5 0 0 1-.708 0l-3-3a.5.5 0 0 1 0-.708z" />
        <path d="M2 14a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1v-1a.5.5 0 0 0-1 0v1H3v-1a.5.5 0 0 0-1 0v1z" />
      </svg>
      {strings.ExportCsv}
    </button>
  )
}

export default CsvExport
