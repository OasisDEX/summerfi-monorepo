import type { Token } from '~sdk-common/common/implementation/Token'
import { IPool } from './IPool'
import { PoolType } from './PoolType'
import type { Percentage } from '~sdk-common/common/implementation/Percentage'
import { TokenAmount } from '~sdk-common/common/implementation/TokenAmount'
import { Price } from '~sdk-common/common/implementation/Price'
import { CurrencySymbol, RiskRatio } from '~sdk-common/common'
import { ProtocolName } from './ProtocolName'

export interface CollateralConfig {
  protocol: ProtocolName
  token: Token
  price: Price
  priceUSD: Price
  liquidationTreshold: RiskRatio
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
  protocol: ProtocolName
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
  protocol: ProtocolName
  protocolBaseCurrency: Token | CurrencySymbol
  collaterals: CollateralConfig[]
  debts: DebtConfig[]
}

export function isLendingPool(pool: IPool): pool is LendingPool {
  return pool.type === PoolType.Lending
}
