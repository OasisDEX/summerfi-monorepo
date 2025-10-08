import { ContractSpecificRoleName } from '@summerfi/armada-protocol-common'
import { createAccessControlTestSetup } from './utils/accessControlTestSetup'

jest.setTimeout(300000)

/**
 * @group e2e
 */
describe('Armada Protocol - Access Control Contract Role Grant/Revoke', () => {
  const { sdk, chainId, userAddress, fleetAddress, aqAddress, governorSendTxTool } =
    createAccessControlTestSetup()

  const contractAddress = fleetAddress
  const targetAddress = aqAddress
  const role = ContractSpecificRoleName.WHITELISTED_ROLE

  test('should grant and revoke contract-specific role', async () => {
    // Check if the address has the whitelisted role initially
    const roleAddresses = await sdk.armada.accessControl.getAllAddressesWithContractSpecificRole({
      chainId,
      role,
      contractAddress: fleetAddress,
    })

    const hasRoleAtStart = roleAddresses.some(
      (address) => address.toLowerCase() === userAddress.value.toLowerCase(),
    )
    console.log(`Target address ${hasRoleAtStart ? 'has' : 'does not have'} role initially`)

    // Grant role if not already granted
    if (hasRoleAtStart === false) {
      console.log('Granting role because the address does not have it...')
      const grantTxInfo = await sdk.armada.accessControl.grantContractSpecificRole({
        chainId,
        role,
        contractAddress,
        targetAddress,
      })
      const grantStatus = await governorSendTxTool(grantTxInfo)
      expect(grantStatus).toBe('success')

      // Check addresses after grant
      const addressesAfterGrant =
        await sdk.armada.accessControl.getAllAddressesWithContractSpecificRole({
          chainId,
          role,
          contractAddress,
        })
      expect(addressesAfterGrant).toContain(userAddress.value.toLowerCase())
      console.log('Role successfully granted and verified.')
    } else {
      console.log('Address already has role, skipping grant step.')
    }

    // Revoke role
    const revokeTxInfo = await sdk.armada.accessControl.revokeContractSpecificRole({
      chainId,
      role,
      contractAddress,
      targetAddress,
    })
    const revokeStatus = await governorSendTxTool(revokeTxInfo)
    expect(revokeStatus).toBe('success')

    // Check after revoke
    const addressesAfterRevoke =
      await sdk.armada.accessControl.getAllAddressesWithContractSpecificRole({
        chainId,
        role,
        contractAddress,
      })
    expect(addressesAfterRevoke).not.toContain(userAddress.value.toLowerCase())
    console.log('Role successfully revoked and verified.')
  })
})
