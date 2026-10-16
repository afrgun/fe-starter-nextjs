import { describe, expect, it } from 'vitest';
import { toBank, toBanks } from '../bank.mapper';

describe('toBank', () => {
  it('maps a full payload', () => {
    expect(toBank({ bank_code: 'BCA', bank_name: 'Bank Central Asia', active: 'Y', other: false, logo: 'https://cdn/bca.png' })).toEqual({
      code: 'BCA',
      name: 'Bank Central Asia',
      isActive: true,
      isOtherBank: false,
      logoUrl: 'https://cdn/bca.png',
    });
  });

  it('falls back to the code when the name is missing', () => {
    expect(toBank({ bank_code: 'OTH', bank_name: null, active: 'Y' })?.name).toBe('OTH');
  });

  it('treats lowercase "y" as active and unknown flags as inactive', () => {
    expect(toBank({ bank_code: 'A', active: 'y' })?.isActive).toBe(true);
    expect(toBank({ bank_code: 'A', active: 'maybe' })?.isActive).toBe(false);
  });

  it('returns null when the required code is missing', () => {
    expect(toBank({ bank_name: 'No code', active: 'Y' })).toBeNull();
    expect(toBank({ bank_code: '   ', active: 'Y' })).toBeNull();
  });
});

describe('toBanks', () => {
  it('maps every item', () => {
    expect(toBanks([{ bank_code: 'A', active: 'Y' }, { bank_code: 'B', active: 'N' }])?.map((b) => b.code)).toEqual(['A', 'B']);
  });

  it('is all-or-nothing when one item is invalid', () => {
    expect(toBanks([{ bank_code: 'A', active: 'Y' }, { active: 'Y' }])).toBeNull();
  });
});
