import { InstiContractRoles, type InstiVersion } from '@summerfi/sdk-common'
import { createInstiSdkTestSetup } from './utils/createInstiSdkTestSetup'
import { TestClientIds } from './utils/testConfig'

jest.setTimeout(300000)

/**
 * @group e2e
 */
describe('Armada Protocol - Access Control Get Addresses with Contract-Specific Role', () => {
  const clientId: string = TestClientIds.ACME
  // const clientId = RwaTestConfig.clientId
  const instiVersion: InstiVersion | undefined = undefined
  // const instiVersion: InstiVersion | undefined = 'v2'

  const { sdk, chainId, fleetAddress } = createInstiSdkTestSetup({ clientId, instiVersion })
  const contractAddress = fleetAddress

  test('should get all addresses for each contract-specific role for a specific contract', async () => {
    const roles = Object.values(InstiContractRoles).filter(
      (value) => typeof value === 'number',
    ) as InstiContractRoles[]

    for (const role of roles) {
      const addresses = await sdk.armada.accessControl.getAllAddressesWithContractSpecificRole({
        chainId,
        role,
        contractAddress,
      })

      expect(Array.isArray(addresses)).toBe(true)

      console.log(
        `Role ${InstiContractRoles[role]} -> found ${addresses.length} addresses`,
        addresses,
      )
    }
  })
})
