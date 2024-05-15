import { ProtocolClient, makeSDK, type Chain, type User } from '@summerfi/sdk-client'
import { ProtocolName, isLendingPool } from '@summerfi/sdk-common/protocols'
import { EmodeType } from '@summerfi/protocol-plugins/plugins/common'
import {
  AddressValue,
  CommonTokenSymbols,
  RefinanceSimulationTypes,
  ISimulation,
  Percentage,
  TokenAmount,
  Address,
  type Maybe,
  ChainFamilyMap,
  PositionType,
  IToken,
} from '@summerfi/sdk-common'
import { PositionsManager, Order, RefinanceParameters } from '@summerfi/sdk-common/orders'
import {
  SparkLendingPoolId,
  isSparkLendingPoolId,
  isSparkProtocol,
} from '@summerfi/protocol-plugins/plugins/spark'
import {
  MorphoLendingPoolId,
  MorphoPosition,
  MorphoPositionId,
  isMorphoLendingPool,
  isMorphoProtocol,
} from '@summerfi/protocol-plugins/plugins/morphoblue'

import assert from 'assert'
import { TransactionUtils } from './utils/TransactionUtils'
import { Hex } from 'viem'

jest.setTimeout(300000)

/** TEST CONFIG */
const config = {
  SDKAPiUrl: 'https://zmjmtfsocb.execute-api.us-east-1.amazonaws.com/api/sdk',
  TenderlyForkUrl: 'https://virtual.mainnet.rpc.tenderly.co/508f2861-d790-43f6-a6f0-b1c1f1854bc2',
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
    const user: User = await sdk.users.getUser({
      chainInfo: chain.chainInfo,
      walletAddress: walletAddress,
    })
    expect(user).toBeDefined()
    expect(user.wallet.address).toEqual(walletAddress)
    expect(user.chainInfo).toEqual(chain.chainInfo)

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

    const morpho = await chain.protocols.getProtocol({ name: ProtocolName.Morpho })
    assert(morpho, 'Maker protocol not found')

    if (!isMorphoProtocol(morpho)) {
      assert(false, 'Maker protocol type is not lending')
    }

    const morphoPoolId = MorphoLendingPoolId.createFrom({
      protocol: morpho,
      marketId: '0xB323495F7E4148BE5643A4EA4A8221EEF163E4BCCFDEDC2A6F4696BAACBC86CC',
    })

    const morphoPool = await morpho.getLendingPool({
      poolId: morphoPoolId,
    })
    assert(morphoPool, 'Maker pool not found')

    if (!isMorphoLendingPool(morphoPool)) {
      assert(false, 'Maker pool type is not lending')
    }

    // Source position
    const morphoPosition = MorphoPosition.createFrom({
      type: PositionType.Multiply,
      id: MorphoPositionId.createFrom({
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
    const spark: Maybe<ProtocolClient> = await chain.protocols.getProtocol({
      name: ProtocolName.Spark,
    })
    assert(spark, 'Spark not found')

    if (!isSparkProtocol(spark)) {
      assert(false, 'Protocol type is not Spark')
    }

    const poolId = SparkLendingPoolId.createFrom({
      protocol: spark,
      collateralToken: collateralToken,
      debtToken: debtToken,
      emodeType: EmodeType.None,
    })

    const sparkPool = await spark.getLendingPool({
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

    const refinanceSimulation: ISimulation<RefinanceSimulationTypes> =
      await sdk.simulator.refinance.simulateRefinancePosition(refinanceParameters)

    expect(refinanceSimulation).toBeDefined()

    expect(refinanceSimulation.sourcePosition?.id).toEqual(morphoPosition.id)
    expect(refinanceSimulation.targetPosition.pool.id).toEqual(sparkPool.id)

    const refinanceOrder: Maybe<Order> = await user.newOrder({
      positionsManager,
      simulation: refinanceSimulation,
    })

    assert(refinanceOrder, 'Order not found')

    // Send transaction
    console.log('Sending transaction...')

    if (config.sendTransactionEnabled) {
      const privateKey = process.env.DEPLOYER_PRIVATE_KEY as Hex
      const transactionUtils = new TransactionUtils({
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
