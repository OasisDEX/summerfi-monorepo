import {
  EmodeType,
  ILKType,
  IMakerLendingPosition,
  MakerLendingPool,
  MakerLendingPoolId,
  MakerLendingPosition,
  MakerLendingPositionId,
  MakerProtocol,
  SparkLendingPool,
  SparkLendingPoolId,
  SparkLendingPosition,
  SparkLendingPositionId,
  SparkProtocol,
} from '@summerfi/protocol-plugins'
import {
  IRefinanceSimulation,
  RefinanceSimulation,
  Address,
  ChainFamilyMap,
  ChainInfo,
  Maybe,
  Token,
  TokenAmount,
  LendingPositionType,
  IPositionsManager,
  Order,
} from '@summerfi/sdk-common'
import { SDKManager } from '../../src/implementation/SDKManager'
import { UserClient } from '../../src/implementation/UserClient'
import { RPCMainClientType } from '../../src/rpc/SDKMainClient'

export default async function simulateNewOrder() {
  const chainInfo: ChainInfo = ChainFamilyMap.Ethereum.Mainnet

  // Tokens
  const WETH = Token.createFrom({
    chainInfo,
    address: Address.createFromEthereum({ value: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2' }),
    symbol: 'WETH',
    name: 'Wrapped Ether',
    decimals: 18,
  })

  const DAI = Token.createFrom({
    chainInfo,
    address: Address.createFromEthereum({ value: '0x6B175474E89094C44Da98b954EedeAC495271d0F' }),
    symbol: 'DAI',
    name: 'Dai Stablecoin',
    decimals: 18,
  })

  const makerProtocol = MakerProtocol.createFrom({
    chainInfo: chainInfo,
  })

  const makerPoolId = MakerLendingPoolId.createFrom({
    protocol: makerProtocol,
    ilkType: ILKType.ETH_A,
    collateralToken: Token.createFrom({
      address: Address.createFromEthereum({
        value: '0x6b175474e89094c44da98b954eedeac495271d0f',
      }),
      chainInfo: ChainFamilyMap.Ethereum.Mainnet,
      name: 'USD Coin',
      symbol: 'USDC',
      decimals: 6,
    }),
    debtToken: Token.createFrom({
      address: Address.createFromEthereum({
        value: '0x6b175474e89094c44da98b954eedeac495271d0f',
      }),
      chainInfo: { chainId: 1, name: 'Ethereum' },
      name: 'USD Coin',
      symbol: 'USDC',
      decimals: 6,
    }),
  })

  const pool = MakerLendingPool.createFrom({
    id: makerPoolId,
    collateralToken: makerPoolId.collateralToken,
    debtToken: makerPoolId.debtToken,
  })

  const prevPosition: IMakerLendingPosition = MakerLendingPosition.createFrom({
    subtype: LendingPositionType.Multiply,
    id: MakerLendingPositionId.createFrom({
      id: '1234567890',
      vaultId: '1234567890',
    }),
    pool: pool,
    debtAmount: TokenAmount.createFrom({ token: DAI, amount: '56.78' }),
    collateralAmount: TokenAmount.createFrom({ token: WETH, amount: '105.98' }),
  })

  const sparkProtocol = SparkProtocol.createFrom({
    chainInfo: chainInfo,
  })

  const sparkPoolId = SparkLendingPoolId.createFrom({
    protocol: sparkProtocol,
    collateralToken: Token.createFrom({
      address: Address.createFromEthereum({
        value: '0x6b175474e89094c44da98b954eedeac495271d0f',
      }),
      chainInfo: ChainFamilyMap.Ethereum.Mainnet,
      name: 'USD Coin',
      symbol: 'USDC',
      decimals: 6,
    }),
    debtToken: Token.createFrom({
      address: Address.createFromEthereum({
        value: '0x6b175474e89094c44da98b954eedeac495271d0f',
      }),
      chainInfo: { chainId: 1, name: 'Ethereum' },
      name: 'USD Coin',
      symbol: 'USDC',
      decimals: 6,
    }),
    emodeType: EmodeType.None,
  })

  const targetPool = SparkLendingPool.createFrom({
    id: sparkPoolId,
    collateralToken: sparkPoolId.collateralToken,
    debtToken: sparkPoolId.debtToken,
  })

  const simulation: IRefinanceSimulation = RefinanceSimulation.createFrom({
    sourcePosition: prevPosition,
    swaps: [],
    targetPosition: SparkLendingPosition.createFrom({
      subtype: LendingPositionType.Multiply,
      id: SparkLendingPositionId.createFrom({ id: '1234567890' }),
      debtAmount: TokenAmount.createFrom({ token: DAI, amount: '56.78' }),
      collateralAmount: TokenAmount.createFrom({ token: WETH, amount: '105.98' }),
      pool: targetPool,
    }),
    steps: [],
  })

  const positionsManager: IPositionsManager = {
    address: Address.ZeroAddressEthereum,
  }

  let userClient: UserClient | undefined = undefined

  type BuildOrderType = RPCMainClientType['orders']['buildOrder']['mutate']
  const buildOrder: BuildOrderType = jest.fn(async (params) => {
    expect(params).toBeDefined()
    expect(params.positionsManager).toBeDefined()
    expect(params.user).toBeDefined()
    expect(params.user.chainInfo).toBe(userClient?.user.chainInfo)
    expect(params.user.wallet).toBe(userClient?.user.wallet)

    expect(params.simulation).toBeDefined()
    expect(params.simulation).toBe(simulation)

    return {} as Maybe<Order>
  })

  const rpcClient = {
    orders: {
      buildOrder: {
        mutate: buildOrder,
      },
    },
  } as unknown as RPCMainClientType

  const sdkManager = new SDKManager({ rpcClient })

  expect(sdkManager).toBeDefined()

  userClient = await sdkManager.users.getUserClient({
    chainInfo: chainInfo,
    walletAddress: Address.createFromEthereum({
      value: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
    }),
  })

  const order: Maybe<Order> = await userClient.newOrder({ simulation, positionsManager })

  if (!order) {
    fail('Order not generated')
  }
}
