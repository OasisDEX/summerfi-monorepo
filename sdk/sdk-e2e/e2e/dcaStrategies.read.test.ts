import assert from 'assert'
import { ArmadaDcaOrderStatusEnum, ChainIds, ChainId } from '@summerfi/sdk-common'
import { TestConfigAccounts } from './utils/testConfig'
import { createSdkTestSetup } from './utils/createSdkTestSetup'

jest.setTimeout(300000)

const scenarios: { chainId: ChainId; status?: ArmadaDcaOrderStatusEnum }[] = [
  { chainId: ChainIds.Base, status: ArmadaDcaOrderStatusEnum.Active },
  { chainId: ChainIds.Base, status: undefined },
]

/**
 * @group e2e
 */
describe('Armada Protocol - DCA Strategies Read', () => {
  describe.each(scenarios)('with scenario %#', (scenario) => {
    const { chainId, status } = scenario

    it('should get a list of strategies', async () => {
      const setup = createSdkTestSetup({ chainId })
      const { sdk, userAddressValue: userAddress } = setup

      // getBuyOrders with optional status filter
      const orders = await sdk.armada.dca.getBuyOrders({
        userAddress,
        chainId,
        status,
      })

      assert(Array.isArray(orders), 'Expected orders to be an array')
      console.log(
        `[Read] Orders (status=${status ?? 'all'}, count=${orders.length}):`,
        JSON.stringify(orders.map(logOrder), null, 2),
      )
    })
  })
})

function logOrder(order: { id: string; status: ArmadaDcaOrderStatusEnum }) {
  return {
    id: order.id,
    status: order.status,
  }
}
