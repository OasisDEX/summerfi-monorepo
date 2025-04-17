import { Pool } from '../../common/implementation/Pool'
import { Token } from '../../common/implementation/Token'
import { IPrintable } from '../../common/interfaces/IPrintable'
import { IToken } from '../../common/interfaces/IToken'
import { PoolType } from '../../common/enums/PoolType'
import { SerializationService } from '../../services/SerializationService'
import { ILendingPool, ILendingPoolData, __signature__ } from '../interfaces/ILendingPool'
import { ILendingPoolId } from '../interfaces/ILendingPoolId'

/**
 * Type for the parameters of LendingPool
 */
export type LendingPoolParameters = Omit<ILendingPoolData, 'type'>

/**
 * LendingPool
 * @see ILendingPool
 *
 * The class is abstract to force each protocol to implement it's own version of the LendingPool by
 * customizing the PoolId
 */
export abstract class LendingPool extends Pool implements ILendingPool, IPrintable {
  /** SIGNATURE */
  readonly [__signature__] = __signature__

  /** ATTRIBUTES */
  abstract readonly id: ILendingPoolId
  readonly collateralToken: IToken
  readonly debtToken: IToken
  readonly type = PoolType.Lending

  /** SEALED CONSTRUCTOR */
  protected constructor(params: LendingPoolParameters) {
    super(params)

    this.collateralToken = Token.createFrom(params.collateralToken)
    this.debtToken = Token.createFrom(params.debtToken)
  }

  /** METHODS */

  /** @see IPrintable.toString */
  toString(): string {
    return `Lending Pool: ${this.id.toString()}`
  }
}

SerializationService.registerClass(LendingPool, { identifier: 'LendingPool' })
