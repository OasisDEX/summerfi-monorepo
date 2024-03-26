import { BigNumber } from 'bignumber.js'
import { SerializationService } from '../../services/SerializationService'
import { IPercentage } from '../interfaces/IPercentage'

/**
 * @class Percentage
 * @description Represents a percentage
 */
export class Percentage implements IPercentage {
  readonly value: number

  private constructor(params: IPercentage) {
    this.value = params.value
  }

  static createFrom(params: IPercentage) {
    return new Percentage(params)
  }

  toString(): string {
    return `${this.value}`
  }

  add(percentage: IPercentage): Percentage {
    return Percentage.createFrom({ value: this.value + percentage.value })
  }

  toBaseUnit(params: { decimals: number }): string {
    const factor = new BigNumber(10).pow(params.decimals)
    return new BigNumber(this.value).multipliedBy(factor).toFixed(0).toString()
  }
}

SerializationService.registerClass(Percentage)
