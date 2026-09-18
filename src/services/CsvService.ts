import { Member } from '../models/Member'

export interface ICsvService {
  /**
   * Generates a CSV file and triggers its download.
   *
   * @param container Optional element owned by the web part where the transient
   * download anchor is attached. When omitted, the anchor is clicked while
   * detached. The page DOM (`document.body`) is never modified.
   */
  exportToCsv(
    headers: string[],
    rows: string[][],
    filename: string,
    container?: HTMLElement,
  ): void
}

export class CsvService implements ICsvService {
  exportToCsv(
    headers: string[],
    rows: string[][],
    filename: string,
    container?: HTMLElement,
  ): void {
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
    link.style.display = 'none'

    if (container) {
      // Attach to the web part DOM, never to the page body.
      container.appendChild(link)
      link.click()
      container.removeChild(link)
    } else {
      // Detached click — supported by all evergreen browsers.
      link.click()
    }

    URL.revokeObjectURL(url)
  }
}
