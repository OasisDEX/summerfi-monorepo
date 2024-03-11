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

export interface MakerPoolCollateralConfig extends CollateralConfig {
  nextPrice: Price // only maker has this TODO add to protocol specific config
  maxLtv: RiskRatio
}

export interface SparkPoolCollateralConfig extends CollateralConfig {
  maxLtv: RiskRatio
  usageAsCollateralEnabled: boolean
}

export interface AavePoolCollateralConfig extends CollateralConfig {
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

export interface MakerPoolDebtConfig extends DebtConfig {}

export interface AavePoolDebtConfig extends DebtConfig {
  maxLtv: RiskRatio
}

export interface SparkPoolDebtConfig extends DebtConfig {
  borrowingEnabled: boolean;
}

export type MakerLendingPool = LendingPool<MakerPoolCollateralConfig, MakerPoolDebtConfig>
export type SparkLendingPool = LendingPool<SparkPoolCollateralConfig, SparkPoolDebtConfig>
export type AaveLendingPool = LendingPool<AavePoolCollateralConfig>
