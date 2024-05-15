import { SparkContractNames } from '@summerfi/deployment-types'
import { GenericAbiMap } from '../../utils/ChainContractProvider'
import {
  SPARK_ORACLE_ABI,
  SPARK_POOL_DATA_PROVIDER_ABI,
  SPARK_LENDING_POOL_ABI,
} from './SparkABIS'

export type SparkAbiMapType = GenericAbiMap<SparkContractNames> & {
  Oracle: typeof SPARK_ORACLE_ABI,
  PoolDataProvider: typeof SPARK_POOL_DATA_PROVIDER_ABI,
  SparkLendingPool: typeof SPARK_LENDING_POOL_ABI,
}

/**
 * @description Spark ABI map
 * ABIs for the different Spark contracts
 */
export const SparkAbiMap: SparkAbiMapType = {
  Oracle: SPARK_ORACLE_ABI,
  PoolDataProvider: SPARK_POOL_DATA_PROVIDER_ABI,
  SparkLendingPool: SPARK_LENDING_POOL_ABI,
} as const