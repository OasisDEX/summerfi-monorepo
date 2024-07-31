import { LendingPoolInfo } from '@summerfi/sdk-common/lending-protocols'
import { SerializationService } from '@summerfi/sdk-common/services'
import { __iaavev3lendingpoolinfo__ } from '../../aave-v3'
import { IMakerLendingPoolId } from '../interfaces/IMakerLendingPoolId'
import {
  IMakerLendingPoolInfoData,
  IMakerLendingPoolInfoParameters,
} from '../interfaces/IMakerLendingPoolInfo'

/**
 * @class MakerLendingPoolInfo
 * @see IMakerLendingPoolInfoData
 */
export class MakerLendingPoolInfo extends LendingPoolInfo implements IMakerLendingPoolInfoData {
  /** SIGNATURE */
  readonly [__iaavev3lendingpoolinfo__] = 'IMakerLendingPoolInfo'

  /** ATTRIBUTES */
  readonly id: IMakerLendingPoolId

  /** FACTORY */
  static createFrom(params: IMakerLendingPoolInfoParameters): MakerLendingPoolInfo {
    return new MakerLendingPoolInfo(params)
  }

  /** SEALED CONSTRUCTOR */
  private constructor(params: IMakerLendingPoolInfoParameters) {
    super(params)

    this.id = params.id
  }
}

SerializationService.registerClass(MakerLendingPoolInfo)
