import { ContractSpecificRoleName } from '@summerfi/sdk-common'
import { createAdminSdkTestSetup } from './utils/createAdminSdkTestSetup'
import { TestClientIds } from './utils/testConfig'

jest.setTimeout(300000)

/**
 * @group e2e
 */
describe('Armada Protocol - Access Control Get Addresses with Contract-Specific Role', () => {
  const { sdk, chainId, fleetAddress } = createAdminSdkTestSetup(TestClientIds.ACME)
  const contractAddress = fleetAddress

  test('should get all addresses for each contract-specific role for a specific contract', async () => {
    const roles = Object.values(ContractSpecificRoleName).filter(
      (value) => typeof value === 'number',
    ) as ContractSpecificRoleName[]

    for (const role of roles) {
      const addresses = await sdk.armada.accessControl.getAllAddressesWithContractSpecificRole({
        chainId,
        role,
        contractAddress,
      })

      expect(Array.isArray(addresses)).toBe(true)

      console.log(
        `Role ${ContractSpecificRoleName[role]} -> found ${addresses.length} addresses`,
        addresses,
      )
    }
  })
})
