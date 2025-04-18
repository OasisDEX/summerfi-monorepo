import { Address, ChainFamilyMap, Percentage, TokenAmount, type Maybe } from '@summerfi/sdk-common'

import { makeSDK, type Chain } from '@summerfi/sdk-client'
import {
  ExternalLendingPosition,
  ExternalLendingPositionType,
  ImportPositionParameters,
  Order,
  PositionsManager,
  RefinanceParameters,
  AddressValue,
  CommonTokenSymbols,
  ExternalLendingPositionId,
  IImportSimulation,
  IRefinanceSimulation,
  IToken,
  isLendingPool,
  LendingPositionType,
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
    const maker = MakerProtocol.createFrom({
      chainInfo: chain.chainInfo,
    })

    if (!isMakerProtocol(maker)) {
      assert(false, 'Maker protocol type is not lending')
    }

    const makerPoolId = MakerLendingPoolId.createFrom({
      protocol: maker,
      debtToken: sourceDebtToken,
      collateralToken: sourceCollateralToken,
      ilkType: config.source.ilkType,
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
      id: MakerLendingPositionId.createFrom({
        id: config.makerVaultId,
        vaultId: config.makerVaultId,
      }),
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
    const spark = SparkProtocol.createFrom({
      chainInfo: chain.chainInfo,
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

    const sparkPool = await chain.protocols.getLendingPool({
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
    const importSimulation: IImportSimulation =
      await sdk.simulator.importing.simulateImportPosition(
        ImportPositionParameters.createFrom({
          externalPosition: ExternalLendingPosition.createFrom({
            ...makerPosition,
            id: ExternalLendingPositionId.createFrom({
              externalType: ExternalLendingPositionType.DS_PROXY,
              id: '0x517775d01FA1D41c8906848e88831b6dA49AB8E7',
              address: Address.createFromEthereum({
                value: '0x517775d01FA1D41c8906848e88831b6dA49AB8E7',
              }),
              protocolId: makerPosition.id,
            }),
          }),
        }),
      )

    //
    // REFINANCE SIMULATION
    //
    const refinanceParameters = RefinanceParameters.createFrom({
      sourcePosition: makerPosition,
      targetPool: sparkPool,
      slippage: Percentage.createFrom({ value: 0.2 }),
    })

    const refinanceSimulation: IRefinanceSimulation =
      await sdk.simulator.refinance.simulateRefinancePosition(refinanceParameters)

    expect(refinanceSimulation).toBeDefined()

    expect(refinanceSimulation.sourcePosition?.id).toEqual(makerPosition.id)
    expect(refinanceSimulation.targetPosition.pool.id).toEqual(sparkPool.id)

    console.log('Refinance Simulation:', JSON.stringify(refinanceSimulation, null, 2))
    //
    // IMPORT ORDER
    //
    const importOrder: Maybe<Order> = await userClient.newOrder({
      positionsManager,
      simulation: importSimulation,
    })

    assert(importOrder, 'Order not found')

    //
    // REFINANCE ORDER
    //
    const refinanceOrder: Maybe<Order> = await userClient.newOrder({
      positionsManager,
      simulation: refinanceSimulation,
    })

    assert(refinanceOrder, 'Order not found')

    if (config.sendTransaction) {
      // Send transaction
      console.log('Sending transaction...')

      const privateKey = process.env.DEPLOYER_PRIVATE_KEY as Hex
      const transactionUtils = new TransactionUtils({
        chainInfo: chain.chainInfo,
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
