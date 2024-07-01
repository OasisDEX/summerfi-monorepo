import {
  Address,
  ChainFamilyMap,
  ChainInfo,
  Percentage,
  PositionType,
  RiskRatio,
  RiskRatioType,
  Token,
  TokenAmount,
} from '@summerfi/sdk-common/common'
import { SimulationSteps, steps } from '@summerfi/sdk-common/simulation'
import { SetupBuilderReturnType, setupBuilderParams } from '../../../utils/SetupBuilderParams'
import { PoolType, ProtocolName } from '@summerfi/sdk-common/protocols'
import { getErrorMessage } from '@summerfi/testing-utils'
import assert from 'assert'
import {
  ILKType,
  MorphoBluePositionId,
  MorphoBluePosition,
  MorphoBlueLendingPool,
  MorphoBlueLendingPoolId,
  MorphoBlueProtocol,
  MakerLendingPool,
  MakerLendingPoolId,
  MakerProtocol,
  MorphoBlueOpenPositionActionBuilder,
} from '../../../../src'

describe('Morpho Open Position Action Builder', () => {
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

  const protocol = MorphoBlueProtocol.createFrom({
    name: ProtocolName.MorphoBlue,
    chainInfo: ChainFamilyMap.Ethereum.Mainnet,
  })

  const poolId = MorphoBlueLendingPoolId.createFrom({
    marketId: '0x1234',
    protocol: protocol,
  })

  const pool = MorphoBlueLendingPool.createFrom({
    collateralToken: WETH,
    debtToken: DAI,
    id: poolId,
    irm: Address.createFromEthereum({ value: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599' }),
    oracle: Address.createFromEthereum({ value: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48' }),
    lltv: RiskRatio.createFrom({
      value: Percentage.createFrom({ value: 0.5 }),
      type: RiskRatioType.LTV,
    }),
    type: PoolType.Lending,
  })

  const position = MorphoBluePosition.createFrom({
    type: PositionType.Multiply,
    id: MorphoBluePositionId.createFrom({ id: 'someposition' }),
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

  it('should fail the position is not a Morpho one', async () => {
    try {
      await new MorphoBlueOpenPositionActionBuilder().build({
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
      expect(getErrorMessage(error)).toEqual('Invalid Morpho lending pool id')
    }
  })

  it('should not add a transaction to the context', async () => {
    builderParams.context.startSubContext()

    await new MorphoBlueOpenPositionActionBuilder().build({
      ...builderParams,
      step: derivedStep,
      protocolsRegistry: builderParams.emptyProtocolsRegistry,
    })

    const { callsBatch } = builderParams.context.endSubContext()

    expect(callsBatch.length).toEqual(0)
  })
})
