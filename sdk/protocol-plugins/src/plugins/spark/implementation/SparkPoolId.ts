import { PoolId } from '@summerfi/sdk-common/protocols'
import { SerializationService } from '@summerfi/sdk-common/services'
import { ISparkPoolId } from '../interfaces/ISparkPoolId'
import { ISparkProtocol } from '../interfaces/ISparkProtocol'
import { EmodeType } from '../../common'

export class SparkPoolId extends PoolId implements ISparkPoolId {
  protocol: ISparkProtocol
  emodeType: EmodeType

  private constructor(params: ISparkPoolId) {
    super(params)

    this.protocol = params.protocol
    this.emodeType = params.emodeType
  }

  static createFrom(params: ISparkPoolId): SparkPoolId {
    return new SparkPoolId(params)
  }
}

SerializationService.registerClass(SparkPoolId)
