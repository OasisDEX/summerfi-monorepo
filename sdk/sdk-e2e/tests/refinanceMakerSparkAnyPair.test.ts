import {
  Percentage,
  PositionId,
  Token,
  TokenAmount,
  Position,
  Address,
  type Maybe,
  ChainFamilyMap,
  newEmptyPositionFromPool,
  PositionType,
} from '@summerfi/sdk-common/common'

import { ProtocolName, isLendingPool } from '@summerfi/sdk-common/protocols'
import { makeSDK, type Chain, type User, Protocol } from '@summerfi/sdk-client'
import { TokenSymbol } from '@summerfi/sdk-common/common/enums'
import { IPositionsManager, IRefinanceParameters, Order } from '@summerfi/sdk-common/orders'
import { ISimulation } from '@summerfi/sdk-common/simulation'
import { TransactionUtils } from './utils/TransactionUtils'

import { Hex } from 'viem'
import assert from 'assert'
import { EmodeType } from '@summerfi/protocol-plugins/plugins/common'
import { ILKType, MakerPoolId } from '@summerfi/protocol-plugins/plugins/maker'
import { SparkPoolId, isSparkPoolId } from '@summerfi/protocol-plugins/plugins/spark'
import { RefinanceSimulationTypes } from '@summerfi/sdk-common'

jest.setTimeout(300000)

const SDKAPiUrl = 'https://nkllstfoy8.execute-api.us-east-1.amazonaws.com/api/sdk'
const TenderlyForkUrl =
  'https://virtual.mainnet.rpc.tenderly.co/8ffae4ec-575d-40a5-87d4-295669e8a24b'

describe.skip('Refinance Maker Spark | SDK', () => {
  it('should allow refinance Maker -> Spark with same pair', async () => {
    // SDK
    const sdk = makeSDK({ apiURL: SDKAPiUrl })

    // Chain
    const chain: Maybe<Chain> = await sdk.chains.getChain({
      chainInfo: ChainFamilyMap.Ethereum.Mainnet,
    })

    assert(chain, 'Chain not found')

    // User
    const walletAddress = Address.createFromEthereum({
      value: '0x34314adbfBb5d239bb67f0265c9c45EB8b834412',
    })
    const user: User = await sdk.users.getUser({
      chainInfo: chain.chainInfo,
      walletAddress: walletAddress,
    })
    expect(user).toBeDefined()
    expect(user.wallet.address).toEqual(walletAddress)
    expect(user.chainInfo).toEqual(chain.chainInfo)

    // Positions Manager
    const positionsManager: IPositionsManager = {
      address: Address.createFromEthereum({
        value: '0x1858b76756d19f8cb7c7756a0f96e0d7673285ed',
      }),
    }

    // Tokens
    const WETH: Maybe<Token> = await chain.tokens.getTokenBySymbol({ symbol: TokenSymbol.WETH })
    assert(WETH, 'WETH not found')

    const DAI: Maybe<Token> = await chain.tokens.getTokenBySymbol({ symbol: TokenSymbol.DAI })
    assert(DAI, 'DAI not found')

    const USDC: Maybe<Token> = await chain.tokens.getTokenBySymbol({ symbol: TokenSymbol.USDC })
    assert(USDC, 'USDC not found')

    const WBTC: Maybe<Token> = await chain.tokens.getTokenBySymbol({ symbol: TokenSymbol.WBTC })
    assert(WBTC, 'WBTC not found')

    const WSTETH: Maybe<Token> = await chain.tokens.getTokenBySymbol({ symbol: TokenSymbol.WSTETH })
    assert(WSTETH, 'WSTETH not found')

    const maker = await chain.protocols.getProtocol({ name: ProtocolName.Maker })
    assert(maker, 'Maker protocol not found')

    const makerPoolId: MakerPoolId = {
      protocol: {
        name: ProtocolName.Maker,
        chainInfo: chain.chainInfo,
      },
      ilkType: ILKType.ETH_C,
      vaultId: '31697',
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
      type: PositionType.Multiply,
      positionId: PositionId.createFrom({ id: '31697' }),
      debtAmount: TokenAmount.createFromBaseUnit({
        token: DAI,
        amount: '5000000000000000000000',
      }),
      collateralAmount: TokenAmount.createFromBaseUnit({
        token: WETH,
        amount: '100000000000000000000',
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

    const emptyTargetPosition = newEmptyPositionFromPool(sparkPool, DAI, WSTETH)
    const refinanceSimulation: ISimulation<RefinanceSimulationTypes> =
      await sdk.simulator.refinance.simulateRefinancePosition({
        sourcePosition: makerPosition,
        targetPosition: emptyTargetPosition,
        slippage: Percentage.createFrom({ value: 0.2 }),
      } as IRefinanceParameters)

    expect(refinanceSimulation).toBeDefined()

    expect(refinanceSimulation.sourcePosition?.positionId).toEqual(makerPosition.positionId)
    expect(refinanceSimulation.targetPosition.pool.poolId).toEqual(sparkPool.poolId)

    const refinanceOrder: Maybe<Order> = await user.newOrder({
      positionsManager,
      simulation: refinanceSimulation,
    })

    assert(refinanceOrder, 'Order not found')

    // Send transaction
    console.log('Sending transaction...')

    const privateKey = process.env.DEPLOYER_PRIVATE_KEY as Hex
    const transactionUtils = new TransactionUtils({
      rpcUrl: TenderlyForkUrl,
      walletPrivateKey: privateKey,
    })

    const receipt = await transactionUtils.sendTransaction({
      transaction: refinanceOrder.transactions[0].transaction,
    })

    console.log('Transaction sent:', receipt)
  })
})
