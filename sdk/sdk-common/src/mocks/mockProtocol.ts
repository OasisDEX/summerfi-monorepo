import type { Maybe } from '~sdk-common/common/aliases'
import { mockPool } from './mockPool'
import type { ChainInfo } from '~sdk-common/common/implementation/ChainInfo'
import { ProtocolsRegistry } from '~sdk-common/protocols/adapters'
import type { IPool } from '~sdk-common/protocols/interfaces/IPool'
import type { PoolParameters } from '~sdk-common/protocols/interfaces/PoolParameters'
import type { Protocol } from '~sdk-common/protocols/interfaces/Protocol'
import { ProtocolName } from '~sdk-common/protocols/interfaces/ProtocolName'
import type { ProtocolParameters } from '~sdk-common/protocols/interfaces/ProtocolParameters'

export class mockProtocolSpark implements Protocol {
  public readonly name: ProtocolName
  private readonly chainInfo: ChainInfo

  public constructor(params: { chainInfo: ChainInfo }) {
    this.chainInfo = params.chainInfo
    this.name = ProtocolName.Spark
  }

  /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
  public async getPool(params: {
    poolParameters: PoolParameters
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

  ProtocolsRegistry.registerProtocol({
    chainInfo: chainInfo,
    name: ProtocolName.Spark,
    protocol: new mockProtocolSpark({ chainInfo }),
  })
}
