import { User, Address, getChainInfoByChainId } from '@summerfi/sdk-common'
import assert from 'assert'

import { createTestSDK } from './utils/sdkInstance'
import { sendAndLogTransactions } from '@summerfi/testing-utils'
import { SharedConfig, TestConfigs, type TestConfigKey } from './utils/testConfig'

jest.setTimeout(300000)

const simulateOnly = false
const privateKey = SharedConfig.userPrivateKey

describe('Armada Protocol Gov V2 Stake', () => {
  const sdk = createTestSDK()

  const scenarios: {
    testConfigKey?: TestConfigKey
    amountSumr?: bigint
    lockupDays?: bigint
  }[] = [
    {
      testConfigKey: 'BaseUSDC',
      amountSumr: 100n,
      lockupDays: 0n,
    },
    {
      testConfigKey: 'BaseUSDC',
      amountSumr: 100n,
      lockupDays: 1n,
    },
    {
      testConfigKey: 'BaseUSDC',
      amountSumr: 100n,
      lockupDays: 14n,
    },
    {
      testConfigKey: 'BaseUSDC',
      amountSumr: 100n,
      lockupDays: 90n,
    },
    {
      testConfigKey: 'BaseUSDC',
      amountSumr: 100n,
      lockupDays: 200n,
    },
    {
      testConfigKey: 'BaseUSDC',
      amountSumr: 100n,
      lockupDays: 370n,
    },
  ]

  describe.each(scenarios)('with scenario %#', (scenario) => {
    const { testConfigKey: chainConfigKey, amountSumr, lockupDays } = scenario
    const chainConfig = TestConfigs[chainConfigKey ?? 'BaseUSDC']
    const chainInfo = getChainInfoByChainId(chainConfig.chainId)
    const rpcUrl = chainConfig.rpcUrl
    const userAddress = Address.createFromEthereum({ value: SharedConfig.userAddressValue })
    const user = User.createFromEthereum(chainInfo.chainId, userAddress.value)

    // Convert to contract units
    const stakeAmount = (amountSumr ?? 1n) * 10n ** 18n // Convert SUMR to wei
    const stakeLockupPeriod = (lockupDays ?? 14n) * 24n * 60n * 60n // Convert days to seconds

    it('should stake with specified amount and lockup period', async () => {
      const balance = await sdk.armada.users.getUserBalance({ user })
      assert(balance >= stakeAmount, `Balance should be greater than ${stakeAmount}`)

      // Get balance before staking
      const balancesBefore = await sdk.armada.users.getUserStakingBalanceV2({ user })
      console.log('Staking balances before:', balancesBefore)

      // Stake with specified lockup period
      const stakeTxV2 = await sdk.armada.users.getStakeTxV2({
        user,
        amount: stakeAmount,
        lockupPeriod: stakeLockupPeriod,
      })

      const { statuses } = await sendAndLogTransactions({
        chainInfo,
        transactions: stakeTxV2,
        rpcUrl: rpcUrl,
        privateKey,
        simulateOnly,
      })
      statuses.forEach((status) => {
        expect(status).toBe('success')
      })

      // Get balance after staking
      const balancesAfter = await sdk.armada.users.getUserStakingBalanceV2({ user })
      console.log('Staking balances after:', balancesAfter)

      // Verify one of the buckets has increased
      const totalBefore = balancesBefore.reduce((sum, b) => sum + b.amount, 0n)
      const totalAfter = balancesAfter.reduce((sum, b) => sum + b.amount, 0n)
      expect(totalAfter).toBeGreaterThan(totalBefore)
    })
  })
})
