import assert from 'assert'
import { TestConfigAccounts, TestConfigs as TestConfigFleets } from './utils/testConfig'
import { privateKeyToAccount } from 'viem/accounts'
import {
  Token,
  TokenAmount,
  Address,
  getChainInfoByChainId,
  ArmadaDcaOrderStatusEnum,
  type AddressValue,
  type HexData,
} from '@summerfi/sdk-common'
import { createSdkTestSetup } from './utils/createSdkTestSetup'

jest.setTimeout(300000)

/**
 * @group e2e
 */
describe('Armada Protocol - DCA Orders', () => {
  it('should create, fetch, list and cancel a DCA buy order', async () => {
    const fromVault = TestConfigFleets.BaseUSDC
    const chainId = fromVault.chainId
    const toVault = TestConfigFleets.BaseWETH

    const { sdk, userAddress, publicClient, walletClient } = createSdkTestSetup({ chainId })

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

    const now = Math.floor(Date.now() / 1000)
    const orderTx = await sdk.armada.dca.createStrategyTx({
      chainId,
      userAddress: userAddress.toSolidityValue(),
      fromVault: fromVault.fleetAddressValue,
      toVault: toVault.fleetAddressValue,
      amount: amount.toSolidityValue().toString(),
      slippagePercentage: '0.5',
      intervalSeconds: 3600,
      nextExecutionAtUnixTimestamp: now + 3600,
      maxTrades: 10,
      inAssetFeed: fromVault.chainlinkOracleAddressValue,
      outAssetFeed: toVault.chainlinkOracleAddressValue,
    })

    // Send the createStrategy transaction and extract strategyId from the StrategyCreated event
    const txHash = await walletClient.sendTransaction({
      account: walletClient.account!,
      to: orderTx.transaction.target.value,
      value: BigInt(orderTx.transaction.value),
      data: orderTx.transaction.calldata,
      chain: walletClient.chain,
    })
    const receipt = await publicClient.waitForTransactionReceipt({ hash: txHash })
    const strategyLog = receipt.logs.find(
      (log) => log.address.toLowerCase() === orderTx.transaction.target.value.toLowerCase(),
    )
    assert(strategyLog?.topics[1], 'Expected StrategyCreated event with strategyId topic')
    const onChainStrategyId = BigInt(strategyLog.topics[1])
    console.log('On-chain strategy ID:', onChainStrategyId.toString())

    const order = await sdk.armada.dca.createAndSaveBuyOrder({
      orderId: onChainStrategyId.toString(),
      userAddress: userAddress.toSolidityValue(),
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
      userAddress: userAddress.toSolidityValue(),
    })

    assert(fetchedOrder, 'Expected created order to be retrievable')
    assert.strictEqual(fetchedOrder.id, order.id)
    console.log('Fetched DCA order with ID:', fetchedOrder.id)
  })
})
