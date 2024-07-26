import {
  IArmadaPoolId,
  IArmadaPoolIdParameters,
  IArmadaProtocol,
} from '@summerfi/armada-protocol-common'
import { PoolId } from '@summerfi/sdk-common'
import { PoolType } from '@summerfi/sdk-common/common'
import { SerializationService } from '@summerfi/sdk-common/services'
import { IUser } from '@summerfi/sdk-common/user'

/**
 * @class ArmadaPoolId
 * @see IArmadaPoolId
 */
export class ArmadaPoolId extends PoolId implements IArmadaPoolId {
  readonly _signature_1 = 'IArmadaPoolId'

  readonly user: IUser
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

    this.user = params.user
    this.protocol = params.protocol
  }
}

SerializationService.registerClass(ArmadaPoolId)
