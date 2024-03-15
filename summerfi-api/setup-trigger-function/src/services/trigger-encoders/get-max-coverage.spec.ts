import { getMaxCoverage } from './get-max-coverage'
import { PositionLike, PRICE_DECIMALS } from '@summerfi/triggers-shared'

describe('get-max-coverage', () => {
  it('Should return 1500 USD in USDC', () => {
    const position = {
      address: '0x123',
      debt: {
        token: {
          address: '0x456',
          decimals: 6,
        },
      },
      oraclePrices: {
        debtPrice: 1n * 10n ** PRICE_DECIMALS,
      },
    } as unknown as PositionLike
    const result = getMaxCoverage(position)
    expect(result).toEqual(1_500_000_000n)
  })
  it('Should return 1500 USD in ETH', () => {
    const position = {
      address: '0x123',
      debt: {
        token: {
          address: '0x456',
          decimals: 18,
        },
      },
      oraclePrices: {
        debtPrice: 3000n * 10n ** PRICE_DECIMALS,
      },
    } as unknown as PositionLike
    const result = getMaxCoverage(position)
    expect(result).toEqual(5n * 10n ** (18n - 1n))
  })
})
