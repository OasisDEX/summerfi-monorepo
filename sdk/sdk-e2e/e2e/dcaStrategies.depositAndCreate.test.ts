import assert from 'assert'
import { decodeFunctionData } from 'viem'
import { TestConfigs as TestConfigFleets } from './utils/testConfig'
import { createSdkTestSetup } from './utils/createSdkTestSetup'
import { retryUntilDefined } from './utils/retryUntilDefined'
import { TransactionType } from '@summerfi/sdk-common'

jest.setTimeout(300000)

// Flip this to choose which Permit2 branch of `depositAndCreateStrategyTx` this run exercises:
const REVOKE_PERMIT2_FIRST = true
// Unlike the deposit-less create test, `depositAndCreateStrategyTx` (encodes `depositAndCreate`) pulls
// `assetAmount` of the in-asset (USDC) from the wallet at creation, converting it into source-vault
// shares. This test therefore runs against LIVE Base and CONSUMES `assetAmount` USDC each run — keep it
// small and ensure the wallet holds at least this much USDC, or `depositAndCreate` reverts with
// "ERC20: transfer amount exceeds balance".
const amountShares = 1000000n // per-trade source-vault share amount (6 decimals)
const maxTrades = 1n
const amount = amountShares * maxTrades
const assetAmount = 100000n // 0.1 USDC principal deposited at creation (6 decimals)

/**
 * @group e2e
 */
