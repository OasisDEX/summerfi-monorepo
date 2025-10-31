import { GlobalRoles } from '@summerfi/sdk-common'
import { createAdminSdkTestSetup } from './utils/createAdminSdkTestSetup'
import { TestClientIds } from './utils/testConfig'

jest.setTimeout(300000)

/**
 * @group e2e
 */
describe('Armada Protocol - Access Control Global Role Checking', () => {
  const scenarios: {
    role: GlobalRoles
    targetAddress?: 'governorAddress'
    shouldGrant?: boolean
    shouldRevoke?: boolean
  }[] = [
    {
      role: GlobalRoles.GOVERNOR_ROLE,
      targetAddress: 'governorAddress',
      shouldGrant: false,
      shouldRevoke: false,
    },
    {
      role: GlobalRoles.SUPER_KEEPER_ROLE,
      targetAddress: 'governorAddress',
      shouldGrant: true,
      shouldRevoke: false,
    },
  ]

  describe.each(scenarios)('with scenario %#', (scenario) => {
    const {
      role,
      targetAddress: targetAddressKey,
      shouldGrant = false,
      shouldRevoke = false,
    } = scenario

    it('should check if address has global role', async () => {
      const { sdk, chainId, governorAddress, governorSendTxTool } = createAdminSdkTestSetup(
        TestClientIds.ACME,
      )

      // Resolve targetAddress from key
      const targetAddress =
        targetAddressKey === 'governorAddress' ? governorAddress : governorAddress

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
    })
  })
})
