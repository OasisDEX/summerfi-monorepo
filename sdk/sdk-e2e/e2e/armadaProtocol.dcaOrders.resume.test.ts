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

const scenarios: { testConfigKey: TestConfigKey }[] = [{ testConfigKey: 'BaseUSDC' }]

/**
 * @group e2e
 */
describe('Armada Protocol - DCA Orders Resume', () => {
  describe.each(scenarios)('with scenario %#', (scenario) => {
    const { testConfigKey } = scenario

    it('should resume a paused buy order', async () => {
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
      console.log(`[Resume] Created order:`, JSON.stringify(order, null, 2))

      // pause first
      const pauseMessage = `I want to pause ${order.id}.`
      const pauseSignature = await account.signMessage({ message: pauseMessage })
      const pausedOrder = await sdk.armada.dca.pauseBuyOrder({
        orderId: order.id,
        userAddress,
        signedMessage: pauseMessage,
        signature: pauseSignature,
      })

      assert.strictEqual(pausedOrder.status, ArmadaDcaOrderStatusEnum.Paused)
      console.log(`[Resume] Paused order:`, JSON.stringify(pausedOrder, null, 2))

      // resume
      const resumeMessage = `I want to resume ${order.id}.`
      const resumeSignature = await account.signMessage({ message: resumeMessage })
      const resumedOrder = await sdk.armada.dca.resumeBuyOrder({
        orderId: order.id,
        userAddress,
        signedMessage: resumeMessage,
        signature: resumeSignature,
      })

      assert.strictEqual(resumedOrder.status, ArmadaDcaOrderStatusEnum.Active)
      console.log(`[Resume] Resumed order:`, JSON.stringify(resumedOrder, null, 2))

      // clean up — cancel the order
      const cancelMessage = `I want to cancel ${order.id}.`
      const cancelSignature = await account.signMessage({ message: cancelMessage })
      await sdk.armada.dca.cancelBuyOrder({
        orderId: order.id,
        userAddress,
        signedMessage: cancelMessage,
        signature: cancelSignature,
      })
    })
  })
})
