import { IPercentage } from '../../../common/interfaces/IPercentage'
import { ILendingPool } from '../../../lending-protocols/interfaces/ILendingPool'
import { ILendingPosition } from '../../../lending-protocols/interfaces/ILendingPosition'
import { SerializationService } from '../../../services/SerializationService'
import {
  IRefinanceParameters,
  IRefinanceParametersParameters,
  __signature__,
} from '../interfaces/IRefinanceParameters'

/**
 * @name RefinanceParameters
 * @see IRefinanceParameters
 */
export class RefinanceParameters implements IRefinanceParameters {
  /** SIGNATURE */
  readonly [__signature__] = __signature__

  /** ATTRIBUTES */
  readonly sourcePosition: ILendingPosition
  readonly targetPool: ILendingPool
  readonly slippage: IPercentage

  /** FACTORY */
  static createFrom(params: IRefinanceParametersParameters): RefinanceParameters {
    return new RefinanceParameters(params)
  }

  /** SEALED CONSTRUCTOR */
  private constructor(params: IRefinanceParametersParameters) {
    this.sourcePosition = params.sourcePosition
    this.targetPool = params.targetPool
    this.slippage = params.slippage
  }

  /** METHODS */

  /** @see IPrintable.toString */
  toString(): string {
    return `Refinance Parameters (source: ${this.sourcePosition}, target: ${this.targetPool}, slippage: ${this.slippage})`
  }
}

SerializationService.registerClass(RefinanceParameters)
