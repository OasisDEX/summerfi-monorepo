import {
  ArmadaOperationType,
  IArmadaPoolId,
  IArmadaUsersParameters,
  IArmadaUsersParametersData,
  __iarmadausersparameters__,
} from '@summerfi/armada-protocol-common'
import { ITokenAmount } from '@summerfi/sdk-common/common'
import { SerializationService } from '@summerfi/sdk-common/services'
import { IUser } from '@summerfi/sdk-common/user'

/**
 * Type for the parameters of ArmadaParameters
 */
export type ArmadaParametersParameters = Omit<IArmadaUsersParametersData, ''>

/**
 * @name ArmadaUsersParameters
 * @see IArmadaUsersParameters
 */
export class ArmadaUsersParameters implements IArmadaUsersParameters {
  /** SIGNATURE */
  readonly [__iarmadausersparameters__] = __iarmadausersparameters__

  /** ATTRIBUTES */
  readonly user: IUser
  readonly poolId: IArmadaPoolId
  readonly operation: ArmadaOperationType
  readonly amount: ITokenAmount

  /** FACTORY */
  static createFrom(params: ArmadaParametersParameters): ArmadaUsersParameters {
    return new ArmadaUsersParameters(params)
  }

  /** SEALED CONSTRUCTOR */
  private constructor(params: ArmadaParametersParameters) {
    this.user = params.user
    this.poolId = params.poolId
    this.operation = params.operation
    this.amount = params.amount
  }

  toString(): string {
    return `Armada Parameters [user: ${this.user}, poolId: ${this.poolId}, operation: ${this.operation}, amount: ${this.amount}]`
  }
}

SerializationService.registerClass(ArmadaUsersParameters)
