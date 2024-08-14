import { IAddress } from '../../../common/interfaces/IAddress'
import { LendingPositionId } from '../../../lending-protocols/implementation/LendingPositionId'
import { ILendingPositionId } from '../../../lending-protocols/interfaces/ILendingPositionId'
import { SerializationService } from '../../../services/SerializationService'
import { ExternalLendingPositionType } from '../enums/ExrternalLendingPositionType'
import {
  IExternalLendingPositionId,
  IExternalLendingPositionIdData,
  __signature__,
} from '../interfaces/IExternalLendingPositionId'

/**
 * Type for the parameters of ExternalLendingPositionIdParameters
 */
export type ExternalLendingPositionIdParameters = Omit<IExternalLendingPositionIdData, 'type'>

/**
 * @name ExternalLendingPositionId
 * @see IExternalLendingPositionId
 */
export class ExternalLendingPositionId
  extends LendingPositionId
  implements IExternalLendingPositionId
{
  /** SIGNATURE */
  readonly [__signature__] = __signature__

  /** ATTRIBUTES */
  readonly externalType: ExternalLendingPositionType
  readonly address: IAddress
  readonly protocolId: ILendingPositionId

  /** FACTORY */
  static createFrom(params: ExternalLendingPositionIdParameters): ExternalLendingPositionId {
    return new ExternalLendingPositionId(params)
  }

  /** SEALED CONSTRUCTOR */
  private constructor(params: ExternalLendingPositionIdParameters) {
    super(params)

    this.externalType = params.externalType
    this.address = params.address
    this.protocolId = params.protocolId
  }

  /** METHODS */

  /** @see IPrintable.toString */
  toString(): string {
    return `External lending position ID: ${this.externalType} at ${this.address.toString()} (${super.toString()})`
  }
}

SerializationService.registerClass(ExternalLendingPositionId)
