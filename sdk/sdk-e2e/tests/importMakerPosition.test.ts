import { makeSDK, type Chain } from '@summerfi/sdk-client'
import {
  Address,
  ChainFamilyMap,
  Token,
  TokenAmount,
  type Maybe,
  CommonTokenSymbols,
  ExternalLendingPositionType,
  ImportPositionParameters,
  Order,
  SimulationSteps,
  SimulationType,
  ExternalLendingPosition,
  ExternalLendingPositionId,
  LendingPositionType,
  IImportSimulation,
  isImportSimulation,
} from '@summerfi/sdk-common'

import {
  ILKType,
  MakerLendingPoolId,
  MakerLendingPosition,
  MakerLendingPositionId,
  MakerProtocol,
  isMakerLendingPool,
  isMakerProtocol,
} from '@summerfi/protocol-plugins'
import { TransactionUtils } from '@summerfi/testing-utils'
import assert from 'assert'
import { Hex } from 'viem'

jest.setTimeout(300000)

const SDKAPiUrl = 'https://zmjmtfsocb.execute-api.us-east-1.amazonaws.com/api/sdk'
const TenderlyForkUrl =
  'https://virtual.mainnet.rpc.tenderly.co/d4cb5af8-8015-4342-b95d-26e5b05a6525'

describe.skip('Import Maker Position | SDK', () => {
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
      value: '0xbEf4befb4F230F43905313077e3824d7386E09F8',
    })
    const userClient = await sdk.users.getUserClient({
      chainInfo: chain.chainInfo,
      walletAddress: walletAddress,
    })
    expect(userClient).toBeDefined()
    expect(userClient.user.wallet.address).toEqual(walletAddress)
    expect(userClient.user.chainInfo).toEqual(chain.chainInfo)

    // Tokens
    const WETH: Maybe<Token> = await chain.tokens.getTokenBySymbol({
      symbol: CommonTokenSymbols.WETH,
    })
    assert(WETH, 'WETH not found')

    const DAI: Maybe<Token> = await chain.tokens.getTokenBySymbol({
      symbol: CommonTokenSymbols.DAI,
    })
    assert(DAI, 'DAI not found')

    const maker = MakerProtocol.createFrom({
      chainInfo: chain.chainInfo,
    })

    if (!isMakerProtocol(maker)) {
      assert(false, 'Maker protocol type is not Maker')
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
    const makerPositionId = MakerLendingPositionId.createFrom({
      id: '31646',
      vaultId: '31646',
    })

    const makerPosition = MakerLendingPosition.createFrom({
      subtype: LendingPositionType.Multiply,
      id: makerPositionId,
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

    const importPositionSimulation: IImportSimulation =
      await sdk.simulator.importing.simulateImportPosition(
        ImportPositionParameters.createFrom({
          externalPosition: ExternalLendingPosition.createFrom({
            ...makerPosition,
            id: ExternalLendingPositionId.createFrom({
              id: 'test',
              externalType: ExternalLendingPositionType.DS_PROXY,
              address: Address.createFromEthereum({
                value: '0x6c7ed10997873b59c2b2d9449d9106fe1dd85784',
              }),
              protocolId: makerPositionId,
            }),
          }),
        }),
      )

    expect(importPositionSimulation).toBeDefined()

    expect(importPositionSimulation.type).toEqual(SimulationType.ImportPosition)
    assert(importPositionSimulation.sourcePosition, 'Source position not found')
    expect(importPositionSimulation.steps.length).toBe(1)
    expect(importPositionSimulation.steps[0].type).toBe(SimulationSteps.Import)

    const importPositionOrder: Maybe<Order> = await userClient.newOrder({
      positionsManager: {
        address: Address.createFromEthereum({
          value: '0x551Eb8395093fDE4B9eeF017C93593a3C7a75138',
        }),
      },
      simulation: importPositionSimulation,
    })

    assert(importPositionOrder, 'Order not found')

    expect(importPositionOrder.simulation.type).toEqual(importPositionSimulation.type)
    assert(isImportSimulation(importPositionOrder.simulation), 'Simulation is not Import')

    expect(importPositionOrder.simulation.sourcePosition.id).toEqual(
      importPositionSimulation.sourcePosition?.id,
    )

    expect(importPositionOrder.transactions.length).toEqual(1)

    console.log('Import Position Order:', JSON.stringify(importPositionOrder.transactions[0]))
    // Send transaction
    console.log('Sending transaction...')

    const privateKey = process.env.DEPLOYER_PRIVATE_KEY as Hex
    const transactionUtils = new TransactionUtils({
      chainInfo: chain.chainInfo,
      rpcUrl: TenderlyForkUrl,
      walletPrivateKey: privateKey,
    })

    const receipt = await transactionUtils.sendTransaction({
      transaction: importPositionOrder.transactions[0].transaction,
    })

    console.log('Transaction sent:', receipt)
  })
})
