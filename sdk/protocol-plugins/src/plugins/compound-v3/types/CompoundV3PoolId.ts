import { Address, ChainInfo, TokenSymbol } from '@summerfi/sdk-common/common'
import { IPoolId, ProtocolName, isPoolId } from '@summerfi/sdk-common/protocols'

export interface CompoundV3PoolId extends IPoolId {
  protocol: {
    name: ProtocolName.CompoundV3
    chainInfo: ChainInfo
  }
  collaterals: TokenSymbol[]
  debt: TokenSymbol
  comet: Address
}

export function isCompoundV3PoolId(
  maybeCompoundV3PoolId: unknown,
): maybeCompoundV3PoolId is CompoundV3PoolId {
  return (
    isPoolId(maybeCompoundV3PoolId) &&
    'collaterals' in maybeCompoundV3PoolId &&
    'debt' in maybeCompoundV3PoolId &&
    'comet' in maybeCompoundV3PoolId &&
    maybeCompoundV3PoolId.protocol.name === ProtocolName.CompoundV3
  )
}
