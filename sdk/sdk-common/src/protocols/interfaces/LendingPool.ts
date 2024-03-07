import type { Token } from '~sdk-common/common/implementation/Token'
import {ProtocolName} from "~sdk-common/protocols";
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
  maxLtv: RiskRatio
  tokensLocked: TokenAmount
  liquidationPenalty: Percentage
}

interface MakerPoolCollateralConfig extends CollateralConfig {
  nextPrice: Price // only maker has this TODO add to protocol specific config
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
  variableRate: boolean
}

/**
 * @interface LendingPool
 * @description Represents a lending pool. Provides information about the collateral
 *              and debt tokens
 */
export interface LendingPool extends IPool {
  type: PoolType.Lending
  poolBaseCurrency: Token | CurrencySymbol
  collaterals: Record<AddressValue, CollateralConfig>
  debts: Record<AddressValue, DebtConfig>
}

export function isLendingPool(pool: IPool): pool is LendingPool {
  return pool.type === PoolType.Lending
}
