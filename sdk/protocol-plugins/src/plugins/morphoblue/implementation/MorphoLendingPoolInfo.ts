import { LendingPoolInfo } from '@summerfi/sdk-common/lending-protocols'
import { SerializationService } from '@summerfi/sdk-common/services'
import {
  IMorphoLendingPoolInfo,
  IMorphoLendingPoolInfoData,
} from '../interfaces/IMorphoLendingPoolInfo'
import { MorphoLendingPoolId } from './MorphoLendingPoolId'

/**
 * @class MorphoLendingPoolInfo
 * @see IMorphoLendingPoolInfo
 */
export class MorphoLendingPoolInfo extends LendingPoolInfo implements IMorphoLendingPoolInfo {
  readonly id: MorphoLendingPoolId

  private constructor(params: IMorphoLendingPoolInfoData) {
    super(params)

    this.id = MorphoLendingPoolId.createFrom(params.id)
  }

  public static createFrom(params: IMorphoLendingPoolInfoData): MorphoLendingPoolInfo {
    return new MorphoLendingPoolInfo(params)
  }
}

SerializationService.registerClass(MorphoLendingPoolInfo)
