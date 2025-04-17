import { PoolType } from '../../common/enums/PoolType'
import { PoolId } from '../../common/implementation/PoolId'
import { IPrintable } from '../../common/interfaces/IPrintable'
import { SerializationService } from '../../services/SerializationService'
import { ILendingPoolId, ILendingPoolIdData, __signature__ } from '../interfaces/ILendingPoolId'

/**
 * Type for the parameters of LendingPoolId
 */
export type LendingPoolIdParameters = Omit<ILendingPoolIdData, 'type'>

/**
 * LendingPoolId
 * @see ILendingPoolId
 */
export abstract class LendingPoolId extends PoolId implements ILendingPoolId, IPrintable {
  /** SIGNATURE */
  readonly [__signature__] = __signature__

  /** ATTRIBUTES */
  readonly type = PoolType.Lending

  /** SEALED CONSTRUCTOR */
  protected constructor(params: LendingPoolIdParameters) {
    super(params)
  }

  /** METHODS */

  /** @see IPrintable.toString */
  toString(): string {
    return `Lending Pool ID: ${this.protocol.toString()}`
  }
}

SerializationService.registerClass(LendingPoolId, { identifier: 'LendingPoolId' })
