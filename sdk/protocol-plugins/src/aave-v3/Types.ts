import {
    CollateralConfig,
    DebtConfig,
} from '@summerfi/sdk-common/protocols'
import {
    Percentage,
    RiskRatio,
} from '@summerfi/sdk-common/common'
import type { LendingPool } from '@summerfi/sdk-common/protocols'

export interface AaveV3PoolCollateralConfig extends CollateralConfig {
    usageAsCollateralEnabled: boolean
    apy: Percentage
    maxLtv: RiskRatio
}
export interface AaveV3PoolDebtConfig extends DebtConfig {
    borrowingEnabled: boolean
}

export type AaveV3LendingPool = LendingPool<AaveV3PoolCollateralConfig, AaveV3PoolDebtConfig>
