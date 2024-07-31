import { Protocol, ProtocolName } from '@summerfi/sdk-common/common'
import { SerializationService } from '@summerfi/sdk-common/services'
import {
  IAaveV3Protocol,
  IAaveV3ProtocolParameters,
  __iaavev3protocol__,
} from '../interfaces/IAaveV3Protocol'

/**
 * @class AaveV3Protocol
 * @see IAaveV3ProtocolData
 */
export class AaveV3Protocol extends Protocol implements IAaveV3Protocol {
  /** SIGNATURE */
  readonly [__iaavev3protocol__] = 'IAaveV3Protocol'

  /** FACTORY */
  static createFrom(params: IAaveV3ProtocolParameters): AaveV3Protocol {
    return new AaveV3Protocol(params)
  }

  /** SEALED CONSTRUCTOR */
  private constructor(params: IAaveV3ProtocolParameters) {
    super({
      ...params,
      name: ProtocolName.AaveV3,
    })
  }
}

SerializationService.registerClass(AaveV3Protocol)
