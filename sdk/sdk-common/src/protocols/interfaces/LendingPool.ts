import type { Token } from '../../common/implementation/Token'
import type { Percentage } from '../../common/implementation/Percentage'
import { TokenAmount } from '../../common/implementation/TokenAmount'
import { Price } from '../../common/implementation/Price'
import { RiskRatio } from '../../common/implementation/RiskRatio'

export interface CollateralConfig {
  token: Token
  price: Price
  priceUSD: Price
  liquidationThreshold: RiskRatio
  maxSupply: TokenAmount
  tokensLocked: TokenAmount
  liquidationPenalty: Percentage
}

export interface DebtConfig {
  token: Token
  price: Price
  priceUSD: Price
  rate: Percentage
  totalBorrowed: TokenAmount
  debtCeiling: TokenAmount
  debtAvailable: TokenAmount
  dustLimit: TokenAmount
  originationFee: Percentage
}

