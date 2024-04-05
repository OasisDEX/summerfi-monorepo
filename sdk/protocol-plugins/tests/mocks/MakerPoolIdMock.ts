import { ChainInfo } from '@summerfi/sdk-common/common'
import { ProtocolName } from '@summerfi/sdk-common/protocols'
import { ILKType } from '../../src/plugins/maker'

export const makerPoolIdMock = {
  protocol: {
    name: ProtocolName.Maker,
    chainInfo: ChainInfo.createFrom({ chainId: 1, name: 'Ethereum' }),
  },
  ilkType: ILKType.ETH_A,
  vaultId: '123',
}
