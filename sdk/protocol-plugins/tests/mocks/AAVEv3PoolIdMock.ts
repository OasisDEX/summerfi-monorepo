import { ChainInfo } from '@summerfi/sdk-common/common'
import { EmodeType } from '@summerfi/sdk-common/protocols'
import { ILKType, ProtocolName } from '@summerfi/sdk-common/protocols'

export const aaveV3PoolIdMock = {
  protocol: {
    name: ProtocolName.AAVEv3,
    chainInfo: ChainInfo.createFrom({ chainId: 1, name: 'Ethereum' }),
  },
  emodeType: EmodeType.None,
}
