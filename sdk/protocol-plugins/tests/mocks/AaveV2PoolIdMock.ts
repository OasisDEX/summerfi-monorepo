import { ChainInfo } from '@summerfi/sdk-common/common'
import { ProtocolName } from '@summerfi/sdk-common/protocols'

export const aaveV2PoolIdMock = {
    protocol: {
        name: ProtocolName.AAVEv2,
        chainInfo: ChainInfo.createFrom({ chainId: 1, name: 'Ethereum' }),
    },
}
