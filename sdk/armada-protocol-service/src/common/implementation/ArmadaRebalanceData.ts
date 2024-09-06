import { IArmadaRebalanceData, __iarmadarebalancedata__ } from '@summerfi/armada-protocol-common'
import { IAddress, ITokenAmount } from '@summerfi/sdk-common'

/**
 * Type for the parameters of TokenAmount
 */
export type RebalanceDataParameters = Omit<IArmadaRebalanceData, ''>

/**
 * @class RebalanceData
 * @see IArmadaRebalanceData
 */
export class ArmadaRebalanceData implements IArmadaRebalanceData {
  /** SIGNATURE */
  readonly [__iarmadarebalancedata__] = __iarmadarebalancedata__

  /** ATTRIBUTES */
  readonly fromArk: IAddress
  readonly toArk: IAddress
  readonly amount: ITokenAmount

  /** FACTORY */

  static createFrom(params: RebalanceDataParameters): IArmadaRebalanceData {
    return new ArmadaRebalanceData(params)
  }

  /** SEALED CONSTRUCTOR */

  private constructor(params: IArmadaRebalanceData) {
    this.fromArk = params.fromArk
    this.toArk = params.toArk
    this.amount = params.amount
  }
}
