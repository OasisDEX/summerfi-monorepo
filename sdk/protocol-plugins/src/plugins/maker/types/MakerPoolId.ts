import { ChainInfo } from '@summerfi/sdk-common/common'
import { IPoolId, ProtocolName, isPoolId } from '@summerfi/sdk-common/protocols'
import { ILKType } from '../enums/ILKType'

export interface MakerPoolId extends IPoolId {
  protocol: {
    name: ProtocolName.Maker
    chainInfo: ChainInfo
  }
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
