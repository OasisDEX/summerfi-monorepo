import { Protocol, ProtocolName } from '@summerfi/sdk-common/protocols'
import { ISparkProtocol, ISparkProtocolData } from '../interfaces/ISparkProtocol'
import { SerializationService } from '@summerfi/sdk-common/services'

/**
 * @class SparkProtocol
 * @see ISparkProtocolData
 */
export class SparkProtocol extends Protocol implements ISparkProtocol {
  readonly name: ProtocolName.Spark

  /** Factory method */
  static createFrom(params: ISparkProtocolData): SparkProtocol {
    return new SparkProtocol(params)
  }

  /** Sealed constructor */
  private constructor(params: ISparkProtocolData) {
    super(params)

    this.name = params.name
  }
}

SerializationService.registerClass(SparkProtocol)
