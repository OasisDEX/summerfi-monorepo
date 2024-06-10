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
  MakerPosition,
  MakerPositionId,
  MakerProtocol,
  SparkLendingPool,
  SparkLendingPoolId,
  SparkPosition,
  SparkProtocol,
} from '../../../../src'
import { SparkPaybackWithdrawActionBuilder } from '../../../../src/'

describe('Spark Payback Withdraw Action Builder', () => {
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

  const paybackAmount = TokenAmount.createFrom({
    token: WETH,
    amount: '134.5',
  })

  const withdrawAmount = TokenAmount.createFrom({
    token: DAI,
    amount: '1000',
  })

  const protocol = SparkProtocol.createFrom({
    name: ProtocolName.Spark,
    chainInfo: ChainFamilyMap.Ethereum.Mainnet,
  })

  const poolId = SparkLendingPoolId.createFrom({
    protocol: protocol,
    collateralToken: WETH,
    debtToken: DAI,
    emodeType: EmodeType.None,
  })

  const pool = SparkLendingPool.createFrom({
    collateralToken: WETH,
    debtToken: DAI,
    id: poolId,
    type: PoolType.Lending,
  })

  const position = SparkPosition.createFrom({
    type: PositionType.Multiply,
    id: MakerPositionId.createFrom({ id: 'someposition', vaultId: '123' }),
    debtAmount: withdrawAmount,
    collateralAmount: paybackAmount,
    pool: pool,
  })

  const wrongPosition = MakerPosition.createFrom({
    type: PositionType.Multiply,
    id: MakerPositionId.createFrom({ id: 'someposition', vaultId: '123' }),
    debtAmount: withdrawAmount,
    collateralAmount: paybackAmount,
    pool: MakerLendingPool.createFrom({
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
    }),
  })

  const derivedStep: steps.PaybackWithdrawStep = {
    type: SimulationSteps.PaybackWithdraw,
    name: 'PaybackWithdrawStep',
    inputs: {
      paybackAmount: paybackAmount,
      withdrawAmount: withdrawAmount,
      position: position,
      withdrawTargetType: TokenTransferTargetType.PositionsManager,
    },
    outputs: {
      paybackAmount: paybackAmount,
      withdrawAmount: withdrawAmount,
    },
  }

  beforeEach(() => {
    builderParams = setupBuilderParams({ chainInfo: ChainFamilyMap.Ethereum.Mainnet })
  })

  it('should fail the position is not a Spark one', async () => {
    try {
      await new SparkPaybackWithdrawActionBuilder().build({
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
      expect(getErrorMessage(error)).toEqual('Invalid Spark lending pool')
    }
  })

  it('should add all the action calls', async () => {
    builderParams.context.startSubContext()

    await new SparkPaybackWithdrawActionBuilder().build({
      ...builderParams,
      step: derivedStep,
      protocolsRegistry: builderParams.emptyProtocolsRegistry,
    })

    const { callsBatch } = builderParams.context.endSubContext()

    expect(callsBatch.length).toEqual(3)

    expect(callsBatch[0].name).toBe('SetApproval')
    expect(callsBatch[1].name).toBe('SparkPayback')
    expect(callsBatch[2].name).toBe('SparkWithdraw')
  })

  it('should not add payback when payback amount is 0', async () => {
    builderParams.context.startSubContext()

    await new SparkPaybackWithdrawActionBuilder().build({
      ...builderParams,
      step: {
        ...derivedStep,
        inputs: {
          ...derivedStep.inputs,
          paybackAmount: TokenAmount.createFrom({
            token: DAI,
            amount: '0',
          }),
        },
      },
      protocolsRegistry: builderParams.emptyProtocolsRegistry,
    })

    const { callsBatch } = builderParams.context.endSubContext()

    expect(callsBatch.length).toEqual(3)

    expect(callsBatch[0].name).toBe('SetApproval')
    expect(callsBatch[1].name).toBe('SparkPayback')
    expect(callsBatch[2].name).toBe('SparkWithdraw')
  })
})
