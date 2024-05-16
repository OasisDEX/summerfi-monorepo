import { LendingPoolId } from '@summerfi/sdk-common/protocols'
import { SerializationService } from '@summerfi/sdk-common/services'
import { IMakerLendingPoolId, IMakerLendingPoolIdData } from '../interfaces/IMakerLendingPoolId'
import { ILKType } from '../enums/ILKType'
import { MakerProtocol } from './MakerProtocol'
import { IPrintable, IToken, Token } from '@summerfi/sdk-common/common'

/**
 * @class MakerLendingPoolId
 * @see IMakerLendingPoolIdData
 */
export class MakerLendingPoolId extends LendingPoolId implements IMakerLendingPoolId, IPrintable {
  readonly protocol: MakerProtocol
  readonly ilkType: ILKType
  readonly collateralToken: IToken
  readonly debtToken: IToken

  /** Factory method */
  public static createFrom(params: IMakerLendingPoolIdData): MakerLendingPoolId {
    return new MakerLendingPoolId(params)
  }

  /** Sealed constructor */
  private constructor(params: IMakerLendingPoolIdData) {
    super(params)

    this.protocol = MakerProtocol.createFrom(params.protocol)
    this.ilkType = params.ilkType
    this.collateralToken = Token.createFrom(params.collateralToken)
    this.debtToken = Token.createFrom(params.debtToken)
  }

  toString(): string {
    return `${LendingPoolId.toString()} [ilkType: ${this.ilkType}]`
  }
}

SerializationService.registerClass(MakerLendingPoolId)
