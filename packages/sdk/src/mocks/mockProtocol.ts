import { ChainInfo } from '~sdk/chains'
import {
  Pool,
  PoolParameters,
  Protocol,
  ProtocolId,
  ProtocolName,
  ProtocolParameters,
  ProtocolsRegistry,
} from '~sdk/protocols'
import { Maybe } from '~sdk/utils'
import { mockPool } from '.'

export class mockProtocolSpark implements Protocol {
  public readonly protocolId: ProtocolId
  private readonly chainInfo: ChainInfo

  public constructor(params: { chainInfo: ChainInfo }) {
    this.chainInfo = params.chainInfo
    this.protocolId = { id: 'spark' }
  }

  /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
  public async getPool(params: {
    poolParameters: PoolParameters
    protocolParameters?: ProtocolParameters
  }): Promise<Maybe<Pool>> {
    return mockPool({ protocol: this, poolParameters: params.poolParameters })
  }

  /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
  public async getAllPools(params: { protocolParameters?: ProtocolParameters }): Promise<Pool[]> {
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
