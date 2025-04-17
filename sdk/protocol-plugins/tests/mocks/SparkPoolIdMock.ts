import { ChainFamilyMap } from '@summerfi/sdk-common'
import { TokensManagerMock } from '@summerfi/testing-utils'
import { ISparkLendingPoolId, SparkLendingPoolId, SparkProtocol } from '../../src'
import { EmodeType } from '../../src/plugins/common'

export async function getSparkPoolIdMock(): Promise<ISparkLendingPoolId> {
  const tokenManagerMock = new TokensManagerMock()
  const chainInfo = ChainFamilyMap.Ethereum.Mainnet

  const DAI = await tokenManagerMock.getTokenBySymbol({ symbol: 'DAI', chainInfo })
  if (!DAI) {
    throw new Error('DAI token not found')
  }

  return SparkLendingPoolId.createFrom({
    protocol: SparkProtocol.createFrom({
      chainInfo,
    }),
    collateralToken: DAI,
    debtToken: DAI,
    emodeType: EmodeType.None,
  })
}
