import { SerializationService } from '@summerfi/sdk-common/services'
import { ISparkLendingPoolId } from '../interfaces/ISparkLendingPoolId'
import { ISparkProtocol } from '../interfaces/ISparkProtocol'
import { EmodeType } from '../../common'
import { SparkProtocol } from './SparkProtocol'
import { LendingPoolId } from '@summerfi/sdk-common'

/**
 * @class SparkLendingPoolId
 * @see ISparkLendingPoolId
 */
export class SparkLendingPoolId extends LendingPoolId implements ISparkLendingPoolId {
  protocol: ISparkProtocol
  emodeType: EmodeType

  private constructor(params: ISparkLendingPoolId) {
    super(params)

    this.protocol = SparkProtocol.createFrom(params.protocol)
    this.emodeType = params.emodeType
  }

  static createFrom(params: ISparkLendingPoolId): SparkLendingPoolId {
    return new SparkLendingPoolId(params)
  }
}

SerializationService.registerClass(SparkLendingPoolId)
