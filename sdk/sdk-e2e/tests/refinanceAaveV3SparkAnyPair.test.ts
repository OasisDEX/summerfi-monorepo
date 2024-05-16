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

import assert from 'assert'
import { TransactionUtils } from './utils/TransactionUtils'
import { Hex } from 'viem'
import {
  AaveV3LendingPoolId,
  AaveV3Position,
  AaveV3PositionId,
  isAaveV3LendingPool,
  isAaveV3Protocol,
} from '@summerfi/protocol-plugins'

jest.setTimeout(300000)

/** TEST CONFIG */
const config = {
  SDKAPiUrl: 'https://zmjmtfsocb.execute-api.us-east-1.amazonaws.com/api/sdk',
  TenderlyForkUrl: 'https://virtual.mainnet.rpc.tenderly.co/cc7432cd-f037-4aa8-a05f-ae6d8cefba39',
  DPMAddress: '0x551eb8395093fde4b9eef017c93593a3c7a75138',
  walletAddress: '0xbEf4befb4F230F43905313077e3824d7386E09F8',
  collateralTokenSymbol: CommonTokenSymbols.WETH,
  collateralAmount: '0.0198',
  debtTokenSymbol: CommonTokenSymbols.DAI,
  debtAmount: '26',
  sendTransactionEnabled: true,
}

describe.skip('Refinance AaveV3 Spark | SDK', () => {
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

    const aaveV3 = await chain.protocols.getProtocol({ name: ProtocolName.AAVEv3 })
    assert(aaveV3, 'AaveV3 protocol not found')

    if (!isAaveV3Protocol(aaveV3)) {
      assert(false, 'AaveV3 protocol type is not lending')
    }

    const aaveV3PoolId = AaveV3LendingPoolId.createFrom({
      protocol: aaveV3,
      collateralToken: collateralToken,
      debtToken: debtToken,
      emodeType: EmodeType.None,
    })

    const aaveV3Pool = await aaveV3.getLendingPool({
      poolId: aaveV3PoolId,
    })
    assert(aaveV3Pool, 'AaveV3 pool not found')

    if (!isAaveV3LendingPool(aaveV3Pool)) {
      assert(false, 'AaveV3 pool type is not lending')
    }

    // Source position
    const morphoPosition = AaveV3Position.createFrom({
      type: PositionType.Multiply,
      id: AaveV3PositionId.createFrom({
        id: 'AaveV3Position',
      }),
      debtAmount: TokenAmount.createFrom({
        token: debtToken,
        amount: config.debtAmount,
      }),
      collateralAmount: TokenAmount.createFrom({
        token: collateralToken,
        amount: config.collateralAmount,
      }),
      pool: aaveV3Pool,
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
