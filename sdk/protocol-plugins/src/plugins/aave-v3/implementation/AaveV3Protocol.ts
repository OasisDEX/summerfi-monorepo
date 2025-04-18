import { Protocol, ProtocolName, SerializationService } from '@summerfi/sdk-common'
import { IAaveV3Protocol, IAaveV3ProtocolData, __signature__ } from '../interfaces/IAaveV3Protocol'

/**
 * Type for the parameters of AaveV3Protocol
 */
export type AaveV3ProtocolParameters = Omit<IAaveV3ProtocolData, 'name'>

/**
 * @class AaveV3Protocol
 * @see IAaveV3ProtocolData
 */
export class AaveV3Protocol extends Protocol implements IAaveV3Protocol {
  /** SIGNATURE */
  readonly [__signature__] = __signature__

  /** ATTRIBUTES */
  readonly name = ProtocolName.AaveV3

  /** FACTORY */
  static createFrom(params: AaveV3ProtocolParameters): AaveV3Protocol {
    return new AaveV3Protocol(params)
  }

  /** SEALED CONSTRUCTOR */
  private constructor(params: AaveV3ProtocolParameters) {
    super(params)
  }
}

SerializationService.registerClass(AaveV3Protocol, { identifier: 'AaveV3Protocol' })
