import {
  ArmadaOperationType,
  IArmadaParameters,
  IArmadaParametersParameters,
  IArmadaPosition,
} from '@summerfi/armada-protocol-common'
import { ITokenAmount } from '@summerfi/sdk-common/common'
import { SerializationService } from '@summerfi/sdk-common/services'
import { IUser } from '@summerfi/sdk-common/user'

/**
 * @name ArmadaParameters
 * @see IArmadaParameters
 */
export class ArmadaParameters implements IArmadaParameters {
  readonly _signature_0 = 'IArmadaParameters'

  readonly user: IUser
  readonly previousPosition?: IArmadaPosition
  readonly operation: ArmadaOperationType
  readonly amount: ITokenAmount

  /** Factory method */
  static createFrom(params: IArmadaParametersParameters): ArmadaParameters {
    return new ArmadaParameters(params)
  }

  /** Sealed constructor */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private constructor(params: IArmadaParametersParameters) {
    this.user = params.user
    this.previousPosition = params.previousPosition
    this.operation = params.operation
    this.amount = params.amount
  }

  toString(): string {
    return `Armada Parameters ()`
  }
}

SerializationService.registerClass(ArmadaParameters)
