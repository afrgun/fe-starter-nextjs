export interface Bank {
  readonly code: string;
  readonly name: string;
  readonly isActive: boolean;
  readonly isOtherBank: boolean;
  readonly logoUrl: string | null;
}

/** Banks a user may pick: active only, with the "other bank" option last. */
export const selectableBanks = (banks: readonly Bank[]): Bank[] =>
  banks.filter((bank) => bank.isActive).sort((a, b) => Number(a.isOtherBank) - Number(b.isOtherBank));
