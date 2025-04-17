import {
  EmodeType,
  MorphoLendingPoolId,
  MorphoLendingPosition,
  MorphoLendingPositionId,
  MorphoProtocol,
  isMorphoLendingPool,
  isMorphoProtocol,
  SparkLendingPoolId,
  SparkProtocol,
  isSparkLendingPoolId,
  isSparkProtocol,
} from '@summerfi/protocol-plugins'
import { makeSDK, type Chain } from '@summerfi/sdk-client'
import {
  Address,
  AddressValue,
  ChainFamilyMap,
  CommonTokenSymbols,
  IRefinanceSimulation,
  IToken,
  Percentage,
  TokenAmount,
  isLendingPool,
  type Maybe,
} from '@summerfi/sdk-common'
import {
  LendingPositionType,
  Order,
  PositionsManager,
  RefinanceParameters,
} from '@summerfi/sdk-common'
import { TransactionUtils } from '@summerfi/testing-utils'

import assert from 'assert'
import { Hex } from 'viem'

jest.setTimeout(300000)

/** TEST CONFIG */
const config = {
  SDKAPiUrl: 'https://zmjmtfsocb.execute-api.us-east-1.amazonaws.com/api/sdk',
  TenderlyForkUrl: 'https://virtual.mainnet.rpc.tenderly.co/5fa32626-1a0c-4e37-b0c0-351e2f5aa885',
  DPMAddress: '0x302a28D7968824f386F278a72368856BC4d82BA4',
  walletAddress: '0xbEf4befb4F230F43905313077e3824d7386E09F8',
  collateralTokenSymbol: CommonTokenSymbols.wstETH,
  collateralAmount: '0.025000000000000000',
  debtTokenSymbol: CommonTokenSymbols.USDC,
  debtAmount: '21',
  sendTransactionEnabled: true,
}

describe.skip('Refinance Morpho Spark | SDK', () => {
  it('should allow refinance Maker -> Spark with same pair', async () => {
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
    const debtToken: Maybe<IToken> = await chain.tokens.getTokenBySymbol({
      symbol: config.debtTokenSymbol,
    })
    assert(debtToken, `${config.debtTokenSymbol} not found`)

    const collateralToken: Maybe<IToken> = await chain.tokens.getTokenBySymbol({
      symbol: config.collateralTokenSymbol,
    })
    assert(collateralToken, `${config.collateralTokenSymbol} not found`)

    const morpho = MorphoProtocol.createFrom({
      chainInfo: chain.chainInfo,
    })

    if (!isMorphoProtocol(morpho)) {
      assert(false, 'Maker protocol type is not lending')
    }

    const morphoPoolId = MorphoLendingPoolId.createFrom({
      protocol: morpho,
      marketId: '0xB323495F7E4148BE5643A4EA4A8221EEF163E4BCCFDEDC2A6F4696BAACBC86CC',
    })

    const morphoPool = await chain.protocols.getLendingPool({
      poolId: morphoPoolId,
    })
    assert(morphoPool, 'Maker pool not found')

    if (!isMorphoLendingPool(morphoPool)) {
      assert(false, 'Maker pool type is not lending')
    }

    // Source position
    const morphoPosition = MorphoLendingPosition.createFrom({
      subtype: LendingPositionType.Multiply,
      id: MorphoLendingPositionId.createFrom({
        id: 'MorphoPosition',
      }),
      debtAmount: TokenAmount.createFrom({
        token: debtToken,
        amount: config.debtAmount,
      }),
      collateralAmount: TokenAmount.createFrom({
        token: collateralToken,
        amount: config.collateralAmount,
      }),
      pool: morphoPool,
    })

    // Target protocol
    const spark = SparkProtocol.createFrom({
      chainInfo: chain.chainInfo,
    })

    if (!isSparkProtocol(spark)) {
      assert(false, 'Protocol type is not Spark')
    }

    const poolId = SparkLendingPoolId.createFrom({
      protocol: spark,
      collateralToken: collateralToken,
      debtToken: debtToken,
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

    const refinanceParameters = RefinanceParameters.createFrom({
      sourcePosition: morphoPosition,
      targetPool: sparkPool,
      slippage: Percentage.createFrom({ value: 0.2 }),
    })

    const refinanceSimulation: IRefinanceSimulation =
      await sdk.simulator.refinance.simulateRefinancePosition(refinanceParameters)

    expect(refinanceSimulation).toBeDefined()

    expect(refinanceSimulation.sourcePosition?.id).toEqual(morphoPosition.id)
    expect(refinanceSimulation.targetPosition.pool.id).toEqual(sparkPool.id)

    const refinanceOrder: Maybe<Order> = await userClient.newOrder({
      positionsManager,
      simulation: refinanceSimulation,
    })

    assert(refinanceOrder, 'Order not found')

    // Send transaction
    console.log('Sending transaction...')

    if (config.sendTransactionEnabled) {
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
