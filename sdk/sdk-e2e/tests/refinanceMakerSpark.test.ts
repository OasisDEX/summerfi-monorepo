import {
  Percentage,
  PositionId,
  RiskRatio,
  Token,
  TokenAmount,
  type Position,
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
} from '@summerfi/sdk-common/protocols'
import { makeSDK, type Chain, type User, Protocol } from '@summerfi/sdk-client'
import { TokenSymbol } from '@summerfi/sdk-common/common/enums'
import { Order, RefinanceParameters } from '@summerfi/sdk-common/orders'
import { Simulation, SimulationType } from '@summerfi/sdk-common/simulation'
import { PoolIds } from '@summerfi/protocol-manager'
import assert from 'assert'
//import { createFork } from '@summerfi/tenderly-utils'

describe.only('Refinance Maker Spark | SDK', () => {
  it('should allow refinance Maker -> Spark with same pair', async () => {
    //await createFork({ network: 'mainnet', atBlock: 19482638 })

    // SDK
    const apiURL = 'https://hklgfinvwb.execute-api.us-east-1.amazonaws.com/api/sdk'
    const sdk = makeSDK({ apiURL })

    // Chain
    const chain: Maybe<Chain> = await sdk.chains.getChain({
      chainInfo: ChainFamilyMap.Ethereum.Mainnet,
    })

    assert(chain, 'Chain not found')

    // User
    const walletAddress = Address.createFrom({
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

    // Previous position
    const positionId = PositionId.createFrom({ id: '1234567890' })

    const prevPosition: Maybe<Position> = await user.getPosition({ id: positionId })
    assert(prevPosition, 'Position not found')

    expect(prevPosition.positionId).toEqual(positionId)
    expect(prevPosition.debtAmount).toEqual(TokenAmount.createFrom({ token: DAI, amount: '56.78' }))
    expect(prevPosition.collateralAmount).toEqual(
      TokenAmount.createFrom({ token: WETH, amount: '105.98' }),
    )
    expect(prevPosition.riskRatio).toEqual(
      RiskRatio.createFrom({
        ratio: Percentage.createFrom({ percentage: 20.3 }),
        type: RiskRatio.type.LTV,
      }),
    )

    if (!isMakerPoolId(prevPosition.pool.poolId)) {
      console.log(prevPosition.pool.poolId)
      throw new Error('Pool ID is not a Maker one')
    }

    expect(prevPosition.pool.poolId.ilkType).toEqual(ILKType.ETH_A)
    // expect(prevPosition.pool.poolId.vaultId).toEqual('testvault')
    expect(prevPosition.pool.protocol).toEqual({
      name: ProtocolName.Maker,
      chainInfo: chain.chainInfo,
    })
    expect(prevPosition.pool.type).toEqual(PoolType.Lending)

    // Target protocol
    // TODO: this should have spark protocol type so we don't need to cast, derive it from the protocol name
    const spark: Maybe<Protocol> = await chain.protocols.getProtocol({
      name: ProtocolName.Spark,
    })
    assert(spark, 'Spark not found')

    expect(spark.name).toEqual(ProtocolName.Spark)

    const poolPair: LendingPoolParameters = {
      debts: {
        [WETH.address.value]: {
          token: WETH,
          price: Price.createFrom({ value: '123.45', baseToken: WETH }),
          priceUSD: Price.createFrom({ value: '123.45', baseToken: WETH }),
          rate: Percentage.createFrom({ percentage: 0.5 }),
          totalBorrowed: TokenAmount.createFrom({ token: WETH, amount: '123456.78' }),
          debtCeiling: TokenAmount.createFrom({ token: WETH, amount: '100000000.78' }),
          debtAvailable: TokenAmount.createFrom({ token: WETH, amount: '100000000.78' }),
          dustLimit: TokenAmount.createFrom({ token: WETH, amount: '0.0001' }),
          originationFee: Percentage.createFrom({ percentage: 0.5 }),
        },
      },
      collaterals: {
        [DAI.address.value]: {
          token: DAI,
          price: Price.createFrom({ value: '123.45', baseToken: DAI }),
          priceUSD: Price.createFrom({ value: '123.45', baseToken: DAI }),
          liquidationThreshold: RiskRatio.createFrom({
            ratio: Percentage.createFrom({ percentage: 0.5 }),
            type: RiskRatio.type.LTV,
          }),
          maxSupply: TokenAmount.createFrom({ token: DAI, amount: '100000000' }),
          tokensLocked: TokenAmount.createFrom({ token: DAI, amount: '123456.78' }),
          liquidationPenalty: Percentage.createFrom({ percentage: 0.5 }),
        },
      },
    }

    const poolId: PoolIds = {
      protocol: {
        name: ProtocolName.Spark,
        chainInfo: chain.chainInfo,
      },
      emodeType: EmodeType.None,
    }

    const newPool = await spark.getPool({
      poolId,
    })

    assert(newPool, 'Pool not found')

    if (!isSparkPoolId(newPool.poolId)) {
      assert(false, 'Pool ID is not a Maker one')
    }

    expect(newPool.poolId.emodeType).toEqual(EmodeType.None)
    expect(newPool.protocol).toEqual({
      name: ProtocolName.Spark,
      chainInfo: chain.chainInfo,
    })

    if (!isLendingPool(newPool)) {
      assert(false, 'Pool type is not lending')
    }

    // TODO: this should have spark protocol type so we don't need to cast, derive it from the protocol name
    const newLendingPool = newPool as LendingPool

    expect(newLendingPool.debts).toEqual(poolPair.debts)
    expect(newLendingPool.collaterals).toEqual(poolPair.collaterals)

    const refinanceParameters: RefinanceParameters = {
      position: prevPosition,
      targetPool: newLendingPool,
      slippage: Percentage.createFrom({ percentage: 0.5 }),
    }

    const refinanceSimulation: Simulation<SimulationType.Refinance> =
      await sdk.simulator.refinance.simulateRefinancePosition(refinanceParameters)

    expect(refinanceSimulation).toBeDefined()
    expect(refinanceSimulation.sourcePosition).toEqual(prevPosition)
    expect(refinanceSimulation.targetPosition.pool).toEqual(newPool)

    expect(refinanceSimulation).toBeDefined()
    expect(refinanceSimulation.sourcePosition).toEqual(prevPosition)
    expect(refinanceSimulation.targetPosition.pool).toEqual(newPool)

    const refinanceOrder: Maybe<Order> = await user.newOrder({
      positionsManager: {
        address: Address.ZeroAddressEthereum,
      },
      simulation: refinanceSimulation,
    })

    assert(refinanceOrder, 'Order not found')

    expect(refinanceOrder.simulation).toEqual(refinanceSimulation)
    expect(refinanceOrder.transactions).toEqual([])
  })
})
