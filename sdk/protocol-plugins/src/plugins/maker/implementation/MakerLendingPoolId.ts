import { IPrintable, IToken } from '@summerfi/sdk-common/common'
import { LendingPoolId } from '@summerfi/sdk-common/lending-protocols'
import { SerializationService } from '@summerfi/sdk-common/services'
import { ILKType } from '../enums/ILKType'
import {
  IMakerLendingPoolId,
  IMakerLendingPoolIdParameters,
} from '../interfaces/IMakerLendingPoolId'
import { MakerProtocol } from './MakerProtocol'

/**
 * @class MakerLendingPoolId
 * @see IMakerLendingPoolIdData
 */
export class MakerLendingPoolId extends LendingPoolId implements IMakerLendingPoolId, IPrintable {
  readonly _signature_2 = 'IMakerLendingPoolId'

  readonly protocol: MakerProtocol
  readonly ilkType: ILKType
  readonly collateralToken: IToken
  readonly debtToken: IToken

  /** Factory method */
  public static createFrom(params: IMakerLendingPoolIdParameters): MakerLendingPoolId {
    return new MakerLendingPoolId(params)
  }

  /** Sealed constructor */
  private constructor(params: IMakerLendingPoolIdParameters) {
    super(params)

    this.protocol = params.protocol
    this.ilkType = params.ilkType
    this.collateralToken = params.collateralToken
    this.debtToken = params.debtToken
  }

  toString(): string {
    return `${LendingPoolId.toString()} [ilkType: ${this.ilkType}]`
  }
}

SerializationService.registerClass(MakerLendingPoolId)
