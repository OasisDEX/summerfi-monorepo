import { Protocol, ProtocolName } from '@summerfi/sdk-common/protocols'
import { SerializationService } from '@summerfi/sdk-common/services'
import { IAaveV3Protocol, IAaveV3ProtocolData } from '../interfaces/IAaveV3Protocol'

/**
 * @class AaveV3Protocol
 * @see IAaveV3ProtocolData
 */
export class AaveV3Protocol extends Protocol implements IAaveV3Protocol {
  readonly name: ProtocolName.AAVEv3

  /** Factory method */
  static createFrom(params: IAaveV3ProtocolData): AaveV3Protocol {
    return new AaveV3Protocol(params)
  }

  /** Sealed constructor */
  private constructor(params: IAaveV3ProtocolData) {
    super(params)

    this.name = params.name
  }
}

SerializationService.registerClass(AaveV3Protocol)
