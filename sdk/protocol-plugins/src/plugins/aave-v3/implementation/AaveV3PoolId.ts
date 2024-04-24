import { PoolId } from '@summerfi/sdk-common/protocols'
import { SerializationService } from '@summerfi/sdk-common/services'
import { EmodeType } from '../../common'
import { IAaveV3PoolId } from '../interfaces/IAaveV3LendingPoolId'
import { IAaveV3Protocol } from '../interfaces/IAaveV3Protocol'

export class AaveV3PoolId extends PoolId implements IAaveV3PoolId {
  protocol: IAaveV3Protocol
  emodeType: EmodeType

  private constructor(params: IAaveV3PoolId) {
    super(params)

    this.protocol = params.protocol
    this.emodeType = params.emodeType
  }

  static createFrom(params: IAaveV3PoolId): AaveV3PoolId {
    return new AaveV3PoolId(params)
  }
}

SerializationService.registerClass(AaveV3PoolId)
