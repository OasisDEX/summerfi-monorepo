import assert from 'assert'
import { ChainIds, DcaStrategyStatusEnum } from '@summerfi/sdk-common'
import { createSdkTestSetup } from './utils/createSdkTestSetup'

jest.setTimeout(300000)

/**
 * @group e2e
 */
describe('Armada Protocol - DCA Strategies Pause', () => {
  const scenarios: { strategyId: string }[] = [{ strategyId: '<replace-with-strategy-id>' }]

  describe.each(scenarios)('with scenario %#', (scenario) => {
    const { strategyId } = scenario

    it('should pause an active DCA strategy by id', async () => {
      const setup = createSdkTestSetup({ chainId: ChainIds.Base })
      const { sdk, chainId, userAddressValue: userAddress } = setup

      const existingStrategy = await sdk.dca.getStrategy({ strategyId, chainId })

      assert(existingStrategy, `Expected strategy ${strategyId} to exist`)

      if (existingStrategy.status === DcaStrategyStatusEnum.Paused) {
        console.log(`[Pause] Strategy ${strategyId} is already paused, skipping`)
        return
      }

      const pausedStrategy = await sdk.dca.pauseBuyOrder({
        orderId: strategyId,
        userAddress,
      })

      assert.strictEqual(pausedStrategy.status, DcaStrategyStatusEnum.Paused)
      console.log(`[Pause] Paused DCA strategy with ID: ${strategyId}`)
    })
  })
})
