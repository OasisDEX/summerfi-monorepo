import {
  EmodeType,
  SparkLendingPoolId,
  SparkProtocol,
  isSparkLendingPoolId,
  isSparkProtocol,
  AaveV3LendingPoolId,
  AaveV3LendingPosition,
  AaveV3LendingPositionId,
  AaveV3Protocol,
  isAaveV3LendingPool,
  isAaveV3Protocol,
} from '@summerfi/protocol-plugins'
import { makeSDK, type Chain } from '@summerfi/sdk-client'
import {
  Address,
  AddressValue,
  ChainFamilyMap,
  CommonTokenSymbols,
  IToken,
  Percentage,
  TokenAmount,
  isLendingPool,
  Maybe,
  Order,
  PositionsManager,
  RefinanceParameters,
  LendingPositionType,
} from '@summerfi/sdk-common'

import { TransactionUtils } from '@summerfi/testing-utils'
import assert from 'assert'
import { Hex } from 'viem'

jest.setTimeout(300000)

/** TEST CONFIG */
const config = {
  SDKAPiUrl: 'https://72dytt1e93.execute-api.us-east-1.amazonaws.com/api/sdk',
  TenderlyForkUrl: 'https://virtual.mainnet.rpc.tenderly.co/28f27b3b-bafb-4902-a1a0-53668b179117',
  DPMAddress: '0xb2f1349068c1cb6a596a22a3531b8062778c9da4',
  walletAddress: '0xDDc68f9dE415ba2fE2FD84bc62Be2d2CFF1098dA',
  source: {
    collateralTokenSymbol: CommonTokenSymbols.wstETH,
    collateralAmount: '10',
    debtTokenSymbol: CommonTokenSymbols.USDC,
    debtAmount: '0',
  },
  target: {
    collateralTokenSymbol: CommonTokenSymbols.WETH,
    debtTokenSymbol: CommonTokenSymbols.DAI,
  },
  sendTransactionEnabled: true,
}

describe.skip('Refinance AaveV3 Spark | SDK', () => {
  it('should allow refinance AaveV3 -> Spark with any pair', async () => {
    // SDK
    const sdk = makeSDK({ apiURL: config.SDKAPiUrl })

    // Chain
    const chain: Maybe<Chain> = await sdk.chains.getChain({
      chainInfo: ChainFamilyMap.Ethereum.Mainnet,
    })

    assert(chain, 'Chain not found')

    // User
    const walletAddress = Address.createFromEthereum({
      value: config.walletAddress as AddressValue,
    })
    const userClient = await sdk.users.getUserClient({
      chainInfo: chain.chainInfo,
      walletAddress: walletAddress,
    })
    expect(userClient).toBeDefined()
    expect(userClient.user.wallet.address).toEqual(walletAddress)
    expect(userClient.user.chainInfo).toEqual(chain.chainInfo)

    // Positions Manager
    const positionsManager = PositionsManager.createFrom({
      address: Address.createFromEthereum({
        value: config.DPMAddress as AddressValue,
      }),
    })

    // Tokens
    const sourceDebtToken: Maybe<IToken> = await chain.tokens.getTokenBySymbol({
      symbol: config.source.debtTokenSymbol,
    })
    assert(sourceDebtToken, `${config.source.debtTokenSymbol} not found`)

    const sourceCollateralToken: Maybe<IToken> = await chain.tokens.getTokenBySymbol({
      symbol: config.source.collateralTokenSymbol,
    })
    assert(sourceCollateralToken, `${config.source.collateralTokenSymbol} not found`)

    const targetDebtToken: Maybe<IToken> = await chain.tokens.getTokenBySymbol({
      symbol: config.target.debtTokenSymbol,
    })
    assert(targetDebtToken, `${config.target.debtTokenSymbol} not found`)

    const targetCollateralToken: Maybe<IToken> = await chain.tokens.getTokenBySymbol({
      symbol: config.target.collateralTokenSymbol,
    })
    assert(targetCollateralToken, `${config.target.collateralTokenSymbol} not found`)

    const aaveV3 = AaveV3Protocol.createFrom({
      chainInfo: chain.chainInfo,
    })

    if (!isAaveV3Protocol(aaveV3)) {
      assert(false, 'AaveV3 protocol type is not lending')
    }

    const aaveV3PoolId = AaveV3LendingPoolId.createFrom({
      protocol: aaveV3,
      collateralToken: sourceCollateralToken,
      debtToken: sourceDebtToken,
      emodeType: EmodeType.None,
    })

    const aaveV3Pool = await chain.protocols.getLendingPool({
      poolId: aaveV3PoolId,
    })
    assert(aaveV3Pool, 'AaveV3 pool not found')

    if (!isAaveV3LendingPool(aaveV3Pool)) {
      assert(false, 'AaveV3 pool type is not lending')
    }

    // Source position
    const aaveV3Position = AaveV3LendingPosition.createFrom({
      subtype: LendingPositionType.Multiply,
      id: AaveV3LendingPositionId.createFrom({
        id: 'AaveV3Position',
      }),
      debtAmount: TokenAmount.createFrom({
        token: sourceDebtToken,
        amount: config.source.debtAmount,
      }),
      collateralAmount: TokenAmount.createFrom({
        token: sourceCollateralToken,
        amount: config.source.collateralAmount,
      }),
      pool: aaveV3Pool,
    })

    // Target protocol
    const spark = SparkProtocol.createFrom({
      chainInfo: chain.chainInfo,
    })
    assert(spark, 'Spark not found')

    if (!isSparkProtocol(spark)) {
      assert(false, 'Protocol type is not Spark')
    }

    const poolId = SparkLendingPoolId.createFrom({
      protocol: spark,
      collateralToken: targetCollateralToken,
      debtToken: targetDebtToken,
      emodeType: EmodeType.None,
    })

    const sparkPool = await chain.protocols.getLendingPool({
      poolId,
    })

    assert(sparkPool, 'Pool not found')

    if (!isSparkLendingPoolId(sparkPool.id)) {
      assert(false, 'Pool ID is not a Spark one')
    }

    if (!isLendingPool(sparkPool)) {
      assert(false, 'Spark pool type is not lending')
    }

    const sparkPoolInfo = await chain.protocols.getLendingPoolInfo({
      poolId,
    })

    assert(sparkPoolInfo, 'Pool info not found')

    const refinanceParameters = RefinanceParameters.createFrom({
      sourcePosition: aaveV3Position,
      targetPool: sparkPool,
      slippage: Percentage.createFrom({ value: 0.2 }),
    })

    const refinanceSimulation =
      await sdk.simulator.refinance.simulateRefinancePosition(refinanceParameters)

    expect(refinanceSimulation).toBeDefined()

    expect(refinanceSimulation.sourcePosition?.id).toEqual(aaveV3Position.id)
    expect(refinanceSimulation.targetPosition.pool.id).toEqual(sparkPool.id)

    const refinanceOrder: Maybe<Order> = await userClient.newOrder({
      positionsManager,
      simulation: refinanceSimulation,
    })

    assert(refinanceOrder, 'Order not found')

    if (config.sendTransactionEnabled) {
      // Send transaction
      console.log('Sending transaction...')

      const privateKey = process.env.DEPLOYER_PRIVATE_KEY as Hex
      const transactionUtils = new TransactionUtils({
        chainInfo: chain.chainInfo,
        rpcUrl: config.TenderlyForkUrl,
        walletPrivateKey: privateKey,
      })

      const receipt = await transactionUtils.sendTransaction({
        transaction: refinanceOrder.transactions[0].transaction,
      })

      console.log('Transaction sent:', receipt)
    }
  })
})
