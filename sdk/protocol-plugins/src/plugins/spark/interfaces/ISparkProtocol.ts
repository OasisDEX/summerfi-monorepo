import { IProtocol } from '@summerfi/sdk-common'
import { ChainInfo } from '@summerfi/sdk-common/common'
import { ProtocolName } from '@summerfi/sdk-common/protocols'

export interface ISparkProtocol extends IProtocol {
  name: ProtocolName.Spark
  chainInfo: ChainInfo
}
