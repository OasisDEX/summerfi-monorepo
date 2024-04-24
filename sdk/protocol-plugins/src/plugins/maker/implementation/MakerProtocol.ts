import { Protocol, ProtocolName } from '@summerfi/sdk-common/protocols'
import { SerializationService } from '@summerfi/sdk-common/services'
import { IMakerProtocol } from '../interfaces/IMakerProtocol'

/**
 * @class MakerProtocol
 * @see IMakerProtocol
 */
export class MakerProtocol extends Protocol implements IMakerProtocol {
  readonly name: ProtocolName.Maker

  private constructor(params: IMakerProtocol) {
    super(params)

    this.name = params.name
  }

  static createFrom(params: IMakerProtocol): MakerProtocol {
    return new MakerProtocol(params)
  }
}

SerializationService.registerClass(MakerProtocol)
