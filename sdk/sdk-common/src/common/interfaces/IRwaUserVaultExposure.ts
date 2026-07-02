import type { IFiatCurrencyAmount } from './IFiatCurrencyAmount'
import type { ITokenAmount } from './ITokenAmount'

/**
 * A single user's total economic exposure to an RWA vault, stitched from the three
 * money pools of the RoundsVault settlement model: the settled Fleet position, the
 * Input RoundsVault (pending + claimable deposits) and the Output RoundsVault (pending
 * withdrawals). All amounts are denominated in the Fleet input asset (e.g. USDC) —
 * withdrawal (share-denominated) receipts are converted via the vault `pricePerShare`.
 *
 * `total = settledPosition + pendingDeposits + claimableDeposits + pendingWithdrawals`.
 * `claimableDeposits` is a genuine additive term: settled-but-unclaimed deposit shares
 * are held by the RoundsVault contract, not the user, so they are NOT reflected in the
 * subgraph's per-user `position.inputTokenBalance` (`settledPosition`). Claimable
 * (settled, unredeemed) withdrawals are intentionally excluded.
 */
export interface IRwaUserVaultExposure {
  /** Sum of all components below, in the Fleet input asset */
  total: ITokenAmount
  /** `total` valued in USD via the vault `inputTokenPriceUSD` */
  totalUsd: IFiatCurrencyAmount
  /** Settled Fleet position (subgraph `position.inputTokenBalance`) */
  settledPosition: ITokenAmount
  /** Input-vault receipts in non-settled rounds (deposits awaiting settlement) */
  pendingDeposits: ITokenAmount
  /** Input-vault receipts in settled rounds (shares awaiting claim; not in `settledPosition`) */
  claimableDeposits: ITokenAmount
  /** Output-vault receipts in non-settled rounds, converted shares→input asset via pricePerShare */
  pendingWithdrawals: ITokenAmount
}
