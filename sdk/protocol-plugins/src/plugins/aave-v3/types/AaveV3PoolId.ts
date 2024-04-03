import { ChainInfo } from '@summerfi/sdk-common/common'
import { IPoolId, ProtocolName, isPoolId } from '@summerfi/sdk-common/protocols'
import { EmodeType } from '../../common/enums/EmodeType'

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
