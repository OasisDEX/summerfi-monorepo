import { Protocol, ProtocolName, SerializationService } from '@summerfi/sdk-common'
import { IMorphoProtocol, IMorphoProtocolData, __signature__ } from '../interfaces/IMorphoProtocol'

/**
 * Type for the parameters MorphoProtocol
 */
export type MorphoProtocolParameters = Omit<IMorphoProtocolData, 'name'>

/**
 * @class MorphoProtocol
 * @see IMorphoProtocol
 */
export class MorphoProtocol extends Protocol implements IMorphoProtocol {
  /** SIGNATURE */
  readonly [__signature__] = __signature__

  /** ATTRIBUTES */
  readonly name = ProtocolName.MorphoBlue

  /** FACTORY */
  static createFrom(params: MorphoProtocolParameters): MorphoProtocol {
    return new MorphoProtocol(params)
  }

  /** SEALED CONSTRUCTOR */
  private constructor(params: MorphoProtocolParameters) {
    super(params)
  }
}

SerializationService.registerClass(MorphoProtocol, { identifier: 'MorphoProtocol' })
