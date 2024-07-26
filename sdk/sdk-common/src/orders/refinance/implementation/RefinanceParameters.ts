import { IPercentage } from '../../../common/interfaces/IPercentage'
import { ILendingPool } from '../../../lending-protocols/interfaces/ILendingPool'
import { ILendingPosition } from '../../../lending-protocols/interfaces/ILendingPosition'
import { SerializationService } from '../../../services/SerializationService'
import {
  IRefinanceParameters,
  IRefinanceParametersParameters,
} from '../interfaces/IRefinanceParameters'

/**
 * @name RefinanceParameters
 * @see IRefinanceParameters
 */
export class RefinanceParameters implements IRefinanceParameters {
  readonly _signature_0 = 'IRefinanceParameters'

  readonly sourcePosition: ILendingPosition
  readonly targetPool: ILendingPool
  readonly slippage: IPercentage

  /** Factory method */
  static createFrom(params: IRefinanceParametersParameters): RefinanceParameters {
    return new RefinanceParameters(params)
  }

  /** Sealed constructor */
  private constructor(params: IRefinanceParametersParameters) {
    this.sourcePosition = params.sourcePosition
    this.targetPool = params.targetPool
    this.slippage = params.slippage
  }

  toString(): string {
    return `Refinance Parameters (source: ${this.sourcePosition}, target: ${this.targetPool}, slippage: ${this.slippage})`
  }
}

SerializationService.registerClass(RefinanceParameters)
