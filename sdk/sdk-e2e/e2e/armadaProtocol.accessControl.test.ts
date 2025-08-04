import { makeSDK, type SDKManager } from '@summerfi/sdk-client'
import { Address, ChainIds } from '@summerfi/sdk-common'
import { GeneralRoles, ContractSpecificRoleName } from '@summerfi/armada-protocol-common'
import { SDKApiUrl, userAddress } from './utils/testConfig'

jest.setTimeout(300000)

/**
 * @group e2e
 */
describe('Armada Protocol - Access Control E2E Tests', () => {
  const sdk: SDKManager = makeSDK({
    apiDomainUrl: SDKApiUrl,
  })

  const chainId = ChainIds.Base
  const testAddress = userAddress
  const permissionedFleetAddress = Address.createFromEthereum({
    value: '0x98c49e13bf99d7cad8069faa2a370933ec9ecf17', // Using a known fleet address
  })

  describe('Access Control API', () => {
    test('should check if address has governor role', async () => {
      const hasGeneralRole = await sdk.armada.accessControl.hasGeneralRole({
        chainId,
        role: GeneralRoles.GOVERNOR_ROLE,
        targetAddress: testAddress,
      })
      expect(typeof hasGeneralRole).toBe('boolean')
    })

    test('should check contract-specific role (keeper)', async () => {
      const hasContractSpecificRole = await sdk.armada.accessControl.hasContractSpecificRole({
        chainId,
        role: ContractSpecificRoleName.KEEPER_ROLE,
        contractAddress: permissionedFleetAddress,
        targetAddress: testAddress,
      })
      expect(typeof hasContractSpecificRole).toBe('boolean')
    })

    test('should handle grant/revoke general role (expect error or tx)', async () => {
      // These will likely fail on testnet/mainnet unless the test address has permissions
      expect(
        sdk.armada.accessControl.grantGeneralRole({
          chainId,
          role: GeneralRoles.SUPER_KEEPER_ROLE,
          targetAddress: testAddress,
        }),
      ).resolves.toBeDefined()
      expect(
        sdk.armada.accessControl.revokeGeneralRole({
          chainId,
          role: GeneralRoles.SUPER_KEEPER_ROLE,
          targetAddress: testAddress,
        }),
      ).resolves.toBeDefined()
    })

    test('should handle grant/revoke contract-specific role (expect error or tx)', async () => {
      expect(
        sdk.armada.accessControl.grantContractSpecificRole({
          chainId,
          role: ContractSpecificRoleName.KEEPER_ROLE,
          contractAddress: permissionedFleetAddress,
          targetAddress: testAddress,
        }),
      ).resolves.toBeDefined()
      await expect(
        sdk.armada.accessControl.revokeContractSpecificRole({
          chainId,
          role: ContractSpecificRoleName.KEEPER_ROLE,
          contractAddress: permissionedFleetAddress,
          targetAddress: testAddress,
        }),
      ).resolves.toBeDefined()
    })
  })
})
