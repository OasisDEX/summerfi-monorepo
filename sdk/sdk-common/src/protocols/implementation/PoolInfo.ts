import { IPrintable } from '../../common/interfaces/IPrintable'
import { SerializationService } from '../../services/SerializationService'
import { IPoolInfo, IPoolInfoData } from '../interfaces/IPoolInfo'
import { PoolType } from '../types/PoolType'
import { PoolId } from './PoolId'

/**
 * @class PoolInfo
 * @see IPoolInfo
 */
export abstract class PoolInfo implements IPoolInfo, IPrintable {
  readonly type: PoolType
  abstract readonly id: PoolId

  protected constructor(params: IPoolInfoData) {
    this.type = params.type
  }

  toString(): string {
    return `Pool Info: ${this.type} (${this.id.toString()})`
  }
}

SerializationService.registerClass(PoolInfo)
