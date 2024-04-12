import {
  PositionId,
  Token,
  TokenAmount,
  Position,
  Address,
  type Maybe,
  ChainFamilyMap,
  AddressValue,
  PositionType,
} from '@summerfi/sdk-common/common'

import { ProtocolName, isLendingPool } from '@summerfi/sdk-common/protocols'
import { makeSDK, type Chain, type User } from '@summerfi/sdk-client'
import { TokenSymbol } from '@summerfi/sdk-common/common/enums'
import {
  ExternalPositionType,
  IImportPositionParameters,
  IPositionsManager,
  Order,
} from '@summerfi/sdk-common/orders'
import { ISimulation, SimulationSteps, SimulationType } from '@summerfi/sdk-common/simulation'
import { Deployments } from '@summerfi/core-contracts'
import { DeploymentIndex } from '@summerfi/deployment-utils'

import assert from 'assert'
import { ILKType, MakerPoolId } from '@summerfi/protocol-plugins/plugins/maker'
import { Hex } from 'viem'
import { TransactionUtils } from './utils/TransactionUtils'

jest.setTimeout(300000)

const SDKAPiUrl = 'https://zmjmtfsocb.execute-api.us-east-1.amazonaws.com/api/sdk'
const TenderlyForkUrl =
  'https://virtual.mainnet.rpc.tenderly.co/c9231728-8442-4c98-80a0-7fbdca928099'

describe('Import Maker Position | SDK', () => {
  it('should allow refinance Maker -> Spark with same pair', async () => {
    // SDK
    const sdk = makeSDK({ apiURL: SDKAPiUrl })

    // Chain
    const chain: Maybe<Chain> = await sdk.chains.getChain({
      chainInfo: ChainFamilyMap.Ethereum.Mainnet,
    })

    assert(chain, 'Chain not found')

    // Deployment
    const deploymentName = `${chain.chainInfo.name}.standard`
    const deployments = Deployments as DeploymentIndex
    const deployment = deployments[deploymentName]

    // Strategy Executor
    const strategyExecutorAddress = Address.createFromEthereum({
      value: deployment.contracts.OperationExecutor.address as AddressValue,
    })

    // User
    const walletAddress = Address.createFromEthereum({
      value: '0xbEf4befb4F230F43905313077e3824d7386E09F8',
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
        value: '0x551Eb8395093fDE4B9eeF017C93593a3C7a75138',
      }),
    }

    // Tokens
    const WETH: Maybe<Token> = await chain.tokens.getTokenBySymbol({ symbol: TokenSymbol.WETH })
    assert(WETH, 'WETH not found')

    const DAI: Maybe<Token> = await chain.tokens.getTokenBySymbol({ symbol: TokenSymbol.DAI })
    assert(DAI, 'DAI not found')

    const maker = await chain.protocols.getProtocol({ name: ProtocolName.Maker })
    assert(maker, 'Maker protocol not found')

    const makerPoolId: MakerPoolId = {
      protocol: {
        name: ProtocolName.Maker,
        chainInfo: chain.chainInfo,
      },
      ilkType: ILKType.ETH_C,
      vaultId: '31646',
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
      positionId: PositionId.createFrom({ id: '31646' }),
      debtAmount: TokenAmount.createFromBaseUnit({
        token: DAI,
        amount: '3717915731044925295249',
      }),
      collateralAmount: TokenAmount.createFromBaseUnit({
        token: WETH,
        amount: '2127004370346054622',
      }),
      pool: makerPool,
    })

    const importPositionSimulation: ISimulation<SimulationType.ImportPosition> =
      await sdk.simulator.importing.simulateImportPosition({
        externalPosition: {
          position: makerPosition,
          externalId: {
            type: ExternalPositionType.DS_PROXY,
            address: Address.createFromEthereum({
              value: '0x6c7ed10997873b59c2b2d9449d9106fe1dd85784',
            }),
          },
        },
      } as IImportPositionParameters)

    expect(importPositionSimulation).toBeDefined()

    expect(importPositionSimulation.simulationType).toEqual(SimulationType.ImportPosition)
    assert(importPositionSimulation.sourcePosition, 'Source position not found')
    expect(importPositionSimulation.steps.length).toBe(1)
    expect(importPositionSimulation.steps[0].type).toBe(SimulationSteps.Import)

    const importPositionOrder: Maybe<Order> = await user.newOrder({
      positionsManager: {
        address: Address.createFromEthereum({
          value: '0x551Eb8395093fDE4B9eeF017C93593a3C7a75138',
        }),
      },
      simulation: importPositionSimulation,
    })

    assert(importPositionOrder, 'Order not found')

    expect(importPositionOrder.simulation.simulationType).toEqual(
      importPositionSimulation.simulationType,
    )
    assert(importPositionOrder.simulation.sourcePosition, 'Source position not found')

    expect(importPositionOrder.simulation.sourcePosition.positionId).toEqual(
      importPositionSimulation.sourcePosition?.positionId,
    )

    expect(importPositionOrder.transactions.length).toEqual(1)

    console.log('Import Position Order:', JSON.stringify(importPositionOrder.transactions[0]))
    // Send transaction
    console.log('Sending transaction...')

    const privateKey = process.env.DEPLOYER_PRIVATE_KEY as Hex
    const transactionUtils = new TransactionUtils({
      rpcUrl: TenderlyForkUrl,
      walletPrivateKey: privateKey,
    })

    const receipt = await transactionUtils.sendTransaction({
      transaction: importPositionOrder.transactions[0].transaction,
    })

    console.log('Transaction sent:', receipt)
  })
})
