import {
  ArmadaOperationType,
  IArmadaParameters,
  IArmadaParametersData,
  IArmadaPosition,
  __iarmadaparameters__,
} from '@summerfi/armada-protocol-common'
import { ITokenAmount } from '@summerfi/sdk-common/common'
import { SerializationService } from '@summerfi/sdk-common/services'
import { IUser } from '@summerfi/sdk-common/user'

/**
 * Type for the parameters of ArmadaParameters
 */
export type ArmadaParametersParameters = Omit<IArmadaParametersData, ''>

/**
 * @name ArmadaParameters
 * @see IArmadaParameters
 */
export class ArmadaParameters implements IArmadaParameters {
  /** SIGNATURE */
  readonly [__iarmadaparameters__] = __iarmadaparameters__

  /** ATTRIBUTES */
  readonly user: IUser
  readonly previousPosition?: IArmadaPosition
  readonly operation: ArmadaOperationType
  readonly amount: ITokenAmount

  /** FACTORY */
  static createFrom(params: ArmadaParametersParameters): ArmadaParameters {
    return new ArmadaParameters(params)
  }

  /** SEALED CONSTRUCTOR */
  private constructor(params: ArmadaParametersParameters) {
    this.user = params.user
    this.previousPosition = params.previousPosition
    this.operation = params.operation
    this.amount = params.amount
  }

  toString(): string {
    return `Armada Parameters [user: ${this.user}, previousPosition: ${this.previousPosition}, operation: ${this.operation}, amount: ${this.amount}]`
  }
}

SerializationService.registerClass(ArmadaParameters)
