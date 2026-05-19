import assert from 'assert'
import { ArmadaDcaOrderStatusEnum } from '@summerfi/sdk-common'
import { TestConfigAccounts, type TestConfigKey } from './utils/testConfig'
import { createSdkTestSetup } from './utils/createSdkTestSetup'

jest.setTimeout(300000)

const scenarios: { testConfigKey: TestConfigKey; status?: ArmadaDcaOrderStatusEnum }[] = [
  { testConfigKey: 'BaseUSDC', status: ArmadaDcaOrderStatusEnum.Active },
  { testConfigKey: 'BaseUSDC', status: undefined },
]

/**
 * @group e2e
 */
describe('Armada Protocol - DCA Orders Read', () => {
  describe.each(scenarios)('with scenario %#', (scenario) => {
    const { testConfigKey, status } = scenario

    it('should get a list of buy orders', async () => {
      const setup = createSdkTestSetup(testConfigKey)
      const { sdk, chainId } = setup

      const userAddress = TestConfigAccounts.testUserAddressValue

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
