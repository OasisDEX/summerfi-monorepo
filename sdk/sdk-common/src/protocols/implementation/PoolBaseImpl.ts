import { Address } from '../../common/implementation/Address'
import { SerializationService } from '../../services/SerializationService'
import { IPool } from '../interfaces/IPool'
import { IPoolId } from '../interfaces/IPoolId'
import { IProtocol } from '../interfaces/IProtocol'
import { PoolType } from '../types/PoolType'

export abstract class PoolBaseImpl<T extends PoolType> implements IPool {
  public readonly poolId: IPoolId
  public readonly protocol: IProtocol
  public readonly type: T
  public readonly address?: Address
  public readonly TVL?: number

  constructor(params: {
    poolId: IPoolId
    protocol: IProtocol
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

SerializationService.registerClass(PoolBaseImpl)
