import { Protocol, ProtocolName } from '@summerfi/sdk-common/common'
import { SerializationService } from '@summerfi/sdk-common/services'
import { IMakerProtocol, IMakerProtocolParameters } from '../interfaces/IMakerProtocol'

/**
 * @class MakerProtocol
 * @see IMakerProtocolData
 */
export class MakerProtocol extends Protocol implements IMakerProtocol {
  readonly _signature_1 = 'IMakerProtocol'

  /** Factory method */
  static createFrom(params: IMakerProtocolParameters): MakerProtocol {
    return new MakerProtocol(params)
  }

  /** Sealed constructor */
  private constructor(params: IMakerProtocolParameters) {
    super({
      ...params,
      name: ProtocolName.Maker,
    })
  }
}

SerializationService.registerClass(MakerProtocol)
