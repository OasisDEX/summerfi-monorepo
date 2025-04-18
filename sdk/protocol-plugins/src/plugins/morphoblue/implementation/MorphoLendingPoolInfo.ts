import { LendingPoolInfo, SerializationService } from '@summerfi/sdk-common'
import { IMorphoLendingPoolId } from '../interfaces/IMorphoLendingPoolId'
import {
  IMorphoLendingPoolInfo,
  IMorphoLendingPoolInfoData,
  __signature__,
} from '../interfaces/IMorphoLendingPoolInfo'

/**
 * Type for the parameters of MorphoLendingPoolInfo
 */
export type MorphoLendingPoolInfoParameters = Omit<IMorphoLendingPoolInfoData, 'type'>

/**
 * @class MorphoLendingPoolInfo
 * @see IMorphoLendingPoolInfo
 */
export class MorphoLendingPoolInfo extends LendingPoolInfo implements IMorphoLendingPoolInfo {
  /** SIGNATURE */
  readonly [__signature__] = __signature__

  /** ATTRIBUTES */
  readonly id: IMorphoLendingPoolId

  /** FACTORY */
  public static createFrom(params: MorphoLendingPoolInfoParameters): MorphoLendingPoolInfo {
    return new MorphoLendingPoolInfo(params)
  }

  /** SEALED CONSTRUCTOR */
  private constructor(params: MorphoLendingPoolInfoParameters) {
    super(params)

    this.id = params.id
  }
}

SerializationService.registerClass(MorphoLendingPoolInfo, { identifier: 'MorphoLendingPoolInfo' })
