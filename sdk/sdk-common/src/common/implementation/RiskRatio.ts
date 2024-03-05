import { Percentage } from '~sdk-common/common/implementation/Percentage'
import { SerializationService } from '~sdk-common/services/SerializationService'

interface IRiskRatioSerialized {
  ltv: Percentage
}

enum RiskRatioType {
  LTV = 'LTV',
  CollateralizationRatio = 'CollateralizationRatio',
  Multiple = 'Multiple',
}

/**
 * @class RiskRatio
 * @description Risk ratio representing the risk of position, 
 */
export class RiskRatio implements IRiskRatioSerialized {
  readonly ltv: Percentage

  private constructor(params: IRiskRatioSerialized) {
    this.ltv = params.ltv
  }

  static type = RiskRatioType

  static createFrom(params: { ratio: Percentage, type: RiskRatioType }): RiskRatio {
    switch (params.type) {
      case RiskRatioType.LTV:
        return new RiskRatio({ ltv: params.ratio })
      case RiskRatioType.CollateralizationRatio:
        const ltv = Percentage.createFrom({ percentage: 1 / params.ratio.value })
        return new RiskRatio({ ltv })
      case RiskRatioType.Multiple:
        throw new Error('Multiple not implemented')
        // return new RiskRatio(params)
      default:
        throw new Error('Invalid RiskRatio type')
    }
  }

  toString(): string {
    return `${this.ltv.toString()}`
  }
}

SerializationService.registerClass(RiskRatio)
