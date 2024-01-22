import { Percentage, PercentageType } from '~sdk/common'

export class PercentageBaseImpl implements Percentage {
  public readonly value: number
  public readonly type: PercentageType

  constructor(params: { value: number; type: PercentageType }) {
    this.value = params.value
    this.type = params.type
  }

  static fromNormalized(value: number) {
    return new PercentageBaseImpl({ value, type: PercentageType.Proportion })
  }
  static fromAbsolute(value: number) {
    return new PercentageBaseImpl({ value, type: PercentageType.Percentage })
  }

  toString(): string {
    return this.type === PercentageType.Proportion ? `${this.value * 100.0}%` : `%{value}%`
  }
}
