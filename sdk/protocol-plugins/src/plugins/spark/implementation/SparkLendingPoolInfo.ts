import { LendingPoolInfo } from '@summerfi/sdk-common/lending-protocols'
import { SerializationService } from '@summerfi/sdk-common/services'
import { ISparkLendingPoolId } from '../interfaces/ISparkLendingPoolId'
import {
  ISparkLendingPoolInfo,
  ISparkLendingPoolInfoParameters,
  __isparklendingpoolinfo__,
} from '../interfaces/ISparkLendingPoolInfo'

/**
 * @class SparkLendingPoolInfo
 * @see ISparkLendingPoolInfo
 */
export class SparkLendingPoolInfo extends LendingPoolInfo implements ISparkLendingPoolInfo {
  readonly [__isparklendingpoolinfo__] = 'ISparkLendingPoolInfo'

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
