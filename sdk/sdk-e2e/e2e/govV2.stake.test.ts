import { User } from '@summerfi/sdk-common'
import assert from 'assert'
import { BigNumber } from 'bignumber.js'

import { createSdkTestSetup } from './utils/createSdkTestSetup'
import { type TestConfigKey } from './utils/testConfig'

jest.setTimeout(300000)

const SUMR_DECIMALS = 10n ** 18n
const SECONDS_PER_DAY = 24n * 60n * 60n

describe('Armada Protocol Gov V2 Stake', () => {
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
    // Setup SDK and tools
    const setup = createSdkTestSetup(chainConfigKey)
    const { sdk, chainId, userAddress, userSendTxTool } = setup

    const user = User.createFromEthereum(chainId, userAddress.value)

    // Convert to contract units
    const stakeAmount = (amountSumr ?? 1n) * SUMR_DECIMALS // Convert SUMR to wei
    const stakeLockupPeriod = (lockupDays ?? 0n) * SECONDS_PER_DAY // Convert days to seconds

    it('should stake with specified amount and lockup period', async () => {
      const sumrBalanceBefore = await sdk.armada.users.getUserBalance({ user })
      console.log(
        'SUMR balance before: ',
        BigNumber(sumrBalanceBefore).div(SUMR_DECIMALS).toFixed(),
      )
      assert(sumrBalanceBefore >= stakeAmount, `Balance should be greater than ${stakeAmount}`)

      // Get balance before staking
      const balancesBefore = await sdk.armada.users.getUserStakingBalanceV2({ user })
      console.log(
        'Staking balances before:',
        balancesBefore.map((b) => ({
          ...b,
          amount: BigNumber(b.amount).div(SUMR_DECIMALS).toFixed(),
        })),
      )

      // Stake with specified lockup period
      const stakeTxV2 = await sdk.armada.users.getStakeTxV2({
        user,
        amount: stakeAmount,
        lockupPeriod: stakeLockupPeriod,
      })

      const stakeStatus = await userSendTxTool(stakeTxV2)
      expect(stakeStatus).toBe('success')

      // Get balance after staking
      const sumrBalanceAfter = await sdk.armada.users.getUserBalance({ user })
      const balancesAfter = await sdk.armada.users.getUserStakingBalanceV2({ user })
      console.log(
        'Staking balances after:',
        balancesAfter,
        'Summer balance after: ',
        sumrBalanceAfter,
      )

      // Verify one of the buckets has increased
      const totalBefore = balancesBefore.reduce((sum, b) => sum + b.amount, 0n)
      const totalAfter = balancesAfter.reduce((sum, b) => sum + b.amount, 0n)
      expect(totalAfter).toBeGreaterThan(totalBefore)
    })
  })
})
