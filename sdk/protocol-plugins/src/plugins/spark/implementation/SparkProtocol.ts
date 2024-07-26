import { Protocol, ProtocolName } from '@summerfi/sdk-common/common'
import { SerializationService } from '@summerfi/sdk-common/services'
import { ISparkProtocol, ISparkProtocolParameters } from '../interfaces/ISparkProtocol'

/**
 * @class SparkProtocol
 * @see ISparkProtocol
 */
export class SparkProtocol extends Protocol implements ISparkProtocol {
  readonly _signature_1 = 'ISparkProtocol'

  /** Factory method */
  static createFrom(params: ISparkProtocolParameters): SparkProtocol {
    return new SparkProtocol(params)
  }

  /** Sealed constructor */
  private constructor(params: ISparkProtocolParameters) {
    super({
      ...params,
      name: ProtocolName.Spark,
    })
  }
}

SerializationService.registerClass(SparkProtocol)
