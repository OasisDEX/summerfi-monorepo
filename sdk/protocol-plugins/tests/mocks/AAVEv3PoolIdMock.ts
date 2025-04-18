import { ChainFamilyMap } from '@summerfi/sdk-common'
import { TokensManagerMock } from '@summerfi/testing-utils'
import { AaveV3LendingPoolId, AaveV3Protocol } from '../../src'
import { IAaveV3LendingPoolId } from '../../src/plugins/aave-v3/interfaces/IAaveV3LendingPoolId'
import { EmodeType } from '../../src/plugins/common/enums/EmodeType'

export async function getAaveV3PoolIdMock(): Promise<IAaveV3LendingPoolId> {
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

  return AaveV3LendingPoolId.createFrom({
    protocol: AaveV3Protocol.createFrom({
      chainInfo,
    }),
    debtToken: DAI,
    collateralToken: WETH,
    emodeType: EmodeType.None,
  })
}
