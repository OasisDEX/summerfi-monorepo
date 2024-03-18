import {
    CollateralConfig,
    DebtConfig,
} from '@summerfi/sdk-common/protocols'
import {
    Percentage,
    RiskRatio,
} from '@summerfi/sdk-common/common'
import type { LendingPool } from '@summerfi/sdk-common/protocols'

export interface SparkPoolDebtConfig extends DebtConfig {
    borrowingEnabled: boolean
}
export interface SparkPoolCollateralConfig extends CollateralConfig {
    usageAsCollateralEnabled: boolean
    apy: Percentage
    maxLtv: RiskRatio
}

export type SparkLendingPool = LendingPool<SparkPoolCollateralConfig, SparkPoolDebtConfig>

