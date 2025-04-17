import { HexData, IPrintable, LendingPoolId, SerializationService } from '@summerfi/sdk-common'
import {
  IMorphoLendingPoolId,
  IMorphoLendingPoolIdData,
  __signature__,
} from '../interfaces/IMorphoLendingPoolId'
import { IMorphoProtocol } from '../interfaces/IMorphoProtocol'

/**
 * Type for the parameters of MorphoLendingPoolId
 */
export type MorphoLendingPoolIdParameters = Omit<IMorphoLendingPoolIdData, 'type'>

/**
 * @class MorphoLendingPoolId
 * @see IMorphoLendingPoolIdData
 */
export class MorphoLendingPoolId extends LendingPoolId implements IMorphoLendingPoolId, IPrintable {
  /** SIGNATURE */
  readonly [__signature__] = __signature__

  /** ATTRIBUTES */
  readonly protocol: IMorphoProtocol
  readonly marketId: HexData

  /** FACTORY */
  static createFrom(params: MorphoLendingPoolIdParameters): MorphoLendingPoolId {
    return new MorphoLendingPoolId(params)
  }

  /** SEALED CONSTRUCTOR */
  private constructor(params: MorphoLendingPoolIdParameters) {
    super(params)

    this.protocol = params.protocol
    this.marketId = params.marketId
  }

  /** METHODS */

  /** @see IPrintable.toString */
  toString(): string {
    return `${LendingPoolId.toString()} [marketId=${this.marketId}]`
  }
}

SerializationService.registerClass(MorphoLendingPoolId, { identifier: 'MorphoLendingPoolId' })
