import { Protocol, ProtocolName, SerializationService } from '@summerfi/sdk-common'
import { IMakerProtocol, IMakerProtocolData, __signature__ } from '../interfaces/IMakerProtocol'

/**
 * Type for the parameters of MakerProtocol
 */
export type MakerProtocolParameters = Omit<IMakerProtocolData, 'name'>

/**
 * @class MakerProtocol
 * @see IMakerProtocolData
 */
export class MakerProtocol extends Protocol implements IMakerProtocol {
  /** SIGNATURE */
  readonly [__signature__] = __signature__

  /** ATTRIBUTES */
  readonly name = ProtocolName.Maker

  /** FACTORY */
  static createFrom(params: MakerProtocolParameters): MakerProtocol {
    return new MakerProtocol(params)
  }

  /** SEALED CONSTRUCTOR */
  private constructor(params: MakerProtocolParameters) {
    super(params)
  }
}

SerializationService.registerClass(MakerProtocol, { identifier: 'MakerProtocol' })
