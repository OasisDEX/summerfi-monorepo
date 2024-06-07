import { Percentage } from '../src'

describe('SDK Common | Percentage', () => {
  describe('#createFrom()', () => {
    it('should instantiate with right data', () => {
      const percentage = Percentage.createFrom({
        value: 0.1,
      })

      expect(percentage.value).toBeCloseTo(0.1)
    })
  })

  describe('#add()', () => {
    it('should add the percentages', () => {
      const percentage = Percentage.createFrom({
        value: 0.1,
      })

      const percentage2 = Percentage.createFrom({
        value: 0.2,
      })

      const result = percentage.add(percentage2)

      expect(result.value).toBeCloseTo(0.3)
    })
  })

  describe('#subtract()', () => {
    it('should subtract the percentages', () => {
      const percentage = Percentage.createFrom({
        value: 0.2,
      })

      const percentage2 = Percentage.createFrom({
        value: 0.1,
      })

      const result = percentage.subtract(percentage2)

      expect(result.value).toBeCloseTo(0.1)
    })
  })

  describe('#multiply()', () => {
    it('should multiply the percentages', () => {
      const percentage = Percentage.createFrom({
        value: 10,
      })

      const percentage2 = Percentage.createFrom({
        value: 50,
      })

      const result = percentage.multiply(percentage2)

      expect(result.value).toBeCloseTo(5)
    })

    it('should multiply the percentage by a number', () => {
      const percentage = Percentage.createFrom({
        value: 0.1,
      })

      const result = percentage.multiply(2)

      expect(result.value).toBeCloseTo(0.2)
    })

    it('should multiply the percentage by a string number', () => {
      const percentage = Percentage.createFrom({
        value: 0.1,
      })

      const result = percentage.multiply('2')

      expect(result.value).toBeCloseTo(0.2)
    })
  })

  describe('#divide()', () => {
    it('should divide the percentages', () => {
      const percentage = Percentage.createFrom({
        value: 10,
      })

      const percentage2 = Percentage.createFrom({
        value: 50,
      })

      const result = percentage.divide(percentage2)

      expect(result.value).toBeCloseTo(20)
    })

    it('should divide the percentage by a number', () => {
      const percentage = Percentage.createFrom({
        value: 0.2,
      })

      const result = percentage.divide(2)

      expect(result.value).toBeCloseTo(0.1)
    })

    it('should divide the percentage by a string number', () => {
      const percentage = Percentage.createFrom({
        value: 0.2,
      })

      const result = percentage.divide('2')

      expect(result.value).toBeCloseTo(0.1)
    })
  })

  describe('#toProportion()', () => {
    it('should return the proportion', () => {
      const percentage = Percentage.createFrom({
        value: 20,
      })

      const result = percentage.toProportion()

      expect(result).toBeCloseTo(0.2)
    })
  })

  describe('#toBaseUnit()', () => {
    it('should return the base unit', () => {
      const percentage = Percentage.createFrom({
        value: 20,
      })

      const result = percentage.toBaseUnit({ decimals: 4 })

      expect(result).toEqual('2000')
    })
  })

  describe('#toString()', () => {
    it('should return the string representation', () => {
      const percentage = Percentage.createFrom({
        value: 20,
      })

      expect(percentage.toString()).toEqual('20%')
    })
  })

  describe('#toComplement()', () => {
    it('should return the complement (100-x) of the percentage', () => {
      const percentage = Percentage.createFrom({
        value: 20,
      })

      const complementPercentage = percentage.toComplement()

      expect(complementPercentage.value).toEqual(80)
    })
  })
})
