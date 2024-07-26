import { IAddress } from '../../../common/interfaces/IAddress'
import { LendingPositionId } from '../../../lending-protocols/implementation/LendingPositionId'
import { ILendingPositionId } from '../../../lending-protocols/interfaces/ILendingPositionId'
import { SerializationService } from '../../../services/SerializationService'
import { ExternalLendingPositionType } from '../enums/ExrternalLendingPositionType'
import {
  IExternalLendingPositionId,
  IExternalLendingPositionIdParameters,
} from '../interfaces/IExternalLendingPositionId'

/**
 * @name ExternalLendingPositionId
 * @see IExternalLendingPositionId
 */
export class ExternalLendingPositionId
  extends LendingPositionId
  implements IExternalLendingPositionId
{
  readonly _signature_2 = 'IExternalLendingPositionId'

  readonly externalType: ExternalLendingPositionType
  readonly address: IAddress
  readonly protocolId: ILendingPositionId

  /** Factory method */
  static createFrom(params: IExternalLendingPositionIdParameters): ExternalLendingPositionId {
    return new ExternalLendingPositionId(params)
  }

  /** Sealed constructor */
  private constructor(params: IExternalLendingPositionIdParameters) {
    super(params)

    this.externalType = params.externalType
    this.address = params.address
    this.protocolId = params.protocolId
  }

  toString(): string {
    return `External lending position ID: ${this.externalType} at ${this.address.toString()} (${super.toString()})`
  }
}

SerializationService.registerClass(ExternalLendingPositionId)
