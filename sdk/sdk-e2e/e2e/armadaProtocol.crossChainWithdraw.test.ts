import {
  Address,
  ArmadaVaultId,
  ChainIds,
  getChainInfoByChainId,
  Percentage,
  TokenAmount,
  User,
} from '@summerfi/sdk-common'

import assert from 'assert'
import { createSdkTestSetup } from './utils/createSdkTestSetup'
import { DEFAULT_SLIPPAGE_PERCENTAGE } from './utils/constants'
import { FleetAddresses } from './utils/testConfig'

jest.setTimeout(300000)

/**
 * @group e2e
 */
describe('Armada Protocol - Cross Chain Withdraw', () => {
  const scenarios: {
    description: string
    fromChainId: typeof ChainIds.ArbitrumOne
    fromFleetAddress: string
    fromSymbol: string
    toChainId: typeof ChainIds.Base
    toSymbol: string
    withdrawAmount: string
  }[] = [
    {
      description: 'withdraw from Arbitrum USDT vault to Base USDC',
      fromChainId: ChainIds.ArbitrumOne,
      fromFleetAddress: FleetAddresses.ArbitrumOne.USDT,
      fromSymbol: 'USDT',
      toChainId: ChainIds.Base,
      toSymbol: 'USDC',
      withdrawAmount: '1',
    },
  ]

  describe.each(scenarios)('with scenario %#', (scenario) => {
    const {
      description,
      fromChainId,
      fromFleetAddress,
      fromSymbol,
      toChainId,
      toSymbol,
      withdrawAmount,
    } = scenario

    it('should get cross-chain withdraw transaction', async () => {
      const setup = createSdkTestSetup('ArbitrumUSDT')
      const { sdk, userAddress, userSendTxTool } = setup

      console.log(
        `[Cross-Chain Withdraw] ${description}\n` +
          `From: Chain ${fromChainId} (${fromSymbol}) at ${fromFleetAddress}\n` +
          `To: Chain ${toChainId} (${toSymbol})\n` +
          `User: ${userAddress.value}`,
      )

      // Get vault token
      const vaultToken = await sdk.tokens.getTokenBySymbol({
        chainId: fromChainId,
        symbol: fromSymbol,
      })

      // Create amount to withdraw
      const amount = TokenAmount.createFrom({
        amount: withdrawAmount,
        token: vaultToken,
      })

      // Create user
      const user = User.createFromEthereum(fromChainId, userAddress.value)

      // Create vault ID on source chain
      const vaultId = ArmadaVaultId.createFrom({
        chainInfo: getChainInfoByChainId(fromChainId),
        fleetAddress: Address.createFromEthereum({ value: fromFleetAddress }),
      })

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
        'Assets before withdrawal:',
        '\n - Fleet balance:',
        fleetAmountBefore.assets.toSolidityValue(),
        '\n - Staked balance:',
        stakedAmountBefore.assets.toSolidityValue(),
      )

      // Verify sufficient balance
      const totalAssetsBefore = fleetAmountBefore.assets.add(stakedAmountBefore.assets)
      assert(
        totalAssetsBefore.toSolidityValue() >= amount.toSolidityValue(),
        `Insufficient fleet balance: ${totalAssetsBefore.toString()} < ${amount.toString()}`,
      )

      // Get cross-chain withdraw transaction
      const transactions = await sdk.armada.users.getCrossChainWithdrawTx({
        vaultId,
        user,
        amount,
        slippage: Percentage.createFrom({
          value: DEFAULT_SLIPPAGE_PERCENTAGE,
        }),
        toChainId,
      })

      // Validate transactions
      assert(transactions, 'Transactions should be defined')
      assert(transactions.length > 0, 'Should have at least one transaction')
      console.log(`Generated ${transactions.length} transaction(s) for cross-chain withdraw`)

      // Send transactions using the user send tx tool
      console.log('\nSending transactions...')
      const results = await userSendTxTool(transactions)

      // Verify all transactions succeeded
      results.forEach((status) => {
        expect(status).toBe('success')
      })

      console.log('\n✓ Cross-chain withdraw completed successfully')
    })
  })
})
