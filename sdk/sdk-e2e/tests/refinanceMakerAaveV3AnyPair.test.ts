import {
  Address,
  ChainFamilyMap,
  Percentage,
  PositionType,
  TokenAmount,
  type Maybe,
} from '@summerfi/sdk-common/common'

import { IProtocolClient, makeSDK, type Chain } from '@summerfi/sdk-client'
import {
  ExternalLendingPositionType,
  Order,
  PositionsManager,
  RefinanceParameters,
} from '@summerfi/sdk-common/orders'
import { ISimulation, SimulationType } from '@summerfi/sdk-common/simulation'

import {
  AaveV3LendingPoolId,
  isAaveV3LendingPoolId,
  isAaveV3Protocol,
} from '@summerfi/protocol-plugins'
import { EmodeType } from '@summerfi/protocol-plugins/plugins/common'
import {
  ILKType,
  MakerLendingPoolId,
  MakerLendingPosition,
  MakerLendingPositionId,
  isMakerLendingPool,
  isMakerProtocol,
} from '@summerfi/protocol-plugins/plugins/maker'
import {
  AddressValue,
  CommonTokenSymbols,
  IToken,
  LendingPositionType,
  ProtocolName,
  Token,
} from '@summerfi/sdk-common'
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
    collateralAmount: '2.5',
    debtTokenSymbol: CommonTokenSymbols.DAI,
    debtAmount: '3509.8',
    ilkType: ILKType.ETH_C,
  },
  target: {
    collateralTokenSymbol: CommonTokenSymbols.sDAI,
    debtTokenSymbol: CommonTokenSymbols.LUSD,
    emodeType: EmodeType.Stablecoins,
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
    const user = await sdk.users.getUser({
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

    const targetCollateralToken = Token.createFrom({
      address: Address.createFromEthereum({
        value: '0x83F20F44975D03b1b09e64809B757c47f942BEeA',
      }),
      chainInfo: ChainFamilyMap.Ethereum.Mainnet,
      decimals: 18,
      name: 'SDAI Test',
      symbol: 'SDAI',
    })

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
    const makerPosition: MakerLendingPosition = MakerLendingPosition.createFrom({
      type: PositionType.Lending,
      subtype: LendingPositionType.Multiply,
      id: MakerLendingPositionId.createFrom({
        type: PositionType.Lending,
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
    const aaveV3: Maybe<IProtocolClient> = await chain.protocols.getProtocol({
      name: ProtocolName.AaveV3,
    })
    assert(aaveV3, 'AaveV3 not found')

    if (!isAaveV3Protocol(aaveV3)) {
      assert(false, 'Protocol type is not AaveV3')
    }

    const targetPoolId = AaveV3LendingPoolId.createFrom({
      protocol: aaveV3,
      collateralToken: targetCollateralToken,
      debtToken: targetDebtToken,
      emodeType: config.target.emodeType,
    })

    const targetPool = await aaveV3.getLendingPool({
      poolId: targetPoolId,
    })

    assert(targetPool, 'Pool not found')

    if (!isAaveV3LendingPoolId(targetPool.id)) {
      assert(false, 'Pool ID is not a AaveV3 one')
    }

    if (!isLendingPool(targetPool)) {
      assert(false, 'Spark pool type is not lending')
    }

    const poolInfo = await aaveV3.getLendingPoolInfo({ poolId: targetPoolId })
    console.log('Pool Info:', JSON.stringify(poolInfo, null, 2))

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
            type: ExternalLendingPositionType.DS_PROXY,
          },
          position: makerPosition,
        },
      })

    //
    // REFINANCE SIMULATION
    //
    const refinanceParameters = RefinanceParameters.createFrom({
      sourcePosition: makerPosition,
      targetPool: targetPool,
      slippage: Percentage.createFrom({ value: 0.2 }),
    })

    const refinanceSimulation: ISimulation<SimulationType.Refinance> =
      await sdk.simulator.refinance.simulateRefinancePosition(refinanceParameters)

    expect(refinanceSimulation).toBeDefined()

    expect(refinanceSimulation.sourcePosition?.id).toEqual(makerPosition.id)
    expect(refinanceSimulation.targetPosition.pool.id).toEqual(targetPool.id)

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
