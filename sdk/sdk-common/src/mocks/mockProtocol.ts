import { Maybe } from '../common/aliases/Maybe'
import { ChainInfo } from '../common/implementation/ChainInfo'
import { ProtocolsRegistry } from '../protocols/adapters/ProtocolsRegistry'
import { IPool } from '../protocols/interfaces/IPool'
import { PoolParameters } from '../protocols/interfaces/PoolParameters'
import { Protocol } from '../protocols/interfaces/Protocol'
import { ProtocolName } from '../protocols/interfaces/ProtocolName'
import { ProtocolParameters } from '../protocols/interfaces/ProtocolParameters'
import { mockPool } from './mockPool'

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