describe('Armada Protocol - DCA Strategies (deposit + create)', () => {
  it('should deposit, create, fetch and cancel a DCA buy strategy', async () => {
    const fromVault = TestConfigFleets.BaseUSDC
    const chainId = fromVault.chainId
    const toVault = TestConfigFleets.BaseWETH
    const { sdk, userAddress, publicClient, walletClient } = createSdkTestSetup({
      chainId,
    })

    // Send a returned TransactionInfo and wait for it to mine.
    const sendTxInfo = async (
      label: string,
      txInfo: {
        transaction: { target: { value: `0x${string}` }; value: string; calldata: `0x${string}` }
      },
      confirmations = 3,
    ) => {
      const hash = await walletClient.sendTransaction({
        account: walletClient.account!,
        to: txInfo.transaction.target.value,
        value: BigInt(txInfo.transaction.value),
        data: txInfo.transaction.calldata,
        chain: walletClient.chain,
      })
      console.log(`Sent ${label} transaction, hash:`, hash)
      const receipt = await publicClient.waitForTransactionReceipt({
        hash,
        confirmations,
      })
      return { hash, receipt }
    }

    // Put the source-vault → Permit2 ERC20 allowance into the state this run wants to test, so the
    // subsequent depositAndCreateStrategyTx deterministically includes (or omits) the Permit2Authorization tx.
    const sourceVaultShares = fromVault.fleetAddressValue
    const isAuthorized = !(await sdk.allowance.isPermit2AuthorizationNeeded({
      chainId,
      ownerAddress: userAddress.toSolidityValue(),
      tokenAddress: sourceVaultShares,
      amount, // any non-zero amount will do, since we only care about whether the allowance is non-zero
    }))

    // Make the branch deterministic regardless of leftover on-chain state:
    //  - REVOKE branch: if currently authorized, revoke so the tx list MUST include the auth tx.
    //  - non-REVOKE branch: if currently not authorized, authorize so the tx list OMITS the auth tx.
    if (REVOKE_PERMIT2_FIRST && isAuthorized) {
      const [revokeTx] = await sdk.allowance.getPermit2RevokeTx({
        chainId,
        tokenAddress: sourceVaultShares,
      })
      await sendTxInfo('Permit2 revoke (approve Permit2 → 0)', revokeTx, 5)
    } else if (!REVOKE_PERMIT2_FIRST && !isAuthorized) {
      const [authTx] = await sdk.allowance.getPermit2AuthorizationTx({
        chainId,
        tokenAddress: sourceVaultShares,
      })
      await sendTxInfo('Permit2 authorization (approve Permit2 → max)', authTx)
    }

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

    const txs = await sdk.dca.depositAndCreateStrategyTx({
      chainId,
      userAddress: userAddress.toSolidityValue(),
      fromVault: fromVault.fleetAddressValue,
      toVault: toVault.fleetAddressValue,
      inAsset: fromVaultToken.address.toSolidityValue(),
      outAsset: toVaultToken.address.toSolidityValue(),
      inAssetFeed: { feed: fromVault.chainlinkOracleAddressValue!, maxStaleness: 0n },
      outAssetFeed: { feed: toVault.chainlinkOracleAddressValue!, maxStaleness: 0n },
      amountShares: amountShares.toString(),
      assetAmount: assetAmount.toString(),
      slippagePercentage: '0.5',
      intervalSeconds: 60 * 60 * 24, // daily
      maxTrades: Number(maxTrades.toString()),
      deadlineUnixTimestamp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7, // 1 week from now
    })

    expect(txs).toBeDefined()
    expect(txs.length).toBeGreaterThan(0)

    const strategyTx = txs.find((tx) => tx.type === TransactionType.CreateStrategy)
    assert(strategyTx, 'Expected a CreateStrategy transaction')
    // The CreateStrategy tx must be the last element — all setup (permit2 + approval) precedes it.
    assert.strictEqual(
      txs[txs.length - 1],
      strategyTx,
      'CreateStrategy transaction should be the last element',
    )

    const permit2AuthTx = txs.find((tx) => tx.type === TransactionType.Permit2Authorization)
    if (REVOKE_PERMIT2_FIRST) {
      assert(
        permit2AuthTx,
        'Expected a leading Permit2Authorization tx after revoking the allowance',
      )
      assert.strictEqual(txs[0], permit2AuthTx, 'Permit2Authorization must be the first element')
    } else {
      assert(!permit2AuthTx, 'Did not expect a Permit2Authorization tx when already authorized')
    }

    // A Permit2 sub-allowance (recurring keeper-pull allowance on the source-vault shares) is always
    // returned; the ERC20 Permit2 authorization is only present when the allowance is insufficient.
    const permit2SubAllowanceTx = txs.find((tx) => tx.type === TransactionType.Permit2SubAllowance)
    assert(permit2SubAllowanceTx, 'Expected a Permit2SubAllowance transaction')
    // Decode the sub-allowance: PERMIT2.approve(sourceVault, manager, MaxUint160, MaxUint48).
    const permit2ApproveAbi = [
      {
        type: 'function',
        name: 'approve',
        stateMutability: 'nonpayable',
        inputs: [
          { name: 'token', type: 'address' },
          { name: 'spender', type: 'address' },
          { name: 'amount', type: 'uint160' },
          { name: 'expiration', type: 'uint48' },
        ],
        outputs: [],
      },
    ] as const
    const decodedSubAllowance = decodeFunctionData({
      abi: permit2ApproveAbi,
      data: permit2SubAllowanceTx.transaction.calldata,
    })
    assert.strictEqual(decodedSubAllowance.functionName, 'approve')
    assert.strictEqual(
      decodedSubAllowance.args[0].toLowerCase(),
      fromVault.fleetAddressValue.toLowerCase(),
      'sub-allowance token should be the source vault share token',
    )
    assert(decodedSubAllowance.args[2] > 0n, 'sub-allowance amount should be non-zero')

    // Send every setup transaction (permit2 authorization?, permit2 sub-allowance, inAsset approval?)
    // in tuple order, then the create last. depositAndCreate pulls assetAmount of the in-asset from the
    // user, and the keeper pull needs the Permit2 sub-allowance — so all must be mined first.
    const setupTxs = txs.slice(0, txs.length - 1)
    for (const setupTx of setupTxs) {
      await sendTxInfo(setupTx.type, setupTx)
    }

    const { receipt } = await sendTxInfo(strategyTx.type, strategyTx)
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
