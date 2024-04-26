import { Token } from '../../common/implementation/Token'
import { IPrintable } from '../../common/interfaces/IPrintable'
import { SerializationService } from '../../services'
import { ILendingPoolId, ILendingPoolIdData } from '../interfaces/ILendingPoolId'
import { PoolId } from './PoolId'

/**
 * LendingPoolId
 * @see ILendingPoolIdData
 */
export abstract class LendingPoolId extends PoolId implements ILendingPoolId, IPrintable {
  readonly collateralToken: Token
  readonly debtToken: Token

  protected constructor(params: ILendingPoolIdData) {
    super(params)

    this.collateralToken = Token.createFrom(params.collateralToken)
    this.debtToken = Token.createFrom(params.debtToken)
  }

  toString(): string {
    return `Lending Pool ID: ${this.collateralToken.symbol}/${this.debtToken.symbol} for ${this.protocol.toString()}`
  }
}

SerializationService.registerClass(LendingPoolId)
