import {
  SPARK_ORACLE_ABI,
  SPARK_POOL_DATA_PROVIDER_ABI,
  SPARK_LENDING_POOL_ABI,
} from './SparkABIS'

/**
 * @description Spark ABI map
 * ABIs for the different Spark contracts
 */
export const SparkAbiMap = {
  Oracle: SPARK_ORACLE_ABI,
  PoolDataProvider: SPARK_POOL_DATA_PROVIDER_ABI,
  SparkLendingPool: SPARK_LENDING_POOL_ABI,
} as const
