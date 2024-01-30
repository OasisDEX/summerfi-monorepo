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
    return `${this.value}%`
  }
}
