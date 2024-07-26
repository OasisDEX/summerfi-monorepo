import { Protocol, ProtocolName } from '@summerfi/sdk-common/common'
import { SerializationService } from '@summerfi/sdk-common/services'
import { IAaveV3Protocol, IAaveV3ProtocolParameters } from '../interfaces/IAaveV3Protocol'

/**
 * @class AaveV3Protocol
 * @see IAaveV3ProtocolData
 */
export class AaveV3Protocol extends Protocol implements IAaveV3Protocol {
  readonly _signature_1 = 'IAaveV3Protocol'

  /** Factory method */
  static createFrom(params: IAaveV3ProtocolParameters): AaveV3Protocol {
    return new AaveV3Protocol(params)
  }

  /** Sealed constructor */
  private constructor(params: IAaveV3ProtocolParameters) {
    super({
      ...params,
      name: ProtocolName.AaveV3,
    })
  }
}

SerializationService.registerClass(AaveV3Protocol)
