import {
  IArmadaParameters,
  IArmadaParametersData,
  __iarmadaparameters__,
} from '@summerfi/armada-protocol-common'
import {
  ITokenAmount,
  type ArmadaOperationType,
  type IArmadaVaultId,
} from '@summerfi/sdk-common/common'
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
  readonly poolId: IArmadaVaultId
  readonly operation: ArmadaOperationType
  readonly amount: ITokenAmount

  /** FACTORY */
  static createFrom(params: ArmadaParametersParameters): ArmadaParameters {
    return new ArmadaParameters(params)
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

SerializationService.registerClass(ArmadaParameters, { identifier: 'ArmadaParameters' })
