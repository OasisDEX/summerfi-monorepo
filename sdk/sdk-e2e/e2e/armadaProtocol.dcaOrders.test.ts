import assert from 'assert'
import { TestConfigAccounts, TestConfigs as TestConfigFleets } from './utils/testConfig'
import { createTestSdkInstance } from './utils/createTestSdkInstance'
import { privateKeyToAccount } from 'viem/accounts'
import {
  Token,
  TokenAmount,
  Address,
  getChainInfoByChainId,
  type AddressValue,
  ArmadaDcaOrderStatusEnum,
} from '@summerfi/sdk-common'

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

    const usdcToken = Token.createFrom({
      chainInfo: getChainInfoByChainId(chainId),
      address: Address.createFromEthereum({
        value: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913' as AddressValue,
      }),
      symbol: 'USDC',
      name: 'USD Coin',
      decimals: 6,
    })
    const amount = TokenAmount.createFrom({ token: usdcToken, amount: '6' })
    const account = privateKeyToAccount(TestConfigAccounts.testUserPrivateKey)

    const order = await sdk.armada.dca.createAndSaveBuyOrder({
      userAddress: userAddress,
      chainId,
      fromVault: fromVault.fleetAddressValue,
      toVault: toVault.fleetAddressValue,
      viemAccount: account,
      signTypedData: account.signTypedData,
      amount: amount,
      slippagePercentage: '0.5',
      intervalSeconds: 3600,
      firstExecutionUnixTimestamp: Math.floor(Date.now() / 1000) + 3600,
      maxTrades: 10,
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
      status: ArmadaDcaOrderStatusEnum.Active,
    })

    assert(activeOrders.find((activeOrder) => activeOrder.id === order.id))

    const signedMessage = `I want to cancel ${order.id}.`
    const signature = await account.signMessage({
      message: signedMessage,
    })

    const cancelledOrder = await sdk.armada.dca.cancelBuyOrder({
      orderId: order.id,
      userAddress: userAddress,
      signedMessage,
      signature,
    })

    assert.strictEqual(cancelledOrder.status, ArmadaDcaOrderStatusEnum.Cancelled)
  })
})
