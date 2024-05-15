import { SerializationService } from '../../services/SerializationService'
import { IRefinanceParameters } from '../interfaces'
import { IPosition } from '../../common/interfaces/IPosition'
import { IPercentage } from '../../common/interfaces/IPercentage'
import { ILendingPool } from '../../protocols'

/**
 * @name RefinanceParameters
 * @see IRefinanceParameters
 */
export class RefinanceParameters implements IRefinanceParameters {
  readonly sourcePosition: IPosition
  readonly targetPool: ILendingPool
  readonly slippage: IPercentage

  /** Factory method */
  static createFrom(params: IRefinanceParameters): RefinanceParameters {
    return new RefinanceParameters(params)
  }

  /** Sealed constructor */
  private constructor(params: IRefinanceParameters) {
    this.sourcePosition = params.sourcePosition
    this.targetPool = params.targetPool
    this.slippage = params.slippage
  }

  toString(): string {
    return `Refinance Parameters (source: ${this.sourcePosition}, target: ${this.targetPool}, slippage: ${this.slippage})`
  }
}

SerializationService.registerClass(RefinanceParameters)
