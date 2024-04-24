import { LendingPoolId } from '@summerfi/sdk-common/protocols'
import { SerializationService } from '@summerfi/sdk-common/services'
import { IMakerLendingPoolId } from '../interfaces/IMakerLendingPoolId'
import { ILKType } from '../enums/ILKType'
import { MakerProtocol } from './MakerProtocol'

/**
 * @class MakerLendingPoolId
 * @see IMakerLendingPoolId
 */
export class MakerLendingPoolId extends LendingPoolId implements IMakerLendingPoolId {
  readonly protocol: MakerProtocol
  readonly ilkType: ILKType

  private constructor(params: IMakerLendingPoolId) {
    super(params)

    this.protocol = MakerProtocol.createFrom(params.protocol)
    this.ilkType = params.ilkType
  }

  public static createFrom(params: IMakerLendingPoolId): MakerLendingPoolId {
    return new MakerLendingPoolId(params)
  }
}

SerializationService.registerClass(MakerLendingPoolId)
