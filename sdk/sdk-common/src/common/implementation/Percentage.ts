import { SerializationManager } from '~sdk-common/common/managers'

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
}

SerializationManager.registerClass(Percentage)
