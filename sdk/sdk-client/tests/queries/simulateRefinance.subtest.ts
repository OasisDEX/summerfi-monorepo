import {
  CollateralConfigMap,
  DebtConfigMap,
  IProtocol,
  PoolType,
  ProtocolName,
} from '@summerfi/sdk-common/protocols'
import { SDKManager } from '../../src/implementation/SDKManager'
import { RPCClientType } from '../../src/rpc/SDKClient'
import { MakerLendingPool } from '@summerfi/protocol-plugins/plugins/maker'
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
import { IRefinanceParameters } from '@summerfi/sdk-common/orders'
import { CollateralConfigMock, DebtConfigMock } from '@summerfi/testing-utils'

export default async function simulateRefinanceTest() {
  type SimulateRefinanceType = RPCClientType['simulation']['refinance']['query']
  const simulateRefinance: SimulateRefinanceType = jest.fn(async (params) => {
    return {
      simulationType: SimulationType.Refinance,
      sourcePosition: params.sourcePosition,
      targetPosition: {
        positionId: PositionId.createFrom({ id: '0987654321' }),
        debtAmount: params.targetPosition.debtAmount,
        collateralAmount: params.targetPosition.collateralAmount,
        pool: params.targetPosition.pool,
      },
      swaps: [],
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
    pool: pool,
    debtAmount: TokenAmount.createFrom({ token: DAI, amount: '56.78' }),
    collateralAmount: TokenAmount.createFrom({ token: WETH, amount: '105.98' }),
    positionId: PositionId.createFrom({ id: '1234567890' }),
    riskRatio: RiskRatio.createFrom({
      ratio: Percentage.createFrom({ value: 0.5 }),
      type: RiskRatio.type.LTV,
    }),
  }

  const targetPool = {
    type: PoolType.Lending as const,
    protocol: protocol,
    poolId: {
      protocol: protocol,
    },
    collaterals: CollateralConfigMap.createFrom({
      record: {
        [prevPosition.collateralAmount.token.address.value]: new CollateralConfigMock({}),
      },
    }),
    debts: DebtConfigMap.createFrom({
      record: {
        [prevPosition.debtAmount.token.address.value]: new DebtConfigMock({}),
      },
    }),
    baseCurrency: DAI,
  }

  const targetPosition = Position.createFrom({
    positionId: {
      id: 'newEmptyPositionFromPool',
    },
    debtAmount: prevPosition.debtAmount,
    collateralAmount: prevPosition.collateralAmount,
    pool: targetPool,
  })
  const refinanceParameters: IRefinanceParameters = {
    sourcePosition: prevPosition,
    targetPosition: targetPosition,
    slippage: Percentage.createFrom({ value: 0.5 }),
  }

  const simulation =
    await sdkManager.simulator.refinance.simulateRefinancePosition(refinanceParameters)

  expect(simulation).toBeDefined()
  expect(simulation.simulationType).toBe(SimulationType.Refinance)
  expect(simulation.sourcePosition).toBeDefined()
  expect(simulation.sourcePosition?.positionId).toBe(prevPosition.positionId)
  expect(simulation.targetPosition).toBeDefined()
  expect(simulation.targetPosition.positionId).toBeDefined()
  expect(simulation.targetPosition.pool.poolId).toBe(targetPool.poolId)
  expect(simulation.steps).toBeDefined()
}
