import assert from 'assert'
import { ChainIds, DcaStrategyStatusEnum } from '@summerfi/sdk-common'
import { createSdkTestSetup } from './utils/createSdkTestSetup'

jest.setTimeout(300000)

/**
 * @group e2e
 */
describe('Armada Protocol - DCA Strategies Cancel', () => {
  const scenarios: { strategyId: string }[] = [
    { strategyId: '2ee5a4cb-31ac-4b9c-91b1-cfbcaec5e891' },
  ]

  describe.each(scenarios)('with scenario %#', (scenario) => {
    const { strategyId } = scenario

    it('should cancel a DCA strategy by id', async () => {
      const setup = createSdkTestSetup({ chainId: ChainIds.Base })
      const { sdk, chainId, userAddressValue: userAddress } = setup

      const existingStrategy = await sdk.dca.getStrategy({ strategyId, chainId })

      assert(existingStrategy, `Expected strategy ${strategyId} to exist`)

      if (existingStrategy.status === DcaStrategyStatusEnum.Cancelled) {
        console.log(`[Cancel] Strategy ${strategyId} is already cancelled, skipping`)
        return
      }
      const cancelledStrategy = await sdk.dca.cancelBuyOrder({
        orderId: strategyId,
        userAddress,
      })

      assert.strictEqual(cancelledStrategy.status, DcaStrategyStatusEnum.Cancelled)
      console.log(`[Cancel] Cancelled DCA strategy with ID: ${strategyId}`)
    })
  })
})
