import { makeSDK } from '@summerfi/sdk-client'
import { ProtocolName, isLendingPool } from '@summerfi/sdk-common/protocols'
import { EmodeType } from '@summerfi/protocol-plugins/plugins/common'
import {
  AddressValue,
  CommonTokenSymbols,
  ISimulation,
  Percentage,
  TokenAmount,
  Address,
  ChainFamilyMap,
  PositionType,
  SimulationType,
} from '@summerfi/sdk-common'
import { PositionsManager, RefinanceParameters } from '@summerfi/sdk-common/orders'
import {
  SparkLendingPoolId,
  SparkPosition,
  SparkPositionId,
  isSparkLendingPool,
  isSparkProtocol,
} from '@summerfi/protocol-plugins/plugins/spark'
import {
  MorphoLendingPoolId,
  isMorphoLendingPoolId,
  isMorphoProtocol,
} from '@summerfi/protocol-plugins/plugins/morphoblue'

import assert from 'assert'
import { TransactionUtils } from './utils/TransactionUtils'
import { Hex } from 'viem'

jest.setTimeout(300000)

/** TEST CONFIG */
const config = {
  SDKAPiUrl: 'https://72dytt1e93.execute-api.us-east-1.amazonaws.com/api/sdk',
  TenderlyForkUrl: 'https://virtual.mainnet.rpc.tenderly.co/f127b873-ff67-4490-ae0d-e17742db7725',
  DPMAddress: '0x7126E8E9C26832B441a560f4283e09f9c51AB605',
  walletAddress: '0xDDc68f9dE415ba2fE2FD84bc62Be2d2CFF1098dA',
  chainInfo: ChainFamilyMap.Ethereum.Mainnet,
  source: {
    collateralTokenSymbol: CommonTokenSymbols.WBTC,
    collateralAmount: '0.00005',
    debtTokenSymbol: CommonTokenSymbols.DAI,
    debtAmount: '1.0005',
    emodeType: EmodeType.None,
  },
  target: {
    // WBTC/USDC
    marketId: '0x3a85e619751152991742810df6ec69ce473daef99e28a64ab2340d7b7ccfee49' as const,
  },
  sendTransactionEnabled: true,
}

describe.skip('Refinance Morpho Spark | SDK', () => {
  it('should allow refinance Maker -> Spark with same pair', async () => {
    // SDK
    const sdk = makeSDK({ apiURL: config.SDKAPiUrl })

    // Chain
    const chain = await sdk.chains.getChain({
      chainInfo: config.chainInfo,
    })
    assert(chain, 'Chain not found')

    // User
    const walletAddress = Address.createFromEthereum({
      value: config.walletAddress as AddressValue,
    })
    const user = await sdk.users.getUser({
      chainInfo: chain.chainInfo,
      walletAddress: walletAddress,
    })

    // Positions Manager
    const positionsManager = PositionsManager.createFrom({
      address: Address.createFromEthereum({
        value: config.DPMAddress as AddressValue,
      }),
    })

    // Tokens
    const debtToken = await chain.tokens.getTokenBySymbol({
      symbol: config.source.debtTokenSymbol,
    })
    const collateralToken = await chain.tokens.getTokenBySymbol({
      symbol: config.source.collateralTokenSymbol,
    })

    if (!debtToken || !collateralToken) {
      assert(false, 'Tokens not found')
    }

    const sourceProtocol = await chain.protocols.getProtocol({ name: ProtocolName.Spark })
    assert(sourceProtocol, 'Source protocol not found')

    if (!isSparkProtocol(sourceProtocol)) {
      assert(false, 'Spark protocol type is not lending')
    }

    const sourcePoolId = SparkLendingPoolId.createFrom({
      protocol: sourceProtocol,
      collateralToken: collateralToken,
      debtToken: debtToken,
      emodeType: config.source.emodeType,
    })

    const sourcePool = await sourceProtocol.getLendingPool({
      poolId: sourcePoolId,
    })
    assert(sourcePool, 'Spark pool not found')

    if (!isSparkLendingPool(sourcePool)) {
      assert(false, 'Spark pool type is not lending')
    }

    // Source position
    const sourcePosition = SparkPosition.createFrom({
      type: PositionType.Multiply,
      id: SparkPositionId.createFrom({
        id: 'SparkPosition',
      }),
      debtAmount: TokenAmount.createFrom({
        token: debtToken,
        amount: config.source.debtAmount,
      }),
      collateralAmount: TokenAmount.createFrom({
        token: collateralToken,
        amount: config.source.collateralAmount,
      }),
      pool: sourcePool,
    })

    // Target protocol
    const targetProtocol = await chain.protocols.getProtocol({
      name: ProtocolName.MorphoBlue,
    })
    assert(targetProtocol, 'Morpho not found')

    if (!isMorphoProtocol(targetProtocol)) {
      assert(false, 'Protocol type is not Morpho')
    }

    const targetPoolId = MorphoLendingPoolId.createFrom({
      protocol: targetProtocol,
      marketId: config.target.marketId,
    })

    const targetPool = await sourceProtocol.getLendingPool({
      poolId: targetPoolId,
    })

    assert(targetPool, 'Pool not found')

    if (!isMorphoLendingPoolId(targetPool.id)) {
      assert(false, 'Pool ID is not a Spark one')
    }

    if (!isLendingPool(sourcePool)) {
      assert(false, 'Spark pool type is not lending')
    }

    const refinanceParameters = RefinanceParameters.createFrom({
      sourcePosition: sourcePosition,
      targetPool: targetPool,
      slippage: Percentage.createFrom({ value: 0.2 }),
    })

    const refinanceSimulation: ISimulation<SimulationType.Refinance> =
      await sdk.simulator.refinance.simulateRefinancePosition(refinanceParameters)

    expect(refinanceSimulation).toBeDefined()

    expect(refinanceSimulation.sourcePosition?.id).toEqual(sourcePosition.id)
    expect(refinanceSimulation.targetPosition.pool.id).toEqual(targetPool.id)

    const refinanceOrder = await user.newOrder({
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
