import { ChainFamilyMap } from '@summerfi/sdk-common/common'
import { ProtocolName } from '@summerfi/sdk-common/protocols'
import { EmodeType } from '../../src/plugins/common'
import { ISparkLendingPoolId, SparkLendingPoolId, SparkProtocol } from '../../src'
import { TokensManagerMock } from '@summerfi/testing-utils'

export async function getSparkPoolIdMock(): Promise<ISparkLendingPoolId> {
  const tokenManagerMock = new TokensManagerMock()
  const chainInfo = ChainFamilyMap.Ethereum.Mainnet

  const DAI = await tokenManagerMock.getTokenBySymbol({ symbol: 'DAI', chainInfo })
  if (!DAI) {
    throw new Error('DAI token not found')
  }

  return SparkLendingPoolId.createFrom({
    protocol: SparkProtocol.createFrom({
      name: ProtocolName.Spark,
      chainInfo,
    }),
    collateralToken: DAI,
    debtToken: DAI,
    emodeType: EmodeType.None,
  })
}
