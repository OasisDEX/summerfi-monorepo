import type { Token } from '~sdk-common/common/implementation/Token'
import { IPool } from './IPool'
import { PoolType } from './PoolType'
import type { Percentage } from '~sdk-common/common/implementation/Percentage'
import { TokenAmount } from '~sdk-common/common/implementation/TokenAmount'
import { Price } from '~sdk-common/common/implementation/Price'
import {AddressValue, CurrencySymbol, RiskRatio} from '~sdk-common/common'

export interface CollateralConfig {
  token: Token
  price: Price
  priceUSD: Price
  liquidationThreshold: RiskRatio
  maxSupply: TokenAmount
  tokensLocked: TokenAmount
  liquidationPenalty: Percentage
}

interface MakerPoolCollateralConfig extends CollateralConfig {
  nextPrice: Price // only maker has this TODO add to protocol specific config
  maxLtv: RiskRatio
}

interface AavePoolCollateralConfig extends CollateralConfig {
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
}

interface AavePoolDebtConfig extends DebtConfig {
  maxLtv: RiskRatio
}

/**
 * @interface LendingPool
 * @description Represents a lending pool. Provides information about the collateral
 *              and debt tokens
 */
export interface LendingPool<GenericCollateralConfig extends CollateralConfig = CollateralConfig, GenericDebtConfig extends DebtConfig = DebtConfig> extends IPool {
  type: PoolType.Lending
  baseCurrency: Token | CurrencySymbol
  maxLTV: Percentage;
  collaterals: Record<AddressValue, GenericCollateralConfig>
  debts: Record<AddressValue, GenericDebtConfig>
}

export function isLendingPool(pool: IPool): pool is LendingPool {
  return pool.type === PoolType.Lending
}

export type MakerLendingPool = LendingPool<MakerPoolCollateralConfig>

export type SparkLendingPool = LendingPool