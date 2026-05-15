import assert from 'assert'
import { createSdkTestSetup } from './utils/createSdkTestSetup'
import { TestConfigs } from './utils/testConfig'

jest.setTimeout(300000)

/**
 * @group e2e
 */
describe('Armada Protocol - DCA Orders', () => {
  const { sdk, chainId, userAddress } = createSdkTestSetup('MainnetETHDao')

  it('should create, fetch, list and cancel a DCA buy order', async () => {
    const fromVault = TestConfigs.BaseUSDC
    const toVault = TestConfigs.BaseWETH

    const order = await sdk.armada.dca.createAndSaveBuyOrder({
      userAddress: userAddress.value,
      chainId,
      fromVault: fromVault.fleetAddressValue,
      toVault: toVault.fleetAddressValue,
      amount: '1',
      slippagePercentage: '0.5',
      intervalSeconds: 3600,
    })

    assert(order.id, 'Expected order id to be defined')

    const fetchedOrder = await sdk.armada.dca.getBuyOrder({
      orderId: order.id,
      userAddress: userAddress.value,
    })

    assert(fetchedOrder, 'Expected created order to be retrievable')
    assert.strictEqual(fetchedOrder.id, order.id)

    const activeOrders = await sdk.armada.dca.getBuyOrders({
      userAddress: userAddress.value,
      chainId,
      status: 'active',
    })

    assert(activeOrders.find((activeOrder) => activeOrder.id === order.id))

    const cancelledOrder = await sdk.armada.dca.cancelBuyOrder({
      orderId: order.id,
      userAddress: userAddress.value,
    })

    assert.strictEqual(cancelledOrder.status, 'cancelled')
  })
})
