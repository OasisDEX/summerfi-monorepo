import assert from 'assert'
import { privateKeyToAccount } from 'viem/accounts'
import {
  Token,
  TokenAmount,
  Address,
  ChainIds,
  getChainInfoByChainId,
  type AddressValue,
  ArmadaDcaOrderStatusEnum,
} from '@summerfi/sdk-common'
import { TestConfigAccounts, TestConfigs } from './utils/testConfig'
import { createSdkTestSetup } from './utils/createSdkTestSetup'

jest.setTimeout(300000)

/**
 * @group e2e
 */
describe('Armada Protocol - DCA Orders Pause', () => {
  it('should pause an active buy order', async () => {
    const setup = createSdkTestSetup({ chainId: ChainIds.Base })
    const { sdk, chainId, userAddressValue: userAddress } = setup

    const fromVault = TestConfigs.BaseUSDC
    const toVault = TestConfigs.BaseWETH

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
    assert.strictEqual(order.status, ArmadaDcaOrderStatusEnum.Active)
    console.log(`[Pause] Created order:`, JSON.stringify(order, null, 2))

    const signedMessage = `I want to pause ${order.id}.`
    const signature = await account.signMessage({ message: signedMessage })

    const pausedOrder = await sdk.armada.dca.pauseBuyOrder({
      orderId: order.id,
      userAddress,
      signedMessage,
      signature,
    })

    assert.strictEqual(pausedOrder.status, ArmadaDcaOrderStatusEnum.Paused)
    console.log(`[Pause] Paused order:`, JSON.stringify(pausedOrder, null, 2))

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
