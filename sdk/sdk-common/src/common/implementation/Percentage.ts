import { BigNumber } from 'bignumber.js'
import { SerializationService } from '../../services/SerializationService'
import { IPercentage, IPercentageData, isPercentage } from '../interfaces/IPercentage'

/**
 * @class Percentage
 * @see IPercentage
 */
export class Percentage implements IPercentage {
  public static Percent100: Percentage = new Percentage({
    value: 100.0,
  })

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

  /** @see IPercentage.toComplement */
  toComplement(): IPercentage {
    return Percentage.createFrom({ value: 100 - this.value })
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
