import { IPrintable } from '../../common/interfaces/IPrintable'
import { PoolType } from '../../common/types/PoolType'
import { SerializationService } from '../../services/SerializationService'
import { IPool, IPoolParameters } from '../interfaces/IPool'
import { IPoolId } from '../interfaces/IPoolId'

/**
 * @class Pool
 * @see IPool
 */
export abstract class Pool implements IPool, IPrintable {
  readonly _signature_0 = 'IPool'
  readonly type: PoolType
  abstract readonly id: IPoolId

  protected constructor(params: IPoolParameters) {
    this.type = params.type
  }

  toString(): string {
    return `Pool: ${this.type} (${this.id.toString()})`
  }
}

SerializationService.registerClass(Pool)
