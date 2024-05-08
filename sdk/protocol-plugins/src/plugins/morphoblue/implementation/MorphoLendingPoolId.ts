import { SerializationService } from '@summerfi/sdk-common/services'
import { IMorphoLendingPoolId, IMorphoLendingPoolIdData } from '../interfaces/IMorphoLendingPoolId'
import { MorphoProtocol } from './MorphoProtocol'
import { Address, IPrintable, Percentage } from '@summerfi/sdk-common/common'
import { LendingPoolId } from '@summerfi/sdk-common/protocols'

/**
 * @class MorphoLendingPoolId
 * @see IMorphoLendingPoolIdData
 */
export class MorphoLendingPoolId extends LendingPoolId implements IMorphoLendingPoolId, IPrintable {
  readonly protocol: MorphoProtocol
  readonly oracle: Address
  readonly irm: Address
  readonly lltv: Percentage

  /** Factory method */
  static createFrom(params: IMorphoLendingPoolIdData): MorphoLendingPoolId {
    return new MorphoLendingPoolId(params)
  }

  /** Sealed constructor */
  private constructor(params: IMorphoLendingPoolIdData) {
    super(params)

    this.protocol = MorphoProtocol.createFrom(params.protocol)
    this.oracle = Address.createFrom(params.oracle)
    this.irm = Address.createFrom(params.irm)
    this.lltv = Percentage.createFrom(params.lltv)
  }

  toString(): string {
    return `${LendingPoolId.toString()} [oracle=${this.oracle}, irm=${this.irm}, lltv=${this.lltv}]`
  }
}

SerializationService.registerClass(MorphoLendingPoolId)
