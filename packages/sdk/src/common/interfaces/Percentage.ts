import { Printable } from './Printable'

/**
 * @class Percentage
 * @description Represents a percentage
 */
export class Percentage implements Printable {
  public readonly value: number

  private constructor(params: { value: number }) {
    this.value = params.value
  }

  static createFrom(percentage: number) {
    return new Percentage({ value: percentage })
  }

  toString(): string {
    return `${this.value}%`
  }
}
