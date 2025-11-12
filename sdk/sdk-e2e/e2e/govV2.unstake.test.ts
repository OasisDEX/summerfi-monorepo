import { User } from '@summerfi/sdk-common'
import assert from 'assert'

import { type TestConfigKey } from './utils/testConfig'
import { createSdkTestSetup } from './utils/createSdkTestSetup'

jest.setTimeout(300000)

describe('Armada Protocol Gov V2 Unstake', () => {
  const scenarios: {
    testConfigKey?: TestConfigKey
    amountSumr?: bigint
    userStakeIndex?: bigint
  }[] = [
    {
      testConfigKey: 'BaseUSDC',
      amountSumr: 1n, // 1 SUMR
      userStakeIndex: 0n, // First stake in user's portfolio
    },
  ]

  describe.each(scenarios)('with scenario %#', (scenario) => {
    const { testConfigKey: chainConfigKey, amountSumr, userStakeIndex } = scenario
    // Setup SDK and tools
    const setup = createSdkTestSetup(chainConfigKey)
    const { sdk, chainId, userAddress, userSendTxTool } = setup

    const user = User.createFromEthereum(chainId, userAddress.value)

    // Convert to contract units
    const unstakeAmount = (amountSumr ?? 1n) * 10n ** 18n // Convert SUMR to wei
    const stakeIndex = userStakeIndex ?? 0n

    it('should unstake from specific stake index using V2 method', async () => {
      const balancesBefore = await sdk.armada.users.getUserStakingBalanceV2({ user })
      // find bucket with balance
      const stakeBucketBefore = balancesBefore.find((b) => b.amount > unstakeAmount)
      assert(stakeBucketBefore, `No bucket with enough staked balance found for user`)

      // Unstake from specified user stake index
      const unstakeTxV2 = await sdk.armada.users.getUnstakeTxV2({
        userStakeIndex: stakeIndex,
        amount: unstakeAmount,
      })

      const unstakeStatus = await userSendTxTool(unstakeTxV2)
      expect(unstakeStatus).toBe('success')

      const balancesAfter = await sdk.armada.users.getUserStakingBalanceV2({ user })
      const stakeBucketAfter = balancesAfter.find((b) => b.bucket === stakeBucketBefore.bucket)
      expect(stakeBucketAfter?.amount).toBeLessThan(stakeBucketBefore.amount)
    })
  })
})
