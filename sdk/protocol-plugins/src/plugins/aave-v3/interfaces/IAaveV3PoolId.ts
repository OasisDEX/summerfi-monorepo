import { IPoolId, ProtocolName, isPoolId } from '@summerfi/sdk-common/protocols'
import { EmodeType } from '../../common/enums/EmodeType'
import { IAaveV3Protocol } from './IAaveV3Protocol'

export interface IAaveV3PoolId extends IPoolId {
  protocol: IAaveV3Protocol
  emodeType: EmodeType
}

export function isAaveV3PoolId(maybeAaveV3PoolId: unknown): maybeAaveV3PoolId is IAaveV3PoolId {
  return (
    isPoolId(maybeAaveV3PoolId) &&
    'emodeType' in maybeAaveV3PoolId &&
    maybeAaveV3PoolId.protocol.name === ProtocolName.AAVEv3
  )
}
