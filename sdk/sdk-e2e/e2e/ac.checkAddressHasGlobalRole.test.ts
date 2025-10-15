import { GlobalRoles } from '@summerfi/sdk-common'
import { createAdminSdkTestSetup } from './utils/accessControlTestSetup'
import type { GlobalRoleScenario } from './utils/types'

jest.setTimeout(300000)

/**
 * @group e2e
 */
describe('Armada Protocol - Access Control Global Role Checking', () => {
  const { sdk, chainId, userAddress, governorAddress, governorSendTxTool } =
    createAdminSdkTestSetup()

  // Configure test scenarios here
  const scenarios: GlobalRoleScenario[] = [
    {
      role: GlobalRoles.GOVERNOR_ROLE,
      targetAddress: governorAddress,
      shouldGrant: false,
      shouldRevoke: false,
    },
    {
      role: GlobalRoles.SUPER_KEEPER_ROLE,
      targetAddress: governorAddress,
      shouldGrant: true,
      shouldRevoke: false,
    },
  ]

  test.each(scenarios)(
    'should check if address has global role: $role',
    async ({ role, targetAddress, shouldGrant = false, shouldRevoke = false }) => {
      if (shouldGrant) {
        // Grant the role if not already granted
        const grantTxInfo = await sdk.armada.accessControl.grantGlobalRole({
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
        const revokeTxInfo = await sdk.armada.accessControl.revokeGlobalRole({
          chainId,
          role,
          targetAddress,
        })
        expect(revokeTxInfo).toBeDefined()
        const revokeStatus = await governorSendTxTool(revokeTxInfo)
        expect(revokeStatus).toBe('success')
      }

      const hasGlobalRole = await sdk.armada.accessControl.hasGlobalRole({
        chainId,
        role,
        targetAddress,
      })
      console.log(
        `Address ${targetAddress.value} ${hasGlobalRole ? 'has' : 'does not have'} ${role} role`,
      )
    },
  )
})
