import { makeSDK } from '~sdk-common/entrypoint'
import { Maybe } from '~sdk-common/utils'
import { ChainFamilyMap, Chain } from '~sdk-common/chains'
import { Position, PositionId, User } from '~sdk-common/users'
import { Percentage, RiskRatio, Token, TokenAmount, Wallet } from '~sdk-common/common'
import {
  LendingPool,
  LendingPoolParameters,
  Pool,
  PoolType,
  Protocol,
  ProtocolName,
} from '~sdk-common/protocols'
import { RefinanceParameters, RefinanceSimulation, Order } from '~sdk-common/orders'

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
      hexValue: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
    })

    // User
    const user: User = await sdk.users.getUser({ chain: chain, wallet })
    expect(user).toBeDefined()
    expect(user.wallet).toEqual(wallet)
    expect(user.chain).toEqual(chain)

    // Tokens
    const WETH: Maybe<Token> = await chain.tokens.getTokenBySymbol({ symbol: 'WETH' })
    if (!WETH) {
      fail('WETH not found')
    }

    const DAI: Maybe<Token> = await chain.tokens.getTokenBySymbol({ symbol: 'DAI' })
    if (!DAI) {
      fail('DAI not found')
    }

    // Previous position
    const positionId: PositionId = { id: '1234567890' }

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
    expect(prevPosition.pool.poolId.id).toEqual('testpool')
    expect(prevPosition.pool.protocolId.id).toEqual('testprotocol')
    expect(prevPosition.pool.type).toEqual(PoolType.Lending)

    // Target protocol
    const spark: Maybe<Protocol> = await chain.protocols.getProtocolByName({
      name: ProtocolName.Spark,
    })
    if (!spark) {
      fail('Spark not found')
    }

    expect(spark.protocolId.id).toEqual('spark')

    const poolPair: LendingPoolParameters = {
      collateralTokens: [WETH],
      debtTokens: [DAI],
    }

    const newPool: Maybe<Pool> = await spark.getPool({
      poolParameters: poolPair,
    })
    if (!newPool) {
      fail('Pool not found')
    }

    expect(newPool.poolId.id).toEqual('mock')
    expect(newPool.protocolId.id).toEqual('spark')
    expect(newPool.type).toEqual(PoolType.Lending)

    const newLendingPool = newPool as LendingPool

    expect(newLendingPool.maxLTV).toEqual(Percentage.createFrom({ percentage: 50.3 }))
    expect(newLendingPool.debtTokens).toEqual(poolPair.debtTokens)
    expect(newLendingPool.collateralTokens).toEqual(poolPair.collateralTokens)

    const refinanceParameters: RefinanceParameters = {
      sourcePosition: prevPosition,
      targetPool: newPool,
      slippage: Percentage.createFrom({ percentage: 20.5 }),
    }

    const refinanceSimulation: RefinanceSimulation =
      await sdk.simulator.refinance.simulateRefinancePosition({
        position: prevPosition,
        pool: newPool,
        parameters: refinanceParameters,
      })

    expect(refinanceSimulation).toBeDefined()
    expect(refinanceSimulation.simulationData.sourcePosition).toEqual(prevPosition)
    expect(refinanceSimulation.simulationData.targetPosition.pool).toEqual(newPool)

    const refinanceOrder: Order = await user.newOrder({
      simulation: refinanceSimulation,
    })

    expect(refinanceOrder.simulation).toEqual(refinanceSimulation)
    expect(refinanceOrder.transactions).toEqual([])
  })
})
