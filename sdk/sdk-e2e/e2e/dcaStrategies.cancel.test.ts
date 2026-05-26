import assert from 'assert'
import { ChainIds, DcaStrategyStatusEnum } from '@summerfi/sdk-common'
import { createSdkTestSetup } from './utils/createSdkTestSetup'

jest.setTimeout(300000)

/**
 * @group e2e
 */
describe('Armada Protocol - DCA Strategies Cancel', () => {
  // Replace with an on-chain numeric strategyId (e.g. '1', '2', ...)
  const scenarios: { strategyId: string }[] = [{ strategyId: '<replace-with-strategy-id>' }]

  describe.each(scenarios)('with scenario %#', (scenario) => {
    const { strategyId } = scenario

    it('should cancel a DCA strategy by id', async () => {
      const setup = createSdkTestSetup({ chainId: ChainIds.Base, simulateOnly: false })
      const { sdk, chainId, walletClient, publicClient } = setup

      const existingStrategy = await sdk.dca.getStrategy({ strategyId, chainId })

      assert(existingStrategy, `Expected strategy ${strategyId} to exist`)

      if (existingStrategy.status === DcaStrategyStatusEnum.Cancelled) {
        console.log(`[Cancel] Strategy ${strategyId} is already cancelled, skipping`)
        return
      }

      const [cancelTx] = await sdk.dca.cancelStrategyTx({ chainId, strategyId })

      const txHash = await walletClient.sendTransaction({
        account: walletClient.account!,
        to: cancelTx.transaction.target.value,
        value: BigInt(cancelTx.transaction.value),
        data: cancelTx.transaction.calldata,
        chain: walletClient.chain,
      })
      await publicClient.waitForTransactionReceipt({ hash: txHash })

      const updatedStrategy = await sdk.dca.getStrategy({ strategyId, chainId })
      assert(updatedStrategy, `Expected strategy ${strategyId} to exist after cancel`)
      assert.strictEqual(updatedStrategy.status, DcaStrategyStatusEnum.Cancelled)
      console.log(`[Cancel] Cancelled DCA strategy with ID: ${strategyId}`)
    })
  })
})
