import assert from 'assert'
import { ChainIds, ChainId } from '@summerfi/sdk-common'
import { createSdkTestSetup } from './utils/createSdkTestSetup'

jest.setTimeout(300000)

const scenarios: { chainId: ChainId; strategyId: string }[] = [
  { chainId: ChainIds.Base, strategyId: '3' },
]

/**
 * @group e2e
 */
describe('Armada Protocol - DCA Strategies - getStrategy', () => {
  describe.each(scenarios)('with scenario %#', (scenario) => {
    const { chainId, strategyId } = scenario

    it('should get a single strategy by id', async () => {
      const { sdk } = createSdkTestSetup({ chainId })

      const strategy = await sdk.dca.getStrategy({
        chainId,
        strategyId,
      })

      assert(strategy !== undefined, `Expected strategy with id ${strategyId} to exist`)
      assert.strictEqual(strategy.id, strategyId, 'Fetched strategy ID should match requested ID')
      console.log(
        `[getStrategy] Strategy (chainId=${chainId}, id=${strategyId}):`,
        JSON.stringify(
          {
            id: strategy.id,
            status: strategy.status,
            tradeAmount: strategy.tradeAmount,
          },
          null,
          2,
        ),
      )
    })
  })
})
