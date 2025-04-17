import {
  Address,
  ChainFamilyMap,
  ChainInfo,
  Percentage,
  Token,
  TokenAmount,
} from '@summerfi/sdk-common'
import { SimulationSteps, TokenTransferTargetType, steps } from '@summerfi/sdk-common'
import { getErrorMessage } from '@summerfi/testing-utils'
import assert from 'assert'
import {
  ILKType,
  MakerLendingPool,
  MakerLendingPoolId,
  MakerLendingPosition,
  MakerLendingPositionId,
  MakerPaybackWithdrawActionBuilder,
  MakerProtocol,
  MorphoLendingPool,
  MorphoLendingPoolId,
  MorphoLendingPosition,
  MorphoLendingPositionId,
  MorphoProtocol,
} from '../../../../src'
import { SetupBuilderReturnType, setupBuilderParams } from '../../../utils/SetupBuilderParams'

import { RiskRatio, RiskRatioType } from '@summerfi/sdk-common'
import { LendingPositionType } from '@summerfi/sdk-common'

describe('Maker Payback Withdraw Action Builder', () => {
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

  const debtAmount = TokenAmount.createFrom({
    token: WETH,
    amount: '134.5',
  })

  const collateralAmount = TokenAmount.createFrom({
    token: DAI,
    amount: '1000',
  })

  const protocol = MakerProtocol.createFrom({
    chainInfo: ChainFamilyMap.Ethereum.Mainnet,
  })

  const poolId = MakerLendingPoolId.createFrom({
    collateralToken: collateralAmount.token,
    debtToken: debtAmount.token,
    ilkType: ILKType.ETH_A,
    protocol: protocol,
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
    debtAmount: debtAmount,
    collateralAmount: collateralAmount,
    pool: pool,
  })

  const wrongPosition = MorphoLendingPosition.createFrom({
    subtype: LendingPositionType.Multiply,
    id: MorphoLendingPositionId.createFrom({
      id: 'someposition',
    }),
    debtAmount: debtAmount,
    collateralAmount: collateralAmount,
    pool: MorphoLendingPool.createFrom({
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
    }),
  })

  const derivedStep: steps.PaybackWithdrawStep = {
    type: SimulationSteps.PaybackWithdraw,
    name: 'PaybackWithdrawStep',
    inputs: {
      paybackAmount: debtAmount,
      withdrawAmount: collateralAmount,
      position: position,
      withdrawTargetType: TokenTransferTargetType.PositionsManager,
    },
    outputs: {
      paybackAmount: debtAmount,
      withdrawAmount: collateralAmount,
    },
  }

  beforeEach(() => {
    builderParams = setupBuilderParams({ chainInfo: ChainFamilyMap.Ethereum.Mainnet })
  })

  it('should fail the position is not a Maker one', async () => {
    try {
      await new MakerPaybackWithdrawActionBuilder().build({
        ...builderParams,
        step: {
          ...derivedStep,
          inputs: {
            ...derivedStep.inputs,
            position: wrongPosition,
          },
        },
        protocolsRegistry: builderParams.emptyProtocolsRegistry,
      })
      assert.fail('Should have thrown an error')
    } catch (error: unknown) {
      expect(getErrorMessage(error)).toEqual('Invalid Maker lending pool id')
    }
  })

  it('should add all the action calls', async () => {
    builderParams.context.startSubContext()

    await new MakerPaybackWithdrawActionBuilder().build({
      ...builderParams,
      step: derivedStep,
      protocolsRegistry: builderParams.emptyProtocolsRegistry,
    })

    const { callsBatch } = builderParams.context.endSubContext()

    expect(callsBatch.length).toEqual(2)

    expect(callsBatch[0].name).toBe('MakerPayback')
    expect(callsBatch[1].name).toBe('MakerWithdraw')
  })

  it('should not add payback when payback amount is 0', async () => {
    builderParams.context.startSubContext()

    await new MakerPaybackWithdrawActionBuilder().build({
      ...builderParams,
      step: {
        ...derivedStep,
        inputs: {
          ...derivedStep.inputs,
          paybackAmount: TokenAmount.createFrom({
            token: WETH,
            amount: '0',
          }),
        },
      },
      protocolsRegistry: builderParams.emptyProtocolsRegistry,
    })

    const { callsBatch } = builderParams.context.endSubContext()

    expect(callsBatch.length).toEqual(2)

    expect(callsBatch[0].name).toBe('MakerPayback')
    expect(callsBatch[1].name).toBe('MakerWithdraw')
  })
})
