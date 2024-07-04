import { PoolType, ProtocolName } from '@summerfi/sdk-common/protocols'
import { SDKManager } from '../../src/implementation/SDKManager'
import { RPCMainClientType } from '../../src/rpc/SDKMainClient'
import {
  ILKType,
  IMakerLendingPoolData,
  MakerPositionId,
} from '@summerfi/protocol-plugins/plugins/maker'
import {
  ISparkLendingPoolData,
  ISparkLendingPoolIdData,
  SparkPositionId,
} from '@summerfi/protocol-plugins/plugins/spark'
import { ISimulation, SimulationType } from '@summerfi/sdk-common/simulation'
import {
  Address,
  AddressType,
  ChainFamilyMap,
  ChainInfo,
  Maybe,
  PositionType,
  Token,
  TokenAmount,
} from '@summerfi/sdk-common/common'
import { IPositionsManager, Order } from '@summerfi/sdk-common/orders'
import { User } from '../../src/implementation/User'
import { IMakerProtocolData } from '@summerfi/protocol-plugins/plugins/maker/interfaces/IMakerProtocol'
import { IMakerLendingPoolIdData } from '@summerfi/protocol-plugins/plugins/maker/interfaces/IMakerLendingPoolId'
import { IPositionData } from '@summerfi/sdk-common'
import { ISparkProtocolData } from '@summerfi/protocol-plugins/plugins/spark/interfaces/ISparkProtocol'
import { EmodeType } from '@summerfi/protocol-plugins/plugins/common'

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

  const makerProtocol: IMakerProtocolData = {
    name: ProtocolName.Maker,
    chainInfo: chainInfo,
  }

  const makerPoolId: IMakerLendingPoolIdData = {
    protocol: makerProtocol,
    ilkType: ILKType.ETH_A,
    collateralToken: {
      address: {
        type: AddressType.Ethereum,
        value: '0x6b175474e89094c44da98b954eedeac495271d0f',
      },
      chainInfo: { chainId: 1, name: 'Ethereum' },
      name: 'USD Coin',
      symbol: 'USDC',
      decimals: 6,
    },
    debtToken: {
      address: {
        type: AddressType.Ethereum,
        value: '0x6b175474e89094c44da98b954eedeac495271d0f',
      },
      chainInfo: { chainId: 1, name: 'Ethereum' },
      name: 'USD Coin',
      symbol: 'USDC',
      decimals: 6,
    },
  }

  const pool: IMakerLendingPoolData = {
    type: PoolType.Lending,
    id: makerPoolId,
    collateralToken: makerPoolId.collateralToken,
    debtToken: makerPoolId.debtToken,
  }

  const prevPosition: IPositionData = {
    type: PositionType.Multiply,
    id: MakerPositionId.createFrom({ id: '1234567890', vaultId: '34' }),
    pool: pool,
    debtAmount: TokenAmount.createFrom({ token: DAI, amount: '56.78' }),
    collateralAmount: TokenAmount.createFrom({ token: WETH, amount: '105.98' }),
  }

  const sparkProtocol: ISparkProtocolData = {
    name: ProtocolName.Spark,
    chainInfo: chainInfo,
  }

  const sparkPoolId: ISparkLendingPoolIdData = {
    protocol: sparkProtocol,
    collateralToken: {
      address: {
        type: AddressType.Ethereum,
        value: '0x6b175474e89094c44da98b954eedeac495271d0f',
      },
      chainInfo: { chainId: 1, name: 'Ethereum' },
      name: 'USD Coin',
      symbol: 'USDC',
      decimals: 6,
    },
    debtToken: {
      address: {
        type: AddressType.Ethereum,
        value: '0x6b175474e89094c44da98b954eedeac495271d0f',
      },
      chainInfo: { chainId: 1, name: 'Ethereum' },
      name: 'USD Coin',
      symbol: 'USDC',
      decimals: 6,
    },
    emodeType: EmodeType.None,
  }

  const targetPool: ISparkLendingPoolData = {
    type: PoolType.Lending,
    id: sparkPoolId,
    collateralToken: sparkPoolId.collateralToken,
    debtToken: sparkPoolId.debtToken,
  }

  const simulation: ISimulation<SimulationType.Refinance> = {
    simulationType: SimulationType.Refinance,
    sourcePosition: prevPosition,
    swaps: [],
    targetPosition: {
      type: PositionType.Multiply,
      id: SparkPositionId.createFrom({ id: '1234567890' }),
      debtAmount: TokenAmount.createFrom({ token: DAI, amount: '56.78' }),
      collateralAmount: TokenAmount.createFrom({ token: WETH, amount: '105.98' }),
      pool: targetPool,
    },
    steps: [],
  }

  const positionsManager: IPositionsManager = {
    address: Address.ZeroAddressEthereum,
  }

  let user: User | undefined = undefined

  type BuildOrderType = RPCMainClientType['orders']['buildOrder']['mutate']
  const buildOrder: BuildOrderType = jest.fn(async (params) => {
    expect(params).toBeDefined()
    expect(params.positionsManager).toBeDefined()
    expect(params.user).toBeDefined()
    expect(params.user.chainInfo).toBe(user?.chainInfo)
    expect(params.user.wallet).toBe(user?.wallet)

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

  user = await sdkManager.users.getUser({
    chainInfo: chainInfo,
    walletAddress: Address.createFromEthereum({
      value: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
    }),
  })

  const order: Maybe<Order> = await user.newOrder({ simulation, positionsManager })

  if (!order) {
    fail('Order not generated')
  }
}
