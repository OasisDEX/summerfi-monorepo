import {
  Address,
  ChainFamilyMap,
  Percentage,
  Token,
  TokenAmount,
  type Maybe,
} from '@summerfi/sdk-common'

import { makeSDK, type Chain } from '@summerfi/sdk-client'
import {
  Order,
  PositionsManager,
  AddressValue,
  CommonTokenSymbols,
  LendingPositionType,
  RefinanceParameters,
  isLendingPool,
} from '@summerfi/sdk-common'

import {
  EmodeType,
  ILKType,
  MakerLendingPoolId,
  MakerLendingPosition,
  MakerLendingPositionId,
  MakerProtocol,
  isMakerLendingPool,
  isMakerProtocol,
  SparkLendingPoolId,
  SparkProtocol,
  isSparkLendingPoolId,
  isSparkProtocol,
} from '@summerfi/protocol-plugins'
import { TransactionUtils } from '@summerfi/testing-utils'
import assert from 'assert'
import { Hex } from 'viem'

jest.setTimeout(300000)

/** TEST CONFIG */
const config = {
  SDKAPiUrl: 'https://nkllstfoy8.execute-api.us-east-1.amazonaws.com/api/sdk',
  TenderlyForkUrl: 'https://virtual.mainnet.rpc.tenderly.co/5a4e0cc3-48d2-4819-8426-068f029b23be',
  makerVaultId: '31709',
  DPMAddress: '0xc1475b2735fb9130a4701ee9e2215b6305dd501b',
  walletAddress: '0x34314adbfBb5d239bb67f0265c9c45EB8b834412',
  collateralAmount: '5000.0',
  debtAmount: '5000000.0',
}

describe.skip('Refinance All | SDK', () => {
  it('should allow refinance Maker -> Spark with same pair', async () => {
    // SDK
    const sdk = makeSDK({ apiURL: config.SDKAPiUrl })

    // Chain
    const chain: Maybe<Chain> = await sdk.chains.getChain({
      chainInfo: ChainFamilyMap.Ethereum.Mainnet,
    })

    assert(chain, 'Chain not found')

    // User
    const walletAddress = Address.createFromEthereum({
      value: config.walletAddress as AddressValue,
    })
    const userClient = await sdk.users.getUserClient({
      chainInfo: chain.chainInfo,
      walletAddress: walletAddress,
    })
    expect(userClient).toBeDefined()
    expect(userClient.user.wallet.address).toEqual(walletAddress)
    expect(userClient.user.chainInfo).toEqual(chain.chainInfo)

    // Positions Manager
    const positionsManager = PositionsManager.createFrom({
      address: Address.createFromEthereum({
        value: config.DPMAddress as AddressValue,
      }),
    })

    // Tokens
    const WETH: Maybe<Token> = await chain.tokens.getTokenBySymbol({
      symbol: CommonTokenSymbols.WETH,
    })
    assert(WETH, 'WETH not found')

    const DAI: Maybe<Token> = await chain.tokens.getTokenBySymbol({
      symbol: CommonTokenSymbols.DAI,
    })
    assert(DAI, 'DAI not found')

    const USDC: Maybe<Token> = await chain.tokens.getTokenBySymbol({
      symbol: CommonTokenSymbols.USDC,
    })
    assert(USDC, 'USDC not found')

    const WBTC: Maybe<Token> = await chain.tokens.getTokenBySymbol({
      symbol: CommonTokenSymbols.WBTC,
    })
    assert(WBTC, 'WBTC not found')

    const WSTETH: Maybe<Token> = await chain.tokens.getTokenBySymbol({
      symbol: CommonTokenSymbols.wstETH,
    })
    assert(WSTETH, 'WSTETH not found')

    const SDAI: Maybe<Token> = await chain.tokens.getTokenBySymbol({
      symbol: CommonTokenSymbols.sDAI,
    })
    assert(SDAI, 'WSTETH not found')

    const maker = MakerProtocol.createFrom({
      chainInfo: chain.chainInfo,
    })

    if (!isMakerProtocol(maker)) {
      assert(false, 'Maker protocol type is not lending')
    }

    const makerPoolId = MakerLendingPoolId.createFrom({
      protocol: maker,
      debtToken: DAI,
      collateralToken: WETH,
      ilkType: ILKType.ETH_C,
    })

    const makerPool = await chain.protocols.getLendingPool({
      poolId: makerPoolId,
    })
    assert(makerPool, 'Maker pool not found')

    if (!isMakerLendingPool(makerPool)) {
      assert(false, 'Maker pool type is not lending')
    }

    // Source position
    const makerPosition: MakerLendingPosition = MakerLendingPosition.createFrom({
      subtype: LendingPositionType.Multiply,
      id: MakerLendingPositionId.createFrom({ id: '31697', vaultId: '31697' }),
      debtAmount: TokenAmount.createFrom({
        token: DAI,
        amount: config.debtAmount,
      }),
      collateralAmount: TokenAmount.createFrom({
        token: WETH,
        amount: config.collateralAmount,
      }),
      pool: makerPool,
    })

    // Target protocol
    const spark = SparkProtocol.createFrom({
      chainInfo: chain.chainInfo,
    })

    if (!isSparkProtocol(spark)) {
      assert(false, 'Protocol type is not Spark')
    }

    const poolId = SparkLendingPoolId.createFrom({
      protocol: spark,
      collateralToken: WETH,
      debtToken: DAI,
      emodeType: EmodeType.None,
    })

    const sparkPool = await chain.protocols.getLendingPool({
      poolId,
    })

    assert(sparkPool, 'Pool not found')

    if (!isSparkLendingPoolId(sparkPool.id)) {
      assert(false, 'Pool ID is not a Spark one')
    }

    if (!isLendingPool(sparkPool)) {
      assert(false, 'Spark pool type is not lending')
    }

    const refinanceSimulation = await sdk.simulator.refinance.simulateRefinancePosition(
      RefinanceParameters.createFrom({
        sourcePosition: makerPosition,
        targetPool: sparkPool,
        slippage: Percentage.createFrom({ value: 0.2 }),
      }),
    )

    expect(refinanceSimulation).toBeDefined()

    expect(refinanceSimulation.sourcePosition?.id).toEqual(makerPosition.id)
    expect(refinanceSimulation.targetPosition.pool.id).toEqual(sparkPool.id)

    const refinanceOrder: Maybe<Order> = await userClient.newOrder({
      positionsManager,
      simulation: refinanceSimulation,
    })

    assert(refinanceOrder, 'Order not found')

    // Send transaction
    console.log('Sending transaction...')

    const privateKey = process.env.DEPLOYER_PRIVATE_KEY as Hex
    const transactionUtils = new TransactionUtils({
      chainInfo: chain.chainInfo,
      rpcUrl: config.TenderlyForkUrl,
      walletPrivateKey: privateKey,
    })

    const receipt = await transactionUtils.sendTransaction({
      transaction: refinanceOrder.transactions[0].transaction,
    })

    console.log('Transaction sent:', receipt)
  })
})
