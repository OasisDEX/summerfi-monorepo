import { BigNumber } from 'bignumber.js'
import { SerializationService } from '../../services/SerializationService'
import {
  IPercentage,
  IPercentageData,
  __signature__,
  isPercentage,
} from '../interfaces/IPercentage'

/**
 * Type for the parameters of Percentage
 */
export type PercentageParameters = Omit<IPercentageData, ''>

/**
 * @class Percentage
 * @see IPercentage
 */
export class Percentage implements IPercentage {
  /** SIGNATURE */
  readonly [__signature__] = __signature__

  /** CONSTANTS */

  /** The number of decimals used to represent the percentage in Solidity */
  public static PERCENTAGE_DECIMALS = 6

  /**The factor used to scale the percentage */
  public static PERCENTAGE_FACTOR = 10 ** Percentage.PERCENTAGE_DECIMALS

  /** The percentage of 100% with the given `PERCENTAGE_DECIMALS` */
  public static Percent100: Percentage = new Percentage({
    value: 100.0,
  })

  /** ATTRIBUTES */
  readonly value: number

  /** FACTORY */
  static createFrom(params: PercentageParameters) {
    return new Percentage(params)
  }

  /**
   * Creates a Percentage instance from a Solidity value with PERCENTAGE_DECIMALS decimals
   * @param value The Solidity value
   * @returns The Percentage instance
   */
  static createFromSolidityValue(params: { value: bigint }): Percentage {
    const percentageValue = new BigNumber(params.value.toString())
      .div(Percentage.PERCENTAGE_FACTOR)
      .toNumber()

    return Percentage.createFrom({ value: percentageValue })
  }

  /** CONSTRUCTOR */

  /** Sealed constructor */
  private constructor(params: PercentageParameters) {
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

  /** @see IValueConverter.toSolidityValue */
  toSolidityValue(
    params: { decimals: number } = { decimals: Percentage.PERCENTAGE_DECIMALS },
  ): bigint {
    const factor = new BigNumber(10).pow(params.decimals)
    return BigInt(new BigNumber(this.toProportion()).multipliedBy(factor).toFixed(0))
  }

  /** @see IValueConverter.toBigNumber */
  toBigNumber(): BigNumber {
    return new BigNumber(this.toProportion())
  }

  /** @see IPrintable.toString */
  toString(): string {
    return `${this.value}%`
  }
}

SerializationService.registerClass(Percentage, { identifier: 'Percentage' })
