import { AaveV3ContractNames } from '@summerfi/deployment-types'
import { CollateralConfig, DebtConfig } from '@summerfi/sdk-common/protocols'
import { Percentage, RiskRatio, AddressValue } from '@summerfi/sdk-common/common'
import type { LendingPool } from '@summerfi/sdk-common/protocols'
import { AAVEV3_LENDING_POOL_ABI, AAVEV3_ORACLE_ABI, AAVEV3_POOL_DATA_PROVIDER_ABI } from './abis'

// Lending Pool
export interface AaveV3PoolCollateralConfig extends CollateralConfig {
  usageAsCollateralEnabled: boolean
  apy: Percentage
  maxLtv: RiskRatio
}
export interface AaveV3PoolDebtConfig extends DebtConfig {
  borrowingEnabled: boolean
}

export type AaveV3LendingPool = LendingPool<AaveV3PoolCollateralConfig, AaveV3PoolDebtConfig>

// ABIs and Protocol contracts
type AaveV3AbiMap = {
  Oracle: typeof AAVEV3_ORACLE_ABI
  PoolDataProvider: typeof AAVEV3_POOL_DATA_PROVIDER_ABI
  AavePool: typeof AAVEV3_LENDING_POOL_ABI
  AaveL2Encoder: null
}

export type AaveV3AddressAbiMap = {
  [K in AaveV3ContractNames]: {
    address: AddressValue
    abi: AaveV3AbiMap[K]
  }
}
