import { ChainIds, type AddressValue, type ChainId } from '@summerfi/sdk-common'
import { createTestSdkInstance } from './utils/createTestSdkInstance'
import { displayMerklReward } from './utils/stringifiers'

const scenarios: { userAddress: AddressValue }[] = [
  { userAddress: '0xA8752762470a6a73aC874258677043c226d080ec' },
  // { userAddress: '0x38233654FB0843c8024527682352A5d41E7f7324' },
  // { userAddress: '0xDDc68f9dE415ba2fE2FD84bc62Be2d2CFF1098dA' },
  // { userAddress: '0x746bb7beFD31D9052BB8EbA7D5dD74C9aCf54C6d' },
  // { userAddress: '0xE9c245293DAC615c11A5bF26FCec91C3617645E4' },
]

describe('Merkl Rewards', () => {
  const sdk = createTestSdkInstance()

  describe.each(scenarios)('user address $userAddress', (scenario) => {
    const { userAddress } = scenario

    it('should fetch Merkl rewards for the user ', async () => {
      const rewards = await sdk.armada.users.getUserMerklRewards({
        address: userAddress,
      })
      expect(rewards.perChain).toBeDefined()

      // Log rewards for each chain

      Object.entries(rewards.perChain).forEach(([chainId, chainRewards]) => {
        if (chainRewards && chainRewards.length > 0) {
          console.log(`Chain ID ${chainId}: ${chainRewards.length} rewards found`)
          chainRewards.forEach((reward, index) => {
            console.log(`  Reward ${index + 1}: ${displayMerklReward(reward)}`)
          })
        } else {
          console.log(`Chain ID ${chainId}: No rewards found`)
        }
      })
    })

    it.skip('should fetch Merkl rewards for specific chain IDs', async () => {
      const requestedChainIds = [ChainIds.Base]

      const rewards = await sdk.armada.users.getUserMerklRewards({
        address: userAddress,
        chainIds: requestedChainIds,
      })
      expect(rewards.perChain).toBeDefined()

      // Check that only requested chains are included (or chains with actual rewards)
      const returnedChainIds = Object.keys(rewards.perChain).map((chainId) => parseInt(chainId))
      returnedChainIds.forEach((chainId) => {
        expect(requestedChainIds).toContain(chainId)
      })

      // Log rewards for each requested chain
      Object.entries(rewards.perChain).forEach(([chainId, chainRewards]) => {
        if (chainRewards && chainRewards.length > 0) {
          console.log(`Chain ID ${chainId}: ${chainRewards.length} rewards found`)
          chainRewards.forEach((reward, index) => {
            console.log(` Reward ${index + 1}: ${displayMerklReward(reward)}`)
          })
        } else {
          console.log(`Chain ID ${chainId}: No rewards found`)
        }
      })
    })
  })
})
