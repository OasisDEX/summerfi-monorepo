import { LendingPoolInfo } from '@summerfi/sdk-common/lending-protocols'
import { SerializationService } from '@summerfi/sdk-common/services'
import { ISparkLendingPoolId } from '../interfaces/ISparkLendingPoolId'
import {
  ISparkLendingPoolInfo,
  ISparkLendingPoolInfoParameters,
} from '../interfaces/ISparkLendingPoolInfo'

/**
 * @class SparkLendingPoolInfo
 * @see ISparkLendingPoolInfo
 */
export class SparkLendingPoolInfo extends LendingPoolInfo implements ISparkLendingPoolInfo {
  readonly _signature_2 = 'ISparkLendingPoolInfo'

  readonly id: ISparkLendingPoolId

  public static createFrom(params: ISparkLendingPoolInfoParameters): SparkLendingPoolInfo {
    return new SparkLendingPoolInfo(params)
  }

  private constructor(params: ISparkLendingPoolInfoParameters) {
    super(params)

    this.id = params.id
  }
}

SerializationService.registerClass(SparkLendingPoolInfo)
