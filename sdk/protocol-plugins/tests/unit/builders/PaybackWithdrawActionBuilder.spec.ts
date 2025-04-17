import { Address, ChainFamilyMap, ChainInfo, Token, TokenAmount } from '@summerfi/sdk-common'
import { LendingPositionType } from '@summerfi/sdk-common'
import { SimulationSteps, TokenTransferTargetType, steps } from '@summerfi/sdk-common'
import { getErrorMessage } from '@summerfi/testing-utils'
import assert from 'assert'
import {
  MakerLendingPool,
  MakerLendingPosition,
  MakerLendingPositionId,
  MakerProtocol,
} from '../../../src'
import { PaybackWithdrawActionBuilder } from '../../../src/plugins/common/builders/PaybackWithdrawActionBuilder'
import { ILKType } from '../../../src/plugins/maker/enums/ILKType'
import { MakerLendingPoolId } from '../../../src/plugins/maker/implementation/MakerLendingPoolId'
import { SetupBuilderReturnType, setupBuilderParams } from '../../utils/SetupBuilderParams'

describe('Payback Withdraw Action Builder', () => {
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

  const protocol = MakerProtocol.createFrom({
    chainInfo: ChainFamilyMap.Ethereum.Mainnet,
  })

  const poolId = MakerLendingPoolId.createFrom({
    protocol: protocol,
    ilkType: ILKType.ETH_A,
    collateralToken: WETH,
    debtToken: DAI,
  })

  const pool = MakerLendingPool.createFrom({
    id: poolId,
    collateralToken: WETH,
    debtToken: DAI,
  })

  const position = MakerLendingPosition.createFrom({
    subtype: LendingPositionType.Multiply,
    id: MakerLendingPositionId.createFrom({
      id: 'someposition',
      vaultId: '1337',
    }),
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

  it('should fail if no protocol plugin exists', async () => {
    try {
      await new PaybackWithdrawActionBuilder().build({
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
    try {
      await new PaybackWithdrawActionBuilder().build({
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
    await new PaybackWithdrawActionBuilder().build({
      ...builderParams,
      step: derivedStep,
    })

    expect(builderParams.context.checkpoints[0]).toEqual('PaybackWithdrawActionBuilderMock')
  })
})
