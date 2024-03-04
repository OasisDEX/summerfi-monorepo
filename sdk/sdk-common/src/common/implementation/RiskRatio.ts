import { type Percentage } from '~sdk-common/common/implementation/Percentage'
import { SerializationService } from '~sdk-common/services/SerializationService'

interface IRiskRatioSerialized {
  ratio: Percentage
}

/**
 * @class RiskRatio
 * @description Risk ratio representing the risk of position, typically the LTV
 */
export class RiskRatio implements IRiskRatioSerialized {
  readonly ratio: Percentage

  private constructor(params: IRiskRatioSerialized) {
    this.ratio = params.ratio
  }

  static createFrom(params: { ratio: Percentage }): RiskRatio {
    return new RiskRatio(params)
  }

  toString(): string {
    return `${this.ratio.toString()}`
  }
}

SerializationService.registerClass(RiskRatio)
