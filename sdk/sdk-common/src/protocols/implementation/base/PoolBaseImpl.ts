import { Address } from '~sdk-common/common'
import { Pool, PoolId, PoolType, ProtocolName } from '~sdk-common/protocols'

export class PoolBaseImpl implements Pool {
  public readonly poolId: PoolId
  public readonly protocol: ProtocolName
  public readonly type: PoolType
  public readonly address?: Address
  public readonly TVL?: number

  constructor(params: {
    poolId: PoolId
    protocol: ProtocolName
    type: PoolType
    address?: Address
    TVL?: number
  }) {
    this.poolId = params.poolId
    this.protocol = params.protocol
    this.type = params.type
    this.address = params.address
    this.TVL = params.TVL
  }
}
