import { BigNumber } from 'bignumber.js'
import { SerializationService } from '../../services/SerializationService'
import { IPercentage, IPercentageData } from '../interfaces/IPercentage'

/**
 * @class Percentage
 * @see IPercentage
 */
export class Percentage implements IPercentage {
  readonly value: number

  /** Factory method */
  static createFrom(params: IPercentageData) {
    return new Percentage(params)
  }

  /** Sealed constructor */
  private constructor(params: IPercentageData) {
    this.value = params.value
  }

  add(percentage: Percentage): Percentage {
    return Percentage.createFrom({ value: this.value + percentage.value })
  }

  subtract(percentage: Percentage): Percentage {
    return Percentage.createFrom({ value: this.value - percentage.value })
  }

  toProportion(): number {
    return this.value / 100
  }

  toBaseUnit(params: { decimals: number }): string {
    const factor = new BigNumber(10).pow(params.decimals)
    return new BigNumber(this.value).multipliedBy(factor).toFixed(0).toString()
  }

  toString(): string {
    return `${this.value}%`
  }
}

SerializationService.registerClass(Percentage)
