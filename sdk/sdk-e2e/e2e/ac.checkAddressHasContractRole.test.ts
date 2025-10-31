import { ContractSpecificRoleName } from '@summerfi/sdk-common'
import { createAdminSdkTestSetup } from './utils/createAdminSdkTestSetup'
import { TestClientIds } from './utils/testConfig'

jest.setTimeout(300000)

/**
 * @group e2e
 */
describe('Armada Protocol - Access Control Contract Role Checking', () => {
  const scenarios: {
    role: ContractSpecificRoleName
    targetAddress?: 'fleetAddress' | 'governorAddress'
    shouldGrant?: boolean
    shouldRevoke?: boolean
  }[] = [
    {
      role: ContractSpecificRoleName.COMMANDER_ROLE,
      targetAddress: 'fleetAddress',
      shouldGrant: false,
      shouldRevoke: false,
    },
    {
      role: ContractSpecificRoleName.CURATOR_ROLE,
      targetAddress: 'governorAddress',
      shouldGrant: false,
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

    it('should check contract-specific role', async () => {
      const { sdk, chainId, fleetAddress, governorAddress, governorSendTxTool } =
        createAdminSdkTestSetup(TestClientIds.ACME)
      const contractAddress = fleetAddress

      // Resolve targetAddress from key
      const targetAddress = targetAddressKey === 'fleetAddress' ? fleetAddress : governorAddress

      if (shouldGrant) {
        // Grant the role if not already granted
        const grantTxInfo = await sdk.armada.accessControl.grantContractSpecificRole({
          chainId,
          role,
          contractAddress,
          targetAddress,
        })
        expect(grantTxInfo).toBeDefined()
        const grantStatus = await governorSendTxTool(grantTxInfo)
        expect(grantStatus).toBe('success')
      }

      if (shouldRevoke) {
        // Revoke the role if it was granted
        const revokeTxInfo = await sdk.armada.accessControl.revokeContractSpecificRole({
          chainId,
          role,
          contractAddress,
          targetAddress,
        })
        expect(revokeTxInfo).toBeDefined()
        const revokeStatus = await governorSendTxTool(revokeTxInfo)
        expect(revokeStatus).toBe('success')
      }

      const hasContractSpecificRole = await sdk.armada.accessControl.hasContractSpecificRole({
        chainId,
        role,
        contractAddress,
        targetAddress,
      })

      const allRoleAddresses =
        await sdk.armada.accessControl.getAllAddressesWithContractSpecificRole({
          chainId,
          role,
          contractAddress,
        })
      console.log(`All addresses with role ${ContractSpecificRoleName[role]}:`, allRoleAddresses)

      console.log(
        `Address ${targetAddress.value} ${hasContractSpecificRole ? 'has' : 'does not have'} ${ContractSpecificRoleName[role]} for contract ${contractAddress.value}`,
      )
    })
  })
})
