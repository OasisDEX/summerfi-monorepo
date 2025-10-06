import { makeAdminSDK } from '@summerfi/sdk-client'
import { Address, ChainIds, getChainInfoByChainId } from '@summerfi/sdk-common'
import { GeneralRoles, ContractSpecificRoleName } from '@summerfi/armada-protocol-common'
import { SDKApiUrl, e2eWalletAddress, testWalletAddress } from './utils/testConfig'
import { createSendTransactionTool, type SendTransactionTool } from '@summerfi/testing-utils'

jest.setTimeout(300000)

/**
 * @group e2e
 */
describe('Armada Protocol - Access Control E2E Tests', () => {
  const sdk = makeAdminSDK({
    clientId: 'test-client',
    apiDomainUrl: SDKApiUrl,
  })

  const chainId = ChainIds.Base
  const permissionedFleetAddressUsdc = Address.createFromEthereum({
    value: '0x29f13a877F3d1A14AC0B15B07536D4423b35E198', // Using a known fleet address
  })

  let governorSendTxTool: SendTransactionTool

  beforeAll(async () => {
    const rpcUrl = process.env.E2E_SDK_FORK_URL_BASE
    const signerPrivateKey = process.env.E2E_USER_PRIVATE_KEY

    if (!signerPrivateKey || !rpcUrl) {
      throw new Error(
        'Environment variables E2E_USER_PRIVATE_KEY and E2E_SDK_FORK_URL_BASE must be set',
      )
    }

    governorSendTxTool = createSendTransactionTool({
      chainId: chainId,
      rpcUrl,
      signerPrivateKey,
    })
  })

  describe('Access Control API', () => {
    test('should check if address has governor role', async () => {
      const hasGeneralRole = await sdk.armada.accessControl.hasGeneralRole({
        chainId,
        role: GeneralRoles.GOVERNOR_ROLE,
        targetAddress: e2eWalletAddress,
      })
      expect(hasGeneralRole).toBe(true)
    })

    test.only('should check contract-specific role (whitelisted)', async () => {
      const shouldGrant = false
      const shouldRevoke = false

      if (shouldGrant) {
        // Grant the role if not already granted
        const grantTxInfo = await sdk.armada.accessControl.grantContractSpecificRole({
          chainId,
          role: ContractSpecificRoleName.WHITELISTED_ROLE,
          contractAddress: permissionedFleetAddressUsdc,
          targetAddress: e2eWalletAddress,
        })
        expect(grantTxInfo).toBeDefined()
        const grantStatus = await governorSendTxTool(grantTxInfo)
        expect(grantStatus).toBe('success')
      }

      if (shouldRevoke) {
        // Revoke the role if it was granted
        const revokeTxInfo = await sdk.armada.accessControl.revokeContractSpecificRole({
          chainId,
          role: ContractSpecificRoleName.WHITELISTED_ROLE,
          contractAddress: permissionedFleetAddressUsdc,
          targetAddress: e2eWalletAddress,
        })
        expect(revokeTxInfo).toBeDefined()
        const revokeStatus = await governorSendTxTool(revokeTxInfo)
        expect(revokeStatus).toBe('success')
      }

      const hasContractSpecificRole = await sdk.armada.accessControl.hasContractSpecificRole({
        chainId,
        role: ContractSpecificRoleName.WHITELISTED_ROLE,
        contractAddress: permissionedFleetAddressUsdc,
        targetAddress: Address.createFromEthereum({
          value: '0x16160cd5c54de1caba7c567c6d232c1a9d514515',
        }),
      })
      expect(hasContractSpecificRole).toBe(false)
      console.log(
        `Address ${e2eWalletAddress.value} has whitelisted role for contract ${permissionedFleetAddressUsdc.value}: ${hasContractSpecificRole}`,
      )
    })

    test('should grant and revoke governor role', async () => {
      const governorRole = GeneralRoles.GOVERNOR_ROLE
      const isGovernorBefore = await sdk.armada.accessControl.hasGeneralRole({
        chainId,
        role: governorRole,
        targetAddress: testWalletAddress,
      })

      if (isGovernorBefore === false) {
        console.log('Granting governor role because the address does not have it...')
        // Grant role by sending tx
        const grantTxInfo = await sdk.armada.accessControl.grantGeneralRole({
          chainId,
          role: governorRole,
          targetAddress: testWalletAddress,
        })
        expect(grantTxInfo).toBeDefined()
        const grantStatus = await governorSendTxTool(grantTxInfo)
        expect(grantStatus).toBe('success')
      } else {
        console.log('Address already has governor role, skipping grant step.')
      }

      // Check after grant
      const isGovernorAfterGrant = await sdk.armada.accessControl.hasGeneralRole({
        chainId,
        role: governorRole,
        targetAddress: testWalletAddress,
      })
      expect(isGovernorAfterGrant).toBe(true)

      // Revoke role
      console.log('Revoking governor role...')
      const revokeTxInfo = await sdk.armada.accessControl.revokeGeneralRole({
        chainId,
        role: governorRole,
        targetAddress: testWalletAddress,
      })
      expect(revokeTxInfo).toBeDefined()
      const revokeStatus = await governorSendTxTool(revokeTxInfo)
      expect(revokeStatus).toBe('success')

      // Check after revoke
      const isGovernorAfterRevoke = await sdk.armada.accessControl.hasGeneralRole({
        chainId,
        role: governorRole,
        targetAddress: testWalletAddress,
      })
      expect(isGovernorAfterRevoke).toBe(false)
    })

    test('should grant and revoke contract-specific role (whitelisted)', async () => {
      // Use the same fleet address as in the other tests
      const contractAddress = permissionedFleetAddressUsdc

      const isWhitelistedInitially = await sdk.armada.accessControl.hasContractSpecificRole({
        chainId,
        role: ContractSpecificRoleName.WHITELISTED_ROLE,
        contractAddress: contractAddress,
        targetAddress: testWalletAddress,
      })

      if (isWhitelistedInitially === false) {
        console.log('Granting whitelisted role because the address does not have it...')
        // Grant whitelisted role
        const grantTxInfo = await sdk.armada.accessControl.grantContractSpecificRole({
          chainId,
          role: ContractSpecificRoleName.WHITELISTED_ROLE,
          contractAddress: contractAddress,
          targetAddress: testWalletAddress,
        })
        expect(grantTxInfo).toBeDefined()
        const grantStatus = await governorSendTxTool(grantTxInfo)
        expect(grantStatus).toBe('success')

        const isWhitelistedAfterGrant = await sdk.armada.accessControl.hasContractSpecificRole({
          chainId,
          role: ContractSpecificRoleName.WHITELISTED_ROLE,
          contractAddress: contractAddress,
          targetAddress: testWalletAddress,
        })
        expect(isWhitelistedAfterGrant).toBe(true)
      } else {
        console.log('Address already has whitelisted role, skipping grant step.')
      }

      // Revoke whitelisted role
      const revokeTxInfo = await sdk.armada.accessControl.revokeContractSpecificRole({
        chainId,
        role: ContractSpecificRoleName.WHITELISTED_ROLE,
        contractAddress: contractAddress,
        targetAddress: testWalletAddress,
      })
      expect(revokeTxInfo).toBeDefined()
      const revokeStatus = await governorSendTxTool(revokeTxInfo)
      expect(revokeStatus).toBe('success')

      const isWhitelistedAfterRevoke = await sdk.armada.accessControl.hasContractSpecificRole({
        chainId,
        role: ContractSpecificRoleName.WHITELISTED_ROLE,
        contractAddress: contractAddress,
        targetAddress: testWalletAddress,
      })
      expect(isWhitelistedAfterRevoke).toBe(false)
    })

    test('should get all addresses with governor role', async () => {
      const addressesWithGovernorRole =
        await sdk.armada.accessControl.getAllAddressesWithGeneralRole({
          chainId,
          role: GeneralRoles.GOVERNOR_ROLE,
        })

      expect(Array.isArray(addressesWithGovernorRole)).toBe(true)
      expect(addressesWithGovernorRole.length).toBeGreaterThan(0)

      // The test wallet should have governor role
      const testWalletHasRole = addressesWithGovernorRole.some(
        (address) => address.toLowerCase() === e2eWalletAddress.value.toLowerCase(),
      )
      expect(testWalletHasRole).toBe(true)

      console.log(
        `Found ${addressesWithGovernorRole.length} addresses with governor role:`,
        addressesWithGovernorRole,
      )
    })

    test('should get all addresses with super keeper role', async () => {
      const addressesWithSuperKeeperRole =
        await sdk.armada.accessControl.getAllAddressesWithGeneralRole({
          chainId,
          role: GeneralRoles.SUPER_KEEPER_ROLE,
        })

      expect(Array.isArray(addressesWithSuperKeeperRole)).toBe(true)
      console.log(
        `Found ${addressesWithSuperKeeperRole.length} addresses with super keeper role:`,
        addressesWithSuperKeeperRole,
      )
    })

    test('should get all addresses with whitelisted role for specific contract', async () => {
      const contractAddress = permissionedFleetAddressUsdc

      const addressesWithWhitelistedRole =
        await sdk.armada.accessControl.getAllAddressesWithContractSpecificRole({
          chainId,
          role: ContractSpecificRoleName.WHITELISTED_ROLE,
          contractAddress: contractAddress,
        })

      expect(Array.isArray(addressesWithWhitelistedRole)).toBe(true)
      console.log(
        `Found ${addressesWithWhitelistedRole.length} addresses with whitelisted role for contract ${contractAddress.value}:`,
        addressesWithWhitelistedRole,
      )
    })

    test('should get all addresses with keeper role for specific contract', async () => {
      const contractAddress = permissionedFleetAddressUsdc

      const addressesWithKeeperRole =
        await sdk.armada.accessControl.getAllAddressesWithContractSpecificRole({
          chainId,
          role: ContractSpecificRoleName.KEEPER_ROLE,
          contractAddress: contractAddress,
        })

      expect(Array.isArray(addressesWithKeeperRole)).toBe(true)
      console.log(
        `Found ${addressesWithKeeperRole.length} addresses with keeper role for contract ${contractAddress.value}:`,
        addressesWithKeeperRole,
      )
    })

    test('should handle role changes in getAllAddressesWithGeneralRole after grant/revoke operations', async () => {
      const aqTargetRole = GeneralRoles.ADMIRALS_QUARTERS_ROLE

      // Get initial addresses with the role
      const initialAddresses = await sdk.armada.accessControl.getAllAddressesWithGeneralRole({
        chainId,
        role: aqTargetRole,
      })

      const initialCount = initialAddresses.length
      const targetAddressHasRoleInitially = initialAddresses.some(
        (address) => address.toLowerCase() === testWalletAddress.value.toLowerCase(),
      )

      console.log(`Initial addresses with ${aqTargetRole}: ${initialCount}`)
      console.log(`Target address has role initially: ${targetAddressHasRoleInitially}`)

      // Grant role if target doesn't have it
      if (!targetAddressHasRoleInitially) {
        const grantTxInfo = await sdk.armada.accessControl.grantGeneralRole({
          chainId,
          role: aqTargetRole,
          targetAddress: testWalletAddress,
        })
        const grantStatus = await governorSendTxTool(grantTxInfo)
        expect(grantStatus).toBe('success')

        // Check addresses after grant
        const addressesAfterGrant = await sdk.armada.accessControl.getAllAddressesWithGeneralRole({
          chainId,
          role: aqTargetRole,
        })

        expect(addressesAfterGrant.length).toBe(initialCount + 1)
        const targetAddressHasRoleAfterGrant = addressesAfterGrant.some(
          (address) => address.toLowerCase() === testWalletAddress.value.toLowerCase(),
        )
        expect(targetAddressHasRoleAfterGrant).toBe(true)
      }

      // Revoke role
      const revokeTxInfo = await sdk.armada.accessControl.revokeGeneralRole({
        chainId,
        role: aqTargetRole,
        targetAddress: testWalletAddress,
      })
      const revokeStatus = await governorSendTxTool(revokeTxInfo)
      expect(revokeStatus).toBe('success')

      // Check addresses after revoke
      const addressesAfterRevoke = await sdk.armada.accessControl.getAllAddressesWithGeneralRole({
        chainId,
        role: aqTargetRole,
      })

      const targetAddressHasRoleAfterRevoke = addressesAfterRevoke.some(
        (address) => address.toLowerCase() === testWalletAddress.value.toLowerCase(),
      )
      expect(targetAddressHasRoleAfterRevoke).toBe(false)

      // Should be back to initial count if we granted it, or same count if it was already revoked
      const expectedFinalCount = targetAddressHasRoleInitially ? initialCount - 1 : initialCount
      expect(addressesAfterRevoke.length).toBe(expectedFinalCount)
    })
  })
})
