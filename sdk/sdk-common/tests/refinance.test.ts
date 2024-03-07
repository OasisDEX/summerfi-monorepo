import { Maybe } from '~sdk-common/utils'
import {
  Percentage,
  PositionId,
  RiskRatio,
  Token,
  TokenAmount,
  Wallet,
  type Position,
} from '~sdk-common/common'

import {
  LendingPool,
  LendingPoolParameters,
  IPool,
  PoolType,
  Protocol,
  ProtocolName,
  isLendingPool,
  isMakerPoolId,
  isSparkPoolId,
  ILKType,
  EmodeType,
} from '~sdk-common/protocols'
import { RefinanceParameters } from '~sdk-common/orders'
import { Simulation, SimulationType } from '~sdk-common/simulation'
import { makeSDK, type Chain, type User, ChainFamilyMap } from '~sdk-common/client'
import { TokenSymbol } from '~sdk-common/common/enums'

describe('Refinance | SDK', () => {
  it('should allow refinance Maker -> Spark with same pair', async () => {
    // SDK
    const sdk = makeSDK()

    // Chain
    const chain: Maybe<Chain> = await sdk.chains.getChain({
      chainInfo: ChainFamilyMap.Ethereum.Mainnet,
    })
    if (!chain) {
      fail('Chain is not defined')
    }

    // Wallet
    const wallet: Wallet = Wallet.createFrom({
      value: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
    })

    // User
    const user: User = await sdk.users.getUser({ chain: chain, wallet })
    expect(user).toBeDefined()
    expect(user.wallet).toEqual(wallet)
    expect(user.chain).toEqual(chain)

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
    expect(prevPosition.pool.protocol).toEqual(ProtocolName.Maker)
    expect(prevPosition.pool.type).toEqual(PoolType.Lending)

    // Target protocol
    const spark: Maybe<Protocol> = await chain.protocols.getProtocolByName({
      name: ProtocolName.Spark,
    })
    if (!spark) {
      fail('Spark not found')
    }

    expect(spark.name).toEqual(ProtocolName.Spark)

    const poolPair: LendingPoolParameters = {
      collateralTokens: [WETH],
      debtTokens: [DAI],
    }

    const newPool: Maybe<IPool> = await spark.getPool({
      poolParameters: poolPair,
    })
    if (!newPool) {
      fail('Pool not found')
    }

    if (!isSparkPoolId(newPool.poolId)) {
      fail('Pool ID is not a Maker one')
    }

    expect(newPool.poolId.emodeType).toEqual(EmodeType.None)
    expect(newPool.protocol).toEqual(ProtocolName.Spark)

    if (!isLendingPool(newPool)) {
      fail('Pool type is not lending')
    }

    const newLendingPool = newPool as LendingPool

    expect(newLendingPool.maxLTV).toEqual(Percentage.createFrom({ percentage: 50.3 }))
    expect(newLendingPool.debtTokens).toEqual(poolPair.debtTokens)
    expect(newLendingPool.collateralTokens).toEqual(poolPair.collateralTokens)

    const refinanceParameters: RefinanceParameters = {
      sourcePosition: prevPosition,
      targetPool: newPool,
      slippage: Percentage.createFrom({ percentage: 20.5 }),
    }

    const refinanceSimulation: Simulation<SimulationType.Refinance> =
      await sdk.simulator.refinance.simulateRefinancePosition(refinanceParameters)

    expect(refinanceSimulation).toBeDefined()

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
