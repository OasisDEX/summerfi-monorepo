import { Protocol, ProtocolName } from '@summerfi/sdk-common/protocols'
import { ISparkProtocol } from '../interfaces/ISparkProtocol'
import { SerializationService } from '@summerfi/sdk-common/services'

/**
 * @class SparkProtocol
 * @see ISparkProtocol
 */
export class SparkProtocol extends Protocol implements ISparkProtocol {
  readonly name: ProtocolName.Spark

  private constructor(params: ISparkProtocol) {
    super(params)

    this.name = params.name
  }

  static createFrom(params: ISparkProtocol): SparkProtocol {
    return new SparkProtocol(params)
  }
}

SerializationService.registerClass(SparkProtocol)
