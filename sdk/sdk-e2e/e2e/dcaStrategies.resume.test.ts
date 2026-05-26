import assert from 'assert'
import { ChainIds, DcaStrategyStatusEnum } from '@summerfi/sdk-common'
import { createSdkTestSetup } from './utils/createSdkTestSetup'

jest.setTimeout(300000)

/**
 * @group e2e
 */
describe('Armada Protocol - DCA Strategies Resume', () => {
  const scenarios: { strategyId: string }[] = [{ strategyId: '<replace-with-strategy-id>' }]

  describe.each(scenarios)('with scenario %#', (scenario) => {
    const { strategyId } = scenario

    it('should resume a paused DCA strategy by id', async () => {
      const setup = createSdkTestSetup({ chainId: ChainIds.Base })
      const { sdk, chainId, userAddressValue: userAddress } = setup

      const existingStrategy = await sdk.dca.getStrategy({ strategyId, chainId })

      assert(existingStrategy, `Expected strategy ${strategyId} to exist`)

      if (existingStrategy.status === DcaStrategyStatusEnum.Active) {
        console.log(`[Resume] Strategy ${strategyId} is already active, skipping`)
        return
      }

      const resumedStrategy = await sdk.dca.resumeBuyOrder({
        orderId: strategyId,
        userAddress,
      })

      assert.strictEqual(resumedStrategy.status, DcaStrategyStatusEnum.Active)
      console.log(`[Resume] Resumed DCA strategy with ID: ${strategyId}`)
    })
  })
})
