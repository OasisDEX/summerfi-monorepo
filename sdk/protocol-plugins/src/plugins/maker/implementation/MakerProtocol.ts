import { Protocol, ProtocolName } from '@summerfi/sdk-common/common'
import { SerializationService } from '@summerfi/sdk-common/services'
import {
  IMakerProtocol,
  IMakerProtocolParameters,
  __imakerprotocol__,
} from '../interfaces/IMakerProtocol'

/**
 * @class MakerProtocol
 * @see IMakerProtocolData
 */
export class MakerProtocol extends Protocol implements IMakerProtocol {
  /** SIGNATURE */
  readonly [__imakerprotocol__] = 'IMakerProtocol'

  /** FACTORY */
  static createFrom(params: IMakerProtocolParameters): MakerProtocol {
    return new MakerProtocol(params)
  }

  /** SEALED CONSTRUCTOR */
  private constructor(params: IMakerProtocolParameters) {
    super({
      ...params,
      name: ProtocolName.Maker,
    })
  }
}

SerializationService.registerClass(MakerProtocol)
