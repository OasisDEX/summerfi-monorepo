import { IProtocol, PoolType, ProtocolName } from '@summerfi/sdk-common/protocols'
import { SDKManager } from '../../src/implementation/SDKManager'
import { RPCClientType } from '../../src/rpc/SDKClient'
import { MakerLendingPool, SparkLendingPool } from '@summerfi/protocol-plugins'
import { ISimulation, SimulationType } from '@summerfi/sdk-common/simulation'
import {
  Address,
  ChainFamilyMap,
  ChainInfo,
  Percentage,
  Position,
  PositionId,
  RiskRatio,
  Token,
  TokenAmount,
} from '@summerfi/sdk-common/common'
import { RefinanceParameters } from '@summerfi/sdk-common/orders'

export default async function simulateRefinanceTest() {
  type SimulateRefinanceType = RPCClientType['simulation']['refinance']['query']
  const simulateRefinance: SimulateRefinanceType = jest.fn(async (params) => {
    return {
      simulationType: SimulationType.Refinance,
      sourcePosition: params.position,
      swaps: [],
      targetPosition: {
        positionId: PositionId.createFrom({ id: '0987654321' }),
        debtAmount: params.position.debtAmount,
        collateralAmount: params.position.collateralAmount,
        pool: params.targetPool,
        riskRatio: params.position.riskRatio,
      },
      steps: [],
    } as ISimulation<SimulationType.Refinance>
  })

  const rpcClient = {
    simulation: {
      refinance: {
        query: simulateRefinance,
      },
    },
  } as unknown as RPCClientType

  const sdkManager = new SDKManager({ rpcClient })

  expect(sdkManager).toBeDefined()

  const chainInfo: ChainInfo = ChainFamilyMap.Ethereum.Mainnet

  // Tokens
  const WETH = Token.createFrom({
    chainInfo,
    address: Address.createFrom({ value: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2' }),
    symbol: 'WETH',
    name: 'Wrapped Ether',
    decimals: 18,
  })

  const DAI = Token.createFrom({
    chainInfo,
    address: Address.createFrom({ value: '0x6B175474E89094C44Da98b954EedeAC495271d0F' }),
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
  }

  const prevPosition: Position = {
    pool: pool,
    debtAmount: TokenAmount.createFrom({ token: DAI, amount: '56.78' }),
    collateralAmount: TokenAmount.createFrom({ token: WETH, amount: '105.98' }),
    positionId: PositionId.createFrom({ id: '1234567890' }),
    riskRatio: RiskRatio.createFrom({
      ratio: Percentage.createFrom({ percentage: 0.5 }),
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
  }

  const refinanceParameters: RefinanceParameters = {
    position: prevPosition,
    targetPool: targetPool,
    slippage: Percentage.createFrom({ percentage: 0.5 }),
  }

  const simulation =
    await sdkManager.simulator.refinance.simulateRefinancePosition(refinanceParameters)

  expect(simulation).toBeDefined()
  expect(simulation.simulationType).toBe(SimulationType.Refinance)
  expect(simulation.sourcePosition).toBe(prevPosition)
  expect(simulation.targetPosition).toBeDefined()
  expect(simulation.targetPosition.positionId).toBeDefined()
  expect(simulation.targetPosition.debtAmount).toBe(prevPosition.debtAmount)
  expect(simulation.targetPosition.collateralAmount).toBe(prevPosition.collateralAmount)
  expect(simulation.targetPosition.pool).toBe(targetPool)
  expect(simulation.steps).toBeDefined()
}
