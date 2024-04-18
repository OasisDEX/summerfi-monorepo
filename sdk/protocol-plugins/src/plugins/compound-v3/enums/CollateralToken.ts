import { TokenSymbol } from '@summerfi/sdk-common/common'
export type CollateralToken =
  | TokenSymbol.WBTC
  | TokenSymbol.ETH
  | TokenSymbol.DAI
  | TokenSymbol.WETH
export const COMPOUND_V3_COLLATERAL_TOKENS = [
  TokenSymbol.WBTC,
  TokenSymbol.ETH,
  TokenSymbol.DAI,
  TokenSymbol.WETH,
] as const
