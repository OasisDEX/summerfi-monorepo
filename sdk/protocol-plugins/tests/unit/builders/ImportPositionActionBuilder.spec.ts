import { ExternalLendingPosition, ExternalLendingPositionId } from '@summerfi/sdk-common'
import { Address, ChainFamilyMap, ChainInfo, Token, TokenAmount } from '@summerfi/sdk-common/common'
import { LendingPositionType } from '@summerfi/sdk-common/lending-protocols'
import { ExternalLendingPositionType } from '@summerfi/sdk-common/orders/importing'
import { SimulationSteps, steps } from '@summerfi/sdk-common/simulation'
import { getErrorMessage } from '@summerfi/testing-utils'
import assert from 'assert'
import {
  ImportPositionActionBuilder,
  MakerLendingPool,
  MakerLendingPoolId,
  MakerLendingPosition,
  MakerLendingPositionId,
  MakerProtocol,
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

  const externalPositionOwner = Address.createFromEthereum({
    value: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
  })

  const derivedStep: steps.ImportStep = {
    type: SimulationSteps.Import,
    name: 'ImportPosition',
    inputs: {
      externalPosition: ExternalLendingPosition.createFrom({
        ...position,
        id: ExternalLendingPositionId.createFrom({
          ...position,
          id: 'someposition',
          protocolId: position.id,
          address: externalPositionOwner,
          externalType: ExternalLendingPositionType.WALLET,
        }),
      }),
    },
    outputs: undefined,
  }

  beforeEach(() => {
    builderParams = setupBuilderParams({ chainInfo: ChainFamilyMap.Ethereum.Mainnet })
  })

  it('should fail if no protocol plugin exists', async () => {
    try {
      await new ImportPositionActionBuilder().build({
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
      await new ImportPositionActionBuilder().build({
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
    await new ImportPositionActionBuilder().build({
      ...builderParams,
      step: derivedStep,
    })

    expect(builderParams.context.checkpoints[0]).toEqual('ImportPositionActionBuilderMock')
  })
})
