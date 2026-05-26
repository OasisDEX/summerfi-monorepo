import assert from 'assert'
import { ChainIds, DcaStrategyStatusEnum } from '@summerfi/sdk-common'
import { createSdkTestSetup } from './utils/createSdkTestSetup'
import { retryUntilDefined } from './utils/retryUntilDefined'

jest.setTimeout(300000)

/**
 * @group e2e
 */
describe('Armada Protocol - DCA Strategies Resume', () => {
  const scenarios: { strategyId: string }[] = [{ strategyId: '3' }]

  describe.each(scenarios)('with scenario %#', (scenario) => {
    const { strategyId } = scenario

    it('should resume a paused DCA strategy by id', async () => {
      const setup = createSdkTestSetup({ chainId: ChainIds.Base, simulateOnly: false })
      const { sdk, chainId, walletClient, publicClient } = setup

      const strategy = await retryUntilDefined(() => sdk.dca.getStrategy({ strategyId, chainId }))

      assert(strategy, `Expected strategy ${strategyId} to exist`)

      const [resumeTx] = await sdk.dca.resumeStrategyTx({
        chainId,
        strategy,
      })

      const txHash = await walletClient.sendTransaction({
        account: walletClient.account!,
        to: resumeTx.transaction.target.value,
        value: BigInt(resumeTx.transaction.value),
        data: resumeTx.transaction.calldata,
        chain: walletClient.chain,
      })
      await publicClient.waitForTransactionReceipt({ hash: txHash })

      const updatedStrategy = await retryUntilDefined(
        () => sdk.dca.getStrategy({ strategyId, chainId }),
        (s) => s !== undefined && s.status === DcaStrategyStatusEnum.Active,
      )

      assert(updatedStrategy, `Expected strategy ${strategyId} to exist after resume`)
      assert.strictEqual(updatedStrategy.status, DcaStrategyStatusEnum.Active)
      console.log(`[Resume] Resumed DCA strategy with ID: ${strategyId}`)
    })
  })
})
