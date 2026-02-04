import { User, Address, getChainInfoByChainId } from '@summerfi/sdk-common'

import { createTestSDK } from './utils/sdkInstance'
import { SharedConfig, TestConfigs, type TestConfigKey } from './utils/testConfig'
import { formatSumr } from './utils/stringifiers'
import { SECONDS_PER_DAY } from './utils/constants'

jest.setTimeout(300000)

describe('Armada Protocol Gov V2 Staking Simulation', () => {
  const sdk = createTestSDK()

  const scenarios: { testConfigKey: TestConfigKey }[] = [
    {
      testConfigKey: 'BaseUSDC',
    },
  ]

  describe.each(scenarios)('with scenario %#', (scenario) => {
    const { testConfigKey: chainConfigKey } = scenario
    const chainConfig = TestConfigs[chainConfigKey]
    const chainInfo = getChainInfoByChainId(chainConfig.chainId)
    const userAddress = Address.createFromEthereum({ value: SharedConfig.testUserAddressValue })
    const user = User.createFromEthereum(chainInfo.chainId, userAddress.value)

    it('should calculate staking simulation data with various amounts and periods', async () => {
      // Test scenarios with different amounts and lockup periods
      const testCases = [
        {
          amount: 48000n,
          lockupDays: 1080n,
        },
      ]

      // Mock SUMR price (in production this would come from a price oracle)
      const sumrPriceUsd = 0.25

      for (const testCase of testCases) {
        const amount = testCase.amount * 10n ** 18n // Convert to wei
        const period = testCase.lockupDays * SECONDS_PER_DAY // Convert to seconds

        console.log(`\nTesting: Deposit ${testCase.amount} SUMR for ${testCase.lockupDays} days`)

        const simulationData = await sdk.armada.users.getStakingSimulationDataV2({
          amount,
          period,
          sumrPriceUsd,
          userAddress: user.wallet.address.value,
        })

        expect(simulationData).toBeDefined()
        expect(simulationData.sumrRewardApy.value).toBeGreaterThanOrEqual(0)
        expect(simulationData.usdcYieldApy.value).toBeGreaterThanOrEqual(0)
        expect(simulationData.usdcYieldBoost).toBeGreaterThanOrEqual(1) // Boost should be at least 1
        expect(simulationData.usdcBlendedYieldBoostFrom).toBeGreaterThanOrEqual(0)
        expect(simulationData.usdcBlendedYieldBoostTo).toBeGreaterThanOrEqual(0)
        expect(simulationData.weightedAmount).toBeGreaterThanOrEqual(amount) // Weighted amount should be >= original amount

        console.log(
          'Simulation results:' +
            `\n  SUMR Reward APY: ${simulationData.sumrRewardApy.toString()}` +
            `\n  USDC Yield APY: ${simulationData.usdcYieldApy.toString()}` +
            `\n  USDC Yield Boost: ${simulationData.usdcYieldBoost.toFixed(4)}x` +
            `\n  Weighted Amount: ${formatSumr(simulationData.weightedAmount)} SUMR` +
            `\n  USDC Blended Yield Boost From: ${simulationData.usdcBlendedYieldBoostFrom.toFixed(4)}x` +
            `\n  USDC Blended Yield Boost To: ${simulationData.usdcBlendedYieldBoostTo.toFixed(4)}x`,
        )

        // Verify boost increases with lockup period (longer lockup = higher boost)
        // The boost is calculated as weightedAmount / amount
        // For a given amount, longer lockup should give higher weighted amount
        if (testCase.lockupDays >= 14n) {
          // Minimum lockup is 14 days, boost should be >= 1
          expect(simulationData.usdcYieldBoost).toBeGreaterThanOrEqual(1)
        }

        // For max lockup (3 years), boost should be at or near max multiplier (7.2655)
        if (testCase.lockupDays >= 1095n) {
          expect(simulationData.usdcYieldBoost).toBeGreaterThan(7)
        }

        // Blended boost "To" should always be >= "From" (assuming we're adding to position)
        expect(simulationData.usdcBlendedYieldBoostTo).toBeGreaterThanOrEqual(
          simulationData.usdcBlendedYieldBoostFrom,
        )
      }
    })

    it('should calculate simulation for user with no existing stake', async () => {
      // Use a fresh address that has never staked
      const freshAddress = Address.createFromEthereum({
        value: '0x0000000000000000000000000000000000000001',
      })

      const amount = 1000n * 10n ** 18n // 1000 SUMR
      const period = 365n * SECONDS_PER_DAY // 1 year
      const sumrPriceUsd = 1.0

      const simulationData = await sdk.armada.users.getStakingSimulationDataV2({
        amount,
        period,
        sumrPriceUsd,
        userAddress: freshAddress.value,
      })

      expect(simulationData).toBeDefined()
      expect(simulationData.usdcBlendedYieldBoostFrom).toBe(0) // No existing stake
      expect(simulationData.usdcBlendedYieldBoostTo).toBeGreaterThan(0) // Will have stake after
      expect(simulationData.weightedAmount).toBeGreaterThanOrEqual(amount)

      console.log(
        'Simulation for fresh address:' +
          `\n  SUMR Reward APY: ${simulationData.sumrRewardApy.toString()}` +
          `\n  USDC Yield APY: ${simulationData.usdcYieldApy.toString()}` +
          `\n  USDC Yield Boost: ${simulationData.usdcYieldBoost.toFixed(4)}x` +
          `\n  Weighted Amount: ${formatSumr(simulationData.weightedAmount)} SUMR` +
          `\n  Blended Boost From: ${simulationData.usdcBlendedYieldBoostFrom.toFixed(4)}x` +
          `\n  Blended Boost To: ${simulationData.usdcBlendedYieldBoostTo.toFixed(4)}x`,
      )
    })

    it('should show how boost changes with lockup period for same amount', async () => {
      const amount = 10000n * 10n ** 18n // 10000 SUMR
      const sumrPriceUsd = 1.0

      const lockupPeriods = [
        { days: 14n, description: 'Min (14 days)' },
        { days: 180n, description: '6 months' },
        { days: 365n, description: '1 year' },
        { days: 730n, description: '2 years' },
        { days: 1095n, description: 'Max (3 years)' },
      ]

      console.log(`\nBoost comparison for ${formatSumr(amount)} SUMR:`)

      for (const { days, description } of lockupPeriods) {
        const period = days * SECONDS_PER_DAY

        const simulationData = await sdk.armada.users.getStakingSimulationDataV2({
          amount,
          period,
          sumrPriceUsd,
          userAddress: user.wallet.address.value,
        })

        console.log(
          `  ${description}: Boost ${simulationData.usdcYieldBoost.toFixed(4)}x, Weighted ${formatSumr(simulationData.weightedAmount)} SUMR, APY ${simulationData.usdcYieldApy.toString()}`,
        )
      }
    })
  })
})
