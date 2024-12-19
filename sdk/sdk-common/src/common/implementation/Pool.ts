import { IPrintable } from '../interfaces/IPrintable'
import { PoolType } from '../enums/PoolType'
import { SerializationService } from '../../services/SerializationService'
import { IPool, IPoolData, __signature__ } from '../interfaces/IPool'
import { IPoolId } from '../interfaces/IPoolId'

/**
 * Type for the parameters of IPool
 */
export type PoolParameters = Omit<IPoolData, 'type' | 'id'>

/**
 * @class Pool
 * @see IPool
 */
export abstract class Pool implements IPool, IPrintable {
  /** SIGNATURE */
  readonly [__signature__] = __signature__

  /** ATTRIBUTES */
  abstract readonly type: PoolType
  abstract readonly id: IPoolId

  /** SEALED CONSTRUCTOR */
  protected constructor(_: PoolParameters) {
    // Empty on purpose
  }

  /** METHODS */

  /** @see IPrintable.toString */
  toString(): string {
    return `Pool: ${this.type} (${this.id.toString()})`
  }
}

SerializationService.registerClass(Pool, { identifier: 'Pool' })
