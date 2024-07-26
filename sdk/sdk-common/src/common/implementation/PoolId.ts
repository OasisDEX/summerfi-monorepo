import { IPrintable } from '../../common/interfaces/IPrintable'
import { SerializationService } from '../../services'
import { IPoolId, IPoolIdParameters } from '../interfaces/IPoolId'
import { IProtocol } from '../interfaces/IProtocol'
import { PoolType } from '../types/PoolType'

/**
 * @class PoolId
 * @see IPoolIdData
 */
export abstract class PoolId implements IPoolId, IPrintable {
  readonly _signature_0 = 'IPoolId'
  readonly type: PoolType
  abstract protocol: IProtocol

  /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
  protected constructor(params: IPoolIdParameters) {
    this.type = params.type
  }

  toString(): string {
    return `Pool ID: ${this.protocol.toString()}`
  }
}

SerializationService.registerClass(PoolId)
