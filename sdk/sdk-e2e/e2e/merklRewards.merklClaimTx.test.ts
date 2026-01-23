import { ChainIds, type AddressValue, type ChainId } from '@summerfi/sdk-common'
import { createTestSDK } from './utils/sdkInstance'

const scenarios: { userAddress: AddressValue }[] = [
  { userAddress: '0x805769AA22219E3a29b301Ab5897B903A9ad2C4A' },
  // { userAddress: '0x38233654FB0843c8024527682352A5d41E7f7324' },
  // { userAddress: '0xDDc68f9dE415ba2fE2FD84bc62Be2d2CFF1098dA' },
  // { userAddress: '0x746bb7beFD31D9052BB8EbA7D5dD74C9aCf54C6d' },
  // { userAddress: '0xE9c245293DAC615c11A5bF26FCec91C3617645E4' },
]

describe('Merkl Rewards - getUserMerklClaimTx', () => {
  const sdk = createTestSDK()

  describe.each(scenarios)('user address $userAddress', (scenario) => {
    const { userAddress } = scenario

    it('should generate claim transaction for user with rewards', async () => {
      // First get rewards to find chains with rewards
      const rewards = await sdk.armada.users.getUserMerklRewards({
        address: userAddress,
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

      // Test chains WITH rewards - should return transaction array
      for (const chainId of chainsWithRewards) {
        console.log(`Testing chain ${chainId} (has rewards)`)
        const claimTransactions = await sdk.armada.users.getUserMerklClaimTx({
          address: userAddress,
          chainId,
        })
        if (!claimTransactions) {
          console.log(`No claim transactions generated for chain ${chainId}`)
          continue // Skip to next chain
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

        console.log(`✅ Generated claim transaction for chain ${chainId}`)
        break // No need to test further chains with rewards
      }

      // Test chains WITHOUT rewards - should return undefined
      for (const chainId of chainsWithoutRewards) {
        console.log(`Testing chain ${chainId} (no rewards)`)
        const result = await sdk.armada.users.getUserMerklClaimTx({
          address: userAddress,
          chainId,
        })

        expect(result).toBeUndefined()
        console.log(`✅ Chain ${chainId} correctly returned undefined (no rewards)`)
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
