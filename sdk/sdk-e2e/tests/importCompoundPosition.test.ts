import {
  Token,
  TokenAmount,
  Position,
  Address,
  type Maybe,
  ChainFamilyMap,
  PositionType,
} from '@summerfi/sdk-common/common'

import { ProtocolName, isLendingPool } from '@summerfi/sdk-common/protocols'
import { makeSDK, type Chain, type User } from '@summerfi/sdk-client'
import { TokenSymbol } from '@summerfi/sdk-common/common/enums'
import { ExternalPositionType, IImportPositionParameters, Order } from '@summerfi/sdk-common/orders'
import { ISimulation, SimulationSteps, SimulationType } from '@summerfi/sdk-common/simulation'

import assert from 'assert'
import {
  CompoundV3PoolId,
  CompoundV3PositionId,
} from '@summerfi/protocol-plugins/plugins/compound-v3'
import { Hex } from 'viem'
import { TransactionUtils } from './utils/TransactionUtils'
import { ICompoundV3Protocol } from 'node_modules/@summerfi/protocol-plugins/src/plugins/compound-v3/interfaces/ICompoundV3Protocol'

jest.setTimeout(300000)

const SDKAPiUrl = 'https://jghh34e4mj.execute-api.us-east-1.amazonaws.com/api/sdk'
const TenderlyForkUrl =
  'https://virtual.mainnet.rpc.tenderly.co/ec6bdc6f-1f8b-4192-9c42-331ae2a81ff8'

describe.skip('Import Compound V3 Position | SDK', () => {
  it('should allow refinance Compound V3 -> Spark with same pair', async () => {
    // SDK
    const sdk = makeSDK({ apiURL: SDKAPiUrl })

    // Chain
    const chain: Maybe<Chain> = await sdk.chains.getChain({
      chainInfo: ChainFamilyMap.Ethereum.Mainnet,
    })

    assert(chain, 'Chain not found')

    // User
    const walletAddress = Address.createFromEthereum({
      value: '0x86f92d7ec49067226ac342cc00e668cb0285ed38',
    })
    const user: User = await sdk.users.getUser({
      chainInfo: chain.chainInfo,
      walletAddress: walletAddress,
    })
    expect(user).toBeDefined()
    expect(user.wallet.address).toEqual(walletAddress)
    expect(user.chainInfo).toEqual(chain.chainInfo)

    // Tokens
    const WBTC: Maybe<Token> = await chain.tokens.getTokenBySymbol({ symbol: TokenSymbol.WBTC })
    assert(WBTC, 'WBTC not found')

    const USDC: Maybe<Token> = await chain.tokens.getTokenBySymbol({ symbol: TokenSymbol.USDC })
    assert(USDC, 'USDC not found')

    const compoundV3 = await chain.protocols.getProtocol({ name: ProtocolName.CompoundV3 })
    assert(compoundV3, 'CompoundV3 protocol not found')
    const protocol = {
      name: ProtocolName.CompoundV3 as const,
      chainInfo: ChainFamilyMap.Ethereum.Mainnet,
    } as ICompoundV3Protocol
    const compoundV3PoolId = CompoundV3PoolId.createFrom({
      protocol: protocol,
      collaterals: [TokenSymbol.WBTC],
      debt: TokenSymbol.USDC,
      comet: Address.createFromEthereum({ value: '0xc3d688B66703497DAA19211EEdff47f25384cdc3' }),
    })

    const compoundV3Pool = await compoundV3.getPool({
      poolId: compoundV3PoolId,
    })
    assert(compoundV3Pool, 'Compound pool not found')

    if (!isLendingPool(compoundV3Pool)) {
      assert(false, 'Maker pool type is not lending')
    }

    // Source position
    const compoundPosition: Position = Position.createFrom({
      type: PositionType.Multiply,
      positionId: CompoundV3PositionId.createFrom({
        id: '31646',
        positionParameters: {
          comet: Address.createFromEthereum({
            value: '0xc3d688B66703497DAA19211EEdff47f25384cdc3',
          }),
          debt: compoundV3PoolId.debt,
          collaterals: compoundV3PoolId.collaterals,
          positionAddress: walletAddress,
        },
      }),
      debtAmount: TokenAmount.createFromBaseUnit({
        token: USDC,
        amount: '24362146803083',
      }),
      collateralAmount: TokenAmount.createFromBaseUnit({
        token: WBTC,
        amount: '2127004370346054622',
      }),
      pool: compoundV3Pool,
    })

    const privateKey = process.env.DEPLOYER_PRIVATE_KEY as Hex
    const transactionUtils = new TransactionUtils({
      rpcUrl: TenderlyForkUrl,
      walletPrivateKey: privateKey,
    })

    // await transactionUtils.impersonateSendTransaction({
    //   transaction: {
    //     target: Address.createFromEthereum({
    //       value: '0xF7B75183A2829843dB06266c114297dfbFaeE2b6',
    //     }),
    //     value: 0n.toString(16) as Hex,
    //     calldata: '0x9dca362f',
    //   },
    //   impersonate: walletAddress.value,
    // })
    // TODO: get proxy address from the tx receipt

    const importPositionSimulation: ISimulation<SimulationType.ImportPosition> =
      await sdk.simulator.importing.simulateImportPosition({
        externalPosition: {
          position: compoundPosition,
          externalId: {
            type: ExternalPositionType.WALLET,
            address: walletAddress,
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
          value: '0x5FdBC6DEfbe76c33b1d75b61208269f2181CAc0b',
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

    const receipt = await transactionUtils.impersonateSendTransaction({
      transaction: importPositionOrder.transactions[0].transaction,
      impersonate: walletAddress.value,
    })

    console.log('Transaction sent:', receipt)
  })
})
