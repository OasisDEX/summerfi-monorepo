import { makeSDK, type Chain, type User } from '@summerfi/sdk-client'
import { ProtocolName, isLendingPool } from '@summerfi/sdk-common/protocols'
import { EmodeType } from '@summerfi/protocol-plugins/plugins/common'
import {
  AddressValue,
  CommonTokenSymbols,
  ISimulation,
  Percentage,
  TokenAmount,
  Address,
  type Maybe,
  ChainFamilyMap,
  PositionType,
  IToken,
  SimulationType,
} from '@summerfi/sdk-common'
import { PositionsManager, Order, RefinanceParameters } from '@summerfi/sdk-common/orders'
import assert from 'assert'
import { TransactionUtils } from './utils/TransactionUtils'
import { Hex } from 'viem'
import {
  AaveV3LendingPoolId,
  AaveV3Position,
  AaveV3PositionId,
  isAaveV3LendingPool,
  isAaveV3LendingPoolId,
  isAaveV3Protocol,
} from '@summerfi/protocol-plugins'

jest.setTimeout(300000)

/** TEST CONFIG */
const config = {
  SDKAPiUrl: 'https://72dytt1e93.execute-api.us-east-1.amazonaws.com/api/sdk',
  TenderlyForkUrl: 'https://virtual.mainnet.rpc.tenderly.co/7a1550d9-d58a-487a-b823-bf2dc0cf16aa',
  DPMAddress: '0x2e0515d7A3eA0276F28c94C426c5d2D1d85FD4d5',
  walletAddress: '0xDDc68f9dE415ba2fE2FD84bc62Be2d2CFF1098dA',
  source: {
    collateralTokenSymbol: CommonTokenSymbols.wstETH,
    collateralAmount: '0.0018',
    debtTokenSymbol: CommonTokenSymbols.USDC,
    debtAmount: '2.248',
    emodeType: EmodeType.None,
  },
  target: {
    collateralTokenSymbol: CommonTokenSymbols.wstETH,
    debtTokenSymbol: CommonTokenSymbols.RPL,
    emodeType: EmodeType.None,
  },
  sendTransactionEnabled: false,
}

describe.skip('Refinance AaveV3 -> AaveV3 | SDK', () => {
  it('should allow refinance AaveV3 -> AaveV3 with different pair', async () => {
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
    const user: User = await sdk.users.getUser({
      chainInfo: chain.chainInfo,
      walletAddress: walletAddress,
    })
    expect(user).toBeDefined()
    expect(user.wallet.address).toEqual(walletAddress)
    expect(user.chainInfo).toEqual(chain.chainInfo)

    // Positions Manager
    const positionsManager = PositionsManager.createFrom({
      address: Address.createFromEthereum({
        value: config.DPMAddress as AddressValue,
      }),
    })

    // Tokens
    const sourceDebtToken: Maybe<IToken> = await chain.tokens.getTokenBySymbol({
      symbol: config.source.debtTokenSymbol,
    })
    assert(sourceDebtToken, `${config.source.debtTokenSymbol} not found`)

    const sourceCollateralToken: Maybe<IToken> = await chain.tokens.getTokenBySymbol({
      symbol: config.source.collateralTokenSymbol,
    })
    assert(sourceCollateralToken, `${config.source.collateralTokenSymbol} not found`)

    const targetDebtToken: Maybe<IToken> = await chain.tokens.getTokenBySymbol({
      symbol: config.target.debtTokenSymbol,
    })
    assert(targetDebtToken, `${config.target.debtTokenSymbol} not found`)

    const targetCollateralToken: Maybe<IToken> = await chain.tokens.getTokenBySymbol({
      symbol: config.target.collateralTokenSymbol,
    })
    assert(targetCollateralToken, `${config.target.collateralTokenSymbol} not found`)

    const aaveV3 = await chain.protocols.getProtocol({ name: ProtocolName.AaveV3 })
    assert(aaveV3, 'AaveV3 protocol not found')

    if (!isAaveV3Protocol(aaveV3)) {
      assert(false, 'AaveV3 protocol type is not lending')
    }

    const aaveV3PoolId = AaveV3LendingPoolId.createFrom({
      protocol: aaveV3,
      collateralToken: sourceCollateralToken,
      debtToken: sourceDebtToken,
      emodeType: config.source.emodeType,
    })

    const aaveV3Pool = await aaveV3.getLendingPool({
      poolId: aaveV3PoolId,
    })
    assert(aaveV3Pool, 'AaveV3 pool not found')

    if (!isAaveV3LendingPool(aaveV3Pool)) {
      assert(false, 'AaveV3 pool type is not lending')
    }

    // Source position
    const aaveV3Position = AaveV3Position.createFrom({
      type: PositionType.Multiply,
      id: AaveV3PositionId.createFrom({
        id: 'AaveV3Position',
      }),
      debtAmount: TokenAmount.createFrom({
        token: sourceDebtToken,
        amount: config.source.debtAmount,
      }),
      collateralAmount: TokenAmount.createFrom({
        token: sourceCollateralToken,
        amount: config.source.collateralAmount,
      }),
      pool: aaveV3Pool,
    })

    // Target protocol
    const targetAaveV3PoolId = AaveV3LendingPoolId.createFrom({
      protocol: aaveV3,
      collateralToken: targetCollateralToken,
      debtToken: targetDebtToken,
      emodeType: config.target.emodeType,
    })

    const targetAaveV3Pool = await aaveV3.getLendingPool({
      poolId: targetAaveV3PoolId,
    })

    assert(targetAaveV3Pool, 'Pool not found')

    if (!isAaveV3LendingPoolId(targetAaveV3Pool.id)) {
      assert(false, 'Pool ID is not a AaveV3 one')
    }

    if (!isLendingPool(targetAaveV3Pool)) {
      assert(false, 'AaveV3 target pool type is not lending')
    }

    const targetAaveV3PoolInfo = await aaveV3.getLendingPoolInfo({
      poolId: targetAaveV3PoolId,
    })

    assert(targetAaveV3PoolInfo, 'Pool info not found')

    const refinanceParameters = RefinanceParameters.createFrom({
      sourcePosition: aaveV3Position,
      targetPool: targetAaveV3Pool,
      slippage: Percentage.createFrom({ value: 0.2 }),
    })

    const refinanceSimulation: ISimulation<SimulationType.Refinance> =
      await sdk.simulator.refinance.simulateRefinancePosition(refinanceParameters)

    expect(refinanceSimulation).toBeDefined()

    expect(refinanceSimulation.sourcePosition?.id).toEqual(aaveV3Position.id)
    expect(refinanceSimulation.targetPosition.pool.id).toEqual(targetAaveV3Pool.id)

    console.log('Refinance simulation:', JSON.stringify(refinanceSimulation, null, 2))

    const refinanceOrder: Maybe<Order> = await user.newOrder({
      positionsManager,
      simulation: refinanceSimulation,
    })

    assert(refinanceOrder, 'Order not found')

    if (config.sendTransactionEnabled) {
      // Send transaction
      console.log('Sending transaction...')

      const privateKey = process.env.DEPLOYER_PRIVATE_KEY as Hex
      const transactionUtils = new TransactionUtils({
        rpcUrl: config.TenderlyForkUrl,
        walletPrivateKey: privateKey,
      })

      const receipt = await transactionUtils.sendTransaction({
        transaction: refinanceOrder.transactions[0].transaction,
      })

      console.log('Transaction sent:', receipt)
    }
  })
})
