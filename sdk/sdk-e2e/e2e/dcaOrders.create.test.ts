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
import { createSdkTestSetup } from './utils/createSdkTestSetup'

jest.setTimeout(300000)

/**
 * @group e2e
 */
describe('Armada Protocol - DCA Orders', () => {
  const { sdk } = createSdkTestSetup()

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

    const orderTx = await sdk.armada.dca.createStrategyTx({
      chainId,
      order: {
        chainId,
        userAddress,
        fromVault: fromVault.fleetAddressValue,
        toVault: toVault.fleetAddressValue,
        amount: amount.toSolidityValue().toString(),
        intervalSeconds: 3600,
        maxTrades: 10,
      },
      inAssetFeed: fromVault.chainlinkOracleAddressValue,
      outAssetFeed: toVault.chainlinkOracleAddressValue,
    })

    // get order ID from the executed transaction response

    const order = await sdk.armada.dca.createAndSaveBuyOrder({
      orderId: `test-order-${Date.now()}`,
      userAddress: userAddress,
      chainId,
      fromVault: fromVault.fleetAddressValue,
      toVault: toVault.fleetAddressValue,
      signTypedData: account.signTypedData,
      amount: amount,
      slippagePercentage: '0.5',
      intervalSeconds: 3600,
      firstExecutionUnixTimestamp: Math.floor(Date.now() / 1000) + 3600,
      maxTrades: 10,
    })

    assert(order.id, 'Expected order id to be defined')
    console.log('Created DCA order with ID:', order.id)

    const fetchedOrder = await sdk.armada.dca.getBuyOrder({
      orderId: order.id,
      userAddress: userAddress,
    })

    assert(fetchedOrder, 'Expected created order to be retrievable')
    assert.strictEqual(fetchedOrder.id, order.id)
    console.log('Fetched DCA order with ID:', fetchedOrder.id)
  })
})
