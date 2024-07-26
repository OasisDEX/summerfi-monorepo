import { LendingPoolInfo } from '@summerfi/sdk-common/lending-protocols'
import { SerializationService } from '@summerfi/sdk-common/services'
import { IAaveV3LendingPoolId } from '../interfaces/IAaveV3LendingPoolId'
import {
  IAaveV3LendingPoolInfo,
  IAaveV3LendingPoolInfoParameters,
} from '../interfaces/IAaveV3LendingPoolInfo'

/**
 * @class AaveV3LendingPoolInfo
 * @see IAaveV3LendingPoolInfo
 */
export class AaveV3LendingPoolInfo extends LendingPoolInfo implements IAaveV3LendingPoolInfo {
  readonly _signature_2 = 'IAaveV3LendingPoolInfo'

  readonly id: IAaveV3LendingPoolId

  /** Factory method */
  public static createFrom(params: IAaveV3LendingPoolInfoParameters): AaveV3LendingPoolInfo {
    return new AaveV3LendingPoolInfo(params)
  }

  /** Sealed constructor */
  private constructor(params: IAaveV3LendingPoolInfoParameters) {
    super(params)

    this.id = params.id
  }
}

SerializationService.registerClass(AaveV3LendingPoolInfo)
