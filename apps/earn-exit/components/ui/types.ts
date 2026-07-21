/**
 * Local replacements for the `@summerfi/app-types` types this app used. Token symbols are
 * plain strings here — the full monorepo union added nothing but casts in this app.
 */
export enum SupportedNetworkIds {
  Mainnet = 1,
  Base = 8453,
  ArbitrumOne = 42161,
  SonicMainnet = 146,
  Hyperliquid = 999,
}

export type TokenSymbolsList = string
