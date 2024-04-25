import { SerializationService } from '../../services/SerializationService'
import { Percentage } from './Percentage'
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

    const originalRatio = Percentage.createFrom(params.ratio)

    switch (params.type) {
      case RiskRatioType.LTV:
        this.ratio = originalRatio
        break
      case RiskRatioType.CollateralizationRatio:
        this.ratio = Percentage.createFrom({
          value: 1 / originalRatio.toProportion(),
        })
        break
      case RiskRatioType.Multiple:
        this.ratio = Percentage.createFrom({
          value: 1 / (1 + 1 / (originalRatio.value - 1)),
        })
        break
      default:
        throw new Error('RiskRatio type not implemented')
    }
  }

  toString(): string {
    return `${this.ratio.toString()}`
  }
}

SerializationService.registerClass(RiskRatio)
