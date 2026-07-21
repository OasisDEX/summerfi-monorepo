import { humanizeFleetName } from './fleet-name'

describe('humanizeFleetName', () => {
  it('parses the LazyVault convention', () => {
    expect(humanizeFleetName(1, 'LazyVault_LowerRisk_USDT')).toBe('USDT Ethereum Lower Risk')
  })

  it('uses the chain label', () => {
    expect(humanizeFleetName(8453, 'LazyVault_HigherRisk_ETH')).toBe('ETH Base Higher Risk')
  })

  it('falls back to the raw name when the convention does not match', () => {
    expect(humanizeFleetName(1, 'SomeVault')).toBe('SomeVault')
    expect(humanizeFleetName(1, '')).toBe('')
  })
})
