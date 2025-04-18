import { IToken, IPrintable, LendingPoolId, SerializationService } from '@summerfi/sdk-common'
import { EmodeType } from '../../common/enums/EmodeType'
import {
  IAaveV3LendingPoolId,
  IAaveV3LendingPoolIdData,
  __signature__,
} from '../interfaces/IAaveV3LendingPoolId'
import { IAaveV3Protocol } from '../interfaces/IAaveV3Protocol'

/**
 * Type for the parameters of AaveV3LendingPoolId
 */
export type AaveV3LendingPoolIdParameters = Omit<IAaveV3LendingPoolIdData, 'type'>

/**
 * @class AaveV3LendingPoolId
 * @see IAaveV3LendingPoolId
 */
export class AaveV3LendingPoolId extends LendingPoolId implements IAaveV3LendingPoolId, IPrintable {
  /** SIGNATURE */
  readonly [__signature__] = __signature__

  /** ATTRIBUTES */
  readonly protocol: IAaveV3Protocol
  readonly emodeType: EmodeType
  readonly collateralToken: IToken
  readonly debtToken: IToken

  /** FACTORY */
  static createFrom(params: AaveV3LendingPoolIdParameters): AaveV3LendingPoolId {
    return new AaveV3LendingPoolId(params)
  }

  /** SEALED CONSTRUCTOR */
  private constructor(params: AaveV3LendingPoolIdParameters) {
    super(params)

    this.protocol = params.protocol
    this.emodeType = params.emodeType
    this.collateralToken = params.collateralToken
    this.debtToken = params.debtToken
  }

  /** METHODS */

  /** @see IPrintable.toString */
  toString(): string {
    return `${LendingPoolId.toString()} [emode: ${this.emodeType}]`
  }
}

SerializationService.registerClass(AaveV3LendingPoolId, { identifier: 'AaveV3LendingPoolId' })
