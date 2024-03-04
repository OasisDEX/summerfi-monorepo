import type { Address } from '~sdk-common/common/implementation/Address'
import type { IPool } from '~sdk-common/protocols/interfaces/IPool'
import type { PoolType } from '~sdk-common/protocols/interfaces/PoolType'
import type { IPoolId } from '~sdk-common/protocols/interfaces/IPoolId'
import { ProtocolName } from '~sdk-common/protocols/interfaces/ProtocolName'

export class PoolBaseImpl<T extends PoolType> implements IPool {
  public readonly poolId: IPoolId
  public readonly protocol: ProtocolName
  public readonly type: T
  public readonly address?: Address
  public readonly TVL?: number

  constructor(params: {
    poolId: IPoolId
    protocol: ProtocolName
    type: T
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
