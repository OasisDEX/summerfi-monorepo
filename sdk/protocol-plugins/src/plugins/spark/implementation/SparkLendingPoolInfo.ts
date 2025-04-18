import { LendingPoolInfo, SerializationService } from '@summerfi/sdk-common'
import { ISparkLendingPoolId } from '../interfaces/ISparkLendingPoolId'
import {
  ISparkLendingPoolInfo,
  ISparkLendingPoolInfoData,
  __signature__,
} from '../interfaces/ISparkLendingPoolInfo'

/**
 * Type for the parameters of SparkLendingPoolInfo
 */
export type SparkLendingPoolInfoParameters = Omit<ISparkLendingPoolInfoData, 'type'>

/**
 * @class SparkLendingPoolInfo
 * @see ISparkLendingPoolInfo
 */
export class SparkLendingPoolInfo extends LendingPoolInfo implements ISparkLendingPoolInfo {
  /** SIGNATURE */
  readonly [__signature__] = __signature__

  /** ATTRIBUTES */
  readonly id: ISparkLendingPoolId

  /** FACTORY */
  public static createFrom(params: SparkLendingPoolInfoParameters): SparkLendingPoolInfo {
    return new SparkLendingPoolInfo(params)
  }

  /** SEALED CONSTRUCTOR */
  private constructor(params: SparkLendingPoolInfoParameters) {
    super(params)

    this.id = params.id
  }
}

SerializationService.registerClass(SparkLendingPoolInfo, { identifier: 'SparkLendingPoolInfo' })
