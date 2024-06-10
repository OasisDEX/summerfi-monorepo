import {
  Address,
  ChainFamilyMap,
  ChainInfo,
  PositionType,
  Token,
  TokenAmount,
} from '@summerfi/sdk-common/common'
import { SimulationSteps, TokenTransferTargetType, steps } from '@summerfi/sdk-common/simulation'
import { SetupBuilderReturnType, setupBuilderParams } from '../../../utils/SetupBuilderParams'
import { PoolType, ProtocolName } from '@summerfi/sdk-common/protocols'
import { getErrorMessage } from '@summerfi/testing-utils'
import assert from 'assert'
import {
  EmodeType,
  ILKType,
  MakerLendingPool,
  MakerLendingPoolId,
  MakerPositionId,
  MakerProtocol,
  AaveV3LendingPool,
  AaveV3LendingPoolId,
  AaveV3OpenPositionActionBuilder,
  AaveV3Position,
  AaveV3Protocol,
} from '../../../../src'

describe('AaveV3 Open Position Action Builder', () => {
  let builderParams: SetupBuilderReturnType

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

  const depositAmount = TokenAmount.createFrom({
    token: WETH,
    amount: '134.5',
  })

  const borrowAmount = TokenAmount.createFrom({
    token: DAI,
    amount: '1000',
  })

  const protocol = AaveV3Protocol.createFrom({
    name: ProtocolName.AaveV3,
    chainInfo: ChainFamilyMap.Ethereum.Mainnet,
  })

  const poolId = AaveV3LendingPoolId.createFrom({
    protocol: protocol,
    collateralToken: WETH,
    debtToken: DAI,
    emodeType: EmodeType.None,
  })

  const pool = AaveV3LendingPool.createFrom({
    collateralToken: WETH,
    debtToken: DAI,
    id: poolId,
    type: PoolType.Lending,
  })

  const position = AaveV3Position.createFrom({
    type: PositionType.Multiply,
    id: MakerPositionId.createFrom({ id: 'someposition', vaultId: '123' }),
    debtAmount: borrowAmount,
    collateralAmount: depositAmount,
    pool: pool,
  })

  const wrongPool = MakerLendingPool.createFrom({
    collateralToken: WETH,
    debtToken: DAI,
    id: MakerLendingPoolId.createFrom({
      collateralToken: WETH,
      debtToken: DAI,
      protocol: MakerProtocol.createFrom({
        name: ProtocolName.Maker,
        chainInfo: ChainFamilyMap.Ethereum.Mainnet,
      }),
      ilkType: ILKType.ETH_A,
    }),
    type: PoolType.Lending,
  })

  const derivedStep: steps.OpenPosition = {
    type: SimulationSteps.OpenPosition,
    name: 'OpenPosition',
    inputs: {
      pool: pool,
    },
    outputs: {
      position: position,
    },
  }

  beforeEach(() => {
    builderParams = setupBuilderParams({ chainInfo: ChainFamilyMap.Ethereum.Mainnet })
  })

  it('should fail the position is not a AaveV3 one', async () => {
    try {
      await new AaveV3OpenPositionActionBuilder().build({
        ...builderParams,
        step: {
          ...derivedStep,
          inputs: {
            ...derivedStep.inputs,
            pool: wrongPool,
          },
        },
        protocolsRegistry: builderParams.emptyProtocolsRegistry,
      })
      assert.fail('Should have thrown an error')
    } catch (error: unknown) {
      expect(getErrorMessage(error)).toEqual('Invalid AaveV3 lending pool')
    }
  })

  it('should add a transaction to the context', async () => {
    builderParams.context.startSubContext()

    await new AaveV3OpenPositionActionBuilder().build({
      ...builderParams,
      step: derivedStep,
      protocolsRegistry: builderParams.emptyProtocolsRegistry,
    })

    const { callsBatch } = builderParams.context.endSubContext()

    expect(callsBatch.length).toEqual(1)

    expect(callsBatch[0].name).toBe('AaveV3SetEMode')
  })
})
