import { ChainFamilyMap } from '@summerfi/sdk-common'
import { TokensManagerMock } from '@summerfi/testing-utils'
import { ILKType } from '../../src/plugins/maker/enums/ILKType'
import { IMakerLendingPoolId } from '../../src/plugins/maker/interfaces/IMakerLendingPoolId'
import { MakerLendingPoolId } from '../../src/plugins/maker/implementation/MakerLendingPoolId'
import { MakerProtocol } from '../../src/plugins/maker/implementation/MakerProtocol'

export async function getMakerPoolIdMock(): Promise<IMakerLendingPoolId> {
  const tokenManagerMock = new TokensManagerMock()
  const chainInfo = ChainFamilyMap.Ethereum.Mainnet

  const WETH = await tokenManagerMock.getTokenBySymbol({ symbol: 'WETH', chainInfo })
  if (!WETH) {
    throw new Error('WETH token not found')
  }

  const DAI = await tokenManagerMock.getTokenBySymbol({ symbol: 'DAI', chainInfo })
  if (!DAI) {
    throw new Error('DAI token not found')
  }

  return MakerLendingPoolId.createFrom({
    protocol: MakerProtocol.createFrom({
      chainInfo,
    }),
    collateralToken: WETH,
    debtToken: DAI,
    ilkType: ILKType.ETH_A,
  })
}
