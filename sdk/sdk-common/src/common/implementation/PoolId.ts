import { IPrintable } from '../interfaces/IPrintable'
import { SerializationService } from '../../services/SerializationService'
import { IPoolId, IPoolIdData, __signature__ } from '../interfaces/IPoolId'
import { IProtocol } from '../interfaces/IProtocol'
import { PoolType } from '../enums/PoolType'

/**
 * Type for the parameters of PoolId
 */
export type PoolIdParameters = Omit<IPoolIdData, 'type' | 'protocol'>

/**
 * @class PoolId
 * @see IPoolIdData
 */
export abstract class PoolId implements IPoolId, IPrintable {
  /** SIGNATURE */
  readonly [__signature__] = __signature__

  /** ATTRIBUTES */
  abstract readonly type: PoolType
  abstract readonly protocol: IProtocol

  /** SEALED CONSTRUCTOR */
  protected constructor(_: PoolIdParameters) {
    // Empty on purpose
  }

  /** METHODS */

  /** @see IPrintable.toString */
  toString(): string {
    return `Pool ID: ${this.protocol.toString()}`
  }
}

SerializationService.registerClass(PoolId, { identifier: 'PoolId' })
