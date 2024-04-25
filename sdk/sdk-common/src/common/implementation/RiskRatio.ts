import { SerializationService } from '../../services/SerializationService'
import { Percentage } from './Percentage'
import { percentageAsFraction } from '../utils/PercentageUtils'
import { IRiskRatio, IRiskRatioData, RiskRatioType } from '../interfaces/IRiskRatio'
import { IPercentage } from '../interfaces/IPercentage'

/**
 * @class RiskRatio
 * @see IRiskRatio
 */
export class RiskRatio implements IRiskRatio {
  readonly type: RiskRatioType
  readonly ratio: IPercentage

  /** Factory method */
  static createFrom(params: IRiskRatioData): RiskRatio {
    return new RiskRatio(params)
  }

  /** Sealed constructor */
  private constructor(params: IRiskRatioData) {
    this.type = params.type

    switch (params.type) {
      case RiskRatioType.LTV:
        this.ratio = Percentage.createFrom(params.ratio)
        break
      case RiskRatioType.CollateralizationRatio:
        this.ratio = Percentage.createFrom({
          value: (1 / percentageAsFraction(params.ratio)) * 100,
        })
        break
      case RiskRatioType.Multiple:
        this.ratio = Percentage.createFrom({
          value: (1 / (1 + 1 / (params.ratio.value - 1))) * 100,
        })
        break
      default:
        throw new Error('Invalid RiskRatio type')
    }
  }

  convertTo(type: RiskRatioType): RiskRatio {
    switch (type) {
      case RiskRatioType.LTV:
        return RiskRatio.createFrom({
          type: RiskRatioType.LTV,
          ratio: this.ratio,
        })
      case RiskRatioType.CollateralizationRatio:
        return RiskRatio.createFrom({
          type: RiskRatioType.CollateralizationRatio,
          ratio: Percentage.createFrom({
            value: (1 / percentageAsFraction(this.ratio)) * 100,
          }),
        })
      case RiskRatioType.Multiple:
        return RiskRatio.createFrom({
          type: RiskRatioType.Multiple,
          ratio: Percentage.createFrom({
            value: 1 / (1 / percentageAsFraction(this.ratio) - 1) + 1,
          }),
        })
      default:
        throw new Error('RiskRatio conversion type not supported')
    }
  }

  toString(): string {
    return `${this.ratio.toString()}`
  }
}

SerializationService.registerClass(RiskRatio)
