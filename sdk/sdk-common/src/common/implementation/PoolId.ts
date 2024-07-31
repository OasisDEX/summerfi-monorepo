import { IPrintable } from '../../common/interfaces/IPrintable'
import { SerializationService } from '../../services'
import { IPoolId, IPoolIdParameters, __ipoolid__ } from '../interfaces/IPoolId'
import { IProtocol } from '../interfaces/IProtocol'
import { PoolType } from '../types/PoolType'

/**
 * @class PoolId
 * @see IPoolIdData
 */
export abstract class PoolId implements IPoolId, IPrintable {
  /** SIGNATURE */
  readonly [__ipoolid__] = 'IPoolId'

  /** ATTRIBUTES */
  readonly type: PoolType
  abstract protocol: IProtocol

  /** SEALED CONSTRUCTOR */
  protected constructor(params: IPoolIdParameters) {
    this.type = params.type
  }

  /** METHODS */

  /** @see IPrintable.toString */
  toString(): string {
    return `Pool ID: ${this.protocol.toString()}`
  }
}

SerializationService.registerClass(PoolId)
