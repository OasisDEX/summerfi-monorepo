import { LendingPoolInfo } from '@summerfi/sdk-common/protocols'
import { SerializationService } from '@summerfi/sdk-common/services'
import { SparkLendingPoolId } from './SparkLendingPoolId'
import {
  ISparkLendingPoolInfo,
  ISparkLendingPoolInfoData,
} from '../interfaces/ISparkLendingPoolInfo'

/**
 * @class SparkLendingPoolInfo
 * @see ISparkLendingPoolInfo
 */
export class SparkLendingPoolInfo extends LendingPoolInfo implements ISparkLendingPoolInfo {
  readonly id: SparkLendingPoolId

  private constructor(params: ISparkLendingPoolInfoData) {
    super(params)

    this.id = SparkLendingPoolId.createFrom(params.id)
  }

  public static createFrom(params: ISparkLendingPoolInfoData): SparkLendingPoolInfo {
    return new SparkLendingPoolInfo(params)
  }
}

SerializationService.registerClass(SparkLendingPoolInfo)
