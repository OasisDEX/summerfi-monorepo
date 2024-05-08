import { IProtocol } from '@summerfi/sdk-common'
import { ChainInfo } from '@summerfi/sdk-common/common'
import { ProtocolName } from '@summerfi/sdk-common/protocols'

export interface ICompoundV3Protocol extends IProtocol {
  name: ProtocolName.CompoundV3
  chainInfo: ChainInfo
}
