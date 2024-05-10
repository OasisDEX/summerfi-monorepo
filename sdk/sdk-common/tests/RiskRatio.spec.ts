import { RiskRatio } from '../src/common/implementation/RiskRatio'
import { Percentage } from '../src/common/implementation/Percentage'
import { RiskRatioType } from '../src/common/interfaces/IRiskRatio'

describe('SDK Common | RiskRatio', () => {
  describe('#createFrom', () => {
    it('should have correct ltv value', () => {
      const riskRatio = RiskRatio.createFrom({
        ratio: Percentage.createFrom({ value: 80 }),
        type: RiskRatioType.LTV,
      })

      expect(riskRatio.ratio.value).toEqual(80)
    })
  })
})
