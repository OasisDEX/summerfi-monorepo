import type { Token } from '~sdk-common/common/implementation/Token'
import { LendingPool } from '~sdk-common/protocols/implementation/LendingPool'
import type { Percentage } from '~sdk-common/common/implementation/Percentage'
import { TokenAmount } from '~sdk-common/common/implementation/TokenAmount'
import { Price } from '~sdk-common/common/implementation/Price'
import { RiskRatio} from '~sdk-common/common'

export interface CollateralConfig {
  token: Token
  price: Price
  priceUSD: Price
  liquidationThreshold: RiskRatio
  maxSupply: TokenAmount
  tokensLocked: TokenAmount
  liquidationPenalty: Percentage
}

// TODO: Move all to plugins directory when integrating everything
export interface MakerPoolCollateralConfig extends CollateralConfig {
  nextPrice: Price
  lastPriceUpdate: Date
  nextPriceUpdate: Date
}

export interface SparkPoolCollateralConfig extends CollateralConfig {
  usageAsCollateralEnabled: boolean
  apy: Percentage
  maxLtv: RiskRatio
}

export interface AaveV3PoolCollateralConfig extends CollateralConfig {
  usageAsCollateralEnabled: boolean
  apy: Percentage 
  maxLtv: RiskRatio
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

export interface MakerPoolDebtConfig extends DebtConfig {}

export interface AaveV3PoolDebtConfig extends DebtConfig {
  borrowingEnabled: boolean;
}

export interface SparkPoolDebtConfig extends DebtConfig {
  borrowingEnabled: boolean;
}

export type MakerLendingPool = LendingPool<MakerPoolCollateralConfig, MakerPoolDebtConfig>
export type SparkLendingPool = LendingPool<SparkPoolCollateralConfig, SparkPoolDebtConfig>
export type AaveV3LendingPool = LendingPool<AaveV3PoolCollateralConfig, AaveV3PoolDebtConfig>
