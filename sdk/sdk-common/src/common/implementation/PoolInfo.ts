import { IPrintable } from '../../common/interfaces/IPrintable'
import { SerializationService } from '../../services/SerializationService'
import { IPoolId } from '../interfaces/IPoolId'
import { IPoolInfo, IPoolInfoParameters, __signature__ } from '../interfaces/IPoolInfo'
import { PoolType } from '../types/PoolType'

/**
 * @class PoolInfo
 * @see IPoolInfo
 */
export abstract class PoolInfo implements IPoolInfo, IPrintable {
  /** SIGNATURE */
  readonly [__signature__] = __signature__

  /** ATTRIBUTES */
  readonly type: PoolType
  abstract readonly id: IPoolId

  /** SEALED CONSTRUCTOR */
  protected constructor(params: IPoolInfoParameters) {
    this.type = params.type
  }

  /** METHODS */

  /** @see IPrintable.toString */
  toString(): string {
    return `Pool Info: ${this.type} (${this.id.toString()})`
  }
}

SerializationService.registerClass(PoolInfo)
