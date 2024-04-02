import { ChainInfo } from '@summerfi/sdk-common/common'
import { IPoolId, ProtocolName } from '@summerfi/sdk-common/protocols'
import { EmodeType } from '../../common/enums/EmodeType'

export interface SparkPoolId extends IPoolId {
  protocol: {
    name: ProtocolName.Spark
    chainInfo: ChainInfo
  }
  emodeType: EmodeType
}

export function isSparkPoolId(poolId: IPoolId): poolId is SparkPoolId {
  return poolId.protocol.name === ProtocolName.Spark
}
