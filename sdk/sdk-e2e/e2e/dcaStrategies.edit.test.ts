import assert from 'assert'
import { ChainIds, DcaStrategyStatusEnum, TransactionType } from '@summerfi/sdk-common'
import { createSdkTestSetup } from './utils/createSdkTestSetup'
import { retryUntilDefined } from './utils/retryUntilDefined'

jest.setTimeout(300000)

/**
 * @group e2e
 */
describe('Armada Protocol - DCA Strategies Edit', () => {
  const scenarios: { strategyId: string }[] = [{ strategyId: '0' }]

  describe.each(scenarios)('with scenario %#', (scenario) => {
    const { strategyId } = scenario

    it('should edit an existing DCA strategy by id', async () => {
      const setup = createSdkTestSetup({ chainId: ChainIds.Base, simulateOnly: false })
      const { sdk, chainId, walletClient, publicClient } = setup

      const strategy = await sdk.dca.getStrategy({ strategyId, chainId })

      assert(strategy, `Expected strategy ${strategyId} to exist`)
      assert(
        [DcaStrategyStatusEnum.Active, DcaStrategyStatusEnum.Paused].includes(strategy.status),
        `Strategy ${strategyId} must be active or paused to edit`,
      )

      // Flip the slippage to a different valid value so the edit is observable after re-fetch.
      // `strategy` stays the current on-chain config (the oldConfig hashed against the commitment);
      // `update` carries only the changed field, which the SDK merges to build the newConfig.
      const newTradeAmount = strategy.tradeAmount <= 500000n ? 2000001n : 5000000n

      const txs = await sdk.dca.editStrategyTx({
        chainId,
        strategy,
        update: { tradeAmount: newTradeAmount },
      })

      // The EditStrategy tx is always last; any leading txs are Permit2 setup (authorization /
      // sub-allowance) prepended only when the new config's keeper-pull needs it.
      const editTx = txs[txs.length - 1]
      assert.strictEqual(
        editTx.type,
        TransactionType.EditStrategy,
        'Last tx should be EditStrategy',
      )
      for (const setupTx of txs.slice(0, txs.length - 1)) {
        assert(
          setupTx.type === TransactionType.Permit2Authorization ||
            setupTx.type === TransactionType.Permit2SubAllowance,
          `Unexpected leading tx type ${setupTx.type}`,
        )
      }

      // Send every tx in order (setup first, then the edit).
      for (const tx of txs) {
        const txHash = await walletClient.sendTransaction({
          account: walletClient.account!,
          to: tx.transaction.target.value,
          value: BigInt(tx.transaction.value),
          data: tx.transaction.calldata,
          chain: walletClient.chain,
        })
        console.log(`Sent ${tx.type} transaction, hash:`, txHash)

        await publicClient.waitForTransactionReceipt({ hash: txHash, confirmations: 5 })
      }

      const updatedStrategy = await retryUntilDefined(
        () => sdk.dca.getStrategy({ strategyId, chainId }),
        (s) => s !== undefined && s.tradeAmount === newTradeAmount,
      )

      assert(updatedStrategy, `Expected strategy ${strategyId} to exist after edit`)
      assert.strictEqual(updatedStrategy.tradeAmount, newTradeAmount)
      console.log(
        `[Edit] Edited DCA strategy with ID: ${strategyId} by changing tradeAmount to ${newTradeAmount}`,
      )
    })
  })
})
