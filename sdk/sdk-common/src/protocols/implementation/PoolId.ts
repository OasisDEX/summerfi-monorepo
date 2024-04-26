import { IPrintable } from '../../common/interfaces/IPrintable'
import { SerializationService } from '../../services'
import { IPoolId, IPoolIdData } from '../interfaces/IPoolId'
import { Protocol } from './Protocol'

/**
 * @class PoolId
 * @see IPoolIdData
 */
export abstract class PoolId implements IPoolId, IPrintable {
  abstract protocol: Protocol

  /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
  protected constructor(params: IPoolIdData) {
    // Empty on purpose
  }

  toString(): string {
    return `Pool ID: ${this.protocol.toString()}`
  }
}

SerializationService.registerClass(PoolId)
