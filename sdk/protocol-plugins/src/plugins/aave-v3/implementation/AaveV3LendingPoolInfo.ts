import { LendingPoolInfo } from '@summerfi/sdk-common/protocols'
import { SerializationService } from '@summerfi/sdk-common/services'
import { AaveV3LendingPoolId } from './AaveV3LendingPoolId'
import {
  IAaveV3LendingPoolInfo,
  IAaveV3LendingPoolInfoData,
} from '../interfaces/IAaveV3LendingPoolInfo'

/**
 * @class AaveV3LendingPoolInfo
 * @see IAaveV3LendingPoolInfo
 */
export class AaveV3LendingPoolInfo extends LendingPoolInfo implements IAaveV3LendingPoolInfo {
  readonly id: AaveV3LendingPoolId

  /** Factory method */
  public static createFrom(params: IAaveV3LendingPoolInfoData): AaveV3LendingPoolInfo {
    return new AaveV3LendingPoolInfo(params)
  }

  /** Sealed constructor */
  private constructor(params: IAaveV3LendingPoolInfoData) {
    super(params)

    this.id = AaveV3LendingPoolId.createFrom(params.id)
  }
}

SerializationService.registerClass(AaveV3LendingPoolInfo)
