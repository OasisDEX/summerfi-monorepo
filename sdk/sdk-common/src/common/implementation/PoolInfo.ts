import { IPrintable } from '../../common/interfaces/IPrintable'
import { SerializationService } from '../../services/SerializationService'
import { IPoolId } from '../interfaces/IPoolId'
import { IPoolInfo, IPoolInfoData, __signature__ } from '../interfaces/IPoolInfo'
import { PoolType } from '../types/PoolType'

/**
 * Type for the parameters of PoolInfo
 */
export type PoolInfoParameters = Omit<IPoolInfoData, 'type' | 'id'>

/**
 * @class PoolInfo
 * @see IPoolInfo
 */
export abstract class PoolInfo implements IPoolInfo, IPrintable {
  /** SIGNATURE */
  readonly [__signature__] = __signature__

  /** ATTRIBUTES */
  abstract readonly type: PoolType
  abstract readonly id: IPoolId

  /** SEALED CONSTRUCTOR */
  protected constructor(_: PoolInfoParameters) {
    // Empty on purpose
  }

  /** METHODS */

  /** @see IPrintable.toString */
  toString(): string {
    return `Pool Info: ${this.type} (${this.id.toString()})`
  }
}

SerializationService.registerClass(PoolInfo)
