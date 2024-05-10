import { BigNumber } from 'bignumber.js'
import { SerializationService } from '../../services/SerializationService'
import { IPercentage, IPercentageData, isPercentage } from '../interfaces/IPercentage'

/**
 * @class Percentage
 * @see IPercentage
 */
export class Percentage implements IPercentage {
  readonly value: number

  /** FACTORY */
  static createFrom(params: IPercentageData) {
    return new Percentage(params)
  }

  /** CONSTRUCTOR */

  /** Sealed constructor */
  private constructor(params: IPercentageData) {
    this.value = params.value
  }

  /** METHODS */

  /** @see IPercentage.add */
  add(percentage: IPercentage): IPercentage {
    return Percentage.createFrom({ value: this.value + percentage.value })
  }

  /** @see IPercentage.subtract */
  subtract(percentage: IPercentage): IPercentage {
    return Percentage.createFrom({ value: this.value - percentage.value })
  }

  /** @see IPercentage.multiply */
  multiply(multiplier: string | number | IPercentage): IPercentage {
    if (isPercentage(multiplier)) {
      return Percentage.createFrom({ value: this.value * multiplier.toProportion() })
    }

    return Percentage.createFrom({ value: this.value * Number(multiplier) })
  }

  /** @see IPercentage.divide */
  divide(divisor: string | number | IPercentage): IPercentage {
    if (isPercentage(divisor)) {
      return Percentage.createFrom({ value: this.value / divisor.toProportion() })
    }

    return Percentage.createFrom({ value: this.value / Number(divisor) })
  }

  /** @see IPercentage.toProportion */
  toProportion(): number {
    return this.value / 100
  }

  /** @see IPercentage.toBaseUnit */
  toBaseUnit(params: { decimals: number }): string {
    const factor = new BigNumber(10).pow(params.decimals)
    return new BigNumber(this.toProportion()).multipliedBy(factor).toFixed(0).toString()
  }

  /** @see IPrintable.toString */
  toString(): string {
    return `${this.value}%`
  }
}

SerializationService.registerClass(Percentage)
