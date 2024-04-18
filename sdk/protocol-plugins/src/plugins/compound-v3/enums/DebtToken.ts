import { TokenSymbol } from '@summerfi/sdk-common/common'
export type DebtToken = TokenSymbol.WBTC | TokenSymbol.ETH | TokenSymbol.DAI | TokenSymbol.WETH
export const COMPOUND_V3_DEBT_TOKENS = [
  TokenSymbol.WETH,
  TokenSymbol.USDC,
] as const
