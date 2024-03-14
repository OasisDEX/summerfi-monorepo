import { getMorphoBlueApiClient, MetaMorphoAllocations, MorphoBlueApiClient } from '.'
import { Logger } from '@aws-lambda-powertools/logger'
import { Address } from '@summerfi/serverless-shared'

const logger = new Logger({
  serviceName: 'moorpho-blue-external-api-client-tests',
  environment: 'dev',
  logLevel: 'debug',
})

/**
 * This test is an exploration test for the Morpho Blue External API Client. No need to run it on every build.
 */
describe.skip('Exploration test for Morpho Blue External API Client', () => {
  let client: MorphoBlueApiClient
  const steakhouseUSDC: Address = '0xBEEF01735c132Ada46AA9aA4c54623cAA92A64CB'
  const wstETH_USDC_market = '0xb323495f7e4148be5643a4ea4a8221eef163e4bccfdedc2a6f4696baacbc86cc'
  let allocationResult: MetaMorphoAllocations[]
  beforeAll(async () => {
    client = getMorphoBlueApiClient({ logger: logger })
    allocationResult = await client.allocations({ metaMorphoAddresses: [steakhouseUSDC] })
  })

  it('should return data for steakhouseUSDC', () => {
    const result = allocationResult.find((a) => a.vault.address === steakhouseUSDC)

    expect(result).toBeDefined()
  })

  it('should return only two allocations for steakhouseUSDC (Date: 2024-03-12)', () => {
    const allocations = allocationResult.find(
      (a) => a.vault.address === steakhouseUSDC,
    )?.allocations

    expect(allocations).toHaveLength(2)
  })
  it('Should return allocations that sum up to nearly 10_000 for Steakhouse USDC. (Date: 2024-03-12)', () => {
    const allocations = allocationResult.find(
      (a) => a.vault.address === steakhouseUSDC,
    )?.allocations
    const sum = allocations?.reduce((acc, a) => acc + a.allocation, 0)

    // even on Morpho Blue website the sum is not 100%
    expect(sum).toBeGreaterThanOrEqual(0.9999)
    expect(sum).toBeLessThanOrEqual(1.001)
  })
  it('should return the biggest allocation in wstETH market (86,57%) for steakhouseUSDC (Date: 2024-03-12)', () => {
    const allocations = allocationResult.find(
      (a) => a.vault.address === steakhouseUSDC,
    )?.allocations
    const wstETHAllocation = allocations?.find((a) => a.market.marketId === wstETH_USDC_market)

    expect(wstETHAllocation?.allocation).toBe(0.8805)
  })
})
