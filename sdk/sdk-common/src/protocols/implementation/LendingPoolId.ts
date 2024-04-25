import { Token } from '../../common/implementation/Token'
import { SerializationService } from '../../services'
import { ILendingPoolIdData } from '../interfaces/ILendingPoolId'
import { PoolId } from './PoolId'

/**
 * LendingPoolId
 * @see ILendingPoolIdData
 */
export abstract class LendingPoolId extends PoolId implements ILendingPoolIdData {
  collateralToken: Token
  debtToken: Token

  protected constructor(params: ILendingPoolIdData) {
    super(params)

    this.collateralToken = Token.createFrom(params.collateralToken)
    this.debtToken = Token.createFrom(params.debtToken)
  }
}

SerializationService.registerClass(LendingPoolId)
