import { TokenSymbol } from '@summerfi/sdk-common/common'
// TODO: figure it out - in compound v3 each comet (main contract) supports different debt token usdc or weth - so it should be dynamic and chain specific
// Ideally we woudl not store it here jsut read data directly from provided comet address ( so support compound like protocols)
export type DebtToken = TokenSymbol.WBTC | TokenSymbol.ETH | TokenSymbol.DAI | TokenSymbol.WETH
export const COMPOUND_V3_DEBT_TOKENS = [
  TokenSymbol.WETH,
  TokenSymbol.USDC,
] as const
