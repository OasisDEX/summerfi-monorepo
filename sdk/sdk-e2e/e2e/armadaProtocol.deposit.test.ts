import {
  Address,
  ArmadaVaultId,
  getChainInfoByChainId,
  Percentage,
  TokenAmount,
  User,
  type AddressValue,
} from '@summerfi/sdk-common'

import { sendAndLogTransactions } from '@summerfi/testing-utils'
import { SharedConfig, type ChainConfig, InstiTestConfigs, TestClientIds } from './utils/testConfig'
import { createTestSDK } from './utils/sdkInstance'
import { DEFAULT_SLIPPAGE_PERCENTAGE } from './utils/constants'

jest.setTimeout(300000)

/**
 * @group e2e
 */
describe('Armada Protocol - Deposit', () => {
  const sdk = createTestSDK()

  // Configure test scenarios here
  const depositScenarios: {
    chainConfig: ChainConfig
    amountValue: string
    swapToSymbol?: string
    stake?: boolean
    referralCode?: string
    signerAddressValue?: AddressValue
    signerPrivateKey?: AddressValue
    simulateOnly: boolean
  }[] = [
    // {
    //   chainConfig: TestConfigs.HyperliquidUSDC,
    //   amountValue: '1',
    // },
    // {
    //   chainConfig: TestConfigs.BaseWETH,
    //   amountValue: '0.0005',
    // },
    {
      chainConfig: InstiTestConfigs[TestClientIds.ACME],
      amountValue: '1',
      signerAddressValue: SharedConfig.e2eUserAddressValue,
      signerPrivateKey: SharedConfig.e2eUserPrivateKey,
      simulateOnly: true,
    },
  ]

  describe('getNewDepositTx - deposit to fleet', () => {
    test.each(depositScenarios)(
      'should deposit to fleet',
      async ({
        chainConfig,
        amountValue,
        swapToSymbol,
        stake = false,
        referralCode,
        signerAddressValue = SharedConfig.testUserAddressValue,
        signerPrivateKey = SharedConfig.testUserPrivateKey,
        simulateOnly = true,
      }) => {
        const { rpcUrl, chainId, fleetAddressValue, symbol } = chainConfig

        const chainInfo = getChainInfoByChainId(chainId)
        const user = User.createFromEthereum(chainId, signerAddressValue)

        const vaultId = ArmadaVaultId.createFrom({
          chainInfo,
          fleetAddress: Address.createFromEthereum({ value: fleetAddressValue }),
        })

        const token = await sdk.tokens.getTokenBySymbol({ chainId, symbol })
        const swapToken = swapToSymbol
          ? await sdk.tokens.getTokenBySymbol({ chainId, symbol: swapToSymbol })
          : undefined

        // Get balances before deposit
        const fleetAmountBefore = await sdk.armada.users.getFleetBalance({
          vaultId,
          user,
        })
        const stakedAmountBefore = await sdk.armada.users.getStakedBalance({
          vaultId,
          user,
        })

        console.log(
          'assets before:',
          '\n - wallet',
          fleetAmountBefore.assets.toSolidityValue(),
          '\n - staked',
          stakedAmountBefore.assets.toSolidityValue(),
        )

        const amount = TokenAmount.createFrom({
          amount: amountValue,
          token: swapToken || token,
        })

        console.log(
          `deposit ${amountValue.toString()} to fleet at ${fleetAddressValue} ${stake ? 'with staking' : 'without staking'} ${swapToken ? ', swapping to ' + swapToken.symbol : ''} ${referralCode ? 'with referral code ' + referralCode : ''}`,
        )

        // Get deposit transaction
        const transactions = await sdk.armada.users.getNewDepositTx({
          vaultId,
          user,
          amount,
          slippage: Percentage.createFrom({
            value: DEFAULT_SLIPPAGE_PERCENTAGE,
          }),
          shouldStake: stake,
          referralCode,
        })

        expect(transactions).toBeDefined()
        expect(transactions.length).toBeGreaterThan(0)

        // Send transactions
        const { statuses } = await sendAndLogTransactions({
          chainInfo,
          transactions,
          rpcUrl,
          privateKey: signerPrivateKey,
          simulateOnly,
        })

        statuses.forEach((status) => {
          expect(status).toBe('success')
        })

        // Verify balances after deposit (only if not simulating)
        if (!simulateOnly) {
          const fleetAmountAfter = await sdk.armada.users.getFleetBalance({
            vaultId,
            user,
          })
          const stakedAmountAfter = await sdk.armada.users.getStakedBalance({
            vaultId,
            user,
          })

          console.log(
            'assets after:',
            '\n - wallet',
            fleetAmountAfter.assets.toSolidityValue(),
            '\n - staked',
            stakedAmountAfter.assets.toSolidityValue(),
          )
          console.log(
            'assets difference:',
            '\n - wallet',
            fleetAmountAfter.assets.subtract(fleetAmountBefore.assets).toString(),
            '\n - staked',
            stakedAmountAfter.assets.subtract(stakedAmountBefore.assets).toString(),
          )

          // Verify that balance changed
          const totalBefore =
            fleetAmountBefore.assets.toSolidityValue() + stakedAmountBefore.assets.toSolidityValue()
          const totalAfter =
            fleetAmountAfter.assets.toSolidityValue() + stakedAmountAfter.assets.toSolidityValue()

          expect(totalAfter).toBeGreaterThan(totalBefore)
        }
      },
    )
  })
})
