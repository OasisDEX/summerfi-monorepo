import { IPrintable } from '../../common/interfaces/IPrintable'
import { SerializationService } from '../../services/SerializationService'
import { IPoolInfo, IPoolInfoParameters } from '../interfaces/IPoolInfo'
import { PoolType } from '../types/PoolType'
import { PoolId } from './PoolId'

/**
 * @class PoolInfo
 * @see IPoolInfo
 */
export abstract class PoolInfo implements IPoolInfo, IPrintable {
  readonly _signature_0 = 'IPoolInfo'
  readonly type: PoolType
  abstract readonly id: PoolId

  protected constructor(params: IPoolInfoParameters) {
    this.type = params.type
  }

  toString(): string {
    return `Pool Info: ${this.type} (${this.id.toString()})`
  }
}

SerializationService.registerClass(PoolInfo)
