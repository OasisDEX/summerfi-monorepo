import { User } from '@summerfi/sdk-common'
import { createSdkTestSetup } from './utils/createSdkTestSetup'
import type { TestConfigKey } from './utils/testConfig'

jest.setTimeout(300000)

/**
 * @group e2e
 */
describe('Armada Protocol - Gov V2 Claims', () => {
  const scenarios: {
    testConfigKey?: TestConfigKey
  }[] = [
    {
      testConfigKey: 'BaseUSDC',
    },
  ]

  describe.each(scenarios)('claim staking v2 rewards with scenario %#', (scenario) => {
    const { testConfigKey: chainConfigKey } = scenario
    const setup = createSdkTestSetup(chainConfigKey)
    const { sdk, chainId, userAddress, userSendTxTool } = setup

    const user = User.createFromEthereum(chainId, userAddress.value)

    it('should generate transaction to claim staking v2 rewards', async () => {
      // Get earned rewards before claiming
      const earnedBefore = await sdk.armada.users.getUserStakingEarnedV2({
        user,
      })
      console.log(`Earned rewards before claim: ${earnedBefore}`)

      // Get claim transaction
      const claimTx = await sdk.armada.users.getClaimStakingV2UserRewardsTx({
        user,
      })

      expect(claimTx).toBeDefined()
      expect(claimTx).toHaveLength(1)
      expect(claimTx[0].type).toBe('Claim')
      expect(claimTx[0].description).toBe('Claiming staking v2 rewards')

      // Only send transaction if there are rewards to claim
      if (earnedBefore > 0n) {
        console.log('Attempting to claim the rewards...')
        const txStatus = await userSendTxTool(claimTx, { confirmations: 5 })
        expect(txStatus).toStrictEqual(['success'])

        // Verify rewards were claimed (balance should be less)
        const earnedAfter = await sdk.armada.users.getUserStakingEarnedV2({
          user,
        })
        console.log(`Earned rewards after claim: ${earnedAfter}`)

        // After claiming, earned rewards should be 0 or less than before
        expect(earnedAfter).toBeLessThanOrEqual(earnedBefore)
      } else {
        console.log('No rewards to claim, skipping transaction execution')
      }
    })
  })
})
