import { makeAdminSDK } from '@summerfi/sdk-client'
import { Address, ChainIds, getChainInfoByChainId } from '@summerfi/sdk-common'
import { GeneralRoles, ContractSpecificRoleName } from '@summerfi/armada-protocol-common'
import { SDKApiUrl, testWalletAddress, privWalletAddress } from './utils/testConfig'
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
  const permissionedFleetAddress = Address.createFromEthereum({
    value: '0x98c49e13bf99d7cad8069faa2a370933ec9ecf17', // Using a known fleet address
  })

  let governorSendTxTool: SendTransactionTool

  beforeAll(async () => {
    const signerPrivateKey = process.env.E2E_USER_PRIVATE_KEY
    const rpcUrl = process.env.E2E_SDK_FORK_URL_BASE
    if (!signerPrivateKey || !rpcUrl) {
      throw new Error(
        'Environment variables E2E_USER_PRIVATE_KEY and E2E_SDK_FORK_URL_BASE must be set',
      )
    }

    governorSendTxTool = createSendTransactionTool({
      chainInfo: getChainInfoByChainId(chainId),
      rpcUrl,
      signerPrivateKey,
    })
  })

  describe('Access Control API', () => {
    test('should check if address has governor role', async () => {
      const hasGeneralRole = await sdk.armada.accessControl.hasGeneralRole({
        chainId,
        role: GeneralRoles.GOVERNOR_ROLE,
        targetAddress: testWalletAddress,
      })
      expect(hasGeneralRole).toBe(true)
    })

    test('should check contract-specific role (whitelisted)', async () => {
      const hasContractSpecificRole = await sdk.armada.accessControl.hasContractSpecificRole({
        chainId,
        role: ContractSpecificRoleName.WHITELISTED_ROLE,
        contractAddress: permissionedFleetAddress,
        targetAddress: testWalletAddress,
      })
      expect(hasContractSpecificRole).toBe(false)
    })

    test('should grant and revoke governor role', async () => {
      const governorRole = GeneralRoles.GOVERNOR_ROLE
      const isGovernorBefore = await sdk.armada.accessControl.hasGeneralRole({
        chainId,
        role: governorRole,
        targetAddress: privWalletAddress,
      })

      if (isGovernorBefore === false) {
        console.log('Granting governor role because the address does not have it...')
        // Grant role by sending tx
        const grantTxInfo = await sdk.armada.accessControl.grantGeneralRole({
          chainId,
          role: governorRole,
          targetAddress: privWalletAddress,
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
        targetAddress: privWalletAddress,
      })
      expect(isGovernorAfterGrant).toBe(true)

      // Revoke role
      console.log('Revoking governor role...')
      const revokeTxInfo = await sdk.armada.accessControl.revokeGeneralRole({
        chainId,
        role: governorRole,
        targetAddress: privWalletAddress,
      })
      expect(revokeTxInfo).toBeDefined()
      const revokeStatus = await governorSendTxTool(revokeTxInfo)
      expect(revokeStatus).toBe('success')

      // Check after revoke
      const isGovernorAfterRevoke = await sdk.armada.accessControl.hasGeneralRole({
        chainId,
        role: governorRole,
        targetAddress: privWalletAddress,
      })
      expect(isGovernorAfterRevoke).toBe(false)
    })

    test('should grant and revoke contract-specific role (whitelisted)', async () => {
      // Use the same fleet address as in the other tests
      const contractAddress = permissionedFleetAddress

      const isWhitelistedInitially = await sdk.armada.accessControl.hasContractSpecificRole({
        chainId,
        role: ContractSpecificRoleName.WHITELISTED_ROLE,
        contractAddress: contractAddress,
        targetAddress: privWalletAddress,
      })

      if (isWhitelistedInitially === false) {
        console.log('Granting whitelisted role because the address does not have it...')
        // Grant whitelisted role
        const grantTxInfo = await sdk.armada.accessControl.grantContractSpecificRole({
          chainId,
          role: ContractSpecificRoleName.WHITELISTED_ROLE,
          contractAddress: contractAddress,
          targetAddress: privWalletAddress,
        })
        expect(grantTxInfo).toBeDefined()
        const grantStatus = await governorSendTxTool(grantTxInfo)
        expect(grantStatus).toBe('success')

        const isWhitelistedAfterGrant = await sdk.armada.accessControl.hasContractSpecificRole({
          chainId,
          role: ContractSpecificRoleName.WHITELISTED_ROLE,
          contractAddress: contractAddress,
          targetAddress: privWalletAddress,
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
        targetAddress: privWalletAddress,
      })
      expect(revokeTxInfo).toBeDefined()
      const revokeStatus = await governorSendTxTool(revokeTxInfo)
      expect(revokeStatus).toBe('success')

      const isWhitelistedAfterRevoke = await sdk.armada.accessControl.hasContractSpecificRole({
        chainId,
        role: ContractSpecificRoleName.WHITELISTED_ROLE,
        contractAddress: contractAddress,
        targetAddress: privWalletAddress,
      })
      expect(isWhitelistedAfterRevoke).toBe(false)
    })
  })
})
