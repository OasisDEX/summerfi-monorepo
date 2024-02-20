import { Printable } from './Printable'

export type PercentageSerialized = {
  percentage: number
}

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

  static deserialize(params: PercentageSerialized) {
    return new Percentage(params)
  }

  toString(): string {
    return `${this.value}`
  }

  add(percentage: Percentage): Percentage {
    return Percentage.createFrom({ percentage: this.value + percentage.value })
  }

  serialize(): PercentageSerialized {
    return { percentage: this.value }
  }
}
