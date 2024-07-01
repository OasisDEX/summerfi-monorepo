import { LendingPoolInfo } from '@summerfi/sdk-common/protocols'
import { SerializationService } from '@summerfi/sdk-common/services'
import { MorphoBlueLendingPoolId } from './MorphoBlueLendingPoolId'
import {
  IMorphoBlueLendingPoolInfo,
  IMorphoBlueLendingPoolInfoData,
} from '../interfaces/IMorphoBlueLendingPoolInfo'

/**
 * @class MorphoBlueLendingPoolInfo
 * @see IMorphoBlueLendingPoolInfo
 */
export class MorphoBlueLendingPoolInfo
  extends LendingPoolInfo
  implements IMorphoBlueLendingPoolInfo
{
  readonly id: MorphoBlueLendingPoolId

  private constructor(params: IMorphoBlueLendingPoolInfoData) {
    super(params)

    this.id = MorphoBlueLendingPoolId.createFrom(params.id)
  }

  public static createFrom(params: IMorphoBlueLendingPoolInfoData): MorphoBlueLendingPoolInfo {
    return new MorphoBlueLendingPoolInfo(params)
  }
}

SerializationService.registerClass(MorphoBlueLendingPoolInfo)
