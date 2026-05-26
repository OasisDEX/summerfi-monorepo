import assert from 'assert'
import { TestConfigs as TestConfigFleets } from './utils/testConfig'
import {
  Token,
  TokenAmount,
  Address,
  getChainInfoByChainId,
  type AddressValue,
} from '@summerfi/sdk-common'
import { createSdkTestSetup } from './utils/createSdkTestSetup'

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

    const strategyTx = await sdk.dca.createStrategyTx({
      chainId,
      userAddress: userAddress.toSolidityValue(),
      fromVault: fromVault.fleetAddressValue,
      toVault: toVault.fleetAddressValue,
      inAsset: fromVaultToken.address.toSolidityValue(),
      outAsset: toVaultToken.address.toSolidityValue(),
      inAssetFeed: fromVault.chainlinkOracleAddressValue,
      outAssetFeed: toVault.chainlinkOracleAddressValue,
      amountShares: amount.toSolidityValue().toString(),
      slippagePercentage: '0.5',
      intervalSeconds: 60 * 60, // hourly
      maxTrades: 5,
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

    const fetchedStrategy = await sdk.dca.getStrategy({
      chainId,
      strategyId: onChainStrategyId.toString(),
    })

    assert(fetchedStrategy, 'Expected created strategy to be retrievable')
    assert.strictEqual(
      fetchedStrategy.id,
      onChainStrategyId.toString(),
      'Fetched strategy ID should match on-chain strategy ID',
    )
    console.log('Fetched DCA strategy with ID:', fetchedStrategy.id)
  })
})
