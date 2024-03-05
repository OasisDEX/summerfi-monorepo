import type { Token } from '~sdk-common/common/implementation/Token'
import { IPool } from './IPool'
import { PoolType } from './PoolType'
import type { Percentage } from '~sdk-common/common/implementation/Percentage'
import { TokenAmount } from '~sdk-common/common/implementation/TokenAmount'
import { Price } from '~sdk-common/common/implementation/Price'
import { RiskRatio } from '~sdk-common/common'

export interface CollateralConfig {
  token: Token
  price: Price
  nextPrice: Price // only maker has this
  priceUSD: Price
  liquidationTreshold: RiskRatio
  tokensLocked: TokenAmount
  maxSupply: TokenAmount
  liquidationPenalty: Percentage
  apy: Percentage 
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
  variableRate: boolean
}

/**
 * @interface LendingPool
 * @description Represents a lending pool. Provides information about the collateral
 *              and debt tokens
 */
export interface LendingPool extends IPool {
  type: PoolType.Lending
  collaterals: CollateralConfig[]
  debts: DebtConfig[]
}

export function isLendingPool(pool: IPool): pool is LendingPool {
  return pool.type === PoolType.Lending
}
