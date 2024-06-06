import {
  Percentage,
  TokenAmount,
  Address,
  type Maybe,
  ChainFamilyMap,
  PositionType,
} from '@summerfi/sdk-common/common'

import { ProtocolName, isLendingPool } from '@summerfi/sdk-common/protocols'
import { ProtocolClient, makeSDK, type Chain, type User } from '@summerfi/sdk-client'
import {
  PositionsManager,
  Order,
  RefinanceParameters,
  ExternalPositionType,
} from '@summerfi/sdk-common/orders'
import { ISimulation, SimulationType } from '@summerfi/sdk-common/simulation'
import { TransactionUtils } from './utils/TransactionUtils'

import { Hex } from 'viem'
import assert from 'assert'
import { EmodeType } from '@summerfi/protocol-plugins/plugins/common'
import { AddressValue, CommonTokenSymbols, IToken } from '@summerfi/sdk-common'
import {
  SparkLendingPoolId,
  isSparkLendingPoolId,
  isSparkProtocol,
} from '@summerfi/protocol-plugins/plugins/spark'
import {
  ILKType,
  MakerLendingPoolId,
  MakerPosition,
  MakerPositionId,
  isMakerLendingPool,
  isMakerProtocol,
} from '@summerfi/protocol-plugins/plugins/maker'

jest.setTimeout(300000)

/** TEST CONFIG */
const config = {
  SDKAPiUrl: 'https://72dytt1e93.execute-api.us-east-1.amazonaws.com/api/sdk',
  TenderlyForkUrl: 'https://virtual.mainnet.rpc.tenderly.co/c5113732-6db6-400d-ad7c-8706e0857239',
  makerVaultId: '31722',
  DPMAddress: '0x7126E8E9C26832B441a560f4283e09f9c51AB605',
  walletAddress: '0xDDc68f9dE415ba2fE2FD84bc62Be2d2CFF1098dA',
  source: {
    collateralTokenSymbol: CommonTokenSymbols.WETH,
    collateralAmount: '13.49',
    debtTokenSymbol: CommonTokenSymbols.DAI,
    debtAmount: '13329.47',
    ilkType: ILKType.ETH_C,
  },
  target: {
    collateralTokenSymbol: CommonTokenSymbols.WBTC,
    debtTokenSymbol: CommonTokenSymbols.DAI,
    emodeType: EmodeType.None,
  },
  sendTransaction: false,
}

describe.skip('Refinance Maker -> Spark | SDK', () => {
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

    // Source position
    const maker = await chain.protocols.getProtocol({ name: ProtocolName.Maker })
    assert(maker, 'Maker protocol not found')

    if (!isMakerProtocol(maker)) {
      assert(false, 'Maker protocol type is not lending')
    }

    const makerPoolId = MakerLendingPoolId.createFrom({
      protocol: maker,
      debtToken: sourceDebtToken,
      collateralToken: sourceCollateralToken,
      ilkType: config.source.ilkType,
    })

    const makerPool = await maker.getLendingPool({
      poolId: makerPoolId,
    })
    assert(makerPool, 'Maker pool not found')

    if (!isMakerLendingPool(makerPool)) {
      assert(false, 'Maker pool type is not lending')
    }

    // Source position
    const makerPosition: MakerPosition = MakerPosition.createFrom({
      type: PositionType.Multiply,
      id: MakerPositionId.createFrom({ id: config.makerVaultId, vaultId: config.makerVaultId }),
      debtAmount: TokenAmount.createFrom({
        token: sourceDebtToken,
        amount: config.source.debtAmount,
      }),
      collateralAmount: TokenAmount.createFrom({
        token: sourceCollateralToken,
        amount: config.source.collateralAmount,
      }),
      pool: makerPool,
    })

    // Target protocol
    const spark: Maybe<ProtocolClient> = await chain.protocols.getProtocol({
      name: ProtocolName.Spark,
    })
    assert(spark, 'Spark not found')

    if (!isSparkProtocol(spark)) {
      assert(false, 'Protocol type is not Spark')
    }

    const targetPoolId = SparkLendingPoolId.createFrom({
      protocol: spark,
      collateralToken: targetCollateralToken,
      debtToken: targetDebtToken,
      emodeType: config.target.emodeType,
    })

    const sparkPool = await spark.getLendingPool({
      poolId: targetPoolId,
    })

    assert(sparkPool, 'Pool not found')

    if (!isSparkLendingPoolId(sparkPool.id)) {
      assert(false, 'Pool ID is not a Spark one')
    }

    if (!isLendingPool(sparkPool)) {
      assert(false, 'Spark pool type is not lending')
    }

    //
    // IMPORT SIMULATION
    //
    const importSimulation: ISimulation<SimulationType.ImportPosition> =
      await sdk.simulator.importing.simulateImportPosition({
        externalPosition: {
          externalId: {
            address: Address.createFromEthereum({
              value: '0x517775d01FA1D41c8906848e88831b6dA49AB8E7',
            }),
            type: ExternalPositionType.DS_PROXY,
          },
          position: makerPosition,
        },
      })

    //
    // REFINANCE SIMULATION
    //
    const refinanceParameters = RefinanceParameters.createFrom({
      sourcePosition: makerPosition,
      targetPool: sparkPool,
      slippage: Percentage.createFrom({ value: 0.2 }),
    })

    const refinanceSimulation: ISimulation<SimulationType.Refinance> =
      await sdk.simulator.refinance.simulateRefinancePosition(refinanceParameters)

    expect(refinanceSimulation).toBeDefined()

    expect(refinanceSimulation.sourcePosition?.id).toEqual(makerPosition.id)
    expect(refinanceSimulation.targetPosition.pool.id).toEqual(sparkPool.id)

    console.log('Refinance Simulation:', JSON.stringify(refinanceSimulation, null, 2))
    //
    // IMPORT ORDER
    //
    const importOrder: Maybe<Order> = await user.newOrder({
      positionsManager,
      simulation: importSimulation,
    })

    assert(importOrder, 'Order not found')

    //
    // REFINANCE ORDER
    //
    const refinanceOrder: Maybe<Order> = await user.newOrder({
      positionsManager,
      simulation: refinanceSimulation,
    })

    assert(refinanceOrder, 'Order not found')

    if (config.sendTransaction) {
      // Send transaction
      console.log('Sending transaction...')

      const privateKey = process.env.DEPLOYER_PRIVATE_KEY as Hex
      const transactionUtils = new TransactionUtils({
        rpcUrl: config.TenderlyForkUrl,
        walletPrivateKey: privateKey,
      })

      const importTxHash = await transactionUtils.sendTransaction({
        transaction: importOrder.transactions[0].transaction,
        waitForConfirmation: true,
      })

      console.log('Import Transaction Sent:', importTxHash)

      const refinanceTxHash = await transactionUtils.sendTransaction({
        transaction: refinanceOrder.transactions[0].transaction,
        waitForConfirmation: true,
      })

      console.log('Refinance Transaction Sent:', refinanceTxHash)
    }
  })
})
