import {
  Percentage,
  PositionId,
  RiskRatio,
  Token,
  TokenAmount,
  Wallet,
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
} from '@summerfi/sdk-common/protocols'
import { Order, type RefinanceParameters } from '@summerfi/sdk-common/orders'
import { Simulation, SimulationType } from '@summerfi/sdk-common/simulation'
import { makeSDK, type Chain, type User, ChainFamilyMap } from '@summerfi/sdk-client'
import { TokenSymbol } from '@summerfi/sdk-common/common/enums'

describe.skip('Refinance | SDK', () => {
  it('should allow refinance Maker -> Spark with same pair', async () => {
    // SDK
    const sdk = makeSDK()

    // Chain
    // TODO: chain should not be used on the server, it should be only used on the client only
    const chain: Maybe<Chain> = await sdk.chains.getChain({
      chainInfo: ChainFamilyMap.Ethereum.Mainnet,
    })
    if (!chain) {
      fail('Chain is not defined')
    }

    // Wallet
    // TODO: Do we really need a wallet instance? We only pass it to the user as the parameter so we might just pass an address instead.
    const wallet: Wallet = Wallet.createFrom({
      address: Address.createFrom({ value: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266' }),
    })

    // TODO: User should also be oniy on the client
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
    expect(prevPosition.pool.poolId.id).toEqual('testpool')
    expect(prevPosition.pool.protocol).toEqual(ProtocolName.Maker)
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

    expect(newPool.poolId.id).toEqual('mock')
    expect(newPool.protocol).toEqual(ProtocolName.Spark)

    if (!isLendingPool(newPool)) {
      fail('Pool type is not lending')
    }

    // TODO: this should have spark protocol type so we don't need to cast, derive it from the protocol name
    // const newLendingPool = newPool as LendingPool

    // expect(newLendingPool.maxLTV).toEqual(Percentage.createFrom({ percentage: 50.3 }))
    // expect(newLendingPool.debtTokens).toEqual(poolPair.debtTokens)
    // expect(newLendingPool.collateralTokens).toEqual(poolPair.collateralTokens)

    const refinanceParameters: RefinanceParameters = {
      position: prevPosition,
      targetPool: newPool,
      slippage: Percentage.createFrom({ percentage: 0.5 }),
    }

    const refinanceSimulation: Simulation<SimulationType.Refinance> =
      await sdk.simulator.refinance.simulateRefinancePosition(refinanceParameters)

    expect(refinanceSimulation).toBeDefined()
    expect(refinanceSimulation.sourcePosition).toEqual(prevPosition)
    expect(refinanceSimulation.targetPosition.pool).toEqual(newPool)

    const refinanceOrder: Order = await user.newOrder({
      simulation: refinanceSimulation,
    })

    expect(refinanceOrder.simulation).toEqual(refinanceSimulation)
    expect(refinanceOrder.transactions).toEqual([])
  })
})
