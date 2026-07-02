import type { IFiatCurrencyAmount } from './IFiatCurrencyAmount'
import type { ITokenAmount } from './ITokenAmount'

/**
 * The total market value (true TVL) of an RWA vault across all users, treating the
 * Fleet and both RoundsVaults as one system. All amounts are denominated in the Fleet
 * input asset (e.g. USDC).
 *
 * `total = fleetAssets + pendingDeposits + claimableWithdrawals`.
 * - `fleetAssets` is the Fleet on-chain `totalAssets()` (subgraph
 * `vault.inputTokenBalance`). It ALREADY includes settled-but-unclaimed deposits
 * (deposited into the Fleet at settlement) and ALREADY excludes settled-but-unclaimed
 * withdrawals (redeemed out of the Fleet at settlement).
 * - `pendingDeposits` is the USDC still sitting in the Input RoundsVault for
 * not-yet-settled rounds (vault-wide, summed from per-round `receiptSupply`).
 * - `claimableWithdrawals` is the USDC sitting in the Output RoundsVault for settled,
 * unredeemed rounds (share supply converted via each round's settled exchange rate).
 *
 * Open/in-settlement output rounds are intentionally NOT added — their underlying is
 * still in the Fleet (already counted in `fleetAssets`).
 */
export interface IRwaVaultMarketValue {
  /** Sum of all components below, in the Fleet input asset */
  total: ITokenAmount
  /** `total` valued in USD via the vault `inputTokenPriceUSD` */
  totalUsd: IFiatCurrencyAmount
  /** Fleet on-chain total assets (subgraph `vault.inputTokenBalance`) */
  fleetAssets: ITokenAmount
  /** Vault-wide Input-RoundsVault funds in non-settled rounds (deposits awaiting settlement) */
  pendingDeposits: ITokenAmount
  /** Vault-wide Output-RoundsVault funds in settled, unredeemed rounds (claimable withdrawals) */
  claimableWithdrawals: ITokenAmount
}
