import assert from 'assert'
import { ChainIds, DcaStrategyStatusEnum } from '@summerfi/sdk-common'
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
      const newSlippagePercentage = strategy.slippagePercentage >= 1 ? 0.5 : 1

      const [editTx] = await sdk.dca.editStrategyTx({
        chainId,
        strategy,
        update: { slippagePercentage: newSlippagePercentage },
      })

      const txHash = await walletClient.sendTransaction({
        account: walletClient.account!,
        to: editTx.transaction.target.value,
        value: BigInt(editTx.transaction.value),
        data: editTx.transaction.calldata,
        chain: walletClient.chain,
      })
      await publicClient.waitForTransactionReceipt({ hash: txHash })

      const updatedStrategy = await retryUntilDefined(
        () => sdk.dca.getStrategy({ strategyId, chainId }),
        (s) => s !== undefined && s.slippagePercentage === newSlippagePercentage,
      )

      assert(updatedStrategy, `Expected strategy ${strategyId} to exist after edit`)
      assert.strictEqual(updatedStrategy.slippagePercentage, newSlippagePercentage)
      console.log(
        `[Edit] Edited DCA strategy with ID: ${strategyId} by changing slippagePercentage to ${newSlippagePercentage}`,
      )
    })
  })
})
