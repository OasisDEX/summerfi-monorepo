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
import type { WithdrawScenario } from './utils/types'
import assert from 'assert'

jest.setTimeout(300000)

const simulateOnly = false

/**
 * @group e2e
 */
describe('Armada Protocol - Withdraw', () => {
  const sdk = createTestSDK()
  const privateKey = SharedConfig.userPrivateKey
  const userAddressValue = SharedConfig.userAddressValue

  // Configure test scenarios here
  const withdrawScenarios: WithdrawScenario[] = [
    {
      description: 'withdraw ETH from Base Eth Vault',
      chainConfig: ChainConfigs.BaseWETH,
      amountValue: '0.001',
      swapToSymbol: 'ETH',
    },
  ]

  describe('getWithdrawTx - withdraw from fleet', () => {
    test.each(withdrawScenarios)(
      'should $description',
      async ({ chainConfig, amountValue, swapToSymbol }) => {
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

        // Get balances before withdrawal
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
          token: token,
        })

        console.log(`withdraw ${amount.toString()} assets back from fleet at ${fleetAddressValue}`)

        // Verify sufficient balance
        const totalAssetsBefore = fleetAmountBefore.assets.add(stakedAmountBefore.assets)
        assert(
          totalAssetsBefore.toSolidityValue() >= amount.toSolidityValue(),
          `Fleet balance is not enough: ${totalAssetsBefore.toString()} < ${amount.toString()}`,
        )

        // Get withdrawal transaction
        const transactions = await sdk.armada.users.getWithdrawTx({
          vaultId,
          user,
          amount,
          toToken: swapToken || token,
          slippage: Percentage.createFrom({
            value: DEFAULT_SLIPPAGE_PERCENTAGE,
          }),
        })

        expect(transactions).toBeDefined()
        expect(transactions.length).toBeGreaterThan(0)

        // Send transactions
        const { statuses } = await sendAndLogTransactions({
          chainInfo,
          transactions: transactions,
          rpcUrl,
          privateKey,
          simulateOnly,
        })

        statuses.forEach((status) => {
          expect(status).toBe('success')
        })

        // Verify balances after withdrawal (only if not simulating)
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

          // Verify that balance decreased
          const totalAfter =
            fleetAmountAfter.assets.toSolidityValue() + stakedAmountAfter.assets.toSolidityValue()
          const totalBefore =
            fleetAmountBefore.assets.toSolidityValue() + stakedAmountBefore.assets.toSolidityValue()

          expect(totalAfter).toBeLessThan(totalBefore)
        }
      },
    )
  })
})
