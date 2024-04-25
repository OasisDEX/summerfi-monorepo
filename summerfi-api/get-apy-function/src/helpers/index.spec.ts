import { getDate, getTimestamp } from './index'

describe('helpers', () => {
  it('Should return epoch timestamp when pass a date in yyyy-m-dd format', () => {
    const date = '2024-4-22'
    const result = getTimestamp(date)
    expect(result).toBe(1713744000)
  })

  it('Should return epoch timestamp when pass a date', () => {
    const date = new Date(Date.UTC(2024, 3, 22))
    const result = getTimestamp(date)
    expect(result).toBe(1713744000)
  })

  it('Should return UTC date when pass a short date', () => {
    const shortDate = '2024-4-22'
    const result = getDate(shortDate)
    expect(result).toEqual(new Date(Date.UTC(2024, 3, 22)))
  })
})
