import {
  Address,
  ChainFamilyMap,
  PositionType,
  Token,
  TokenAmount,
  type Maybe,
} from '@summerfi/sdk-common/common'

import { makeSDK, type Chain } from '@summerfi/sdk-client'
import { CommonTokenSymbols } from '@summerfi/sdk-common/common/enums'
import { ExternalPositionType, IImportPositionParameters, Order } from '@summerfi/sdk-common/orders'
import { ProtocolName } from '@summerfi/sdk-common/protocols'
import { ISimulation, SimulationSteps, SimulationType } from '@summerfi/sdk-common/simulation'

import {
  ILKType,
  MakerLendingPoolId,
  MakerPosition,
  MakerPositionId,
  isMakerLendingPool,
  isMakerProtocol,
} from '@summerfi/protocol-plugins/plugins/maker'
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
    const user = await sdk.users.getUser({
      chainInfo: chain.chainInfo,
      walletAddress: walletAddress,
    })
    expect(user).toBeDefined()
    expect(user.wallet.address).toEqual(walletAddress)
    expect(user.chainInfo).toEqual(chain.chainInfo)

    // Tokens
    const WETH: Maybe<Token> = await chain.tokens.getTokenBySymbol({
      symbol: CommonTokenSymbols.WETH,
    })
    assert(WETH, 'WETH not found')

    const DAI: Maybe<Token> = await chain.tokens.getTokenBySymbol({
      symbol: CommonTokenSymbols.DAI,
    })
    assert(DAI, 'DAI not found')

    const maker = await chain.protocols.getProtocol({ name: ProtocolName.Maker })
    assert(maker, 'Maker protocol not found')

    if (!isMakerProtocol(maker)) {
      assert(false, 'Maker protocol type is not Maker')
    }

    const makerPoolId = MakerLendingPoolId.createFrom({
      protocol: maker,
      debtToken: DAI,
      collateralToken: WETH,
      ilkType: ILKType.ETH_C,
    })

    const makerPool = await maker.getLendingPool({
      poolId: makerPoolId,
    })
    assert(makerPool, 'Maker pool not found')

    if (!isMakerLendingPool(makerPool)) {
      assert(false, 'Maker pool type is not lending')
    }

    // Source position
    const makerPosition = MakerPosition.createFrom({
      type: PositionType.Multiply,
      id: MakerPositionId.createFrom({ id: '31646', vaultId: '31646' }),
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

    expect(importPositionOrder.simulation.sourcePosition.id).toEqual(
      importPositionSimulation.sourcePosition?.id,
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
