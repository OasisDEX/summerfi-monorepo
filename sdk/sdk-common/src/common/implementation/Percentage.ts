import { BigNumber } from 'bignumber.js'
import { SerializationService } from '../../services/SerializationService'

interface IPercentageSerialized {
  value: number
}

/**
 * @class Percentage
 * @description Represents a percentage
 */
export class Percentage implements IPercentageSerialized {
  readonly value: number

  private constructor(params: IPercentageSerialized) {
    this.value = params.value
  }

  static createFrom({ percentage }: { percentage: number }) {
    return new Percentage({ value: percentage })
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

SerializationService.registerClass(Percentage)
