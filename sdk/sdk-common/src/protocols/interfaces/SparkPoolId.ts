import { ChainInfo } from "../../common/implementation/ChainInfo";
import { ProtocolName } from '../enums/ProtocolName'
import { IPoolId } from './IPoolId'
import { EmodeType } from '../enums/EmodeType'

// TODO: temporary interface so FE can create this data types without talking to a service
export interface SparkPoolId extends IPoolId {
  protocol: {
    name: ProtocolName.Spark,
    chainInfo: ChainInfo
  }
  emodeType: EmodeType
}

export function isSparkPoolId(poolId: IPoolId): poolId is SparkPoolId {
  return poolId.protocol.name === ProtocolName.Spark
}
