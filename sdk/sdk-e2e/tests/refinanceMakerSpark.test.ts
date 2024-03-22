import {
  Percentage,
  PositionId,
  RiskRatio,
  Token,
  TokenAmount,
  Position,
  Address,
  type Maybe,
  ChainFamilyMap,
  Price,
} from '@summerfi/sdk-common/common'

import {
  PoolType,
  ProtocolName,
  isMakerPoolId,
  ILKType,
  LendingPoolParameters,
  isSparkPoolId,
  EmodeType,
  isLendingPool,
  LendingPool,
  IProtocol,
} from '@summerfi/sdk-common/protocols'
import { makeSDK, type Chain, type User, Protocol } from '@summerfi/sdk-client'
import { TokenSymbol } from '@summerfi/sdk-common/common/enums'
import { Order, IRefinanceParameters } from '@summerfi/sdk-common/orders'
import { Simulation, SimulationType } from '@summerfi/sdk-common/simulation'
import { PoolIds } from '@summerfi/protocol-manager'
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

    // Source position
    const maker = await chain.protocols.getProtocol({ name: ProtocolName.Maker })
    assert(maker, 'Maker protocol not found')

    const makerPool = await maker.getPool({
      poolId: {
        protocol: {
          name: ProtocolName.Maker,
          chainInfo: chain.chainInfo,
        },
        ilkType: ILKType.ETH_A,
        vaultId: '31646',
      },
    })
    assert(makerPool, 'Maker pool not found')

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

    const poolId: PoolIds = {
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

    const poolStr = JSON.stringify(sparkPool)
    const poolAgain = JSON.parse(poolStr)

    if (!isSparkPoolId(sparkPool.poolId)) {
      assert(false, 'Pool ID is not a Spark one')
    }

    if (!isLendingPool(sparkPool)) {
      assert(false, 'Spark pool type is not lending')
    }

    // const refinanceParameters: IRefinanceParameters = {
    //   position: makerPosition,
    //   targetPool: sparkPool,
    //   slippage: Percentage.createFrom({ value: 0.2 }),
    // }

    const refinanceSimulation: Simulation<SimulationType.Refinance> =
      await sdk.simulator.refinance.simulateRefinancePosition({
        position: makerPosition,
        targetPool: poolAgain,
        slippage: Percentage.createFrom({ value: 0.2 }),
      } as IRefinanceParameters)

    // expect(refinanceSimulation).toBeDefined()
    // expect(refinanceSimulation.sourcePosition).toEqual(makerPosition)
    // expect(refinanceSimulation.targetPosition.pool).toEqual(sparkPool)

    console.log('Refinance simulation:', JSON.stringify(refinanceSimulation))

    // const refinanceOrder: Maybe<Order> = await user.newOrder({
    //   positionsManager: {
    //     address: Address.ZeroAddressEthereum,
    //   },
    //   simulation: refinanceSimulation,
    // })

    // assert(refinanceOrder, 'Order not found')

    // expect(refinanceOrder.simulation).toEqual(refinanceSimulation)
    // expect(refinanceOrder.transactions).toEqual([])
  })
})
