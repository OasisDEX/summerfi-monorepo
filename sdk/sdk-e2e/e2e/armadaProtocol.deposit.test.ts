import {
  Address,
  ArmadaVaultId,
  getChainInfoByChainId,
  Percentage,
  TokenAmount,
  User,
} from '@summerfi/sdk-common'

import { sendAndLogTransactions } from '@summerfi/testing-utils'
import { ChainConfigs, SharedConfig } from './utils/testConfig'
import { createTestSDK } from './utils/sdkInstance'
import { DEFAULT_SLIPPAGE_PERCENTAGE } from './utils/constants'
import type { DepositScenario } from './utils/types'

jest.setTimeout(300000)

const simulateOnly = false

/**
 * @group e2e
 */
describe('Armada Protocol - Deposit', () => {
  const sdk = createTestSDK()
  const privateKey = SharedConfig.userPrivateKey
  const userAddressValue = SharedConfig.userAddressValue

  // Configure test scenarios here
  const depositScenarios: DepositScenario[] = [
    {
      description: 'deposit USDC to self-managed fleet without staking',
      chainConfig: ChainConfigs.SelfManaged,
      amountValue: '1',
      stake: false,
    },
    // Add more scenarios as needed:
    // {
    //   description: 'deposit USDC to self-managed fleet with staking',
    //   chainConfig: ChainConfigs.SelfManaged,
    //   amountValue: '1',
    //   stake: true,
    // },
    // {
    //   description: 'deposit with swap and staking',
    //   chainConfig: ChainConfigs.Base,
    //   amountValue: '1',
    //   swapToSymbol: 'ETH',
    //   stake: true,
    // },
    // {
    //   description: 'deposit with referral code',
    //   chainConfig: ChainConfigs.Base,
    //   amountValue: '1',
    //   stake: false,
    //   referralCode: 'REF123',
    // },
  ]

  describe('getNewDepositTx - deposit to fleet', () => {
    test.each(depositScenarios)(
      'should $description',
      async ({ chainConfig, amountValue, swapToSymbol, stake = false, referralCode }) => {
        const { rpcUrl, chainId, fleetAddressValue, symbol } = chainConfig

        const chainInfo = getChainInfoByChainId(chainId)
        const user = User.createFromEthereum(chainId, userAddressValue)

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
          privateKey,
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
