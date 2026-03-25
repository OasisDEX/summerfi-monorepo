import { ChainIds, type AddressValue, type ChainId } from '@summerfi/sdk-common'
import { createTestSdkInstance } from './utils/createTestSdkInstance'

const scenarios: { userAddress: AddressValue; merklChainId?: ChainId }[] = [
  {
    userAddress: '0xDDc68f9dE415ba2fE2FD84bc62Be2d2CFF1098dA',
    merklChainId: ChainIds.Mainnet,
  },
  // { userAddress: '0x38233654FB0843c8024527682352A5d41E7f7324' },
  // { userAddress: '0xDDc68f9dE415ba2fE2FD84bc62Be2d2CFF1098dA' },
  // { userAddress: '0x746bb7beFD31D9052BB8EbA7D5dD74C9aCf54C6d' },
  // { userAddress: '0xE9c245293DAC615c11A5bF26FCec91C3617645E4' },
]

describe('Merkl SUMR Rewards - getUserMerklClaimTx', () => {
  const sdk = createTestSdkInstance()

  describe.each(scenarios)('user address $userAddress', (scenario) => {
    const { userAddress, merklChainId } = scenario

    it('should generate claim transaction for user with rewards', async () => {
      // First get rewards to find chains with rewards
      const rewards = await sdk.armada.users.getUserMerklRewards({
        address: userAddress,
        merklChainId,
      })

      const allChainIds = [
        ChainIds.Base,
        ChainIds.Mainnet,
        ChainIds.ArbitrumOne,
        ChainIds.Sonic,
      ] as ChainId[] // Ethereum, Base, Arbitrum, Sonic
      const chainsWithRewards = Object.entries(rewards.perChain)
        .filter(([_, chainRewards]) => chainRewards && chainRewards.length > 0)
        .map(([chainId]) => parseInt(chainId) as ChainId)

      const chainsWithoutRewards = allChainIds.filter(
        (chainId) => !chainsWithRewards.includes(chainId),
      )

      console.log(`Chains with rewards: ${chainsWithRewards}`)
      console.log(`Chains without rewards: ${chainsWithoutRewards}`)

      if (chainsWithRewards.length === 0) {
        throw new Error(
          `No chains with rewards found for user ${userAddress} with merkl chain ${merklChainId}. Cannot test claim transaction generation.`,
        )
      }
      // Test chains WITH rewards - should return transaction array
      for (const chainId of chainsWithRewards) {
        console.log(`Testing chain ${chainId} with merkl chain ${merklChainId} (has rewards)`)
        const claimTransactions = await sdk.armada.users.getUserMerklClaimTx({
          address: userAddress,
          chainId,
        })
        if (!claimTransactions) {
          throw new Error(
            `Expected claim transactions for chain ${chainId} with merkl chain ${merklChainId} but got undefined`,
          )
        }

        expect(claimTransactions).toBeDefined()
        expect(claimTransactions).not.toBeUndefined()
        expect(Array.isArray(claimTransactions)).toBe(true)
        expect(claimTransactions!.length).toBe(1)

        const claimTx = claimTransactions![0]
        expect(claimTx.type).toBe('MerklClaim')
        expect(claimTx.description).toContain('Claiming Merkl rewards')
        expect(claimTx.transaction).toBeDefined()
        expect(claimTx.transaction.target).toBeDefined()
        expect(claimTx.transaction.calldata).toBeDefined()
        expect(claimTx.transaction.value).toBe('0')

        console.log(
          `✅ Correctly generated claim transaction for chain ${chainId} with merkl chain ${merklChainId}`,
        )
        break // No need to test further chains with rewards
      }

      // Test chains WITHOUT rewards - should return undefined
      for (const chainId of chainsWithoutRewards) {
        console.log(`Testing chain ${chainId} with merkl chain ${merklChainId} (no rewards)`)
        const result = await sdk.armada.users.getUserMerklClaimTx({
          address: userAddress,
          chainId,
        })

        expect(result).toBeUndefined()
        console.log(
          `✅ Chain ${chainId} with merkl chain ${merklChainId} correctly returned undefined (no rewards)`,
        )
        break // No need to test further chains without rewards
      }

      // Ensure we tested at least one scenario
      if (chainsWithRewards.length === 0 && chainsWithoutRewards.length === 0) {
        throw new Error('Nothing was tested - no chains with or without rewards found')
      }
    })

    it('should throw error for unsupported chain', async () => {
      const unsupportedChainId = 999999 as ChainId

      await expect(
        sdk.armada.users.getUserMerklClaimTx({
          address: userAddress,
          chainId: unsupportedChainId,
        }),
      ).rejects.toThrow()
    })
  })
})
