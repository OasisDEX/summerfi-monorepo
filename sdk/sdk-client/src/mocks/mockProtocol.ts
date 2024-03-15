import { ChainInfo, Maybe } from '@summerfi/sdk-common/common'
import {
  IPool,
  LendingPoolParameters,
  Protocol,
  ProtocolName,
  ProtocolParameters,
  ProtocolsRegistry,
} from '@summerfi/sdk-common/protocols'
import { mockPool } from './mockPool'

export class mockProtocolSpark implements Protocol {
  public readonly name: ProtocolName
  public readonly chainInfo: ChainInfo

  public constructor(params: { chainInfo: ChainInfo }) {
    this.name = ProtocolName.Spark
    this.chainInfo = params.chainInfo
  }

  /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
  public async getPool(params: {
    poolParameters: LendingPoolParameters
    protocolParameters?: ProtocolParameters
  }): Promise<Maybe<IPool>> {
    return mockPool({ protocol: this, poolParameters: params.poolParameters })
  }

  /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
  public async getAllPools(_params: { protocolParameters?: ProtocolParameters }): Promise<IPool[]> {
    return []
  }
}

export async function registerMockProtocols() {
  const chainInfo = { chainId: 1, name: 'Mainnet' }
  const sparkMainnet = new mockProtocolSpark({ chainInfo })

  ProtocolsRegistry.registerProtocol({
    protocol: sparkMainnet,
  })
}
