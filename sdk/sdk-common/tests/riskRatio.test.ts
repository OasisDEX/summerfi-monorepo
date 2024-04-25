import { RiskRatio } from '../src/common/implementation/RiskRatio'
import { Percentage } from '../src/common/implementation/Percentage'
import { RiskRatioType } from '../src/common/interfaces/IRiskRatio'

describe('RiskRatio', () => {
  describe('RiskRatio', () => {
    describe('creates risk ratio from ltv', () => {
      it('should have correct ltv value', () => {
        const riskRatio = RiskRatio.createFrom({
          ratio: Percentage.createFrom({ value: 80 }),
          type: RiskRatioType.LTV,
        })

        expect(riskRatio.ratio.value).toEqual(80)
      })
    })
  })
})
