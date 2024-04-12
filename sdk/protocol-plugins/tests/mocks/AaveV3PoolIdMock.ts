import { ChainInfo } from '@summerfi/sdk-common/common'
import { ProtocolName } from '@summerfi/sdk-common/protocols'
import { EmodeType } from '../../src/plugins/common'

export const aaveV3PoolIdMock = {
  protocol: {
    name: ProtocolName.AAVEv3,
    chainInfo: ChainInfo.createFrom({ chainId: 1, name: 'Ethereum' }),
  },
  emodeType: EmodeType.None,
}
