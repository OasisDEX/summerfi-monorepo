import { RiskRatio, Percentage } from '~sdk/common'

export class RiskRatioBaseImpl implements RiskRatio {
  public readonly ratio: Percentage

  constructor(params: { ratio: Percentage }) {
    this.ratio = params.ratio
  }

  public static fromPercentage(params: { ratio: Percentage }): RiskRatio {
    return new RiskRatioBaseImpl(params)
  }
}
