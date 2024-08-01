import {
  IArmadaPoolId,
  IArmadaPoolIdData,
  IArmadaProtocol,
  __iarmadapoolid__,
} from '@summerfi/armada-protocol-common'
import { IAddress, PoolId } from '@summerfi/sdk-common'
import { PoolType } from '@summerfi/sdk-common/common'
import { SerializationService } from '@summerfi/sdk-common/services'

/**
 * Type for the parameters of ArmadaPoolId
 */
export type ArmadaPoolIdParameters = Omit<IArmadaPoolIdData, 'type'>

/**
 * @class ArmadaPoolId
 * @see IArmadaPoolId
 */
export class ArmadaPoolId extends PoolId implements IArmadaPoolId {
  /** SIGNATURE */
  readonly [__iarmadapoolid__] = __iarmadapoolid__

  /** ATTRIBUTES */
  readonly type = PoolType.Armada
  readonly fleet: IAddress
  readonly protocol: IArmadaProtocol

  /** FACTORY */
  static createFrom(params: ArmadaPoolIdParameters): ArmadaPoolId {
    return new ArmadaPoolId(params)
  }

  /** SEALED CONSTRUCTOR */
  private constructor(params: ArmadaPoolIdParameters) {
    super(params)

    this.fleet = params.fleet
    this.protocol = params.protocol
  }
}

SerializationService.registerClass(ArmadaPoolId)
