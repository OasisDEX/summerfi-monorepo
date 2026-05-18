import assert from 'assert'
import { privateKeyToAccount } from 'viem/accounts'
import {
  Token,
  TokenAmount,
  Address,
  getChainInfoByChainId,
  type AddressValue,
  ArmadaDcaOrderStatusEnum,
} from '@summerfi/sdk-common'
import { TestConfigAccounts, TestConfigs, type TestConfigKey } from './utils/testConfig'
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

    it('should get a buy order by id and list buy orders', async () => {
      const setup = createSdkTestSetup(testConfigKey)
      const { sdk, chainId } = setup

      const fromVault = TestConfigs.BaseUSDC
      const toVault = TestConfigs.BaseWETH
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
        userAddress,
        chainId,
        fromVault: fromVault.fleetAddressValue,
        toVault: toVault.fleetAddressValue,
        signTypedData: account.signTypedData,
        amount,
        slippagePercentage: '0.5',
        intervalSeconds: 3600,
        firstExecutionUnixTimestamp: Math.floor(Date.now() / 1000) + 3600,
        maxTrades: 10,
      })

      assert(order.id, 'Expected order id to be defined')
      console.log(`[Read] Created order:`, JSON.stringify(order, null, 2))

      // getBuyOrder by id
      const fetchedOrder = await sdk.armada.dca.getBuyOrder({
        orderId: order.id,
        userAddress,
      })

      assert(fetchedOrder, 'Expected order to be retrievable by id')
      assert.strictEqual(fetchedOrder.id, order.id)
      console.log(`[Read] Fetched order by id:`, JSON.stringify(fetchedOrder, null, 2))

      // getBuyOrders with optional status filter
      const orders = await sdk.armada.dca.getBuyOrders({
        userAddress,
        chainId,
        status,
      })

      assert(Array.isArray(orders), 'Expected orders to be an array')
      console.log(
        `[Read] Orders (status=${status ?? 'all'}, count=${orders.length}):`,
        JSON.stringify(orders, null, 2),
      )

      // clean up — cancel the order so it doesn't linger as active
      const signedMessage = `I want to cancel ${order.id}.`
      const signature = await account.signMessage({ message: signedMessage })
      await sdk.armada.dca.cancelBuyOrder({
        orderId: order.id,
        userAddress,
        signedMessage,
        signature,
      })
    })
  })
})
