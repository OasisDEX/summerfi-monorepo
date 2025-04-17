import { Address, ChainFamilyMap, ChainInfo, Token, TokenAmount } from '@summerfi/sdk-common'
import { LendingPositionType } from '@summerfi/sdk-common'
import { SimulationSteps, steps } from '@summerfi/sdk-common'
import { getErrorMessage } from '@summerfi/testing-utils'
import assert from 'assert'
import {
  AaveV3LendingPool,
  AaveV3LendingPoolId,
  AaveV3LendingPosition,
  AaveV3LendingPositionId,
  AaveV3OpenPositionActionBuilder,
  AaveV3Protocol,
  EmodeType,
  ILKType,
  MakerLendingPool,
  MakerLendingPoolId,
  MakerProtocol,
} from '../../../../src'
import { SetupBuilderReturnType, setupBuilderParams } from '../../../utils/SetupBuilderParams'

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
  })

  const position = AaveV3LendingPosition.createFrom({
    subtype: LendingPositionType.Multiply,
    id: AaveV3LendingPositionId.createFrom({
      id: 'someposition',
    }),
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
        chainInfo: ChainFamilyMap.Ethereum.Mainnet,
      }),
      ilkType: ILKType.ETH_A,
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
