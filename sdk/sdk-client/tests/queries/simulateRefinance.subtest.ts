import { SparkLendingPositionId } from '@summerfi/protocol-plugins'
import {
  ILKType,
  MakerLendingPool,
  MakerLendingPoolId,
  MakerLendingPosition,
  MakerLendingPositionId,
  MakerProtocol,
} from '@summerfi/protocol-plugins/plugins/maker'
import { RefinanceParameters } from '@summerfi/sdk-common'
import {
  Address,
  ChainFamilyMap,
  ChainInfo,
  Percentage,
  PoolType,
  PositionType,
  ProtocolName,
  Token,
  TokenAmount,
} from '@summerfi/sdk-common/common'
import { LendingPositionType } from '@summerfi/sdk-common/lending-protocols'
import { SimulationType } from '@summerfi/sdk-common/simulation'
import { IRefinanceSimulation } from '@summerfi/sdk-common/simulation/interfaces'
import { SDKManager } from '../../src/implementation/SDKManager'
import { RPCMainClientType } from '../../src/rpc/SDKMainClient'

export default async function simulateRefinanceTest() {
  type SimulateRefinanceType = RPCMainClientType['simulation']['refinance']['query']
  const simulateRefinance: SimulateRefinanceType = jest.fn(async (params) => {
    return {
      type: SimulationType.Refinance,
      sourcePosition: params.sourcePosition,
      targetPosition: {
        type: params.sourcePosition.type,
        id: SparkLendingPositionId.createFrom({ type: PositionType.Lending, id: '0987654321' }),
        debtAmount: TokenAmount.createFrom({
          amount: params.sourcePosition.debtAmount.amount,
          token: params.targetPool.debtToken,
        }),
        collateralAmount: TokenAmount.createFrom({
          amount: params.sourcePosition.collateralAmount.amount,
          token: params.targetPool.collateralToken,
        }),
        pool: params.targetPool,
      },
      swaps: [],
      steps: [],
    } as IRefinanceSimulation
  })

  const rpcClient = {
    simulation: {
      refinance: {
        query: simulateRefinance,
      },
    },
  } as unknown as RPCMainClientType

  const sdkManager = new SDKManager({ rpcClient })

  expect(sdkManager).toBeDefined()

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

  const USDC = Token.createFrom({
    chainInfo,
    address: Address.createFromEthereum({ value: '0x6b175474e89094c44da98b954eedeac495271d0f' }),
    symbol: 'USDC',
    name: 'USD Coin',
    decimals: 6,
  })

  const protocol = MakerProtocol.createFrom({
    name: ProtocolName.Maker,
    chainInfo: chainInfo,
  })

  const poolId = MakerLendingPoolId.createFrom({
    protocol: protocol,
    ilkType: ILKType.ETH_A,
    collateralToken: USDC,
    debtToken: USDC,
  })

  const pool = MakerLendingPool.createFrom({
    type: PoolType.Lending,
    id: poolId,
    collateralToken: poolId.collateralToken,
    debtToken: poolId.debtToken,
  })

  const prevPosition = MakerLendingPosition.createFrom({
    type: PositionType.Lending,
    subtype: LendingPositionType.Multiply,
    pool: pool,
    debtAmount: TokenAmount.createFrom({ token: DAI, amount: '56.78' }),
    collateralAmount: TokenAmount.createFrom({ token: WETH, amount: '105.98' }),
    id: MakerLendingPositionId.createFrom({
      type: PositionType.Lending,
      id: '1234567890',
      vaultId: '34',
    }),
  })

  const targetPool = MakerLendingPool.createFrom({
    type: PoolType.Lending,
    id: poolId,
    collateralToken: poolId.collateralToken,
    debtToken: poolId.debtToken,
  })

  const refinanceParameters = RefinanceParameters.createFrom({
    sourcePosition: prevPosition,
    targetPool: targetPool,
    slippage: Percentage.createFrom({ value: 0.5 }),
  })

  const simulation =
    await sdkManager.simulator.refinance.simulateRefinancePosition(refinanceParameters)

  expect(simulation).toBeDefined()
  expect(simulation.type).toBe(SimulationType.Refinance)
  expect(simulation.sourcePosition).toBeDefined()
  expect(simulation.sourcePosition?.id).toBe(prevPosition.id)
  expect(simulation.targetPosition).toBeDefined()
  expect(simulation.targetPosition.id).toBeDefined()
  expect(simulation.targetPosition.pool.id).toEqual(targetPool.id)
  expect(simulation.steps).toBeDefined()
}
