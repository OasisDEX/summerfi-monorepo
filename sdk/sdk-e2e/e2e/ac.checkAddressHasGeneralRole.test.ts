import { GeneralRoles } from '@summerfi/armada-protocol-common'
import { createAdminSdkTestSetup } from './utils/accessControlTestSetup'

jest.setTimeout(300000)

/**
 * @group e2e
 */
describe('Armada Protocol - Access Control General Role Checking', () => {
  const { sdk, chainId, governorAddress, governorSendTxTool } = createAdminSdkTestSetup()

  const targetAddress = governorAddress
  const role = GeneralRoles.GOVERNOR_ROLE

  test('should check if address has a role', async () => {
    const shouldGrant = false
    const shouldRevoke = false

    if (shouldGrant) {
      // Grant the role if not already granted
      const grantTxInfo = await sdk.armada.accessControl.grantGeneralRole({
        chainId,
        role,
        targetAddress,
      })
      expect(grantTxInfo).toBeDefined()
      const grantStatus = await governorSendTxTool(grantTxInfo)
      expect(grantStatus).toBe('success')
    }

    if (shouldRevoke) {
      // Revoke the role if it was granted
      const revokeTxInfo = await sdk.armada.accessControl.revokeGeneralRole({
        chainId,
        role,
        targetAddress,
      })
      expect(revokeTxInfo).toBeDefined()
      const revokeStatus = await governorSendTxTool(revokeTxInfo)
      expect(revokeStatus).toBe('success')
    }

    const hasGeneralRole = await sdk.armada.accessControl.hasGeneralRole({
      chainId,
      role,
      targetAddress,
    })
    console.log(
      `Address ${targetAddress.value} ${hasGeneralRole ? 'has' : 'does not have'} ${role} role`,
    )
  })
})
