// ABIs and Protocol contracts
import {
  AAVEV3_LENDING_POOL_ABI,
  AAVEV3_ORACLE_ABI,
  AAVEV3_POOL_DATA_PROVIDER_ABI,
} from './AaveV3ABIS'

/**
 * @description AaveV3 ABI map
 * ABIs for the different AaveV3 contracts
 */
export const AaveV3AbiMap = {
  Oracle: AAVEV3_ORACLE_ABI,
  PoolDataProvider: AAVEV3_POOL_DATA_PROVIDER_ABI,
  AavePool: AAVEV3_LENDING_POOL_ABI,
  AaveL2Encoder: null
} as const
