import BigNumber from 'bignumber.js'
import { Printable } from './Printable'

/**
 * @class Percentage
 * @description Represents a percentage
 */
export class Percentage implements Printable {
  public readonly value: number

  private constructor(params: { percentage: number }) {
    this.value = params.percentage
  }

  static createFrom(params: { percentage: number }) {
    return new Percentage(params)
  }

  toString(): string {
    return `${this.value}`
  }

  add(percentage: Percentage): Percentage {
    return Percentage.createFrom({ percentage: this.value + percentage.value })
  }

  toBaseUnit(params: { decimals: number }): string {
    const factor = new BigNumber(10).pow(params.decimals)
    return new BigNumber(this.value).multipliedBy(factor).toFixed(0).toString()
  }
}
