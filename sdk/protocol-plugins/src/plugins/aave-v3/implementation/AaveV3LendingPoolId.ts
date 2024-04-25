import { SerializationService } from '@summerfi/sdk-common/services'
import { EmodeType } from '../../common'
import { IAaveV3LendingPoolId, IAaveV3LendingPoolIdData } from '../interfaces/IAaveV3LendingPoolId'
import { LendingPoolId } from '@summerfi/sdk-common'
import { AaveV3Protocol } from './AaveV3Protocol'

/**
 * @class AaveV3LendingPoolId
 * @see IAaveV3LendingPoolIdData
 */
export class AaveV3LendingPoolId extends LendingPoolId implements IAaveV3LendingPoolId {
  readonly protocol: AaveV3Protocol
  readonly emodeType: EmodeType

  /** Factory method */
  static createFrom(params: IAaveV3LendingPoolIdData): AaveV3LendingPoolId {
    return new AaveV3LendingPoolId(params)
  }

  /** Sealed constructor */
  private constructor(params: IAaveV3LendingPoolIdData) {
    super(params)

    this.protocol = AaveV3Protocol.createFrom(params.protocol)
    this.emodeType = params.emodeType
  }
}

SerializationService.registerClass(AaveV3LendingPoolId)
