import {
  IArmadaProtocol,
  IArmadaProtocolData,
  __iarmadaprotocol__,
} from '@summerfi/armada-protocol-common'
import { Protocol, ProtocolName } from '@summerfi/sdk-common/common'
import { SerializationService } from '@summerfi/sdk-common/services'

/**
 * Type for the parameters of the ArmadaProtocol
 */
export type ArmadaProtocolParameters = Omit<IArmadaProtocolData, 'name'>

/**
 * @class ArmadaProtocol
 * @see IArmadaProtocol
 */
export class ArmadaProtocol extends Protocol implements IArmadaProtocol {
  /** SIGNATURE */
  readonly [__iarmadaprotocol__] = __iarmadaprotocol__

  /** ATTRIBUTES */
  readonly name = ProtocolName.Armada

  /** FACTORY */
  static createFrom(params: ArmadaProtocolParameters): ArmadaProtocol {
    return new ArmadaProtocol(params)
  }

  /** SEALED CONSTRUCTOR */
  private constructor(params: ArmadaProtocolParameters) {
    super(params)
  }
}

SerializationService.registerClass(ArmadaProtocol)
