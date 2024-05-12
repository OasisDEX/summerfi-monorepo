// ABIs and Protocol contracts
import { AaveV3ContractNames } from '@summerfi/deployment-types'
import { GenericAbiMap } from '../../utils/ChainContractProvider'
import {
  AAVEV3_LENDING_POOL_ABI,
  AAVEV3_ORACLE_ABI,
  AAVEV3_POOL_DATA_PROVIDER_ABI,
} from './AaveV3ABIS'

export type AaveV3AbiMapType = GenericAbiMap<AaveV3ContractNames> & {
  Oracle: typeof AAVEV3_ORACLE_ABI,
  PoolDataProvider: typeof AAVEV3_POOL_DATA_PROVIDER_ABI,
  AavePool: typeof AAVEV3_LENDING_POOL_ABI,
  AaveL2Encoder: null
}

/**
 * @description AaveV3 ABI map
 * ABIs for the different AaveV3 contracts
 */
export const AaveV3AbiMap: AaveV3AbiMapType = {
  Oracle: AAVEV3_ORACLE_ABI,
  PoolDataProvider: AAVEV3_POOL_DATA_PROVIDER_ABI,
  AavePool: AAVEV3_LENDING_POOL_ABI,
  AaveL2Encoder: null
} as const
