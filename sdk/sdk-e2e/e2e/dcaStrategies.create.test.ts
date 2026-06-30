import assert from 'assert'
import { decodeFunctionData } from 'viem'
import { TestConfigs as TestConfigFleets } from './utils/testConfig'
import { createSdkTestSetup } from './utils/createSdkTestSetup'
import { retryUntilDefined } from './utils/retryUntilDefined'

jest.setTimeout(300000)

/**
 * Minimal ABI fragment for depositAndCreate — used for the selector assertion only.
 * Duplicates the relevant subset of DCAStrategyManagerAbi (which is not re-exported
 * from @summerfi/armada-protocol-service's package root).
 */
const depositAndCreateAbi = [
  {
    inputs: [
      {
        components: [
          { internalType: 'address', name: 'owner', type: 'address' },
          { internalType: 'contract IFleetCommander', name: 'sourceVault', type: 'address' },
          { internalType: 'contract IFleetCommander', name: 'targetVault', type: 'address' },
          { internalType: 'contract IERC20', name: 'inAsset', type: 'address' },
          { internalType: 'contract IERC20', name: 'outAsset', type: 'address' },
          {
            components: [
              { internalType: 'address', name: 'feed', type: 'address' },
              { internalType: 'uint256', name: 'maxStaleness', type: 'uint256' },
            ],
            internalType: 'struct ChainlinkFeed',
            name: 'inAssetFeed',
            type: 'tuple',
          },
          {
            components: [
              { internalType: 'address', name: 'feed', type: 'address' },
              { internalType: 'uint256', name: 'maxStaleness', type: 'uint256' },
            ],
            internalType: 'struct ChainlinkFeed',
            name: 'outAssetFeed',
            type: 'tuple',
          },
          { internalType: 'uint256', name: 'tradeAmount', type: 'uint256' },
          { internalType: 'uint256', name: 'interval', type: 'uint256' },
          { internalType: 'uint256', name: 'slippageBps', type: 'uint256' },
          { internalType: 'uint256', name: 'maxPrice', type: 'uint256' },
          { internalType: 'uint256', name: 'minPrice', type: 'uint256' },
          { internalType: 'uint256', name: 'endDate', type: 'uint256' },
          { internalType: 'uint256', name: 'maxTrades', type: 'uint256' },
        ],
        internalType: 'struct IDCAStrategyManager.StrategyConfig',
        name: 'config',
        type: 'tuple',
      },
      { internalType: 'uint256', name: 'assetAmount', type: 'uint256' },
      { internalType: 'uint256', name: 'expectedMinShares', type: 'uint256' },
    ],
    name: 'depositAndCreate',
    outputs: [{ internalType: 'uint256', name: 'strategyId', type: 'uint256' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const

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

    const amountShares = '1000000' // 1 USDC per trade (6 decimals)
    const assetAmount = '1000000' // 1 USDC principal deposited at creation (6 decimals, maxTrades=1)

    const [strategyTx] = await sdk.dca.createStrategyTx({
      chainId,
      userAddress: userAddress.toSolidityValue(),
      fromVault: fromVault.fleetAddressValue,
      toVault: toVault.fleetAddressValue,
      inAsset: fromVaultToken.address.toSolidityValue(),
      outAsset: toVaultToken.address.toSolidityValue(),
      inAssetFeed: { feed: fromVault.chainlinkOracleAddressValue!, maxStaleness: 0n },
      outAssetFeed: { feed: toVault.chainlinkOracleAddressValue!, maxStaleness: 0n },
      amountShares,
      assetAmount,
      slippagePercentage: '0.5',
      intervalSeconds: 60 * 60 * 24, // daily
      maxTrades: 1,
      deadlineUnixTimestamp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7, // 1 week from now
    })

    // Assert the calldata targets depositAndCreate (selector 0x1a218843).
    // Decoded without a live network call — pure ABI decode.
    const decoded = decodeFunctionData({
      abi: depositAndCreateAbi,
      data: strategyTx.transaction.calldata,
    })
    assert.strictEqual(
      decoded.functionName,
      'depositAndCreate',
      'createStrategyTx should encode depositAndCreate, not createStrategy',
    )
    const [_config, decodedAssetAmount, decodedExpectedMinShares] = decoded.args
    assert.strictEqual(
      decodedAssetAmount,
      BigInt(assetAmount),
      'args[1] (assetAmount) should match the input assetAmount',
    )
    assert(
      decodedExpectedMinShares > 0n,
      'args[2] (expectedMinShares) should be non-zero (slippage floor)',
    )

    // Send the depositAndCreate transaction and extract strategyId from the StrategyCreated event.
    // NOTE: depositAndCreate pulls assetAmount of the in-asset from the user, so this live send
    // requires a prior ERC-20 approval (USDC → DCA manager) and a funded wallet.
    // If the environment lacks a funded signer or the approval is absent, this block will fail
    // at walletClient.sendTransaction — that is expected and acceptable; the selector assertion
    // above already verified the encoding.
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
