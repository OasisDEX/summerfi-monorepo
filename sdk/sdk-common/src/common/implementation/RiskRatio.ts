import { SerializationService } from '../../services/SerializationService'
import { IPercentage, isPercentageData } from '../interfaces/IPercentage'
import {
  IRiskRatio,
  IRiskRatioParameters,
  RiskRatioType,
  __signature__,
} from '../interfaces/IRiskRatio'
import { Percentage } from './Percentage'

/**
 * @class RiskRatio
 * @see IRiskRatio
 */
export class RiskRatio implements IRiskRatio {
  /** SIGNATURE */
  readonly [__signature__] = __signature__

  /** ATTRIBUTES */
  readonly type: RiskRatioType
  readonly value: IPercentage | number

  private readonly ltv: IPercentage

  /** FACTORY */
  static createFrom(params: IRiskRatioParameters): RiskRatio {
    return new RiskRatio(params)
  }

  /** SEALED CONSTRUCTOR */
  private constructor(params: IRiskRatioParameters) {
    this.type = params.type

    if (isPercentageData(params.value)) {
      this.value = Percentage.createFrom(params.value)

      switch (params.type) {
        case RiskRatioType.LTV:
          this.ltv = this.value
          break
        case RiskRatioType.CollateralizationRatio:
          this.ltv = Percentage.createFrom({
            value: 100 / this.value.toProportion(),
          })
          break
        default:
          throw new Error('Invalid value type for RiskRatio type')
      }
    } else {
      this.value = params.value

      switch (params.type) {
        case RiskRatioType.Multiple:
          this.ltv = Percentage.createFrom({
            value: 100 / (1 + 1 / (this.value - 1)),
          })
          break
        default:
          throw new Error('Invalid value type for RiskRatio type')
      }
    }
  }

  /** METHODS */

  /** @see IRiskRatio.toCollateralizationRatio */
  toCollateralizationRatio(): IPercentage {
    return Percentage.createFrom({
      value: 100 / this.ltv.toProportion(),
    })
  }

  /** @see IRiskRatio.toMultiple */
  toMultiple(): number {
    const proportionLtv = this.ltv.toProportion()

    return 1 + proportionLtv / (1 - proportionLtv)
  }

  /** @see IRiskRatio.toLTV */
  toLTV(): IPercentage {
    return this.ltv
  }

  /** @see IPrintable.toString */
  toString(): string {
    return `RiskRatio: ${this.value.toString()} (type: ${this.type})`
  }
}

SerializationService.registerClass(RiskRatio)
