import {
  Address,
  ChainFamilyMap,
  ChainInfo,
  Position,
  PositionId,
  Token,
  TokenAmount,
} from '@summerfi/sdk-common/common'
import { SimulationSteps, TokenTransferTargetType, steps } from '@summerfi/sdk-common/simulation'
import { SetupBuilderReturnType, setupBuilderParams } from '../utils/SetupBuilderParams'
import { DepositBorrowActionBuilder } from '../../src/builders/DepositBorrowActionBuilder'
import { MakerPoolId, PoolType, ProtocolName, ILKType } from '@summerfi/sdk-common/protocols'
import { getErrorMessage } from '../utils/ErrorMessage'
import assert from 'assert'
import { EmptyProtocolPluginMock } from '../mocks/ProtocolPluginMock'

describe('Deposit Borrow Action Builder', () => {
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

  const protocol = {
    name: ProtocolName.Maker as const,
    chainInfo: ChainFamilyMap.Ethereum.Mainnet,
  }

  const poolId: MakerPoolId = {
    protocol: protocol,
    ilkType: ILKType.ETH_A,
    vaultId: '123',
  }

  const pool = {
    type: PoolType.Lending,
    protocol,
    poolId,
  }

  const position = new Position({
    positionId: PositionId.createFrom({ id: 'someposition' }),
    debtAmount: borrowAmount,
    collateralAmount: depositAmount,
    pool: pool,
  })

  beforeEach(() => {
    builderParams = setupBuilderParams({ chainInfo: ChainFamilyMap.Ethereum.Mainnet })
  })

  it('should fail if no protocol plugin exists', async () => {
    const derivedStep: steps.DepositBorrowStep = {
      type: SimulationSteps.DepositBorrow,
      name: 'DepositBorrowStep',
      inputs: {
        depositAmount: depositAmount,
        borrowAmount: borrowAmount,
        position: position,
        borrowTargetType: TokenTransferTargetType.PositionsManager,
      },
      outputs: {
        depositAmount: depositAmount,
        borrowAmount: borrowAmount,
      },
    }

    try {
      await DepositBorrowActionBuilder({
        ...builderParams,
        step: derivedStep,
        protocolsRegistry: builderParams.emptyProtocolsRegistry,
      })
      assert.fail('Should have thrown an error')
    } catch (error: unknown) {
      expect(getErrorMessage(error)).toEqual('No protocol plugin found for protocol Maker')
    }
  })

  it('should fail if no protocol builder for the step exists', async () => {
    const builderParams = setupBuilderParams({ chainInfo: ChainFamilyMap.Ethereum.Mainnet })

    const derivedStep: steps.DepositBorrowStep = {
      type: SimulationSteps.DepositBorrow,
      name: 'DepositBorrowStep',
      inputs: {
        depositAmount: depositAmount,
        borrowAmount: borrowAmount,
        position: position,
        borrowTargetType: TokenTransferTargetType.PositionsManager,
      },
      outputs: {
        depositAmount: depositAmount,
        borrowAmount: borrowAmount,
      },
    }

    try {
      await DepositBorrowActionBuilder({
        ...builderParams,
        step: derivedStep,
        protocolsRegistry: builderParams.emptyBuildersProtocolRegistry,
      })
      assert.fail('Should have thrown an error')
    } catch (error: unknown) {
      expect(getErrorMessage(error)).toEqual('No action builder found for protocol Maker')
    }
  })

  it('should call the proper builder', async () => {
    const builderParams = setupBuilderParams({ chainInfo: ChainFamilyMap.Ethereum.Mainnet })

    const derivedStep: steps.DepositBorrowStep = {
      type: SimulationSteps.DepositBorrow,
      name: 'DepositBorrowStep',
      inputs: {
        depositAmount: depositAmount,
        borrowAmount: borrowAmount,
        position: position,
        borrowTargetType: TokenTransferTargetType.PositionsManager,
      },
      outputs: {
        depositAmount: depositAmount,
        borrowAmount: borrowAmount,
      },
    }

    await DepositBorrowActionBuilder({
      ...builderParams,
      step: derivedStep,
    })

    expect(builderParams.context.checkpoints[0]).toEqual('DepositBorrowActionBuilderMock')
  })
})
