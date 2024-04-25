import { IPoolId, ProtocolName, isPoolId } from '@summerfi/sdk-common/protocols'
import { ILKType } from '../enums/ILKType'
import { IMakerProtocol } from './IMakerProtocol'

export interface IMakerPoolId extends IPoolId {
  protocol: IMakerProtocol
  ilkType: ILKType
}

export function isMakerPoolId(maybePoolId: unknown): maybePoolId is IMakerPoolId {
  return (
    isPoolId(maybePoolId) &&
    'ilkType' in maybePoolId &&
    maybePoolId.protocol.name === ProtocolName.Maker
  )
}
