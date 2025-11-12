import { User, Address, getChainInfoByChainId } from '@summerfi/sdk-common'
import assert from 'assert'

import { createTestSDK } from './utils/sdkInstance'
import { sendAndLogTransactions } from '@summerfi/testing-utils'
import { SharedConfig, TestConfigs, type TestConfigKey } from './utils/testConfig'

jest.setTimeout(300000)

const simulateOnly = false
const privateKey = SharedConfig.userPrivateKey

describe('Armada Protocol Gov V2 Unstake', () => {
  const sdk = createTestSDK()

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
    const chainConfig = TestConfigs[chainConfigKey ?? 'BaseUSDC']
    const chainInfo = getChainInfoByChainId(chainConfig.chainId)
    const rpcUrl = chainConfig.rpcUrl
    const userAddress = Address.createFromEthereum({ value: SharedConfig.userAddressValue })
    const user = User.createFromEthereum(chainInfo.chainId, userAddress.value)

    // Convert to contract units
    const unstakeAmount = (amountSumr ?? 1n) * 10n ** 18n // Convert SUMR to wei
    const stakeIndex = userStakeIndex ?? 0n

    it('should unstake from specific stake index using V2 method', async () => {
      const balancesBefore = await sdk.armada.users.getUserStakingBalanceV2({ user })
      const totalBefore = balancesBefore.reduce((sum, b) => sum + b.amount, 0n)

      assert(totalBefore >= unstakeAmount, `Staked balance should be greater than ${unstakeAmount}`)

      // Unstake from specified user stake index
      const unstakeTxV2 = await sdk.armada.users.getUnstakeTxV2({
        userStakeIndex: stakeIndex,
        amount: unstakeAmount,
      })

      const { statuses } = await sendAndLogTransactions({
        chainInfo,
        transactions: unstakeTxV2,
        rpcUrl: rpcUrl,
        privateKey,
        simulateOnly,
      })
      statuses.forEach((status) => {
        expect(status).toBe('success')
      })

      const balancesAfter = await sdk.armada.users.getUserStakingBalanceV2({ user })
      const totalAfter = balancesAfter.reduce((sum, b) => sum + b.amount, 0n)

      expect(totalAfter).toBeLessThan(totalBefore)
    })
  })
})
