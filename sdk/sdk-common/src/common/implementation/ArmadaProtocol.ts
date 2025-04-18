import { SerializationService } from '../../services/SerializationService'
import { ProtocolName } from '../enums/ProtocolName'
import { __signature__ } from '../interfaces/IArmadaProtocol'
import type { IArmadaProtocol, IArmadaProtocolData } from '../interfaces/IArmadaProtocol'
import { Protocol } from './Protocol'

/**
 * Type for the parameters of the ArmadaProtocol
 */
export type ArmadaProtocolParameters = Omit<IArmadaProtocolData, 'name'>

/**
 * @class ArmadaProtocol
 * @see IArmadaProtocol
 */
export class ArmadaProtocol extends Protocol implements IArmadaProtocol {
  /** SIGNATURE */
  readonly [__signature__] = __signature__

  /** ATTRIBUTES */
  readonly name = ProtocolName.Armada

  /** FACTORY */
  static createFrom(params: ArmadaProtocolParameters): ArmadaProtocol {
    return new ArmadaProtocol(params)
  }

  /** SEALED CONSTRUCTOR */
  private constructor(params: ArmadaProtocolParameters) {
    super(params)
  }
}

SerializationService.registerClass(ArmadaProtocol, { identifier: 'ArmadaProtocol' })
