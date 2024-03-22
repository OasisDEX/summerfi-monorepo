import { SparkContractNames } from '@summerfi/deployment-types'
import { AddressValue } from '@summerfi/sdk-common/common'
import {
  SPARK_ORACLE_ABI,
  SPARK_POOL_DATA_PROVIDER_ABI,
  SPARK_LENDING_POOL_ABI,
} from '../abis/SparkABIS'

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
