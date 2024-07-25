import { Address } from '../../../common/implementation/Address'
import { IAddress } from '../../../common/interfaces/IAddress'
import { LendingPositionId } from '../../../lending-protocols/implementation/LendingPositionId'
import { SerializationService } from '../../../services/SerializationService'
import { ExternalLendingPositionType } from '../enums/ExrternalLendingPositionType'
import {
  IExternalLendingPositionId,
  IExternalLendingPositionIdData,
} from '../interfaces/IExternalLendingPositionId'

/**
 * @name ExternalLendingPositionId
 * @see IExternalLendingPositionId
 */
export class ExternalLendingPositionId
  extends LendingPositionId
  implements IExternalLendingPositionId
{
  readonly externalType: ExternalLendingPositionType
  readonly address: IAddress

  /** Factory method */
  static createFrom(params: IExternalLendingPositionIdData): ExternalLendingPositionId {
    return new ExternalLendingPositionId(params)
  }

  /** Sealed constructor */
  private constructor(params: IExternalLendingPositionIdData) {
    super(params)

    this.externalType = params.externalType
    this.address = Address.createFrom(params.address)
  }

  toString(): string {
    return `External lending position ID: ${this.externalType} at ${this.address.toString()} (${super.toString()})`
  }
}

SerializationService.registerClass(ExternalLendingPositionId)
