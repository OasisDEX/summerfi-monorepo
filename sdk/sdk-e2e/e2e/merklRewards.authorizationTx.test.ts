import { ChainIds, type AddressValue, type ChainId } from '@summerfi/sdk-common'
import { createSendTransactionTool } from '@summerfi/testing-utils'
import { makeSDK } from '@summerfi/sdk-client'
import { SDKApiUrl, RpcUrls, TestConfigAccounts } from './utils/testConfig'
import { createTestSdkInstance } from './utils/createTestSdkInstance'

jest.setTimeout(300000)

/**
 * @group e2e
 */
describe('Merkl Rewards - Authorization Transaction', () => {
  const scenarios: {
    userAddress: AddressValue
    chainId: ChainId
    authorization: boolean
  }[] = [
    {
      userAddress: '0xDDc68f9dE415ba2fE2FD84bc62Be2d2CFF1098dA',
      chainId: ChainIds.Base,
      authorization: true,
    },
    {
      userAddress: '0xDDc68f9dE415ba2fE2FD84bc62Be2d2CFF1098dA',
      chainId: ChainIds.Base,
      authorization: false,
    },
  ]

  describe.each(scenarios)('with scenario %#', (scenario) => {
    const { userAddress, chainId, authorization } = scenario

    const sdk = createTestSdkInstance()

    const userSendTxTool = createSendTransactionTool({
      chainId,
      rpcUrl: RpcUrls[chainId as keyof typeof RpcUrls],
      senderAddressValue: userAddress,
      signerPrivateKey: TestConfigAccounts.testUserPrivateKey,
      simulateOnly: false,
    })

    it('should send authorization toggle transaction and set authorization state', async () => {
      // Check initial authorization state
      const initialState = await sdk.armada.users.getIsAuthorizedAsMerklRewardsOperator({
        chainId,
        user: userAddress,
      })
      console.log(
        `[chain ${chainId}] Initial authorization state for ${userAddress}: ${initialState}`,
      )

      // Skip if already in the desired state
      if (initialState === authorization) {
        console.log(
          `Skipping - AdmiralsQuarters is already ${authorization ? 'authorized' : 'not authorized'} for ${userAddress}`,
        )
        return
      }

      // Get the authorization toggle transaction
      const authTx = await sdk.armada.users.getAuthorizeAsMerklRewardsOperatorTx({
        chainId,
        user: userAddress,
      })

      expect(authTx).toBeDefined()
      expect(Array.isArray(authTx)).toBe(true)
      expect(authTx).toHaveLength(1)

      const toggleTx = authTx[0]
      expect(toggleTx.type).toBe('ToggleAQasMerklRewardsOperator')
      expect(toggleTx.transaction).toBeDefined()
      expect(toggleTx.transaction.target).toBeDefined()
      expect(toggleTx.transaction.calldata).toBeDefined()
      expect(toggleTx.transaction.value).toBe('0')

      console.log(
        `[chain ${chainId}] Sending authorization toggle transaction to set state to ${authorization}`,
      )

      // Send the transaction
      const txStatus = await userSendTxTool(authTx)
      txStatus.forEach((s) => expect(s).toBe('success'))

      // Verify the final authorization state matches the desired value
      const finalState = await sdk.armada.users.getIsAuthorizedAsMerklRewardsOperator({
        chainId,
        user: userAddress,
      })
      console.log(`[chain ${chainId}] Final authorization state for ${userAddress}: ${finalState}`)
      expect(finalState).toBe(authorization)
    })
  })
})
