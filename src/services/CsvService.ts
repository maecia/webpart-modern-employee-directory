import { Member } from '../models/Member';

export interface ICsvService {
  exportToCsv(members: Member[], filename: string): void;
}

export class CsvService implements ICsvService {
  exportToCsv(members: Member[], filename: string): void {
    const headers = [
      'Nom',
      'Prénom',
      'Email',
      'Téléphone',
      'Poste',
      'Département',
      'Localisation',
      'Manager'
    ];

    const rows = members.map(m => [
      this.escapeCsvField(m.surname || ''),
      this.escapeCsvField(m.givenName || ''),
      this.escapeCsvField(m.email || ''),
      this.escapeCsvField(m.mobilePhone || ''),
      this.escapeCsvField(m.jobTitle || ''),
      this.escapeCsvField(m.department || ''),
      this.escapeCsvField(m.officeLocation || ''),
      this.escapeCsvField(m.managerDisplayName || '')
    ]);

    const bom = '\uFEFF';
    const csvContent = bom + [
      headers.join(';'),
      ...rows.map(r => r.join(';'))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  private escapeCsvField(field: string): string {
    if (field.includes(';') || field.includes('"') || field.includes('\n')) {
      return `"${field.replace(/"/g, '""')}"`;
    }
    return field;
  }
}
