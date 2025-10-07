import { GeneralRoles } from '@summerfi/armada-protocol-common'
import { createAccessControlTestSetup } from './utils/accessControlTestSetup'

jest.setTimeout(300000)

/**
 * @group e2e
 */
describe('Armada Protocol - Access Control Get Addresses with General Role', () => {
  const { sdk, chainId } = createAccessControlTestSetup()

  test('should get all addresses for each general role', async () => {
    const roles = Object.values(GeneralRoles) as GeneralRoles[]

    for (const role of roles) {
      const addresses = await sdk.armada.accessControl.getAllAddressesWithGeneralRole({
        chainId,
        role,
      })

      expect(Array.isArray(addresses)).toBe(true)

      console.log(`Role ${role} -> found ${addresses.length} addresses`, addresses)
    }
  })
})
