import { IToken } from '@summerfi/sdk-common'
import { IPrintable } from '@summerfi/sdk-common/common'
import { LendingPoolId } from '@summerfi/sdk-common/lending-protocols'
import { SerializationService } from '@summerfi/sdk-common/services'
import { EmodeType } from '../../common'
import {
  IAaveV3LendingPoolId,
  IAaveV3LendingPoolIdParameters,
} from '../interfaces/IAaveV3LendingPoolId'
import { IAaveV3Protocol } from '../interfaces/IAaveV3Protocol'

/**
 * @class AaveV3LendingPoolId
 * @see IAaveV3LendingPoolIdData
 */
export class AaveV3LendingPoolId extends LendingPoolId implements IAaveV3LendingPoolId, IPrintable {
  readonly _signature_2 = 'IAaveV3LendingPoolId'

  readonly protocol: IAaveV3Protocol
  readonly emodeType: EmodeType
  readonly collateralToken: IToken
  readonly debtToken: IToken

  /** Factory method */
  static createFrom(params: IAaveV3LendingPoolIdParameters): AaveV3LendingPoolId {
    return new AaveV3LendingPoolId(params)
  }

  /** Sealed constructor */
  private constructor(params: IAaveV3LendingPoolIdParameters) {
    super(params)

    this.protocol = params.protocol
    this.emodeType = params.emodeType
    this.collateralToken = params.collateralToken
    this.debtToken = params.debtToken
  }

  toString(): string {
    return `${LendingPoolId.toString()} [emode: ${this.emodeType}]`
  }
}

SerializationService.registerClass(AaveV3LendingPoolId)
