import {SparkContractNames} from "@summerfi/deployment-types";
import {
    CollateralConfig,
    DebtConfig,
} from '@summerfi/sdk-common/protocols'
import {
    Percentage,
    RiskRatio,
    AddressValue
} from '@summerfi/sdk-common/common'
import type { LendingPool } from '@summerfi/sdk-common/protocols'
import {SPARK_ORACLE_ABI, SPARK_POOL_DATA_PROVIDER_ABI, SPARK_LENDING_POOL_ABI} from "./abis";

// Lending Pool
export interface SparkPoolDebtConfig extends DebtConfig {
    borrowingEnabled: boolean
}
export interface SparkPoolCollateralConfig extends CollateralConfig {
    usageAsCollateralEnabled: boolean
    apy: Percentage
    maxLtv: RiskRatio
}

export type SparkLendingPool = LendingPool<SparkPoolCollateralConfig, SparkPoolDebtConfig>

// ABIs and Protocol contracts
type SparkAbiMap = {
    Oracle: typeof SPARK_ORACLE_ABI
    PoolDataProvider: typeof SPARK_POOL_DATA_PROVIDER_ABI
    SparkLendingPool: typeof SPARK_LENDING_POOL_ABI
}

export type SparkAddressAbiMap = {
    [K in SparkContractNames]: {
        address: AddressValue
        abi: SparkAbiMap[K]
    }
}
