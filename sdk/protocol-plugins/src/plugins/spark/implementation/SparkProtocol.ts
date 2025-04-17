import { Protocol, ProtocolName, SerializationService } from '@summerfi/sdk-common'
import { ISparkProtocol, ISparkProtocolData, __signature__ } from '../interfaces/ISparkProtocol'

/**
 * Type for the parameters of SparkProtocol
 */
export type SparkProtocolParameters = Omit<ISparkProtocolData, 'name'>

/**
 * @class SparkProtocol
 * @see ISparkProtocol
 */
export class SparkProtocol extends Protocol implements ISparkProtocol {
  /** SIGNATURE */
  readonly [__signature__] = __signature__

  /** ATTRIBUTES */
  readonly name = ProtocolName.Spark

  /** FACTORY */
  static createFrom(params: SparkProtocolParameters): SparkProtocol {
    return new SparkProtocol(params)
  }

  /** SEALED CONSTRUCTOR */
  private constructor(params: SparkProtocolParameters) {
    super(params)
  }
}

SerializationService.registerClass(SparkProtocol, { identifier: 'SparkProtocol' })
