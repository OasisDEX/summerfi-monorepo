import { CompoundV3PositionParameters } from '../types/CompoundV3PositionParameters'
import { ICompoundV3PositionId } from '../interfaces/ICompoundV3PositionId'
import { PositionId } from '@summerfi/sdk-common'
import { SerializationService } from '@summerfi/sdk-common/services'

export class CompoundV3PositionId extends PositionId implements ICompoundV3PositionId {
  readonly positionParameters: CompoundV3PositionParameters

  private constructor(params: ICompoundV3PositionId) {
    super(params)

    this.positionParameters = params.positionParameters
  }

  static createFrom(params: ICompoundV3PositionId): CompoundV3PositionId {
    return new CompoundV3PositionId(params)
  }
}

SerializationService.registerClass(CompoundV3PositionId)
