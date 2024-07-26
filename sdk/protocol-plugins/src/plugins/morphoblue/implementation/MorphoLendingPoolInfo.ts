import { LendingPoolInfo } from '@summerfi/sdk-common/lending-protocols'
import { SerializationService } from '@summerfi/sdk-common/services'
import { IMorphoLendingPoolId } from '../interfaces/IMorphoLendingPoolId'
import {
  IMorphoLendingPoolInfo,
  IMorphoLendingPoolInfoParameters,
} from '../interfaces/IMorphoLendingPoolInfo'

/**
 * @class MorphoLendingPoolInfo
 * @see IMorphoLendingPoolInfo
 */
export class MorphoLendingPoolInfo extends LendingPoolInfo implements IMorphoLendingPoolInfo {
  readonly _signature_2 = 'IMorphoLendingPoolInfo'

  readonly id: IMorphoLendingPoolId

  private constructor(params: IMorphoLendingPoolInfoParameters) {
    super(params)

    this.id = params.id
  }

  public static createFrom(params: IMorphoLendingPoolInfoParameters): MorphoLendingPoolInfo {
    return new MorphoLendingPoolInfo(params)
  }
}

SerializationService.registerClass(MorphoLendingPoolInfo)
