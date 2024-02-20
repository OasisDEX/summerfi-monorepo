import { Printable } from '.'
import { Percentage, type PercentageSerialized } from './Percentage'

export type RiskRatioSerialized = {
  ratio: PercentageSerialized
}

/**
 * @class RiskRatio
 * @description Risk ratio representing the risk of position, typically the LTV
 */
export class RiskRatio implements Printable {
  public readonly ratio: Percentage

  private constructor(params: { ratio: Percentage }) {
    this.ratio = params.ratio
  }

  public static createFrom(params: { ratio: Percentage }): RiskRatio {
    return new RiskRatio(params)
  }

  public static deserialize(params: RiskRatioSerialized): RiskRatio {
    return new RiskRatio({
      ratio: Percentage.deserialize(params.ratio),
    })
  }

  toString(): string {
    return `${this.ratio.toString()}`
  }

  serialize(): RiskRatioSerialized {
    return {
      ratio: this.ratio.serialize(),
    }
  }
}
