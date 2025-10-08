import { GeneralRoles } from '@summerfi/armada-protocol-common'
import { createAccessControlTestSetup } from './utils/accessControlTestSetup'

jest.setTimeout(300000)

/**
 * @group e2e
 */
describe('Armada Protocol - Access Control General Role Grant/Revoke', () => {
  const { sdk, chainId, userAddress, aqAddress, governorSendTxTool } =
    createAccessControlTestSetup()

  const targetAddress = aqAddress
  const role = GeneralRoles.ADMIRALS_QUARTERS_ROLE

  test('should grant and revoke general role', async () => {
    // Get initial addresses with the role
    const roleAddresses = await sdk.armada.accessControl.getAllAddressesWithGeneralRole({
      chainId,
      role,
    })

    const hasRoleAtStart = roleAddresses.some(
      (address) => address.toLowerCase() === userAddress.value.toLowerCase(),
    )
    console.log(`Target address ${hasRoleAtStart ? 'has' : 'does not have'} role initially`)

    // Grant role if target doesn't have it
    if (!hasRoleAtStart) {
      console.log('Granting role because the address does not have it...')
      const grantTxInfo = await sdk.armada.accessControl.grantGeneralRole({
        chainId,
        role,
        targetAddress,
      })
      const grantStatus = await governorSendTxTool(grantTxInfo)
      expect(grantStatus).toBe('success')

      // Check addresses after grant
      const addressesAfterGrant = await sdk.armada.accessControl.getAllAddressesWithGeneralRole({
        chainId,
        role: role,
      })
      expect(addressesAfterGrant).toContain(userAddress.value.toLowerCase())
      console.log('Role successfully granted and verified.')
    } else {
      console.log('Address already has role, skipping grant step.')
    }

    // Revoke role
    const revokeTxInfo = await sdk.armada.accessControl.revokeGeneralRole({
      chainId,
      role,
      targetAddress,
    })
    const revokeStatus = await governorSendTxTool(revokeTxInfo)
    expect(revokeStatus).toBe('success')

    // Check addresses after revoke
    const addressesAfterRevoke = await sdk.armada.accessControl.getAllAddressesWithGeneralRole({
      chainId,
      role: role,
    })
    expect(addressesAfterRevoke).not.toContain(userAddress.value.toLowerCase())
    console.log('Role successfully revoked and verified.')
  })
})
