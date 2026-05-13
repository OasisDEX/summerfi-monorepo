import assert from 'assert'
import { Address, getChainInfoByChainId, User } from '@summerfi/sdk-common'
import { createSdkTestSetup } from './utils/createSdkTestSetup'

jest.setTimeout(300000)

/**
 * @group e2e
 */
describe('Armada Protocol - DCA Orders', () => {
  const { sdk, chainId, userAddress } = createSdkTestSetup('MainnetETHDao')

  it('should create, fetch, list and cancel a DCA buy order', async () => {
    const fromVault = process.env.DCA_TEST_FROM_VAULT
    const toVault = process.env.DCA_TEST_TO_VAULT
    const ensoRouterAddress = process.env.DCA_TEST_ENSO_ROUTER

    if (!fromVault || !toVault || !ensoRouterAddress) {
      console.log(
        'Skipping DCA e2e: set DCA_TEST_FROM_VAULT, DCA_TEST_TO_VAULT and DCA_TEST_ENSO_ROUTER',
      )
      return
    }

    const user = User.createFromEthereum(chainId, userAddress.value)
    const chainInfo = getChainInfoByChainId(chainId)

    const order = await sdk.armada.dca.createAndSaveBuyOrder({
      user,
      chainInfo,
      fromVault: Address.createFromEthereum({ value: fromVault }),
      toVault: Address.createFromEthereum({ value: toVault }),
      amount: '1000000',
      slippage: '50',
      intervalSeconds: 3600,
      ensoRouterAddress: Address.createFromEthereum({ value: ensoRouterAddress }),
    })

    assert(order.id, 'Expected order id to be defined')

    const fetchedOrder = await sdk.armada.dca.getBuyOrder({
      orderId: order.id,
      user,
    })

    assert(fetchedOrder, 'Expected created order to be retrievable')
    assert.strictEqual(fetchedOrder.id, order.id)

    const activeOrders = await sdk.armada.dca.getBuyOrders({
      user,
      chainInfo,
      status: 'active',
    })

    assert(activeOrders.find((activeOrder) => activeOrder.id === order.id))

    const cancelledOrder = await sdk.armada.dca.cancelBuyOrder({
      orderId: order.id,
      user,
    })

    assert.strictEqual(cancelledOrder.status, 'cancelled')
  })
})
