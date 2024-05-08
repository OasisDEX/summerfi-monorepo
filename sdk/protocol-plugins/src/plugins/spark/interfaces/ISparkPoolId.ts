import { IPoolId, ProtocolName } from '@summerfi/sdk-common/protocols'
import { EmodeType } from '../../common/enums/EmodeType'
import { ISparkProtocol } from './ISparkProtocol'

export interface ISparkPoolId extends IPoolId {
  protocol: ISparkProtocol
  emodeType: EmodeType
}

export function isSparkPoolId(poolId: IPoolId): poolId is ISparkPoolId {
  return poolId.protocol.name === ProtocolName.Spark
}
