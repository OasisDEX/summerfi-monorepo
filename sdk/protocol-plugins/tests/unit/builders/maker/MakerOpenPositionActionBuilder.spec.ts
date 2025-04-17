import {
  Address,
  ChainFamilyMap,
  ChainInfo,
  Percentage,
  RiskRatio,
  RiskRatioType,
  Token,
  TokenAmount,
} from '@summerfi/sdk-common'
import { LendingPositionType } from '@summerfi/sdk-common'
import { SimulationSteps, steps } from '@summerfi/sdk-common'
import { getErrorMessage } from '@summerfi/testing-utils'
import assert from 'assert'
import {
  ILKType,
  MakerLendingPool,
  MakerLendingPoolId,
  MakerLendingPosition,
  MakerLendingPositionId,
  MakerOpenPositionActionBuilder,
  MakerProtocol,
  MorphoLendingPool,
  MorphoLendingPoolId,
  MorphoProtocol,
} from '../../../../src'
import { SetupBuilderReturnType, setupBuilderParams } from '../../../utils/SetupBuilderParams'

describe('Maker Open Position Action Builder', () => {
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

  const protocol = MakerProtocol.createFrom({
    chainInfo: ChainFamilyMap.Ethereum.Mainnet,
  })

  const poolId = MakerLendingPoolId.createFrom({
    protocol: protocol,
    collateralToken: WETH,
    debtToken: DAI,
    ilkType: ILKType.ETH_A,
  })

  const pool = MakerLendingPool.createFrom({
    collateralToken: WETH,
    debtToken: DAI,
    id: poolId,
  })

  const position = MakerLendingPosition.createFrom({
    subtype: LendingPositionType.Multiply,
    id: MakerLendingPositionId.createFrom({
      id: 'someposition',
      vaultId: '123',
    }),
    debtAmount: borrowAmount,
    collateralAmount: depositAmount,
    pool: pool,
  })

  const wrongPool = MorphoLendingPool.createFrom({
    collateralToken: WETH,
    debtToken: DAI,
    id: MorphoLendingPoolId.createFrom({
      marketId: '0x1234',
      protocol: MorphoProtocol.createFrom({
        chainInfo: ChainFamilyMap.Ethereum.Mainnet,
      }),
    }),
    irm: Address.createFromEthereum({ value: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599' }),
    oracle: Address.createFromEthereum({ value: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48' }),
    lltv: RiskRatio.createFrom({
      value: Percentage.createFrom({ value: 0.5 }),
      type: RiskRatioType.LTV,
    }),
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

  it('should fail the position is not a Maker one', async () => {
    try {
      await new MakerOpenPositionActionBuilder().build({
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
      expect(getErrorMessage(error)).toEqual('Invalid Maker lending pool id')
    }
  })

  it('should not add a transaction to the context', async () => {
    builderParams.context.startSubContext()

    await new MakerOpenPositionActionBuilder().build({
      ...builderParams,
      step: derivedStep,
      protocolsRegistry: builderParams.emptyProtocolsRegistry,
    })

    const { callsBatch } = builderParams.context.endSubContext()

    expect(callsBatch.length).toEqual(0)
  })
})
