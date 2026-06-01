import type BigNumber from 'bignumber.js'

/**
 * Builds the human-readable `txAmount` string for transaction analytics events,
 * or undefined when there is no positive amount/token to report. Shared by the
 * deposit/withdraw/switch flows so every event reports the amount consistently.
 */
export const formatTxAmount = (
  amount: BigNumber | undefined,
  token: { symbol: string } | undefined,
): string | undefined =>
  amount && amount.isGreaterThan(0) && token ? `${amount.toString()} ${token.symbol}` : undefined
