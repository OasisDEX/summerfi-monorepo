import { SerializationService } from '../../services'
import { IPoolIdData } from '../interfaces/IPoolId'
import { Protocol } from './Protocol'

/**
 * @class PoolId
 * @see IPoolIdData
 */
export abstract class PoolId implements IPoolIdData {
  abstract protocol: Protocol

  /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
  protected constructor(params: IPoolIdData) {
    // Empty on purpose
  }
}

SerializationService.registerClass(PoolId)
