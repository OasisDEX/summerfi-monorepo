import { Maybe, makeSDK } from '../src'
import { ChainFamilyMap, Chain } from '../src/chains'
import { Position, PositionId, User } from '../src/users'
import { Percentage, RiskRatio, Token, TokenAmount, Wallet } from '../src/common'
import {
  LendingPool,
  LendingPoolParameters,
  Pool,
  PoolType,
  Protocol,
  ProtocolName,
} from '../src/protocols'
import { RefinanceParameters, RefinanceSimulation, Order } from '../src/orders'
import assert from 'assert'

describe('Refinance | SDK', () => {
  it('should allow refinance Maker -> Spark with same pair', async () => {
    // SDK
    const sdk = makeSDK()

    // Chain
    const chain: Maybe<Chain> = await sdk.chains.getChain({
      chainInfo: ChainFamilyMap.Ethereum.Mainnet,
    })
    if (!chain) {
      assert.fail('Chain not found')
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
      assert.fail('WETH not found')
    }

    const DAI: Maybe<Token> = await chain.tokens.getTokenBySymbol({ symbol: 'DAI' })
    if (!DAI) {
      assert.fail('DAI not found')
    }

    const positionId: PositionId = { id: '1234567890' }

    const prevPosition: Maybe<Position> = await user.getPosition({ id: positionId })
    if (!prevPosition) {
      assert.fail('Position not found')
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

    const maker: Maybe<Protocol> = await chain.protocols.getProtocolByName({
      name: ProtocolName.Maker,
    })
    if (!maker) {
      assert.fail('Maker not found')
    }

    expect(maker.protocolId.id).toEqual('maker')

    const poolPair: LendingPoolParameters = {
      collateralTokens: [WETH],
      debtTokens: [DAI],
    }

    const newPool: Maybe<Pool> = await maker.getPool({
      poolParameters: poolPair,
    })
    if (!newPool) {
      assert.fail('Pool not found')
    }

    expect(newPool.poolId.id).toEqual('mock')
    expect(newPool.protocolId.id).toEqual('maker')
    expect(newPool.type).toEqual(PoolType.Lending)

    const newLendingPool = newPool as LendingPool

    expect(newLendingPool.maxLTV).toEqual(Percentage.createFrom({ percentage: 50.3 }))
    expect(newLendingPool.debtTokens).toEqual(poolPair.debtTokens)
    expect(newLendingPool.collateralTokens).toEqual(poolPair.collateralTokens)

    const refinanceParameters: RefinanceParameters = {
      slippage: Percentage.createFrom({ percentage: 20.5 }),
    }

    const refinanceSimulation: RefinanceSimulation =
      await sdk.simulator.refinance.simulateRefinancePosition({
        position: prevPosition,
        pool: newPool,
        parameters: refinanceParameters,
      })

    expect(refinanceSimulation).toBeDefined()
    expect(refinanceSimulation.position).toEqual(prevPosition)
    expect(refinanceSimulation.pool).toEqual(newPool)
    expect(refinanceSimulation.parameters).toEqual(refinanceParameters)

    const refinanceOrder: Order = await user.newOrder({
      simulation: refinanceSimulation,
    })

    expect(refinanceOrder.simulation).toEqual(refinanceSimulation)
    expect(refinanceOrder.transactions).toEqual([])
  })
})
