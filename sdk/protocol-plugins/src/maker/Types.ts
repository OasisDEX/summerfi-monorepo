import {
    CollateralConfig,
    DebtConfig,
} from '@summerfi/sdk-common/protocols'
import {
    Price,
} from '@summerfi/sdk-common/common'
import type { LendingPool } from '@summerfi/sdk-common/protocols'

export interface MakerPoolDebtConfig extends DebtConfig {}
export interface MakerPoolCollateralConfig extends CollateralConfig {
    nextPrice: Price
    lastPriceUpdate: Date
    nextPriceUpdate: Date
}

export type MakerLendingPool = LendingPool<MakerPoolCollateralConfig, MakerPoolDebtConfig>
