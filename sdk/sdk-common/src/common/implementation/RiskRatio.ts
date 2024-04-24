import { SerializationService } from '../../services/SerializationService'
import { Percentage } from './Percentage'
import { percentageAsFraction } from '../utils/PercentageUtils'
import { IRiskRatio, RiskRatioType } from '../interfaces/IRiskRatio'

/**
 * @class RiskRatio
 * @see IRiskRatio
 */
export class RiskRatio implements IRiskRatio {
  readonly type: RiskRatioType
  readonly ratio: Percentage

  private constructor(params: IRiskRatio) {
    this.type = params.type
    this.ratio = Percentage.createFrom(params.ratio)
  }

  static type = RiskRatioType

  static createFrom(params: IRiskRatio): RiskRatio {
    switch (params.type) {
      case RiskRatioType.LTV:
        return new RiskRatio(params)
      case RiskRatioType.CollateralizationRatio: {
        const ratio = Percentage.createFrom({
          value: (1 / percentageAsFraction(params.ratio)) * 100,
        })
        return new RiskRatio({ ...params, ratio })
      }
      case RiskRatioType.Multiple: {
        const ratio = Percentage.createFrom({
          value: (1 / (1 + 1 / (params.ratio.value - 1))) * 100,
        })
        return new RiskRatio({ ...params, ratio })
      }
      default:
        throw new Error('Invalid RiskRatio type')
    }
  }

  toString(): string {
    return `${this.ratio.toString()}`
  }

  convertTo(type: RiskRatioType): string {
    switch (type) {
      case RiskRatioType.LTV:
        return this.ratio.toString()
      case RiskRatioType.CollateralizationRatio:
        return Percentage.createFrom({
          value: (1 / percentageAsFraction(this.ratio)) * 100,
        }).toString()
      case RiskRatioType.Multiple:
        return Percentage.createFrom({
          value: 1 / (1 / percentageAsFraction(this.ratio) - 1) + 1,
        }).toString()
      default:
        throw new Error('Invalid RiskRatio type')
    }
  }
}

SerializationService.registerClass(RiskRatio)
