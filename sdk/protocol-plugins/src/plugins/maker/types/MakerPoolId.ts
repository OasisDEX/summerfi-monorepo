import { IPoolId, IProtocol, ProtocolName, isPoolId } from '@summerfi/sdk-common/protocols'
import { ILKType } from '../enums/ILKType'

export interface MakerPoolId extends IPoolId {
  protocol: IProtocol
  ilkType: ILKType
  // TODO: vaultId does not belong in the poolId
  vaultId: string
}

export function isMakerPoolId(maybePoolId: unknown): maybePoolId is MakerPoolId {
  return (
    isPoolId(maybePoolId) &&
    'ilkType' in maybePoolId &&
    'vaultId' in maybePoolId &&
    maybePoolId.protocol.name === ProtocolName.Maker
  )
}
