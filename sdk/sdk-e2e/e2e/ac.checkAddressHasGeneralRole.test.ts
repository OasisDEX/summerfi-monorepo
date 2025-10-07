import { GeneralRoles } from '@summerfi/armada-protocol-common'
import { createAccessControlTestSetup } from './utils/accessControlTestSetup'

jest.setTimeout(300000)

/**
 * @group e2e
 */
describe('Armada Protocol - Access Control General Role Checking', () => {
  const { sdk, chainId, userAddress } = createAccessControlTestSetup()

  const role = GeneralRoles.SUPER_KEEPER_ROLE

  test('should check if address has a role', async () => {
    const shouldGrant = false
    const shouldRevoke = false

    if (shouldGrant) {
      // Grant the role if not already granted
      const grantTxInfo = await sdk.armada.accessControl.grantGeneralRole({
        chainId,
        role,
        targetAddress: userAddress,
      })
      expect(grantTxInfo).toBeDefined()
      const { governorSendTxTool } = createAccessControlTestSetup()
      const grantStatus = await governorSendTxTool(grantTxInfo)
      expect(grantStatus).toBe('success')
    }

    if (shouldRevoke) {
      // Revoke the role if it was granted
      const revokeTxInfo = await sdk.armada.accessControl.revokeGeneralRole({
        chainId,
        role,
        targetAddress: userAddress,
      })
      expect(revokeTxInfo).toBeDefined()
      const { governorSendTxTool } = createAccessControlTestSetup()
      const revokeStatus = await governorSendTxTool(revokeTxInfo)
      expect(revokeStatus).toBe('success')
    }

    const hasGeneralRole = await sdk.armada.accessControl.hasGeneralRole({
      chainId,
      role,
      targetAddress: userAddress,
    })
    console.log(
      `Address ${userAddress.value} ${hasGeneralRole ? 'has' : 'does not have'} ${role} role: `,
    )
  })
})
