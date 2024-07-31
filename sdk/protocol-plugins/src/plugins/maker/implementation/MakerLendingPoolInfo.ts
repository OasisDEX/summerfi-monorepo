import { LendingPoolInfo } from '@summerfi/sdk-common/lending-protocols'
import { SerializationService } from '@summerfi/sdk-common/services'
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
  readonly _signature_2 = 'IMakerLendingPoolInfo'

  readonly id: IMakerLendingPoolId

  /** Factory method */
  static createFrom(params: IMakerLendingPoolInfoParameters): MakerLendingPoolInfo {
    return new MakerLendingPoolInfo(params)
  }

  /** Sealed constructor */
  private constructor(params: IMakerLendingPoolInfoParameters) {
    super(params)

    this.id = params.id
  }
}

SerializationService.registerClass(MakerLendingPoolInfo)
