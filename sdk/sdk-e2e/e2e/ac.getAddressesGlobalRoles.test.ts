import { GlobalRoles, type InstiVersion } from '@summerfi/sdk-common'
import { createInstiSdkTestSetup } from './utils/createInstiSdkTestSetup'
import { TestClientIds } from './utils/testConfig'

jest.setTimeout(300000)

/**
 * @group e2e
 */
describe('Armada Protocol - Access Control Get Addresses with General Role', () => {
  const clientId: string = TestClientIds.ACME
  const instiVersion: InstiVersion | undefined = undefined
  // const instiVersion: InstiVersion | undefined = 'v2'

  const { sdk, chainId } = createInstiSdkTestSetup({ clientId, instiVersion })

  test('should get all addresses for each general role', async () => {
    const roles = Object.values(GlobalRoles) as GlobalRoles[]

    for (const role of roles) {
      const addresses = await sdk.armada.accessControl.getAllAddressesWithGlobalRole({
        chainId,
        role,
      })

      expect(Array.isArray(addresses)).toBe(true)

      console.log(`Role ${role} -> found ${addresses.length} addresses`, addresses)
    }
  })
})
