import assert from 'assert'
import { TestConfigAccounts, TestConfigs as TestConfigFleets } from './utils/testConfig'
import { createTestSdkInstance } from './utils/createTestSdkInstance'

jest.setTimeout(300000)

/**
 * @group e2e
 */
describe('Armada Protocol - DCA Orders', () => {
  const sdk = createTestSdkInstance()

  it('should create, fetch, list and cancel a DCA buy order', async () => {
    const fromVault = TestConfigFleets.BaseUSDC
    const chainId = fromVault.chainId
    const toVault = TestConfigFleets.BaseWETH
    const userAddress = TestConfigAccounts.testUserAddressValue

    const order = await sdk.armada.dca.createAndSaveBuyOrder({
      userAddress: userAddress,
      chainId,
      fromVault: fromVault.fleetAddressValue,
      toVault: toVault.fleetAddressValue,
      amount: '1',
      slippagePercentage: '0.5',
      intervalSeconds: 3600,
      nextExecutionAtUnixTimestamp: Math.floor(Date.now() / 1000) + 3600,
      deadlineUnixTimestamp: Math.floor(Date.now() / 1000) + 3600,
    })

    assert(order.id, 'Expected order id to be defined')

    const fetchedOrder = await sdk.armada.dca.getBuyOrder({
      orderId: order.id,
      userAddress: userAddress,
    })

    assert(fetchedOrder, 'Expected created order to be retrievable')
    assert.strictEqual(fetchedOrder.id, order.id)

    const activeOrders = await sdk.armada.dca.getBuyOrders({
      userAddress: userAddress,
      chainId,
      status: 'active',
    })

    assert(activeOrders.find((activeOrder) => activeOrder.id === order.id))

    const cancelledOrder = await sdk.armada.dca.cancelBuyOrder({
      orderId: order.id,
      userAddress: userAddress,
    })

    assert.strictEqual(cancelledOrder.status, 'cancelled')
  })
})
