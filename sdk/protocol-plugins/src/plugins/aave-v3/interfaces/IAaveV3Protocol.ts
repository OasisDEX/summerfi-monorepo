import { IProtocol } from '@summerfi/sdk-common'
import { ChainInfo } from '@summerfi/sdk-common/common'
import { ProtocolName } from '@summerfi/sdk-common/protocols'

export interface IAaveV3Protocol extends IProtocol {
  name: ProtocolName.AAVEv3
  chainInfo: ChainInfo
}
