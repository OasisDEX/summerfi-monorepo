import { LendingPoolId } from '@summerfi/sdk-common/protocols'
import { SerializationService } from '@summerfi/sdk-common/services'
import { IMakerLendingPoolId, IMakerLendingPoolIdData } from '../interfaces/IMakerLendingPoolId'
import { ILKType } from '../enums/ILKType'
import { MakerProtocol } from './MakerProtocol'

/**
 * @class MakerLendingPoolId
 * @see IMakerLendingPoolIdData
 */
export class MakerLendingPoolId extends LendingPoolId implements IMakerLendingPoolId {
  readonly protocol: MakerProtocol
  readonly ilkType: ILKType

  /** Factory method */
  public static createFrom(params: IMakerLendingPoolIdData): MakerLendingPoolId {
    return new MakerLendingPoolId(params)
  }

  /** Sealed constructor */
  private constructor(params: IMakerLendingPoolIdData) {
    super(params)

    this.protocol = MakerProtocol.createFrom(params.protocol)
    this.ilkType = params.ilkType
  }
}

SerializationService.registerClass(MakerLendingPoolId)
