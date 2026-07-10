import { Member } from '../models/Member'

export interface ICsvService {
  exportToCsv(headers: string[], rows: string[][], filename: string): void
}

export class CsvService implements ICsvService {
  exportToCsv(headers: string[], rows: string[][], filename: string): void {
    const bom = '\uFEFF'
    const escape = (field: string): string => {
      if (
        field.indexOf(';') !== -1 ||
        field.indexOf('"') !== -1 ||
        field.indexOf('\n') !== -1
      ) {
        return '"' + field.replace(/"/g, '""') + '"'
      }
      return field
    }

    const csvContent =
      bom +
      [
        headers.map(escape).join(';'),
        ...rows.map((r) => r.map(escape).join(';')),
      ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', filename)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }
}
