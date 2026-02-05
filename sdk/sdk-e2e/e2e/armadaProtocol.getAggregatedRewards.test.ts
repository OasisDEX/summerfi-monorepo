import { type ChainId, ChainIds, User, type AddressValue } from '@summerfi/sdk-common'
import { createTestSdkInstance } from './utils/createTestSdkInstance'

jest.setTimeout(300000)

/**
 * @group e2e
 */
describe('Armada Protocol - Get Aggregated Rewards', () => {
  const scenarios: {
    chainId: ChainId
    userAddress: AddressValue
  }[] = [
    {
      chainId: ChainIds.Base,
      userAddress: '0x10649c79428d718621821Cf6299e91920284743F' as AddressValue,
    },
  ]

  const sdk = createTestSdkInstance()

  describe.each(scenarios)('with scenario %#', (scenario) => {
    const { chainId, userAddress } = scenario
    const user = User.createFromEthereum(chainId, userAddress)

    it('should get aggregated rewards cross chain', async () => {
      const rewards = await sdk.armada.users.getAggregatedRewards({
        user,
      })
      console.log('rewards', rewards)

      expect(rewards.total).toBeDefined()
      expect(rewards.total).toBeGreaterThan(0n)
      expect(rewards.vaultUsagePerChain).toBeDefined()
      expect(rewards.vaultUsage).toBeDefined()
      expect(rewards.stakingV2).toBeDefined()
      expect(rewards.merkleDistribution).toBeDefined()
      expect(rewards.voteDelegation).toBeDefined()
    })

    it('should get aggregated rewards cross chain including merkl', async () => {
      const rewards = await sdk.armada.users.getAggregatedRewardsIncludingMerkl({
        user,
      })
      console.log('rewards including merkl', rewards)

      expect(rewards.total).toBeDefined()
      expect(rewards.total).toBeGreaterThan(0n)
      expect(rewards.vaultUsagePerChain).toBeDefined()
      expect(rewards.vaultUsage).toBeDefined()
      expect(rewards.stakingV2).toBeDefined()
      expect(rewards.merkleDistribution).toBeDefined()
      expect(rewards.voteDelegation).toBeDefined()
    })
  })
})
