import { PoolId } from '@summerfi/sdk-common/protocols'
import { ILKType } from '../enums/ILKType'
import { IMakerPoolId } from '../interfaces/IMakerPoolId'
import { SerializationService } from '@summerfi/sdk-common/services'
import { IMakerProtocol } from '../interfaces/IMakerProtocol'

export class MakerPoolId extends PoolId implements IMakerPoolId {
  protocol: IMakerProtocol
  ilkType: ILKType

  private constructor(params: IMakerPoolId) {
    super(params)

    this.protocol = params.protocol
    this.ilkType = params.ilkType
  }

  static createFrom(params: IMakerPoolId): MakerPoolId {
    return new MakerPoolId(params)
  }
}

SerializationService.registerClass(MakerPoolId)
