import { ContractSpecificRoleName } from '@summerfi/armada-protocol-common'
import { createAccessControlTestSetup } from './utils/accessControlTestSetup'

jest.setTimeout(300000)

/**
 * @group e2e
 */
describe('Armada Protocol - Access Control Contract Role Checking', () => {
  const { sdk, chainId, userAddress, fleetAddress, governorSendTxTool } =
    createAccessControlTestSetup()

  const role = ContractSpecificRoleName.WHITELISTED_ROLE // 3

  test('should check contract-specific role', async () => {
    const shouldGrant = false
    const shouldRevoke = false

    if (shouldGrant) {
      // Grant the role if not already granted
      const grantTxInfo = await sdk.armada.accessControl.grantContractSpecificRole({
        chainId,
        role,
        contractAddress: fleetAddress,
        targetAddress: userAddress,
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
        contractAddress: fleetAddress,
        targetAddress: userAddress,
      })
      expect(revokeTxInfo).toBeDefined()
      const revokeStatus = await governorSendTxTool(revokeTxInfo)
      expect(revokeStatus).toBe('success')
    }

    const hasContractSpecificRole = await sdk.armada.accessControl.hasContractSpecificRole({
      chainId,
      role,
      contractAddress: fleetAddress,
      targetAddress: userAddress,
    })
    console.log(
      `Address ${userAddress.value} ${hasContractSpecificRole ? 'has' : 'does not have'} ${ContractSpecificRoleName[role]} for contract ${fleetAddress.value}`,
    )
  })
})
