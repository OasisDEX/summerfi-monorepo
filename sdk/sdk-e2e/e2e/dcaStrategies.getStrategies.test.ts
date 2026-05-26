import assert from 'assert'
import { DcaStrategyStatusEnum, ChainIds, ChainId, type IDcaStrategy } from '@summerfi/sdk-common'
import { createSdkTestSetup } from './utils/createSdkTestSetup'

jest.setTimeout(300000)

const scenarios: { chainId: ChainId; status?: DcaStrategyStatusEnum }[] = [
  { chainId: ChainIds.Base, status: DcaStrategyStatusEnum.Active },
  { chainId: ChainIds.Base, status: undefined },
]

/**
 * @group e2e
 */
describe('Armada Protocol - DCA Strategies - getStrategies', () => {
  describe.each(scenarios)('with scenario %#', (scenario) => {
    const { chainId, status } = scenario

    it('should get a list of strategies', async () => {
      const setup = createSdkTestSetup({ chainId })
      const { sdk, userAddressValue: userAddress } = setup

      const strategies = await sdk.dca.getStrategies({
        userAddress,
        chainId,
        status,
      })

      assert(Array.isArray(strategies), 'Expected strategies to be an array')
      console.log(
        `[Read] Strategies (status=${status ?? 'all'}, count=${strategies.length}):`,
        JSON.stringify(strategies.map(logStrategy), null, 2),
      )
    })
  })
})

function logStrategy(strategy: IDcaStrategy) {
  return {
    id: strategy.id,
    status: strategy.status,
  }
}
