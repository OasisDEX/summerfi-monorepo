import { Token } from '../../common/implementation/Token'
import { SerializationService } from '../../services'
import { ILendingPoolId } from '../interfaces/ILendingPoolId'
import { PoolId } from './PoolId'

/**
 * LendingPoolId
 * @see ILendingPoolId
 */
export abstract class LendingPoolId extends PoolId implements ILendingPoolId {
  collateral: Token
  debt: Token

  protected constructor(params: ILendingPoolId) {
    super(params)

    this.collateral = Token.createFrom(params.collateral)
    this.debt = Token.createFrom(params.debt)
  }
}

SerializationService.registerClass(LendingPoolId)
