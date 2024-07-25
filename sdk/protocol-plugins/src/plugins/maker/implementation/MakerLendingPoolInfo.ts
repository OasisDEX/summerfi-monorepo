import { LendingPoolInfo } from '@summerfi/sdk-common/lending-protocols'
import { SerializationService } from '@summerfi/sdk-common/services'
import { IMakerLendingPoolInfoData } from '../interfaces/IMakerLendingPoolInfo'
import { MakerLendingPoolId } from './MakerLendingPoolId'

/**
 * @class MakerLendingPoolInfo
 * @see IMakerLendingPoolInfoData
 */
export class MakerLendingPoolInfo extends LendingPoolInfo implements IMakerLendingPoolInfoData {
  readonly id: MakerLendingPoolId

  /** Factory method */
  static createFrom(params: IMakerLendingPoolInfoData): MakerLendingPoolInfo {
    return new MakerLendingPoolInfo(params)
  }

  /** Sealed constructor */
  private constructor(params: IMakerLendingPoolInfoData) {
    super(params)

    this.id = MakerLendingPoolId.createFrom(params.id)
  }
}

SerializationService.registerClass(MakerLendingPoolInfo)
