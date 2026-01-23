import { ChainIds, type AddressValue, type ChainId } from '@summerfi/sdk-common'
import { createTestSDK } from './utils/sdkInstance'

const scenarios: { userAddress: AddressValue }[] = [
  { userAddress: '0x805769AA22219E3a29b301Ab5897B903A9ad2C4A' },
  // { userAddress: '0x38233654FB0843c8024527682352A5d41E7f7324' },
  // { userAddress: '0xDDc68f9dE415ba2fE2FD84bc62Be2d2CFF1098dA' },
  // { userAddress: '0x746bb7beFD31D9052BB8EbA7D5dD74C9aCf54C6d' },
  // { userAddress: '0xE9c245293DAC615c11A5bF26FCec91C3617645E4' },
]

describe('Merkl Rewards - Authorization', () => {
  const sdk = createTestSDK()

  describe.each(scenarios)('user address $userAddress', (scenario) => {
    const { userAddress } = scenario

    describe('getAuthorizeAsMerklRewardsOperatorTx', () => {
      it('should generate authorization transaction for supported chains', async () => {
        const supportedChainIds = [
          ChainIds.Base,
          ChainIds.Mainnet,
          ChainIds.ArbitrumOne,
          ChainIds.Sonic,
        ] as ChainId[]

        for (const chainId of supportedChainIds) {
          console.log(`Testing authorization transaction for chain ${chainId}`)

          const authTransactions = await sdk.armada.users.getAuthorizeAsMerklRewardsOperatorTx({
            chainId,
            user: userAddress,
          })

          expect(authTransactions).toBeDefined()
          expect(Array.isArray(authTransactions)).toBe(true)
          expect(authTransactions.length).toBe(1)

          const authTx = authTransactions[0]
          expect(authTx.type).toBe('ToggleAQasMerklRewardsOperator')
          expect(authTx.description).toBe('Authorize AdmiralsQuarters as Merkl rewards operator')
          expect(authTx.transaction).toBeDefined()
          expect(authTx.transaction.target).toBeDefined()
          expect(authTx.transaction.calldata).toBeDefined()
          expect(authTx.transaction.value).toBe('0')

          console.log(`✅ Generated authorization transaction for chain ${chainId}`)
          break // Test one chain to avoid rate limits
        }
      })

      it('should throw error for unsupported chain', async () => {
        const unsupportedChainId = 999999 as ChainId

        await expect(
          sdk.armada.users.getAuthorizeAsMerklRewardsOperatorTx({
            chainId: unsupportedChainId,
            user: userAddress,
          }),
        ).rejects.toThrow()
      })
    })

    describe('getIsAuthorizedAsMerklRewardsOperator', () => {
      it('should check authorization status for supported chains', async () => {
        const supportedChainIds = [
          ChainIds.Base,
          ChainIds.Mainnet,
          ChainIds.ArbitrumOne,
          ChainIds.Sonic,
        ] as ChainId[]

        for (const chainId of supportedChainIds) {
          console.log(`Testing authorization status for chain ${chainId}`)

          const isAuthorized = await sdk.armada.users.getIsAuthorizedAsMerklRewardsOperator({
            chainId,
            user: userAddress,
          })

          expect(typeof isAuthorized).toBe('boolean')
          console.log(`✅ Authorization status for chain ${chainId}: ${isAuthorized}`)
          break // Test one chain to avoid rate limits
        }
      })

      it('should return false for unauthorized user', async () => {
        const unauthorizedUser = '0x0000000000000000000000000000000000000001' as AddressValue
        const testChainId = ChainIds.Base

        const isAuthorized = await sdk.armada.users.getIsAuthorizedAsMerklRewardsOperator({
          chainId: testChainId,
          user: unauthorizedUser,
        })

        expect(typeof isAuthorized).toBe('boolean')
        expect(isAuthorized).toBe(false)
        console.log(`✅ Unauthorized user correctly returned false`)
      })

      it.skip('should throw error for unsupported chain', async () => {
        const unsupportedChainId = 999999 as ChainId

        await expect(
          sdk.armada.users.getIsAuthorizedAsMerklRewardsOperator({
            chainId: unsupportedChainId,
            user: userAddress,
          }),
        ).rejects.toThrow()
      })
    })
  })
})
