import { Address, ChainFamilyMap, ChainInfo, Token, TokenAmount } from '@summerfi/sdk-common'
import { LendingPositionType } from '@summerfi/sdk-common'
import { SimulationSteps, steps } from '@summerfi/sdk-common'
import { getErrorMessage } from '@summerfi/testing-utils'
import assert from 'assert'
import {
  MakerLendingPool,
  MakerLendingPoolId,
  MakerLendingPosition,
  MakerLendingPositionId,
  MakerProtocol,
  OpenPositionActionBuilder,
} from '../../../src'
import { ILKType } from '../../../src/plugins/maker/enums/ILKType'
import { SetupBuilderReturnType, setupBuilderParams } from '../../utils/SetupBuilderParams'

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
      vaultId: '123',
    }),
    debtAmount: borrowAmount,
    collateralAmount: depositAmount,
    pool: pool,
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

  it('should fail if no protocol plugin exists', async () => {
    try {
      await new OpenPositionActionBuilder().build({
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
      await new OpenPositionActionBuilder().build({
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
    await new OpenPositionActionBuilder().build({
      ...builderParams,
      step: derivedStep,
    })

    expect(builderParams.context.checkpoints[0]).toEqual('OpenPositionActionBuilderMock')
  })
})
