import { IRebalanceData, __irebalancedata__ } from '@summerfi/armada-protocol-common'
import { IAddress, ITokenAmount } from '@summerfi/sdk-common'

/**
 * Type for the parameters of TokenAmount
 */
export type RebalanceDataParameters = Omit<IRebalanceData, ''>

/**
 * @class RebalanceData
 * @see IRebalanceData
 */
export class RebalanceData implements IRebalanceData {
  /** SIGNATURE */
  readonly [__irebalancedata__] = __irebalancedata__

  /** ATTRIBUTES */
  readonly fromArk: IAddress
  readonly toArk: IAddress
  readonly amount: ITokenAmount

  /** FACTORY */

  static createFrom(params: RebalanceDataParameters): IRebalanceData {
    return new RebalanceData(params)
  }

  /** SEALED CONSTRUCTOR */

  private constructor(params: IRebalanceData) {
    this.fromArk = params.fromArk
    this.toArk = params.toArk
    this.amount = params.amount
  }
}
