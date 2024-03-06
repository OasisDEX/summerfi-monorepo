import { ProtocolName } from './ProtocolName'
import { IPoolId } from './IPoolId'

// TODO: temporary interface so FE can create this data types without talking to a service
export interface MakerPoolId extends IPoolId {
  protocol: ProtocolName.Maker
  id: string
}

export function isMakerPoolId(poolId: IPoolId): poolId is MakerPoolId {
  return poolId.protocol === ProtocolName.Maker
}
