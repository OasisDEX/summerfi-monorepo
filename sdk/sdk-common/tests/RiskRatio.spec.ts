import { RiskRatio } from '../src/common/implementation/RiskRatio'
import { Percentage } from '../src/common/implementation/Percentage'
import { RiskRatioType } from '../src/common/interfaces/IRiskRatio'
import { isPercentage } from '../src/common/interfaces/IPercentage'

describe('SDK Common | RiskRatio', () => {
  describe('#createFrom', () => {
    it('should create correct LTV risk ratio', () => {
      const riskRatio = RiskRatio.createFrom({
        value: Percentage.createFrom({ value: 80 }),
        type: RiskRatioType.LTV,
      })

      if (!isPercentage(riskRatio.value)) {
        fail('Expected value to be a percentage')
      }

      expect(riskRatio.value.value).toEqual(80)
    })

    it('should create correct CollateralizationRatio risk ratio', () => {
      const riskRatio = RiskRatio.createFrom({
        value: Percentage.createFrom({ value: 10 }),
        type: RiskRatioType.CollateralizationRatio,
      })

      if (!isPercentage(riskRatio.value)) {
        fail('Expected value to be a percentage')
      }

      expect(riskRatio.value.value).toEqual(10)
    })

    it('should create correct Multiple risk ratio', () => {
      const riskRatio = RiskRatio.createFrom({
        value: 2,
        type: RiskRatioType.Multiple,
      })

      if (typeof riskRatio.value !== 'number') {
        fail('Expected value to be a number')
      }

      expect(riskRatio.value).toEqual(2)
    })

    it('should throw an error if a number is used for LTV or CollateralizationRatio', () => {
      expect(() => {
        RiskRatio.createFrom({
          value: 2,
          type: RiskRatioType.LTV,
        })
      }).toThrow('Invalid value type for RiskRatio type')
    })

    it('should throw an error if a percentage is used for Multiple', () => {
      expect(() => {
        RiskRatio.createFrom({
          value: Percentage.createFrom({ value: 80 }),
          type: RiskRatioType.Multiple,
        })
      }).toThrow('Invalid value type for RiskRatio type')
    })

    it('should convert LTV to the other types correctly', () => {
      const riskRatio = RiskRatio.createFrom({
        value: Percentage.createFrom({ value: 80 }),
        type: RiskRatioType.LTV,
      })

      expect(riskRatio.toLTV().value).toBeCloseTo(80)
      expect(riskRatio.toCollateralizationRatio().value).toBeCloseTo(125)
      expect(riskRatio.toMultiple()).toBeCloseTo(5)
    })

    it('should convert CollateralizationRatio to the other types correctly', () => {
      const riskRatio = RiskRatio.createFrom({
        value: Percentage.createFrom({ value: 200 }),
        type: RiskRatioType.CollateralizationRatio,
      })

      expect(riskRatio.toLTV().value).toBeCloseTo(50)
      expect(riskRatio.toCollateralizationRatio().value).toBeCloseTo(200)
      expect(riskRatio.toMultiple()).toBeCloseTo(2)
    })

    it('should convert Multiple to the other types correctly', () => {
      const riskRatio = RiskRatio.createFrom({
        value: 2,
        type: RiskRatioType.Multiple,
      })

      expect(riskRatio.toLTV().value).toBeCloseTo(50)
      expect(riskRatio.toCollateralizationRatio().value).toBeCloseTo(200)
      expect(riskRatio.toMultiple()).toBeCloseTo(2)
    })
  })
})
