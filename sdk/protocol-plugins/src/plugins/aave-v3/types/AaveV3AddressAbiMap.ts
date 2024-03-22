// ABIs and Protocol contracts
import { AaveV3ContractNames } from '@summerfi/deployment-types'
import { AddressValue } from '@summerfi/sdk-common/common'
import {
  AAVEV3_LENDING_POOL_ABI,
  AAVEV3_ORACLE_ABI,
  AAVEV3_POOL_DATA_PROVIDER_ABI,
} from '../abis/AaveV3ABIS'

export type AaveV3AbiMap = {
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
