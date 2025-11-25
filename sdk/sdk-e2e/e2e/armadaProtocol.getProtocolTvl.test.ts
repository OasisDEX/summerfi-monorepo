import { createSdkTestSetup } from './utils/createSdkTestSetup'

jest.setTimeout(300000)

/**
 * @group e2e
 */
describe('Armada Protocol - getProtocolTvl', () => {
  it('should get total protocol TVL across all chains', async () => {
    const { sdk } = createSdkTestSetup()

    console.log('Fetching total protocol TVL...')

    const totalTvl = await sdk.armada.users.getProtocolTvl()

    console.log(`Total Protocol TVL: $${totalTvl.toLocaleString()}`)

    // Verify the result is a number and greater than or equal to 0
    expect(typeof totalTvl).toBe('number')
    expect(totalTvl).toBeGreaterThanOrEqual(0)
    expect(isNaN(totalTvl)).toBe(false)
  })
})
