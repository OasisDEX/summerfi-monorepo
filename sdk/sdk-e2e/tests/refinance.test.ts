import {
  Percentage,
  PositionId,
  RiskRatio,
  Token,
  TokenAmount,
  type Position,
  Address,
  type Maybe,
} from '@summerfi/sdk-common/common'

import {
  // LendingPool,
  LendingPoolParameters,
  // IPool,
  PoolType,
  Protocol,
  ProtocolName,
  isLendingPool,
  type LendingPool,
  isMakerPoolId,
  ILKType,
  isSparkPoolId,
  EmodeType,
} from '@summerfi/sdk-common/protocols'
import { type RefinanceParameters } from '@summerfi/sdk-common/orders'
import { Simulation, SimulationType } from '@summerfi/sdk-common/simulation'
import { makeSDK, type Chain, type User, ChainFamilyMap } from '@summerfi/sdk-client'
import { TokenSymbol } from '@summerfi/sdk-common/common/enums'

describe('Refinance | SDK', () => {
  it('should allow refinance Maker -> Spark with same pair', async () => {
    // SDK
    const sdk = makeSDK()

    // Chain
    // INFO: it should be only used on the client
    const chain: Maybe<Chain> = await sdk.chains.getChain({
      chainInfo: ChainFamilyMap.Ethereum.Mainnet,
    })
    if (!chain) {
      fail('Chain is not defined')
    }

    // User
    const walletAddress = Address.createFrom({
      value: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
    })
    const user: User = await sdk.users.getUser({
      chain: chain,
      walletAddress: walletAddress,
    })
    expect(user).toBeDefined()
    expect(user.wallet.address).toEqual(walletAddress)
    expect(user.chainInfo).toEqual(chain.chainInfo)

    // Tokens
    const WETH: Maybe<Token> = await chain.tokens.getTokenBySymbol({ symbol: TokenSymbol.WETH })
    if (!WETH) {
      fail('WETH not found')
    }

    const DAI: Maybe<Token> = await chain.tokens.getTokenBySymbol({ symbol: TokenSymbol.DAI })
    if (!DAI) {
      fail('DAI not found')
    }

    // Previous position
    const positionId = PositionId.createFrom({ id: '1234567890' })

    const prevPosition: Maybe<Position> = await user.getPosition({ id: positionId })
    if (!prevPosition) {
      fail('Position not found')
    }

    expect(prevPosition.positionId).toEqual(positionId)
    expect(prevPosition.debtAmount).toEqual(TokenAmount.createFrom({ token: DAI, amount: '56.78' }))
    expect(prevPosition.collateralAmount).toEqual(
      TokenAmount.createFrom({ token: WETH, amount: '105.98' }),
    )
    expect(prevPosition.riskRatio).toEqual(
      RiskRatio.createFrom({
        ratio: Percentage.createFrom({ percentage: 20.3 }),
      }),
    )

    if (!isMakerPoolId(prevPosition.pool.poolId)) {
      fail('Pool ID is not a Maker one')
    }

    expect(prevPosition.pool.poolId.ilkType).toEqual(ILKType.ETH_A)
    expect(prevPosition.pool.poolId.vaultId).toEqual('testvault')
    expect(prevPosition.pool.protocol).toEqual({
      name: ProtocolName.Maker,
      chainInfo: chain.chainInfo,
    })
    expect(prevPosition.pool.type).toEqual(PoolType.Lending)

    // Target protocol
    // TODO: this should have spark protocol type so we don't need to cast, derive it from the protocol name
    const spark: Maybe<Protocol> = await chain.protocols.getProtocol({
      protocol: {
        name: ProtocolName.Spark,
        chainInfo: chain.chainInfo,
      },
    })
    if (!spark) {
      fail('Spark not found')
    }

    expect(spark.name).toEqual(ProtocolName.Spark)

    const poolPair: LendingPoolParameters = {
      collateralTokens: [WETH],
      debtTokens: [DAI],
    }

    const newPool = await spark.getPool({
      poolParameters: poolPair,
    })
    if (!newPool) {
      fail('Pool not found')
    }

    if (!isSparkPoolId(newPool.poolId)) {
      fail('Pool ID is not a Maker one')
    }

    expect(newPool.poolId.emodeType).toEqual(EmodeType.None)
    expect(newPool.protocol).toEqual({
      name: ProtocolName.Spark,
      chainInfo: chain.chainInfo,
    })

    if (!isLendingPool(newPool)) {
      fail('Pool type is not lending')
    }

    // TODO: this should have spark protocol type so we don't need to cast, derive it from the protocol name
    const newLendingPool = newPool as LendingPool

    expect(newLendingPool.maxLTV).toEqual(Percentage.createFrom({ percentage: 50.3 }))
    expect(newLendingPool.debtTokens).toEqual(poolPair.debtTokens)
    expect(newLendingPool.collateralTokens).toEqual(poolPair.collateralTokens)

    const refinanceParameters: RefinanceParameters = {
      position: prevPosition,
      targetPool: newPool,
      slippage: Percentage.createFrom({ percentage: 0.5 }),
    }

    const refinanceSimulation: Simulation<SimulationType.Refinance> =
      await sdk.simulator.refinance.simulateRefinancePosition(refinanceParameters)

    expect(refinanceSimulation).toBeDefined()
    // expect(refinanceSimulation.sourcePosition).toEqual(prevPosition)
    // expect(refinanceSimulation.targetPosition.pool).toEqual(newPool)

    // TODO: uncomment this when the simulator is connected
    // expect(refinanceSimulation).toBeDefined()
    // expect(refinanceSimulation.sourcePosition).toEqual(prevPosition)
    // expect(refinanceSimulation.targetPosition.pool).toEqual(newPool)

    // const refinanceOrder: Order = await user.newOrder({
    //   simulation: refinanceSimulation,
    // })

    // expect(refinanceOrder.simulation).toEqual(refinanceSimulation)
    // expect(refinanceOrder.transactions).toEqual([])
  })
})
