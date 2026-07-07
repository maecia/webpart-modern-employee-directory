/// <reference types="jest" />

import { CsvService } from '../../src/services/CsvService';
import { Member } from '../../src/models/Member';

const createObjectURL = jest.fn(() => 'blob:test');
URL.createObjectURL = createObjectURL;
URL.revokeObjectURL = jest.fn();

describe('CsvService', () => {
  beforeEach(() => {
    createObjectURL.mockClear();
  });

  it('generates CSV and triggers download', () => {
    const service = new CsvService();
    const members: Member[] = [
      {
        id: '1',
        displayName: 'Jean Dupont',
        surname: 'Dupont',
        givenName: 'Jean',
        email: 'jean@test.com',
        isVisible: true
      }
    ];

    const clickSpy = jest.fn();
    const createElementSpy = jest.spyOn(document, 'createElement');
    createElementSpy.mockReturnValue({
      href: '',
      setAttribute: jest.fn(),
      click: clickSpy,
      remove: jest.fn()
    } as any);

    const appendChildSpy = jest.spyOn(document.body, 'appendChild').mockImplementation(() => 0 as any);
    const removeChildSpy = jest.spyOn(document.body, 'removeChild').mockImplementation(() => 0 as any);

    service.exportToCsv(members, 'test.csv');

    expect(createObjectURL).toHaveBeenCalled();
    expect(clickSpy).toHaveBeenCalled();
    expect(appendChildSpy).toHaveBeenCalled();
    expect(removeChildSpy).toHaveBeenCalled();

    createElementSpy.mockRestore();
    appendChildSpy.mockRestore();
    removeChildSpy.mockRestore();
  });

  it('exports only visible members respecting filters', () => {
    const service = new CsvService();
    const members: Member[] = [
      { id: '1', displayName: 'A', isVisible: true },
      { id: '2', displayName: 'B', isVisible: false }
    ];

    const clickSpy = jest.fn();
    const createElementSpy = jest.spyOn(document, 'createElement');
    createElementSpy.mockReturnValue({
      href: '',
      setAttribute: jest.fn(),
      click: clickSpy,
      remove: jest.fn()
    } as any);
    jest.spyOn(document.body, 'appendChild').mockImplementation(() => 0 as any);
    jest.spyOn(document.body, 'removeChild').mockImplementation(() => 0 as any);

    const filteredMembers = members.filter(m => m.isVisible);
    service.exportToCsv(filteredMembers, 'test.csv');

    expect(createObjectURL).toHaveBeenCalled();
    createElementSpy.mockRestore();
  });
});
