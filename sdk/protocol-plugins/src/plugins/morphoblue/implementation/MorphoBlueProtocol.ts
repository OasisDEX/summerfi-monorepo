import { Protocol, ProtocolName } from '@summerfi/sdk-common/protocols'
import { IMorphoBlueProtocol, IMorphoBlueProtocolData } from '../interfaces/IMorphoBlueProtocol'
import { SerializationService } from '@summerfi/sdk-common/services'

/**
 * @class MorphoBlueProtocol
 * @see IMorphoBlueProtocol
 */
export class MorphoBlueProtocol extends Protocol implements IMorphoBlueProtocol {
  readonly name: ProtocolName.MorphoBlue

  /** Factory method */
  static createFrom(params: IMorphoBlueProtocolData): MorphoBlueProtocol {
    return new MorphoBlueProtocol(params)
  }

  /** Sealed constructor */
  private constructor(params: IMorphoBlueProtocolData) {
    super(params)

    this.name = params.name
  }
}

SerializationService.registerClass(MorphoBlueProtocol)
