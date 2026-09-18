/// <reference types="jest" />

import { CsvService } from '../../src/services/CsvService';

describe('CsvService', () => {
  let createObjectURL: jest.Mock;
  let revokeObjectURL: jest.Mock;
  let capturedBlob: Blob | undefined;

  beforeEach(() => {
    capturedBlob = undefined;
    createObjectURL = jest.fn((blob: Blob) => {
      capturedBlob = blob;
      return 'blob:test';
    });
    revokeObjectURL = jest.fn();
    URL.createObjectURL = createObjectURL as any;
    URL.revokeObjectURL = revokeObjectURL as any;
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  function readBlob(blob: Blob): Promise<Uint8Array> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(new Uint8Array(reader.result as ArrayBuffer));
      reader.onerror = () => reject(reader.error);
      reader.readAsArrayBuffer(blob);
    });
  }

  function bytesToString(bytes: Uint8Array): string {
    return Array.from(bytes)
      .map((b) => String.fromCharCode(b))
      .join('');
  }

  /** Returns a real anchor element but with a spied click, so DOM APIs still work. */
  function mockAnchorClick(): jest.Mock {
    const click = jest.fn();
    const realCreateElement = document.createElement.bind(document);
    jest.spyOn(document, 'createElement').mockImplementation((tag: string) => {
      const element = realCreateElement(tag);
      if (tag === 'a') {
        element.click = click;
      }
      return element;
    });
    return click;
  }

  it('attaches the anchor to the provided container and never to document.body', () => {
    const service = new CsvService();
    const container = document.createElement('span');
    const append = jest.spyOn(container, 'appendChild');
    const remove = jest.spyOn(container, 'removeChild');
    const bodyAppend = jest.spyOn(document.body, 'appendChild');
    const click = mockAnchorClick();

    service.exportToCsv(
      ['Name', 'Email'],
      [['Jean Dupont', 'jean@test.com']],
      'test.csv',
      container,
    );

    expect(append).toHaveBeenCalledTimes(1);
    expect(remove).toHaveBeenCalledTimes(1);
    expect(bodyAppend).not.toHaveBeenCalled();
    expect(click).toHaveBeenCalledTimes(1);
    expect(createObjectURL).toHaveBeenCalledTimes(1);
    expect(revokeObjectURL).toHaveBeenCalledWith('blob:test');
  });

  it('clicks the anchor while detached when no container is provided', () => {
    const service = new CsvService();
    const bodyAppend = jest.spyOn(document.body, 'appendChild');
    const click = mockAnchorClick();

    service.exportToCsv(['Name'], [['Jean Dupont']], 'test.csv');

    expect(click).toHaveBeenCalledTimes(1);
    expect(bodyAppend).not.toHaveBeenCalled();
  });

  it('generates a semicolon-separated CSV with a UTF-8 BOM', async () => {
    const service = new CsvService();
    const container = document.createElement('span');
    mockAnchorClick();

    service.exportToCsv(
      ['Name', 'Email'],
      [['Jean Dupont', 'jean@test.com']],
      'test.csv',
      container,
    );

    const bytes = await readBlob(capturedBlob!);
    // UTF-8 BOM so Excel opens the file with the right encoding.
    expect([bytes[0], bytes[1], bytes[2]]).toEqual([0xef, 0xbb, 0xbf]);

    const text = bytesToString(bytes);
    expect(text).toContain('Name;Email');
    expect(text).toContain('Jean Dupont;jean@test.com');
  });

  it('escapes values containing the separator, quotes or line breaks', async () => {
    const service = new CsvService();
    const container = document.createElement('span');
    mockAnchorClick();

    service.exportToCsv(
      ['Value'],
      [['a;b'], ['say "hi"'], ['line1\nline2']],
      'test.csv',
      container,
    );

    const text = bytesToString(await readBlob(capturedBlob!));
    expect(text).toContain('"a;b"');
    expect(text).toContain('"say ""hi"""');
    expect(text).toContain('"line1\nline2"');
  });
});
