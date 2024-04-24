import { Address, TokenSymbol } from '@summerfi/sdk-common/common'
import { IPoolId, ProtocolName, isPoolId } from '@summerfi/sdk-common/protocols'
import { ICompoundV3Protocol } from './ICompoundV3Protocol'

export interface ICompoundV3PoolId extends IPoolId {
  protocol: ICompoundV3Protocol
  collaterals: TokenSymbol[]
  debt: TokenSymbol
  comet: Address
}

export function isCompoundV3PoolId(
  maybeCompoundV3PoolId: unknown,
): maybeCompoundV3PoolId is ICompoundV3PoolId {
  return (
    isPoolId(maybeCompoundV3PoolId) &&
    'collaterals' in maybeCompoundV3PoolId &&
    'debt' in maybeCompoundV3PoolId &&
    'comet' in maybeCompoundV3PoolId &&
    maybeCompoundV3PoolId.protocol.name === ProtocolName.CompoundV3
  )
}
