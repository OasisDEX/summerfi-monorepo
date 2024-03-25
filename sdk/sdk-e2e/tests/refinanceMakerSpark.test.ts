import {
  Percentage,
  PositionId,
  Token,
  TokenAmount,
  Position,
  Address,
  type Maybe,
  ChainFamilyMap,
} from '@summerfi/sdk-common/common'

import {
  ProtocolName,
  ILKType,
  isSparkPoolId,
  EmodeType,
  isLendingPool,
  MakerPoolId,
  SparkPoolId,
} from '@summerfi/sdk-common/protocols'
import { makeSDK, type Chain, type User, Protocol } from '@summerfi/sdk-client'
import { TokenSymbol } from '@summerfi/sdk-common/common/enums'
import { IRefinanceParameters, Order } from '@summerfi/sdk-common/orders'
import { Simulation, SimulationType } from '@summerfi/sdk-common/simulation'
import assert from 'assert'

//import { createFork } from '@summerfi/tenderly-utils'

describe.only('Refinance Maker Spark | SDK', () => {
  it('should allow refinance Maker -> Spark with same pair', async () => {
    //await createFork({ network: 'mainnet', atBlock: 19482638 })

    // SDK
    const apiURL = 'https://zmjmtfsocb.execute-api.us-east-1.amazonaws.com/api/sdk'
    const sdk = makeSDK({ apiURL })

    // Chain
    const chain: Maybe<Chain> = await sdk.chains.getChain({
      chainInfo: ChainFamilyMap.Ethereum.Mainnet,
    })

    assert(chain, 'Chain not found')

    // User
    const walletAddress = Address.createFromEthereum({
      value: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
    })
    const user: User = await sdk.users.getUser({
      chainInfo: chain.chainInfo,
      walletAddress: walletAddress,
    })
    expect(user).toBeDefined()
    expect(user.wallet.address).toEqual(walletAddress)
    expect(user.chainInfo).toEqual(chain.chainInfo)

    // Tokens
    const WETH: Maybe<Token> = await chain.tokens.getTokenBySymbol({ symbol: TokenSymbol.WETH })
    assert(WETH, 'WETH not found')

    const DAI: Maybe<Token> = await chain.tokens.getTokenBySymbol({ symbol: TokenSymbol.DAI })
    assert(DAI, 'DAI not found')

    const maker = await chain.protocols.getProtocol({ name: ProtocolName.Maker })
    assert(maker, 'Maker protocol not found')

    const makerPoolId: MakerPoolId = {
      protocol: {
        name: ProtocolName.Maker,
        chainInfo: chain.chainInfo,
      },
      ilkType: ILKType.ETH_A,
      vaultId: '31646',
    }

    const makerPool = await maker.getPool({
      poolId: makerPoolId,
    })
    assert(makerPool, 'Maker pool not found')

    if (!isLendingPool(makerPool)) {
      assert(false, 'Maker pool type is not lending')
    }

    // Source position
    const makerPosition: Position = Position.createFrom({
      positionId: PositionId.createFrom({ id: '31646' }),
      debtAmount: TokenAmount.createFromBaseUnit({
        token: DAI,
        amount: '3710455916381628559037000000000000000000000000000',
      }),
      collateralAmount: TokenAmount.createFromBaseUnit({
        token: WETH,
        amount: '2127004370346054622',
      }),
      pool: makerPool,
    })

    // Target protocol
    // TODO: this should have spark protocol type so we don't need to cast, derive it from the protocol name
    const spark: Maybe<Protocol> = await chain.protocols.getProtocol({
      name: ProtocolName.Spark,
    })
    assert(spark, 'Spark not found')

    const poolId: SparkPoolId = {
      protocol: {
        name: ProtocolName.Spark,
        chainInfo: chain.chainInfo,
      },
      emodeType: EmodeType.None,
    }

    const sparkPool = await spark.getPool({
      poolId,
    })

    assert(sparkPool, 'Pool not found')

    if (!isSparkPoolId(sparkPool.poolId)) {
      assert(false, 'Pool ID is not a Spark one')
    }

    if (!isLendingPool(sparkPool)) {
      assert(false, 'Spark pool type is not lending')
    }

    const refinanceSimulation: Simulation<SimulationType.Refinance> =
      await sdk.simulator.refinance.simulateRefinancePosition({
        position: makerPosition,
        targetPool: sparkPool,
        slippage: Percentage.createFrom({ value: 0.2 }),
      } as IRefinanceParameters)

    expect(refinanceSimulation).toBeDefined()

    expect(refinanceSimulation.sourcePosition?.positionId).toEqual(makerPosition.positionId)
    expect(refinanceSimulation.targetPosition.pool.poolId).toEqual(sparkPool.poolId)

    const refinanceOrder: Maybe<Order> = await user.newOrder({
      positionsManager: {
        address: Address.createFromEthereum({
          value: '0x551Eb8395093fDE4B9eeF017C93593a3C7a75138',
        }),
      },
      simulation: refinanceSimulation,
    })

    assert(refinanceOrder, 'Order not found')

    expect(refinanceOrder.simulation.simulationType).toEqual(refinanceSimulation.simulationType)
    expect(refinanceOrder.simulation.sourcePosition?.positionId).toEqual(
      refinanceSimulation.sourcePosition?.positionId,
    )
    expect(refinanceOrder.simulation.targetPosition.pool.poolId).toEqual(sparkPool.poolId)
    expect(refinanceOrder.simulation.steps.length).toEqual(refinanceSimulation.steps.length)

    for (let i = 0; i < refinanceOrder.simulation.steps.length; i++) {
      expect(refinanceOrder.simulation.steps[i].type).toEqual(refinanceSimulation.steps[i].type)
    }

    expect(refinanceOrder.transactions.length).toEqual(1)
  })
})
