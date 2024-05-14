import { Protocol, ProtocolName } from '@summerfi/sdk-common/protocols'
import { SerializationService } from '@summerfi/sdk-common/services'
import { IMakerProtocol, IMakerProtocolData } from '../interfaces/IMakerProtocol'

/**
 * @class MakerProtocol
 * @see IMakerProtocolData
 */
export class MakerProtocol extends Protocol implements IMakerProtocol {
  readonly name: ProtocolName.Maker

  /** Factory method */
  static createFrom(params: IMakerProtocolData): MakerProtocol {
    return new MakerProtocol(params)
  }

  /** Sealed constructor */
  private constructor(params: IMakerProtocolData) {
    super(params)

    this.name = params.name
  }
}

SerializationService.registerClass(MakerProtocol)
