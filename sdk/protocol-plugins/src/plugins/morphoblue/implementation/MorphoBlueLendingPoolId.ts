import { SerializationService } from '@summerfi/sdk-common/services'
import {
  IMorphoBlueLendingPoolId,
  IMorphoBlueLendingPoolIdData,
} from '../interfaces/IMorphoBlueLendingPoolId'
import { MorphoBlueProtocol } from './MorphoBlueProtocol'
import { IPrintable } from '@summerfi/sdk-common/common'
import { LendingPoolId } from '@summerfi/sdk-common/protocols'
import { HexData } from '@summerfi/sdk-common'

/**
 * @class MorphoBlueLendingPoolId
 * @see IMorphoBlueLendingPoolIdData
 */
export class MorphoBlueLendingPoolId
  extends LendingPoolId
  implements IMorphoBlueLendingPoolId, IPrintable
{
  readonly protocol: MorphoBlueProtocol
  readonly marketId: HexData

  /** Factory method */
  static createFrom(params: IMorphoBlueLendingPoolIdData): MorphoBlueLendingPoolId {
    return new MorphoBlueLendingPoolId(params)
  }

  /** Sealed constructor */
  private constructor(params: IMorphoBlueLendingPoolIdData) {
    super(params)

    this.protocol = MorphoBlueProtocol.createFrom(params.protocol)
    this.marketId = params.marketId
  }

  toString(): string {
    return `${LendingPoolId.toString()} [marketId=${this.marketId}]`
  }
}

SerializationService.registerClass(MorphoBlueLendingPoolId)
