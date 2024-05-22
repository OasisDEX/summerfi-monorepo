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
import { SimulationSteps, TokenTransferTargetType, steps } from '@summerfi/sdk-common/simulation'
import { SetupBuilderReturnType, setupBuilderParams } from '../../../utils/SetupBuilderParams'
import { PoolType, ProtocolName } from '@summerfi/sdk-common/protocols'
import { getErrorMessage } from '@summerfi/testing-utils'
import assert from 'assert'
import {
  ILKType,
  MakerPositionId,
  MakerLendingPool,
  MakerLendingPoolId,
  MakerPosition,
  MakerProtocol,
  MakerImportPositionActionBuilder,
  MorphoPosition,
  MorphoLendingPool,
  MorphoLendingPoolId,
  MorphoProtocol,
} from '../../../../src'
import { ExternalPositionType } from '@summerfi/sdk-common'

describe('Maker Import Position Action Builder', () => {
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

  const externalPositionOwner = Address.createFromEthereum({
    value: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
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
    name: ProtocolName.Maker,
    chainInfo: ChainFamilyMap.Ethereum.Mainnet,
  })

  const poolId = MakerLendingPoolId.createFrom({
    collateralToken: WETH,
    debtToken: DAI,
    ilkType: ILKType.ETH_A,
    protocol: protocol,
  })

  const pool = MakerLendingPool.createFrom({
    collateralToken: WETH,
    debtToken: DAI,
    id: poolId,
    type: PoolType.Lending,
  })

  const position = MakerPosition.createFrom({
    type: PositionType.Multiply,
    id: MakerPositionId.createFrom({ id: 'someposition', vaultId: '123' }),
    debtAmount: borrowAmount,
    collateralAmount: depositAmount,
    pool: pool,
  })

  const wrongPosition = MorphoPosition.createFrom({
    type: PositionType.Multiply,
    id: MakerPositionId.createFrom({ id: 'someposition', vaultId: '123' }),
    debtAmount: borrowAmount,
    collateralAmount: depositAmount,
    pool: MorphoLendingPool.createFrom({
      collateralToken: WETH,
      debtToken: DAI,
      id: MorphoLendingPoolId.createFrom({
        marketId: '0x1234',
        protocol: MorphoProtocol.createFrom({
          name: ProtocolName.Morpho,
          chainInfo: ChainFamilyMap.Ethereum.Mainnet,
        }),
      }),
      irm: Address.createFromEthereum({ value: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599' }),
      oracle: Address.createFromEthereum({ value: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48' }),
      lltv: RiskRatio.createFrom({
        value: Percentage.createFrom({ value: 0.5 }),
        type: RiskRatioType.LTV,
      }),
      type: PoolType.Lending,
    }),
  })

  const derivedStep: steps.ImportStep = {
    type: SimulationSteps.Import,
    name: 'ImportPosition',
    inputs: {
      externalPosition: {
        position: position,
        externalId: {
          address: externalPositionOwner,
          type: ExternalPositionType.WALLET,
        },
      },
    },
    outputs: undefined,
  }

  beforeEach(() => {
    builderParams = setupBuilderParams({ chainInfo: ChainFamilyMap.Ethereum.Mainnet })
  })

  it('should fail the position is not a Maker one', async () => {
    try {
      await new MakerImportPositionActionBuilder().build({
        ...builderParams,
        step: {
          ...derivedStep,
          inputs: {
            ...derivedStep.inputs,
            externalPosition: {
              position: wrongPosition,
              externalId: {
                address: externalPositionOwner,
                type: ExternalPositionType.WALLET,
              },
            },
          },
        },
        protocolsRegistry: builderParams.emptyProtocolsRegistry,
      })
      assert.fail('Should have thrown an error')
    } catch (error: unknown) {
      expect(getErrorMessage(error)).toEqual('Invalid Maker lending pool id')
    }
  })

  it('should add a new transaction to the context', async () => {
    builderParams.context.startSubContext()

    await new MakerImportPositionActionBuilder().build({
      ...builderParams,
      step: derivedStep,
      protocolsRegistry: builderParams.protocolsRegistry,
    })

    const { callsBatch } = builderParams.context.endSubContext()

    expect(callsBatch.length).toEqual(0)
    expect(builderParams.context.transactions.length).toEqual(1)
  })
})
