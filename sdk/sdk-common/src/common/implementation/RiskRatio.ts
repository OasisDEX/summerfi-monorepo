import { SerializationService } from '../../services/SerializationService'
import { Percentage } from './Percentage'
import { percentageAsFraction } from '../utils/PercentageUtils'

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
      case RiskRatioType.CollateralizationRatio: {
        const ltv = Percentage.createFrom({ percentage: (1 / percentageAsFraction(params.ratio)) * 100 })
        return new RiskRatio({ ltv })
      }
      case RiskRatioType.Multiple:
        const ltv = Percentage.createFrom({percentage: 1 / (1 + ( 1 / (params.ratio.value - 1) )) * 100})
        return new RiskRatio({ ltv })
      default:
        throw new Error('Invalid RiskRatio type')
    }
  }

  toString(): string {
    return `${this.ltv.toString()}`
  }

  toType(type: RiskRatioType): string {
    switch (type) {
      case RiskRatioType.LTV:
        return this.ltv.toString()
      case RiskRatioType.CollateralizationRatio:
        return Percentage.createFrom({ percentage: 1 / percentageAsFraction(this.ltv) * 100 }).toString()
      case RiskRatioType.Multiple:
        return Percentage.createFrom({ percentage: 1 / (1 / percentageAsFraction(this.ltv) - 1) + 1 }).toString()
      default:
        throw new Error('Invalid RiskRatio type')
    }
  }
}

SerializationService.registerClass(RiskRatio)
