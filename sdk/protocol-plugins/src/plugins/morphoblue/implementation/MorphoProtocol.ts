import { Protocol, ProtocolName } from '@summerfi/sdk-common/common'
import { SerializationService } from '@summerfi/sdk-common/services'
import { IMorphoProtocol, IMorphoProtocolParameters } from '../interfaces/IMorphoProtocol'

/**
 * @class MorphoProtocol
 * @see IMorphoProtocol
 */
export class MorphoProtocol extends Protocol implements IMorphoProtocol {
  readonly _signature_1 = 'IMorphoProtocol'

  /** Factory method */
  static createFrom(params: IMorphoProtocolParameters): MorphoProtocol {
    return new MorphoProtocol(params)
  }

  /** Sealed constructor */
  private constructor(params: IMorphoProtocolParameters) {
    super({
      ...params,
      name: ProtocolName.MorphoBlue,
    })
  }
}

SerializationService.registerClass(MorphoProtocol)
