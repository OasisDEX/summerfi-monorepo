import { IPoolId } from '../interfaces/IPoolId'
import { IProtocol } from '../interfaces/IProtocol'

export abstract class PoolId implements IPoolId {
  protocol: IProtocol

  protected constructor(params: IPoolId) {
    this.protocol = params.protocol
  }
}
