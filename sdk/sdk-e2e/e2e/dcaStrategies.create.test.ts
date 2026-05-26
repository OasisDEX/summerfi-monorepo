import assert from 'assert'
import { TestConfigs as TestConfigFleets } from './utils/testConfig'
import { createSdkTestSetup } from './utils/createSdkTestSetup'
import { retryUntilDefined } from './utils/retryUntilDefined'

jest.setTimeout(300000)

/**
 * @group e2e
 */
describe('Armada Protocol - DCA Strategies', () => {
  it('should create, fetch, list and cancel a DCA buy strategy', async () => {
    const fromVault = TestConfigFleets.BaseUSDC
    const chainId = fromVault.chainId
    const toVault = TestConfigFleets.BaseWETH
    const { sdk, userAddress, publicClient, walletClient } = createSdkTestSetup({ chainId })

    const [fromVaultToken, toVaultToken] = await Promise.all([
      sdk.tokens.getTokenBySymbol({
        chainId,
        symbol: fromVault.symbol,
      }),
      sdk.tokens.getTokenBySymbol({
        chainId,
        symbol: toVault.symbol,
      }),
    ])

    const amountShares = '1000000' // 1 USDC in shares (6 decimals)

    const [strategyTx] = await sdk.dca.createStrategyTx({
      chainId,
      userAddress: userAddress.toSolidityValue(),
      fromVault: fromVault.fleetAddressValue,
      toVault: toVault.fleetAddressValue,
      inAsset: fromVaultToken.address.toSolidityValue(),
      outAsset: toVaultToken.address.toSolidityValue(),
      inAssetFeed: fromVault.chainlinkOracleAddressValue,
      outAssetFeed: toVault.chainlinkOracleAddressValue,
      amountShares,
      slippagePercentage: '0.5',
      intervalSeconds: 60 * 60 * 24, // daily
      maxTrades: 1,
      deadlineUnixTimestamp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7, // 1 week from now
    })

    // Send the createStrategy transaction and extract strategyId from the StrategyCreated event
    const txHash = await walletClient.sendTransaction({
      account: walletClient.account!,
      to: strategyTx.transaction.target.value,
      value: BigInt(strategyTx.transaction.value),
      data: strategyTx.transaction.calldata,
      chain: walletClient.chain,
    })
    const receipt = await publicClient.waitForTransactionReceipt({ hash: txHash })
    const strategyLog = receipt.logs.find(
      (log) => log.address.toLowerCase() === strategyTx.transaction.target.value.toLowerCase(),
    )
    assert(strategyLog?.topics[1], 'Expected StrategyCreated event with strategyId topic')
    const onChainStrategyId = BigInt(strategyLog.topics[1])
    console.log('On-chain strategy ID:', onChainStrategyId.toString())

    const fetchedStrategy = await retryUntilDefined(() =>
      sdk.dca.getStrategy({
        chainId,
        strategyId: onChainStrategyId.toString(),
      }),
    )

    assert(fetchedStrategy !== undefined, 'Expected created strategy to be retrievable')
    assert.strictEqual(
      fetchedStrategy.id,
      onChainStrategyId.toString(),
      'Fetched strategy ID should match on-chain strategy ID',
    )
    console.log('Fetched DCA strategy with ID:', fetchedStrategy.id)
  })
})
