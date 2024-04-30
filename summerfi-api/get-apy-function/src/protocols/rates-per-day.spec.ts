import { getRatesPerDay } from './rates-per-day'
import { InterestRate } from './types'

describe('getRatesPerDay', () => {
  it('Should return empty map if rates are empty', () => {
    const rates: InterestRate[] = []
    const result = getRatesPerDay(rates)
    expect(result.size).toBe(0)
  })
  it('Should return map with one day if rates are for one day', () => {
    const rates = [
      {
        fromTimestamp: 1713795083,
        toTimestamp: 1713816767,
        rate: 0.01,
        duration: 21684,
      },
    ] as InterestRate[]
    const result = getRatesPerDay(rates)
    expect(result.size).toBe(1)
    expect(result.get('2024-4-22')?.rates).toEqual([{ ...rates[0], rate: 1 }])
  })

  it('Should return map with rates properly split for each day', () => {
    const rates = [
      {
        fromTimestamp: 1713795083,
        toTimestamp: 1713816767,
        rate: 0.01,
        duration: 21684,
      },
      {
        fromTimestamp: 1713816767,
        toTimestamp: 1713838463,
        duration: 21684,
        rate: 0.02,
      },
      {
        fromTimestamp: 1713838463,
        toTimestamp: 1713860135,
        duration: 21672,
        rate: 0.03,
      },
    ] as InterestRate[]
    const result = getRatesPerDay(rates)
    expect(result.size).toBe(2)
    expect(result.get('2024-4-22')?.rates).toEqual([
      { ...rates[0], rate: 1 },
      { ...rates[1], rate: 2, toTimestamp: 1713830399, duration: 13632 },
    ])
    expect(result.get('2024-4-22')?.averageRate.toFixed(4)).toEqual('1.3860')
    expect(result.get('2024-4-23')?.rates).toEqual([
      { ...rates[1], rate: 2, fromTimestamp: 1713830400, duration: 8063 },
      { ...rates[2], rate: 3 },
    ])
  })

  it('Should return map with one rate split for 3 days', () => {
    const rates = [
      {
        fromTimestamp: 1713795083,
        toTimestamp: 1713946535,
        rate: 0.01,
      },
    ] as InterestRate[]
    const result = getRatesPerDay(rates)
    expect(result.size).toBe(3)
    expect(result.get('2024-4-22')?.rates).toEqual([
      { ...rates[0], rate: 1, toTimestamp: 1713830399, duration: 35316 },
    ])
    expect(result.get('2024-4-22')?.averageRate).toEqual(1)
    expect(result.get('2024-4-23')?.rates).toEqual([
      { ...rates[0], rate: 1, fromTimestamp: 1713830400, toTimestamp: 1713916799, duration: 86399 },
    ])
    expect(result.get('2024-4-23')?.averageRate).toEqual(1)
    expect(result.get('2024-4-24')?.rates).toEqual([
      { ...rates[0], rate: 1, fromTimestamp: 1713916800, duration: 29735 },
    ])
    expect(result.get('2024-4-24')?.averageRate).toEqual(1)
  })
})
