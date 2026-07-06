import { getManagementFee } from '@/helpers/get-management-fee'

describe('getManagementFee', () => {
  it('returns the stablecoin fee (1%) for a symbol containing USD', () => {
    expect(getManagementFee('USDC')).toBe(0.01)
  })

  it('returns the stablecoin fee (1%) for a symbol containing EUR', () => {
    expect(getManagementFee('EURC')).toBe(0.01)
  })

  it('returns the non-stablecoin fee (0.3%) for any other symbol', () => {
    expect(getManagementFee('WETH')).toBe(0.003)
  })

  it('is case-sensitive: lowercase "usd"/"eur" do not match the stablecoin check', () => {
    expect(getManagementFee('usdc')).toBe(0.003)
  })

  it('returns the non-stablecoin fee for an empty symbol', () => {
    expect(getManagementFee('')).toBe(0.003)
  })
})
