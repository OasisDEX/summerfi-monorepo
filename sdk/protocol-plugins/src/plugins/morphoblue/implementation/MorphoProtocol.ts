import { Protocol, ProtocolName } from '@summerfi/sdk-common/common'
import { SerializationService } from '@summerfi/sdk-common/services'
import { IMorphoProtocol, IMorphoProtocolData } from '../interfaces/IMorphoProtocol'

/**
 * @class MorphoProtocol
 * @see IMorphoProtocol
 */
export class MorphoProtocol extends Protocol implements IMorphoProtocol {
  readonly name: ProtocolName.MorphoBlue

  /** Factory method */
  static createFrom(params: IMorphoProtocolData): MorphoProtocol {
    return new MorphoProtocol(params)
  }

  /** Sealed constructor */
  private constructor(params: IMorphoProtocolData) {
    super(params)

    this.name = params.name
  }
}

SerializationService.registerClass(MorphoProtocol)
