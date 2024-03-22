import { ChainInfo } from '../../common'
import { IPoolId, isPoolId } from '../../protocols/interfaces/IPoolId'
import { ProtocolName } from '../../protocols/enums/ProtocolName'
import { EmodeType } from '../enums/EmodeType'

// TODO: temporary interface so FE can create this data types without talking to a service
export interface AaveV3PoolId extends IPoolId {
  protocol: {
    name: ProtocolName.AAVEv3
    chainInfo: ChainInfo
  }
  emodeType: EmodeType
}

export function isAaveV3PoolId(maybeAaveV3PoolId: unknown): maybeAaveV3PoolId is AaveV3PoolId {
  return (
    isPoolId(maybeAaveV3PoolId) &&
    'emodeType' in maybeAaveV3PoolId &&
    maybeAaveV3PoolId.protocol.name === ProtocolName.AAVEv3
  )
}
