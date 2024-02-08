import { Maybe, makeSDK } from '../src'
import { ChainFamilyMap, Chain } from '../src/chains'
import { Position, PositionId, User } from '../src/users'
import { Percentage, Token, Wallet } from '../src/common'
import { LendingPoolParameters, Pool, Protocol, ProtocolName } from '../src/protocols'
import { RefinanceParameters, RefinanceSimulation, Order } from '../src/orders'
import assert from 'assert'

describe('Refinance | SDK', () => {
  it('should allow refinance Maker -> Spark with same pair', async () => {
    const sdk = makeSDK()

    const chain: Maybe<Chain> = await sdk.chains.getChain({
      chainInfo: ChainFamilyMap.Ethereum.Mainnet,
    })
    if (!chain) {
      assert.fail('Chain not found')
    }

    const wallet: Wallet = Wallet.createFrom({
      hexValue: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
    })
    const user: User = await sdk.users.getUser({ chain: chain, wallet })

    const positionId: PositionId = { id: '1234567890' }
    console.log(user)
    console.log('adadadakdlakdl;kaldkalkdlakdkalkdlakd;ak;ldkalskdakd ')

    const prevPosition: Maybe<Position> = await user.getPosition(positionId)
    if (!prevPosition) {
      assert.fail('Position not found')
    }

    const maker: Maybe<Protocol> = await chain.protocols.getProtocolByName({
      name: ProtocolName.Maker,
    })
    if (!maker) {
      assert.fail('Maker not found')
    }

    console.log('aaveV3', maker)

    const WETH: Maybe<Token> = await chain.tokens.getTokenBySymbol({ symbol: 'WETH' })
    if (!WETH) {
      assert.fail('WETH not found')
    }

    const DAI: Maybe<Token> = await chain.tokens.getTokenBySymbol({ symbol: 'DAI' })
    if (!DAI) {
      assert.fail('DAI not found')
    }

    const poolPair: LendingPoolParameters = {
      collateralToken: [WETH],
      debtToken: [DAI],
    }

    const newPool: Maybe<Pool> = await maker.getPool({
      poolParameters: poolPair,
    })
    if (!newPool) {
      assert.fail('Pool not found')
    }

    const refinanceParameters: RefinanceParameters = {
      slippage: Percentage.createFrom({ percentage: 20.5 }),
    }

    const refinanceSimulation: RefinanceSimulation =
      sdk.simulator.refinance.simulateRefinancePosition({
        position: prevPosition,
        pool: newPool,
        parameters: refinanceParameters,
      })

    const refinanceOrder: Order = await user.newOrder({
      simulation: refinanceSimulation,
    })

    expect(refinanceOrder).toBeDefined()
    expect(refinanceOrder.simulation).toEqual(refinanceSimulation)
  })
})
