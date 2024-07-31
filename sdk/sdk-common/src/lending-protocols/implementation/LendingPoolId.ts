import { PoolType } from '../../common'
import { PoolId } from '../../common/implementation/PoolId'
import { IPrintable } from '../../common/interfaces/IPrintable'
import { SerializationService } from '../../services'
import {
  ILendingPoolId,
  ILendingPoolIdParameters,
  __ilendingpoolid__,
} from '../interfaces/ILendingPoolId'

/**
 * LendingPoolId
 * @see ILendingPoolId
 */
export abstract class LendingPoolId extends PoolId implements ILendingPoolId, IPrintable {
  /** SIGNATURE */
  readonly [__ilendingpoolid__] = 'ILendingPoolId'

  /** SEALED CONSTRUCTOR */
  protected constructor(params: ILendingPoolIdParameters) {
    super({
      ...params,
      type: PoolType.Lending,
    })
  }

  /** METHODS */

  /** @see IPrintable.toString */
  toString(): string {
    return `Lending Pool ID: ${this.protocol.toString()}`
  }
}

SerializationService.registerClass(LendingPoolId)
