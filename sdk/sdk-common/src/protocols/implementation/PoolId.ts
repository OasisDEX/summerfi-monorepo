import { SerializationService } from '../../services'
import { IPoolId } from '../interfaces/IPoolId'
import { IProtocol } from '../interfaces/IProtocol'

/**
 * @class PoolId
 * @see IPoolId
 */
export abstract class PoolId implements IPoolId {
  protocol: IProtocol

  protected constructor(params: IPoolId) {
    this.protocol = params.protocol
  }
}

SerializationService.registerClass(PoolId)
