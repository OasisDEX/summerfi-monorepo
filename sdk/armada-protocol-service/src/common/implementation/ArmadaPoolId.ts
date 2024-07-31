import {
  IArmadaPoolId,
  IArmadaPoolIdParameters,
  IArmadaProtocol,
} from '@summerfi/armada-protocol-common'
import { IAddress, PoolId } from '@summerfi/sdk-common'
import { PoolType } from '@summerfi/sdk-common/common'
import { SerializationService } from '@summerfi/sdk-common/services'

/**
 * @class ArmadaPoolId
 * @see IArmadaPoolId
 */
export class ArmadaPoolId extends PoolId implements IArmadaPoolId {
  readonly _signature_1 = 'IArmadaPoolId'

  readonly fleet: IAddress
  readonly protocol: IArmadaProtocol

  /** Factory method */
  static createFrom(params: IArmadaPoolIdParameters): ArmadaPoolId {
    return new ArmadaPoolId(params)
  }

  /** Sealed constructor */
  private constructor(params: IArmadaPoolIdParameters) {
    super({
      ...params,
      type: PoolType.Armada,
    })

    this.fleet = params.fleet
    this.protocol = params.protocol
  }
}

SerializationService.registerClass(ArmadaPoolId)
