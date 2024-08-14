import { LendingPoolInfo } from '@summerfi/sdk-common/lending-protocols'
import { SerializationService } from '@summerfi/sdk-common/services'
import { IMakerLendingPoolId } from '../interfaces/IMakerLendingPoolId'
import { IMakerLendingPoolInfoData, __signature__ } from '../interfaces/IMakerLendingPoolInfo'

/**
 * Type for the parameters of MakerLendingPool
 */
export type MakerLendingPoolInfoParameters = Omit<IMakerLendingPoolInfoData, 'type'>

/**
 * @class MakerLendingPoolInfo
 * @see IMakerLendingPoolInfoData
 */
export class MakerLendingPoolInfo extends LendingPoolInfo implements IMakerLendingPoolInfoData {
  /** SIGNATURE */
  readonly [__signature__] = __signature__

  /** ATTRIBUTES */
  readonly id: IMakerLendingPoolId

  /** FACTORY */
  static createFrom(params: MakerLendingPoolInfoParameters): MakerLendingPoolInfo {
    return new MakerLendingPoolInfo(params)
  }

  /** SEALED CONSTRUCTOR */
  private constructor(params: MakerLendingPoolInfoParameters) {
    super(params)

    this.id = params.id
  }
}

SerializationService.registerClass(MakerLendingPoolInfo)
