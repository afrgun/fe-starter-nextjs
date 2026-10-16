import { describe, expect, it } from 'vitest';
import { selectableBanks, type Bank } from '../bank';

const bank = (code: string, isActive: boolean, isOtherBank = false): Bank => ({
  code,
  name: code,
  isActive,
  isOtherBank,
  logoUrl: null,
});

describe('selectableBanks', () => {
  it('keeps only active banks', () => {
    expect(selectableBanks([bank('A', true), bank('B', false)]).map((b) => b.code)).toEqual(['A']);
  });

  it('puts the other-bank option last', () => {
    expect(selectableBanks([bank('OTHER', true, true), bank('A', true)]).map((b) => b.code)).toEqual(['A', 'OTHER']);
  });

  it('returns an empty list when no bank is active', () => {
    expect(selectableBanks([bank('A', false)])).toEqual([]);
  });
});
