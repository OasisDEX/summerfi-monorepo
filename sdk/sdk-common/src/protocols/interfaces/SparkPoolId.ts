import { ProtocolName } from './ProtocolName'
import { IPoolId } from './IPoolId'

// TODO: temporary interface so FE can create this data types without talking to a service
export interface SparkPoolId extends IPoolId {
  protocol: ProtocolName.Spark
  id: string
}

export function isSparkPoolId(poolId: IPoolId): poolId is SparkPoolId {
  return poolId.protocol === ProtocolName.Spark
}
