import { Printable } from '.'
import { Percentage } from './Percentage'

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

  toString(): string {
    return `${this.ratio.toString()}`
  }
}
