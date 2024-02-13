import { Address } from '~sdk/common'
import { Pool, PoolId, ProtocolId, PoolType } from '~sdk/protocols'

export class PoolBaseImpl implements Pool {
  public readonly poolId: PoolId
  public readonly protocolId: ProtocolId
  public readonly type: PoolType
  public readonly address?: Address
  public readonly TVL?: number

  constructor(params: {
    poolId: PoolId
    protocolId: ProtocolId
    type: PoolType
    address?: Address
    TVL?: number
  }) {
    this.poolId = params.poolId
    this.protocolId = params.protocolId
    this.type = params.type
    this.address = params.address
    this.TVL = params.TVL
  }
}
