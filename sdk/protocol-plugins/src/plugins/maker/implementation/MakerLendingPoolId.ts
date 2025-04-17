import { IPrintable, IToken, LendingPoolId, SerializationService } from '@summerfi/sdk-common'
import { ILKType } from '../enums/ILKType'
import {
  IMakerLendingPoolId,
  IMakerLendingPoolIdData,
  __signature__,
} from '../interfaces/IMakerLendingPoolId'
import { MakerProtocol } from './MakerProtocol'

/**
 * Type for the parameters of MakerLendingPoolId
 */
export type MakerLendingPoolIdParameters = Omit<IMakerLendingPoolIdData, 'type'>

/**
 * @class MakerLendingPoolId
 * @see IMakerLendingPoolIdData
 */
export class MakerLendingPoolId extends LendingPoolId implements IMakerLendingPoolId, IPrintable {
  /** SIGNATURE */
  readonly [__signature__] = __signature__

  /** ATTRIBUTES */
  readonly protocol: MakerProtocol
  readonly ilkType: ILKType
  readonly collateralToken: IToken
  readonly debtToken: IToken

  /** FACTORY */
  public static createFrom(params: MakerLendingPoolIdParameters): MakerLendingPoolId {
    return new MakerLendingPoolId(params)
  }

  /** SEALED CONSTRUCTOR */
  private constructor(params: MakerLendingPoolIdParameters) {
    super(params)

    this.protocol = params.protocol
    this.ilkType = params.ilkType
    this.collateralToken = params.collateralToken
    this.debtToken = params.debtToken
  }

  /** METHODS */

  /** @see IPrintable.toString */
  toString(): string {
    return `${LendingPoolId.toString()} [ilkType: ${this.ilkType}]`
  }
}

SerializationService.registerClass(MakerLendingPoolId, { identifier: 'MakerLendingPoolId' })
