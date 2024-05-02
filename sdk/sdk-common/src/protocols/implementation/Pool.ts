import { IPrintable } from '../../common/interfaces/IPrintable'
import { SerializationService } from '../../services/SerializationService'
import { IPool, IPoolData } from '../interfaces/IPool'
import { PoolType } from '../types/PoolType'
import { PoolId } from './PoolId'

/**
 * @class Pool
 * @see IPool
 */
export abstract class Pool implements IPool, IPrintable {
  readonly type: PoolType
  abstract readonly id: PoolId

  protected constructor(params: IPoolData) {
    this.type = params.type
  }

  toString(): string {
    return `Pool: ${this.type} (${this.id.toString()})`
  }
}

SerializationService.registerClass(Pool)
