import { SerializationService } from '../../services/SerializationService'
import { IPoolData } from '../interfaces/IPool'
import { PoolType } from '../types/PoolType'
import { PoolId } from './PoolId'

/**
 * @class Pool
 * @see IPoolData
 */
export abstract class Pool implements IPoolData {
  readonly type: PoolType
  abstract readonly id: PoolId

  protected constructor(params: IPoolData) {
    this.type = params.type
  }
}

SerializationService.registerClass(Pool)
