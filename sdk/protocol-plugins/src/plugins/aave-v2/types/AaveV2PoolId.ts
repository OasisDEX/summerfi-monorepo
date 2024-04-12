import { ChainInfo } from '@summerfi/sdk-common/common'
import { IPoolId, ProtocolName, isPoolId } from '@summerfi/sdk-common/protocols'

export interface AaveV2PoolId extends IPoolId {
  protocol: {
    name: ProtocolName.AAVEv2
    chainInfo: ChainInfo
  }
}

export function isAaveV2PoolId(maybeAaveV2PoolId: unknown): maybeAaveV2PoolId is AaveV2PoolId {
  return (
    isPoolId(maybeAaveV2PoolId) &&
    maybeAaveV2PoolId.protocol.name === ProtocolName.AAVEv2
  )
}
