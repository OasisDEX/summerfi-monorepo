import type { Token } from '../../common/implementation/Token'
import { LendingPool } from '../../protocols/implementation/LendingPool'
import type { Percentage } from '../../common/implementation/Percentage'
import { TokenAmount } from '../../common/implementation/TokenAmount'
import { Price } from '../../common/implementation/Price'
import { RiskRatio} from '../../common'

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
