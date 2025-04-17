import { LendingPoolInfo, SerializationService } from '@summerfi/sdk-common'
import { IAaveV3LendingPoolId } from '../interfaces/IAaveV3LendingPoolId'
import {
  IAaveV3LendingPoolInfo,
  IAaveV3LendingPoolInfoData,
  __signature__,
} from '../interfaces/IAaveV3LendingPoolInfo'

/**
 * Type for the parameters of AaveV3LendingPool
 */
export type AaveV3LendingPoolInfoParameters = Omit<IAaveV3LendingPoolInfoData, 'type'>

/**
 * @class AaveV3LendingPoolInfo
 * @see IAaveV3LendingPoolInfo
 */
export class AaveV3LendingPoolInfo extends LendingPoolInfo implements IAaveV3LendingPoolInfo {
  /** SIGNATURE */
  readonly [__signature__] = __signature__

  /** ATTRIBUTES */
  readonly id: IAaveV3LendingPoolId

  /** FACTORY */
  public static createFrom(params: AaveV3LendingPoolInfoParameters): AaveV3LendingPoolInfo {
    return new AaveV3LendingPoolInfo(params)
  }

  /** SEALED CONSTRUCTOR */
  private constructor(params: AaveV3LendingPoolInfoParameters) {
    super(params)

    this.id = params.id
  }
}

SerializationService.registerClass(AaveV3LendingPoolInfo, { identifier: 'AaveV3LendingPoolInfo' })
