import { IPrintable } from '../../common/interfaces/IPrintable'
import { PoolType } from '../../common/types/PoolType'
import { SerializationService } from '../../services/SerializationService'
import { IPool, IPoolParameters, __signature__ } from '../interfaces/IPool'
import { IPoolId } from '../interfaces/IPoolId'

/**
 * @class Pool
 * @see IPool
 */
export abstract class Pool implements IPool, IPrintable {
  /** SIGNATURE */
  readonly [__signature__] = __signature__

  /** ATTRIBUTES */
  readonly type: PoolType
  abstract readonly id: IPoolId

  /** SEALED CONSTRUCTOR */
  protected constructor(params: IPoolParameters) {
    this.type = params.type
  }

  /** METHODS */

  /** @see IPrintable.toString */
  toString(): string {
    return `Pool: ${this.type} (${this.id.toString()})`
  }
}

SerializationService.registerClass(Pool)
