import {
  defaultSumrMarketCap,
  getMarketCapIndexByValue,
  sumrMarketCapOptions,
} from '@/helpers/sumr-market-cap'

describe('sumr-market-cap', () => {
  it('defaults to the second option (250 million)', () => {
    expect(defaultSumrMarketCap).toBe('250000000')
    expect(defaultSumrMarketCap).toBe(sumrMarketCapOptions[1])
  })

  describe('getMarketCapIndexByValue', () => {
    it('returns the matching index for a known value', () => {
      expect(getMarketCapIndexByValue('150000000')).toBe(0)
      expect(getMarketCapIndexByValue('250000000')).toBe(1)
      expect(getMarketCapIndexByValue('500000000')).toBe(2)
      expect(getMarketCapIndexByValue('750000000')).toBe(3)
    })

    it('falls back to index 1 (the default) for an unknown value', () => {
      expect(getMarketCapIndexByValue('999999999')).toBe(1)
    })

    it('falls back to index 1 when no value is provided', () => {
      expect(getMarketCapIndexByValue(undefined)).toBe(1)
      expect(getMarketCapIndexByValue()).toBe(1)
    })
  })
})
