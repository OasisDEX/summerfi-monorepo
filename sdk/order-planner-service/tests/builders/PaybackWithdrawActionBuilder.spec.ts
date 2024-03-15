import {
  Address,
  ChainInfo,
  Position,
  PositionId,
  Token,
  TokenAmount,
} from '@summerfi/sdk-common/common'
import { SimulationSteps, steps } from '@summerfi/sdk-common/simulation'
import { SetupBuilderReturnType, setupBuilderParams } from '../utils/SetupBuilderParams'
import { ChainFamilyMap } from '@summerfi/sdk-client'
import { ILKType, MakerPoolId, PoolType, ProtocolName } from '@summerfi/sdk-common/protocols'
import { getErrorMessage } from '../utils/ErrorMessage'
import assert from 'assert'
import { EmptyProtocolBuilderMock } from '../mocks/ProtocolBuilderMock'
import { PaybackWithdrawActionBuilder } from '../../src/builders/PaybackWithdrawActionBuilder'

describe('Payback Withdraw Action Builder', () => {
  let builderParams: SetupBuilderReturnType

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

  const paybackAmount = TokenAmount.createFrom({
    token: WETH,
    amount: '134.5',
  })

  const withdrawAmount = TokenAmount.createFrom({
    token: DAI,
    amount: '1000',
  })

  const protocol = {
    name: ProtocolName.Maker as const,
    chainInfo: ChainFamilyMap.Ethereum.Mainnet,
  }

  const poolId: MakerPoolId = {
    protocol: protocol,
    ilkType: ILKType.ETH_A,
  }

  const pool = {
    type: PoolType.Lending,
    protocol,
    poolId,
  }

  const position = new Position({
    positionId: PositionId.createFrom({ id: 'someposition' }),
    debtAmount: withdrawAmount,
    collateralAmount: paybackAmount,
    pool: pool,
  })

  const derivedStep: steps.PaybackWithdrawStep = {
    type: SimulationSteps.PaybackWithdraw,
    name: 'PaybackWithdrawStep',
    inputs: {
      paybackAmount: paybackAmount,
      withdrawAmount: withdrawAmount,
      position: position,
    },
    outputs: {
      paybackAmount: paybackAmount,
      withdrawAmount: withdrawAmount,
    },
  }

  beforeEach(() => {
    builderParams = setupBuilderParams({ chainInfo: ChainFamilyMap.Ethereum.Mainnet })
  })

  it('should fail if no protocol plugin exists', async () => {
    try {
      await PaybackWithdrawActionBuilder({
        ...builderParams,
        step: derivedStep,
        protocolsRegistry: {},
      })
      assert.fail('Should have thrown an error')
    } catch (error: unknown) {
      expect(getErrorMessage(error)).toEqual('No protocol plugin found for protocol Maker')
    }
  })

  it('should fail if no protocol builder for the step exists', async () => {
    try {
      await PaybackWithdrawActionBuilder({
        ...builderParams,
        step: derivedStep,
        protocolsRegistry: {
          [protocol.name]: EmptyProtocolBuilderMock,
        },
      })
      assert.fail('Should have thrown an error')
    } catch (error: unknown) {
      expect(getErrorMessage(error)).toEqual('No action builder found for protocol Maker')
    }
  })

  it('should call the proper builder', async () => {
    await PaybackWithdrawActionBuilder({
      ...builderParams,
      step: derivedStep,
    })

    expect(builderParams.context.checkpoints[0]).toEqual('PaybackWithdrawActionBuilderMock')
  })
})
