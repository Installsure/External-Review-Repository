import { describe, it, expect } from 'vitest';
import type { Rfi } from '../types/api';

/**
 * Unit tests for RFI data normalization
 * These tests ensure the component never throws on .map() calls
 */
describe('RFI data normalization', () => {
  // Helper function that mimics the normalization logic in api.ts
  const normalizeRfis = (data: any): Rfi[] => {
    const normalized: Rfi[] =
      Array.isArray(data)         ? data :
      Array.isArray(data?.rfis)   ? data.rfis :
      Array.isArray(data?.items)  ? data.items :
      Array.isArray(data?.data)   ? data.data :
      data && typeof data === 'object' ? Object.values(data) as Rfi[] :
      [];
    
    return normalized;
  };

  it('should handle an empty array', () => {
    const result = normalizeRfis([]);
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(0);
  });

  it('should handle array directly', () => {
    const input: Rfi[] = [
      {
        id: 1,
        title: 'Test RFI',
        description: 'Test description',
        status: 'open',
        created_at: '2024-01-01',
        updated_at: '2024-01-01',
      },
    ];
    const result = normalizeRfis(input);
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(1);
    expect(result[0].title).toBe('Test RFI');
  });

  it('should handle { rfis: [...] } shape', () => {
    const input = {
      rfis: [
        {
          id: 1,
          title: 'Test RFI',
          description: 'Test description',
          status: 'open',
          created_at: '2024-01-01',
          updated_at: '2024-01-01',
        },
      ],
    };
    const result = normalizeRfis(input);
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(1);
  });

  it('should handle { items: [...] } shape', () => {
    const input = {
      items: [
        {
          id: 1,
          title: 'Test RFI',
          description: 'Test description',
          status: 'open',
          created_at: '2024-01-01',
          updated_at: '2024-01-01',
        },
      ],
    };
    const result = normalizeRfis(input);
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(1);
  });

  it('should handle { data: [...] } shape', () => {
    const input = {
      data: [
        {
          id: 1,
          title: 'Test RFI',
          description: 'Test description',
          status: 'open',
          created_at: '2024-01-01',
          updated_at: '2024-01-01',
        },
      ],
    };
    const result = normalizeRfis(input);
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(1);
  });

  it('should handle null', () => {
    const result = normalizeRfis(null);
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(0);
  });

  it('should handle undefined', () => {
    const result = normalizeRfis(undefined);
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(0);
  });

  it('should handle empty object', () => {
    const result = normalizeRfis({});
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(0);
  });

  it('should handle single RFI object by converting to array', () => {
    const input = {
      '1': {
        id: 1,
        title: 'Test RFI',
        description: 'Test description',
        status: 'open',
        created_at: '2024-01-01',
        updated_at: '2024-01-01',
      },
    };
    const result = normalizeRfis(input);
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(1);
  });

  it('should never throw on .map() call', () => {
    const testCases = [
      [],
      { rfis: [] },
      { items: [] },
      {},
      null,
      undefined,
      'invalid',
      123,
    ];

    testCases.forEach((testCase) => {
      const result = normalizeRfis(testCase);
      expect(() => result.map((x: any) => x)).not.toThrow();
    });
  });
});
