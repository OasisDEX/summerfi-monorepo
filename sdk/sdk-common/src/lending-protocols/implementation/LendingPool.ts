import { Pool } from '../../common/implementation/Pool'
import { Token } from '../../common/implementation/Token'
import { IPrintable } from '../../common/interfaces/IPrintable'
import { PoolType } from '../../common/types/PoolType'
import { SerializationService } from '../../services'
import { ILendingPool, ILendingPoolData } from '../interfaces/ILendingPool'
import { LendingPoolId } from './LendingPoolId'

/**
 * LendingPool
 * @see ILendingPool
 *
 * The class is abstract to force each protocol to implement it's own version of the LendingPool by
 * customizing the PoolId
 */
export abstract class LendingPool extends Pool implements ILendingPool, IPrintable {
  readonly type = PoolType.Lending
  abstract readonly id: LendingPoolId
  readonly collateralToken: Token
  readonly debtToken: Token

  protected constructor(params: ILendingPoolData) {
    super(params)

    this.collateralToken = Token.createFrom(params.collateralToken)
    this.debtToken = Token.createFrom(params.debtToken)
  }

  toString(): string {
    return `Lending Pool: ${this.id.toString()}`
  }
}

SerializationService.registerClass(LendingPool)
