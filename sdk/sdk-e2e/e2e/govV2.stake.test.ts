import { User } from '@summerfi/sdk-common'
import assert from 'assert'

import { createSdkTestSetup } from './utils/createSdkTestSetup'
import { type TestConfigKey } from './utils/testConfig'
import { formatSumr } from './utils/stringifiers'
import { SECONDS_PER_DAY, SUMR_DECIMALS } from './utils/constants'

jest.setTimeout(300000)

describe('Armada Protocol Gov V2 Stake', () => {
  const scenarios: {
    testConfigKey?: TestConfigKey
    amountSumr?: bigint
    lockupDays?: bigint
  }[] = [
    {
      // 0
      testConfigKey: 'BaseUSDC',
      amountSumr: 1000n,
      lockupDays: 0n,
    },
    // { // 1
    //   testConfigKey: 'BaseUSDC',
    //   amountSumr: 100n,
    //   lockupDays: 1n,
    // },
    // {
    //   // 2
    //   testConfigKey: 'BaseUSDC',
    //   amountSumr: 100n,
    //   lockupDays: 15n,
    // },
    // { // 3
    //   testConfigKey: 'BaseUSDC',
    //   amountSumr: 100n,
    //   lockupDays: 91n,
    // },
    // { // 4
    //   testConfigKey: 'BaseUSDC',
    //   amountSumr: 100n,
    //   lockupDays: 200n,
    // },
    // { // 5
    //   testConfigKey: 'BaseUSDC',
    //   amountSumr: 100n,
    //   lockupDays: 370n,
    // },
    // {
    //   // 6
    //   testConfigKey: 'BaseUSDC',
    //   amountSumr: 100n,
    //   lockupDays: 730n,
    // },
  ]

  describe.each(scenarios)('with scenario %#', (scenario) => {
    const { testConfigKey: chainConfigKey, amountSumr, lockupDays } = scenario
    // Setup SDK and tools
    const setup = createSdkTestSetup(chainConfigKey)
    const { sdk, chainId, userAddress, userSendTxTool } = setup

    const user = User.createFromEthereum(chainId, userAddress.value)

    // Convert to contract units
    const stakeAmount = (amountSumr ?? 1n) * 10n ** SUMR_DECIMALS // Convert SUMR to wei
    const stakeLockupPeriod = (lockupDays ?? 0n) * SECONDS_PER_DAY // Convert days to seconds

    it('should stake with specified amount and lockup period', async () => {
      const sumrBalanceBefore = await sdk.armada.users.getUserBalance({ user })
      console.log('SUMR balance before: ', formatSumr(sumrBalanceBefore) + ' SUMR')
      assert(sumrBalanceBefore >= stakeAmount, `Balance should be greater than ${stakeAmount}`)

      // Get balance before staking
      const balancesBefore = await sdk.armada.users.getUserStakingBalanceV2({ user })
      console.log(
        'Staking balances before:',
        balancesBefore.map((b) => ({
          ...b,
          amount: formatSumr(b.amount),
        })),
      )

      // Stake with specified lockup period
      const stakeTxV2 = await sdk.armada.users.getStakeTxV2({
        user,
        amount: stakeAmount,
        lockupPeriod: stakeLockupPeriod,
      })

      const stakeStatus = await userSendTxTool(stakeTxV2)
      stakeStatus.forEach((s) => expect(s).toBe('success'))

      // Get balance after staking
      const sumrBalanceAfter = await sdk.armada.users.getUserBalance({ user })
      const balancesAfter = await sdk.armada.users.getUserStakingBalanceV2({ user })
      console.log(
        'Staking balances after:',
        balancesAfter.map((b) => ({
          ...b,
          amount: formatSumr(b.amount),
        })),
        '\nSummer balance after: ',
        formatSumr(sumrBalanceAfter),
      )

      // Verify one of the buckets has increased
      const totalBefore = balancesBefore.reduce((sum, b) => sum + b.amount, 0n)
      const totalAfter = balancesAfter.reduce((sum, b) => sum + b.amount, 0n)
      expect(totalAfter).toBeGreaterThan(totalBefore)
    })
  })
})
