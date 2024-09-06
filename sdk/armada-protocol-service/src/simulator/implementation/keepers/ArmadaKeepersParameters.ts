import {
  IArmadaKeepersParameters,
  IArmadaKeepersParametersData,
  IArmadaPoolId,
  IArmadaRebalanceData,
  __iarmadakeepersparameters__,
} from '@summerfi/armada-protocol-common'
import { SerializationService } from '@summerfi/sdk-common/services'
import { IUser } from '@summerfi/sdk-common/user'

/**
 * Type for the parameters of ArmadaParameters
 */
export type ArmadaKeepersParametersParameters = Omit<IArmadaKeepersParametersData, ''>

/**
 * @name ArmadaKeepersParameters
 * @see IArmadaKeepersParameters
 */
export class ArmadaKeepersParameters implements IArmadaKeepersParameters {
  /** SIGNATURE */
  readonly [__iarmadakeepersparameters__] = __iarmadakeepersparameters__

  /** ATTRIBUTES */
  readonly keeper: IUser
  readonly poolId: IArmadaPoolId
  readonly rebalanceData: IArmadaRebalanceData[]

  /** FACTORY */
  static createFrom(params: ArmadaKeepersParametersParameters): ArmadaKeepersParameters {
    return new ArmadaKeepersParameters(params)
  }

  /** SEALED CONSTRUCTOR */
  private constructor(params: ArmadaKeepersParametersParameters) {
    this.keeper = params.keeper
    this.poolId = params.poolId
    this.rebalanceData = params.rebalanceData
  }

  toString(): string {
    return `Armada Parameters [keeper: ${this.keeper}, poolId: ${this.poolId}, rebalanceData: ${this.rebalanceData}]`
  }
}

SerializationService.registerClass(ArmadaKeepersParameters)
