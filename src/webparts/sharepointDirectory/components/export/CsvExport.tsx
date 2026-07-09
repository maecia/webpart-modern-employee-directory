import * as React from 'react'
import { CsvService } from '../../../../services/CsvService'
import { Member } from '../../../../models/Member'
import { strings } from '../../loc/mystrings'

interface CsvExportProps {
  members: Member[]
}

const CsvExport: React.FC<CsvExportProps> = ({ members }) => {
  const csvService = new CsvService()
  const disabled = members.length === 0
  const [hovered, setHovered] = React.useState(false)

  const handleExport = () => {
    const date = new Date().toISOString().split('T')[0]
    csvService.exportToCsv(members, `annuaire-sharepoint-${date}.csv`)
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
