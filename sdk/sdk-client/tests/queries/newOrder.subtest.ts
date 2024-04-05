import { IProtocol, PoolType, ProtocolName } from '@summerfi/sdk-common/protocols'
import { SDKManager } from '../../src/implementation/SDKManager'
import { RPCClientType } from '../../src/rpc/SDKClient'
import { MakerLendingPool } from '@summerfi/protocol-plugins/plugins/maker'
import { SparkLendingPool } from '@summerfi/protocol-plugins/plugins/spark'
import { ISimulation, SimulationType } from '@summerfi/sdk-common/simulation'
import {
  Address,
  ChainFamilyMap,
  ChainInfo,
  Maybe,
  Percentage,
  Position,
  PositionId,
  PositionType,
  RiskRatio,
  Token,
  TokenAmount,
} from '@summerfi/sdk-common/common'
import { IPositionsManager, Order } from '@summerfi/sdk-common/orders'
import { User } from '../../src/implementation/User'

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

  const protocol: IProtocol = {
    name: ProtocolName.Maker,
    chainInfo: chainInfo,
  }

  const pool: MakerLendingPool = {
    type: PoolType.Lending,
    protocol: protocol,
    poolId: {
      protocol: protocol,
    },
    collaterals: {},
    debts: {},
    baseCurrency: DAI,
  } as MakerLendingPool

  const prevPosition: Position = {
    type: PositionType.Multiply,
    pool: pool,
    debtAmount: TokenAmount.createFrom({ token: DAI, amount: '56.78' }),
    collateralAmount: TokenAmount.createFrom({ token: WETH, amount: '105.98' }),
    positionId: PositionId.createFrom({ id: '1234567890' }),
    riskRatio: RiskRatio.createFrom({
      ratio: Percentage.createFrom({ value: 0.5 }),
      type: RiskRatio.type.LTV,
    }),
  }

  const targetPool: SparkLendingPool = {
    type: PoolType.Lending,
    protocol: protocol,
    poolId: {
      protocol: protocol,
    },
    collaterals: {},
    debts: {},
    baseCurrency: DAI,
  } as SparkLendingPool

  const simulation: ISimulation<SimulationType.Refinance> = {
    simulationType: SimulationType.Refinance,
    sourcePosition: prevPosition,
    swaps: [],
    targetPosition: {
      type: PositionType.Multiply,
      positionId: PositionId.createFrom({ id: '1234567890' }),
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

  type BuildOrderType = RPCClientType['orders']['buildOrder']['mutate']
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
  } as unknown as RPCClientType

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
