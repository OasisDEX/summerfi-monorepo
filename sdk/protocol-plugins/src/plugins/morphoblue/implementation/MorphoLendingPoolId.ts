import { HexData } from '@summerfi/sdk-common'
import { IPrintable } from '@summerfi/sdk-common/common'
import { LendingPoolId } from '@summerfi/sdk-common/lending-protocols'
import { SerializationService } from '@summerfi/sdk-common/services'
import { IMorphoLendingPoolId, IMorphoLendingPoolIdData } from '../interfaces/IMorphoLendingPoolId'
import { MorphoProtocol } from './MorphoProtocol'

/**
 * @class MorphoLendingPoolId
 * @see IMorphoLendingPoolIdData
 */
export class MorphoLendingPoolId extends LendingPoolId implements IMorphoLendingPoolId, IPrintable {
  readonly protocol: MorphoProtocol
  readonly marketId: HexData

  /** Factory method */
  static createFrom(params: IMorphoLendingPoolIdData): MorphoLendingPoolId {
    return new MorphoLendingPoolId(params)
  }

  /** Sealed constructor */
  private constructor(params: IMorphoLendingPoolIdData) {
    super(params)

    this.protocol = MorphoProtocol.createFrom(params.protocol)
    this.marketId = params.marketId
  }

  toString(): string {
    return `${LendingPoolId.toString()} [marketId=${this.marketId}]`
  }
}

SerializationService.registerClass(MorphoLendingPoolId)
